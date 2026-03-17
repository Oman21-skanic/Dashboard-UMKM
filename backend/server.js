const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load konfigurasi dari file .env
dotenv.config();

const app = express();

// Middleware untuk memproses data JSON
app.use(express.json());

// 1. Koneksi ke Database MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Koneksi database berhasil terhubung.'))
  .catch(err => console.log('Database gagal terhubung:', err));

// 2. Jalur API untuk Auth (Register)
app.use('/api/health', (req, res) => res.send('API is healthy'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth/tiktok', require('./routes/tiktokAuth'));

// 3. Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server berjalan pada port ' + PORT);
});