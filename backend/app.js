const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const path = require('path');

dotenv.config();

const app = express();

// Konfigurasi Trust Proxy (Sangat penting untuk Railway/Vercel/Cloudflare)
// Menangani header X-Forwarded-For agar express-rate-limit bisa membaca IP user asli
app.set('trust proxy', 1);

// Serve uploads as static resources
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 1. SECURITY HEADERS (Helmet)
app.use(helmet());

// 2. CORS CONFIG (Must be before Rate Limiting so 429 returns CORS headers)
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(Boolean),
  credentials: true,
  exposedHeaders: ['X-Saved-Products', 'Content-Disposition']
}));

// 3. RATE LIMITING (Global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 500, // Diperbesar dari 100 ke 500 untuk kenyamanan tahap development
  message: { msg: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.' }
});
app.use('/api/', limiter);


// 4. BODY PARSING & SANITIZATION
const sanitize = require('mongo-sanitize');
app.use(express.json({ limit: '10kb' })); // Batasi size JSON untuk cegah DDoS
app.use(hpp()); // Antisipasi HTTP Parameter Pollution

// Global NoSQL Injection Protection
app.use((req, res, next) => {
  req.body = sanitize(req.body);
  req.params = sanitize(req.params);
  req.query = sanitize(req.query);
  next();
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
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/tiktok-template', require('./routes/tiktokTemplate'));
app.use('/api/upload', require('./routes/upload'));

module.exports = app;
