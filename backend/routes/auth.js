const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Konfigurasi JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// FITUR FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    console.log("Forgot Password");
    res.json({ msg: "Fitur forgot password sedang dikembangkan" });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

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