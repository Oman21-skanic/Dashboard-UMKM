const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// FITUR LOGIN
router.post("/login", async () => {
  console.log("Login API");
})

// FITUR FORGOT PASSWORD
router.post("/forgot-password", async () => {
  console.log("Forgot Password");
})

// FITUR REGISTER 
router.post('/register', async (req, res) => {
  try {
    const { email, password, businessName, channels } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Format email tidak valid' });
    }

    // Validate password strength (min 8 char)
    if (!password || password.length < 8) {
      return res.status(400).json({ msg: 'Password harus minimal 8 karakter' });
    }

    // 1. Cek apakah user sudah ada
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email sudah terdaftar' });

    // 2. Acak Password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Simpan ke Database
    user = new User({
      email,
      password: hashedPassword,
      businessName,
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

    // 1. Cek User
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Email tidak terdaftar' });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Password salah' });

    // 3. Generate JWT
    const payload = {
      user: {
        id: user.id
      }
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
  // Dalam JWT stateless, logout biasanya dilakukan di sisi klien (menghapus token). 
  // Kita bisa merespon sukses saja.
  res.json({ msg: 'Logout berhasil. Silakan hapus token di sisi klien.' });
});

// FITUR REFRESH
router.post('/refresh', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ msg: 'Tidak ada token yang diberikan' });

  try {
    // Verifikasi token yang lama (mengabaikan expiry untuk refresh jika diinginkan, namun kita asumsi token msih valid atau kita decode saja)
    // Untuk sederhana, verifikasi normal:
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

    // Generate new token
    const payload = {
      user: {
        id: decoded.user.id
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, newToken) => {
        if (err) throw err;
        res.json({ token: newToken, msg: 'Token berhasil di-refresh' });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(403).json({ msg: 'Token tidak valid' });
  }
});

// FITUR AMBIL PROFIL USER
const authenticateToken = require('../middleware/authenticateToken');
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;