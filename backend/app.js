const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

dotenv.config();

const app = express();

// 1. SECURITY HEADERS (Helmet)
app.use(helmet());

// 2. RATE LIMITING (Global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Limit 100 request per IP per 15 menit
  message: { msg: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.' }
});
app.use('/api/', limiter);

// 3. CORS CONFIG
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

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

module.exports = app;
