const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Kita butuh middleware authenticateToken untuk mengekstrak user.id sebelum
// melakukan oauth binding, tapi jika flow ini mandiri (misalkan frontend redirect 
// dengan user token di query url), akan cukup sulit. 
// Standardnya adalah frontend membawa JWT token saat hit /api/auth/tiktok
// namun saat redirect ke third-party kita kehilangan header.
// Solusi: frontend passing token di parameter, a.k.a /api/auth/tiktok?token=JWT
// ATAU kita simpan user.id di dalam "state" yang juga di-enkripsi.
// Untuk kemudahan dan keamanan, kita taruh userId di dalam "state".

const User = require('../models/User');
const { encryptData } = require('../utils/encryption');

const TIKTOK_CLIENT_KEY = process.env.CLIENT_KEY;
const TIKTOK_CLIENT_SECRET = process.env.CLIENT_SECRET;
const TIKTOK_REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// In-memory store untuk state (IDEALNYA di Redis atau Database jika multi instance)
// Key: state_string, Value: userId
const stateStore = new Map();

// GET /api/auth/tiktok?token=user_jwt_token
router.get('/', (req, res) => {
    const userToken = req.query.token;
    if (!userToken) {
        return res.status(401).json({ msg: 'Token JWT diperlukan untuk binding TikTok Account' });
    }

    try {
        const decoded = jwt.verify(userToken, JWT_SECRET);
        const userId = decoded.user.id;

        // 1. Generate random state
        const state = crypto.randomBytes(16).toString('hex');

        // 2. Simpan state mapping ke user
        stateStore.set(state, userId);

        // Hapus state setelah 10 menit (expired)
        setTimeout(() => {
            stateStore.delete(state);
        }, 10 * 60 * 1000);

        // 3. Redirect ke TikTok OAuth (Login API v2)
        const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&redirect_uri=${encodeURIComponent(TIKTOK_REDIRECT_URI)}&response_type=code&scope=user.info.basic&state=${state}`;
        res.redirect(authUrl);

    } catch (err) {
        console.error(err);
        return res.status(401).json({ msg: 'Token JWT tidak valid' });
    }
});

// GET /api/auth/tiktok/callback
router.get('/callback', async (req, res) => {
    const { code, state, error, message } = req.query;

    console.log('--- TIKTOK CALLBACK RECEIVED ---');
    console.log('Query Params:', { code: code ? 'REDACTED' : null, state, error, message });

    // 1. Handle Rejected Flow
    if (error) {
        console.error('TikTok Auth Error from Query:', message);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/dashboard/channels?error=tiktok_auth_rejected`);
    }

    // 2. Verify State
    if (!state || !stateStore.has(state)) {
        console.error('State Verification Failed. Received:', state, 'Store keys:', Array.from(stateStore.keys()));
        return res.status(400).json({ msg: 'Invalid atau expired state' });
    }

    const userId = stateStore.get(state);
    stateStore.delete(state); // Clean up used state
    console.log('State Verified for UserID:', userId);

    if (!code) {
        console.error('No authorization code provided in callback');
        return res.status(400).json({ msg: 'Authorization code tidak valid' });
    }

    try {
        // 3. Exchange Auth Code for Access Token
        console.log('Exchanging code for token...');
        const tokenUrl = `https://open.tiktokapis.com/v2/oauth/token/`;

        const params = new URLSearchParams({
            client_key: TIKTOK_CLIENT_KEY,
            client_secret: TIKTOK_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: TIKTOK_REDIRECT_URI
        });

        console.log('Token Request Params (Redacted):', {
            client_key: TIKTOK_CLIENT_KEY,
            redirect_uri: TIKTOK_REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        const response = await axios.post(tokenUrl, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            }
        });

        const data = response.data;
        console.log('TikTok Token Response Data:', JSON.stringify(data, null, 2));

        if (data.error || !data.access_token) {
            console.error('Token exchange failed according to response body:', data);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            return res.redirect(`${frontendUrl}/dashboard/channels?error=token_exchange_failed`);
        }

        const { access_token, refresh_token, expires_in, open_id } = data;
        console.log('Token exchange successful. OpenID:', open_id);

        // 3.5. Call TikTok API dengan access_token (Contoh: Fetch Basic Info)
        try {
            console.log('Fetching user info from TikTok API...');
            const userInfoUrl = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name';
            const userInfoResponse = await axios.get(userInfoUrl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            console.log('TikTok User Info Response:', userInfoResponse.data);
        } catch (apiErr) {
            console.error('Warning: Failed to fetch TikTok User Info:', apiErr.response ? apiErr.response.data : apiErr.message);
        }

        // 4. Update MongoDB
        const user = await User.findById(userId);
        if (!user) {
            console.error('UserID from state not found in database:', userId);
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        const encryptedAccess = encryptData(access_token);
        const encryptedRefresh = encryptData(refresh_token);

        const channelIndex = user.channels.findIndex(ch => ch.platform === 'tiktok');

        const channelData = {
            platform: 'tiktok',
            tiktokShopId: open_id,
            accessToken: encryptedAccess,
            refreshToken: encryptedRefresh,
            expiresAt: new Date(Date.now() + expires_in * 1000)
        };

        if (channelIndex > -1) {
            user.channels[channelIndex] = channelData;
        } else {
            user.channels.push(channelData);
        }

        await user.save();
        console.log('User channels updated successfully in DB');

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/dashboard/channels?success=tiktok_connected`);

    } catch (err) {
        console.error('CRITICAL ERROR in TikTok Callback:', err.response ? err.response.data : err.message);
        res.status(500).json({
            msg: 'Terjadi kesalahan saat memproses TikTok Callback',
            error: err.response ? err.response.data : err.message
        });
    }
});

module.exports = router;
