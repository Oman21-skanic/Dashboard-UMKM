const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { encryptData } = require('../utils/encryption');

const TIKTOK_CLIENT_KEY = process.env.CLIENT_KEY;
const TIKTOK_CLIENT_SECRET = process.env.CLIENT_SECRET;
const TIKTOK_REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const stateStore = new Map();

// GET /api/auth/tiktok?token=user_jwt_token
router.get('/', (req, res) => {
    const userToken = req.query.token;
    if (!userToken) {
        return res.status(401).json({ msg: 'Token JWT diperlukan' });
    }

    try {
        const decoded = jwt.verify(userToken, JWT_SECRET);
        const userId = decoded.user.id;

        const state = crypto.randomBytes(16).toString('hex');
        stateStore.set(state, userId);
        setTimeout(() => stateStore.delete(state), 10 * 60 * 1000);

        // PKCE
        const codeVerifier = crypto.randomBytes(32).toString('base64url');
        const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');

        stateStore.set(`cv_${state}`, codeVerifier);

        const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&redirect_uri=${encodeURIComponent(TIKTOK_REDIRECT_URI)}&response_type=code&scope=user.info.basic&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        res.redirect(authUrl);
    } catch (err) {
        console.error(err);
        return res.status(401).json({ msg: 'Token JWT tidak valid' });
    }
});

// GET /api/auth/tiktok/callback
router.get('/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query;

    console.log('--- TIKTOK CALLBACK ---');
    console.log('Query:', { code: code ? 'ADA' : null, state, error });

    // Handle cancel/error dari TikTok
    if (error) {
        console.error('TikTok Error:', error_description);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/dashboard/channels?error=tiktok_auth_rejected`);
    }

    // Verify state
    if (!state || !stateStore.has(state)) {
        console.error('State invalid:', state);
        return res.status(400).json({ msg: 'Invalid atau expired state' });
    }

    const userId = stateStore.get(state);
    stateStore.delete(state);

    // Ambil code_verifier
    const codeVerifier = stateStore.get(`cv_${state}`);
    stateStore.delete(`cv_${state}`);

    if (!code) {
        return res.status(400).json({ msg: 'Authorization code tidak ada' });
    }

    try {
        // Exchange code for token
        const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
        const params = new URLSearchParams({
            client_key: TIKTOK_CLIENT_KEY,
            client_secret: TIKTOK_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: TIKTOK_REDIRECT_URI,
            code_verifier: codeVerifier
        });

        const response = await axios.post(tokenUrl, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            }
        });

        const data = response.data;
        console.log('Token response:', JSON.stringify(data, null, 2));

        if (data.error || !data.access_token) {
            console.error('Token exchange gagal:', data);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            return res.redirect(`${frontendUrl}/dashboard/channels?error=token_exchange_failed`);
        }

        const { access_token, refresh_token, expires_in, open_id } = data;

        // Update MongoDB
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        const encryptedAccess = encryptData(access_token);
        const encryptedRefresh = encryptData(refresh_token);

        const channelData = {
            platform: 'tiktok',
            tiktokShopId: open_id,
            accessToken: encryptedAccess,
            refreshToken: encryptedRefresh,
            expiresAt: new Date(Date.now() + expires_in * 1000)
        };

        const channelIndex = user.channels.findIndex(ch => ch.platform === 'tiktok');
        if (channelIndex > -1) {
            user.channels[channelIndex] = channelData;
        } else {
            user.channels.push(channelData);
        }

        await user.save();
        console.log('TikTok berhasil tersimpan ke DB!');

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/dashboard/channels?success=tiktok_connected`);

    } catch (err) {
        console.error('ERROR callback:', err.response ? err.response.data : err.message);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/dashboard/channels?error=token_exchange_failed`);
    }
});

module.exports = router;