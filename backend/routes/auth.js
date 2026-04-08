const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  generateOTP,
  storeOTP,
  getStoredOTP,
  markVerified,
  clearOTP,
  sendOTPEmail,
} = require('../utils/otpService');

// Konfigurasi JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// ════════════════════════════════════════════════════════════════
// STEP 1 — Kirim OTP via Email
// POST /api/auth/forgot-password/send-otp
// Body: { email }
// ════════════════════════════════════════════════════════════════
router.post('/forgot-password/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: 'Email wajib diisi.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ msg: 'Email tidak terdaftar di sistem kami.' });
    }

    const otp = generateOTP();
    storeOTP(email.toLowerCase(), otp);

    await sendOTPEmail(user.email, otp);
    return res.json({
      msg: 'Kode OTP telah dikirim ke email Anda.',
      maskedDestination: maskEmail(user.email),
    });
  } catch (err) {
    console.error('[send-otp]', err.message);
    if (err.message.includes('Konfigurasi')) {
      return res.status(503).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Gagal mengirim OTP.', error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════
// STEP 2 — Verifikasi kode OTP
// POST /api/auth/forgot-password/verify-otp
// Body: { email, otp }
// ════════════════════════════════════════════════════════════════
router.post('/forgot-password/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ msg: 'Email dan kode OTP wajib diisi.' });
  }

  const stored = getStoredOTP(email);
  if (!stored) {
    return res.status(400).json({ msg: 'Sesi OTP tidak ditemukan. Silakan kirim ulang.' });
  }
  if (Date.now() > stored.expiresAt) {
    clearOTP(email);
    return res.status(400).json({ msg: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang.' });
  }
  if (stored.otp !== otp.trim()) {
    return res.status(400).json({ msg: 'Kode OTP salah.' });
  }

  const resetToken = markVerified(email);
  res.json({ msg: 'OTP terverifikasi.', resetToken });
});

// ════════════════════════════════════════════════════════════════
// STEP 3 — Reset password dengan reset token
// POST /api/auth/forgot-password/reset
// Body: { email, resetToken, newPassword }
// ════════════════════════════════════════════════════════════════
router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ msg: 'Data tidak lengkap.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ msg: 'Password baru harus minimal 8 karakter.' });
    }

    const stored = getStoredOTP(email);
    if (!stored) {
      return res.status(400).json({ msg: 'Sesi reset tidak ditemukan. Ulangi dari awal.' });
    }
    if (!stored.verified || stored.resetToken !== resetToken) {
      return res.status(403).json({ msg: 'Token reset tidak valid.' });
    }
    if (Date.now() > stored.resetTokenExpiresAt) {
      clearOTP(email);
      return res.status(400).json({ msg: 'Sesi reset sudah kedaluwarsa. Ulangi dari awal.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ msg: 'Akun tidak ditemukan.' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    clearOTP(email); // Hapus sesi setelah berhasil
    res.json({ msg: 'Password berhasil direset! Silakan login dengan password baru Anda.' });
  } catch (err) {
    console.error('[reset-password]', err.message);
    res.status(500).json({ msg: 'Gagal mereset password.' });
  }
});

// Helper: masking
function maskEmail(email) {
  const [user, domain] = email.split('@');
  const visible = user.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(user.length - 2, 3))}@${domain}`;
}
function maskPhone(phone) {
  const d = phone.replace(/\D/g, '');
  return d.slice(0, 3) + '****' + d.slice(-3);
}

// FITUR REGISTER 
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, businessName, phoneNumber, channels } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Format email tidak valid' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ msg: 'Password harus minimal 8 karakter' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email sudah terdaftar' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      fullName,
      businessName,
      phoneNumber,
      channels
    });

    await user.save();
    res.status(201).json({ msg: 'User berhasil didaftarkan!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// FITUR LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Email tidak terdaftar' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Password salah' });

    const payload = {
      id: user.id
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, msg: 'Login berhasil' });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// FITUR LOGOUT
router.post('/logout', (req, res) => {
  res.json({ msg: 'Logout berhasil' });
});

// FITUR REFRESH TOKEN
router.post('/refresh', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ msg: 'Tidak ada token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    const payload = { id: decoded.id };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, newToken) => {
      if (err) throw err;
      res.json({ token: newToken });
    });
  } catch (err) {
    res.status(403).json({ msg: 'Token tidak valid' });
  }
});

// FITUR AMBIL PROFIL USER
const authenticateToken = require('../middleware/authenticateToken');
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// FITUR UPDATE PROFIL USER
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, businessName, phoneNumber } = req.body;
    
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });

    if (fullName !== undefined) user.fullName = fullName;
    if (businessName !== undefined) user.businessName = businessName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    await user.save();
    
    // Kembalikan data user tanpa password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json({ msg: 'Profil berhasil diperbarui', user: updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// FITUR UBAH KATA SANDI
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ msg: 'Password baru harus minimal 8 karakter' });
    }

    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Password lama salah' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ msg: 'Password berhasil diperbarui' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;