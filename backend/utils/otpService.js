const axios = require('axios');
const crypto = require('crypto');

// ── In-memory OTP Store ─────────────────────────────────────────────────────
// Format: { [email]: { otp, expiresAt, verified, resetToken, resetTokenExpiresAt } }
const otpStore = new Map();
const OTP_TTL_MS = 10 * 60 * 1000; // 10 menit

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

function storeOTP(email, otp, type = 'forgot-password') {
  otpStore.set(email.toLowerCase(), {
    otp,
    type,
    expiresAt: Date.now() + OTP_TTL_MS,
    verified: false,
    token: null,
    tokenExpiresAt: null,
  });
}

function getStoredOTP(email) {
  return otpStore.get(email.toLowerCase()) || null;
}

function markVerified(email) {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return null;
  const token = crypto.randomBytes(32).toString('hex');
  entry.verified = true;
  entry.token = token;
  entry.tokenExpiresAt = Date.now() + 15 * 60 * 1000; // valid 15 menit
  otpStore.set(email.toLowerCase(), entry);
  return token;
}

function clearOTP(email) {
  otpStore.delete(email.toLowerCase());
}

// ── Kirim OTP via Brevo API (HTTP) — Anti-Blokir Railway ──────────────────────
async function sendOTPEmail(toEmail, otp) {
  const brevoKey = process.env.BREVO_API_KEY;

  if (!brevoKey) {
    throw new Error('Konfigurasi BREVO_API_KEY belum diatur. Hubungi administrator.');
  }

  await axios.post('https://api.brevo.com/v3/smtp/email', {
    sender: { name: 'DashUMKM Admin', email: 'dashumkm21@gmail.com' },
    to: [{ email: toEmail }],
    subject: '🔐 Kode OTP DashUMKM',
    htmlContent: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
        <div style="text-align:center;margin-bottom:28px;">
          <span style="font-size:24px;font-weight:800;color:#102e4a;">DashUMKM</span>
        </div>
        <div style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;">Verifikasi Keamanan</h2>
          <p style="color:#64748b;margin:0 0 24px;font-size:14px;line-height:1.6;">
            Gunakan kode OTP berikut untuk melanjutkan proses di DashUMKM.
            Kode berlaku selama <strong>10 menit</strong>.
          </p>
          <div style="background:#f0f7ff;border:2px dashed #3b82f6;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
            <p style="margin:0;font-size:12px;color:#64748b;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Kode OTP Anda</p>
            <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:0.15em;color:#1a4a7a;font-family:monospace;">${otp}</p>
          </div>
          <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.6;">
            ⚠️ Jangan bagikan kode ini kepada siapapun demi keamanan akun Anda.
          </p>
        </div>
        <p style="text-align:center;color:#cbd5e1;font-size:11px;margin-top:20px;">© 2025 DashUMKM · Email Otomatis</p>
      </div>
    `
  }, {
    headers: {
      'api-key': brevoKey,
      'Content-Type': 'application/json'
    }
  });
}

module.exports = {
  generateOTP,
  storeOTP,
  getStoredOTP,
  markVerified,
  clearOTP,
  sendOTPEmail,
};
