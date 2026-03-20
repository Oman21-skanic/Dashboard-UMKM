const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Koneksi database berhasil terhubung.'))
  .catch(err => console.log('Database gagal terhubung:', err));

// TikTok verification files
app.get('/tiktokYARbU826SUdyVo5nkiOZpuhdZNfi3mM6.txt', (req, res) => {
  res.type('text/plain');
  res.send('tiktok-developers-site-verification=YARbU826SUdyVo5nkiOZpuhdZNfi3mM6');
});

app.get('/tiktokkTE3jsp8ZJ1gZHBBN5q56bW5YiSjNJNX.txt', (req, res) => {
  res.type('text/plain');
  res.send('tiktok-developers-site-verification=kTE3jsp8ZJ1gZHBBN5q56bW5YiSjNJNX');
});

app.get('/tiktok3xE58m35xpP4GlGt5HyHOgJAZvk76PIP.txt', (req, res) => {
  res.type('text/plain');
  res.send('tiktok-developers-site-verification=3xE58m35xpP4GlGt5HyHOgJAZvk76PIP');
});

// Terms & Privacy
app.get('/terms', (req, res) => {
  res.send('<html><body><h1>Terms of Service</h1><p>DashUMKM Terms of Service.</p></body></html>');
});

app.get('/privacy', (req, res) => {
  res.send('<html><body><h1>Privacy Policy</h1><p>DashUMKM Privacy Policy.</p></body></html>');
});

// Routes
app.use('/api/health', (req, res) => res.send('API is healthy'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth/tiktok', require('./routes/tiktokAuth'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server berjalan pada port ' + PORT);
});