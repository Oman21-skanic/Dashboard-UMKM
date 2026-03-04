const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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

module.exports = router;