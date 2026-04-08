const nodemailer = require('nodemailer');
const crypto = require('crypto');

// ── In-memory OTP Store ─────────────────────────────────────────────────────
// Format: { [email]: { otp, expiresAt, verified, resetToken, resetTokenExpiresAt } }
const otpStore = new Map();
const OTP_TTL_MS = 10 * 60 * 1000; // 10 menit

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

function storeOTP(email, otp) {
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
    verified: false,
    resetToken: null,
    resetTokenExpiresAt: null,
  });
}

function getStoredOTP(email) {
  return otpStore.get(email.toLowerCase()) || null;
}

function markVerified(email) {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return null;
  const resetToken = crypto.randomBytes(32).toString('hex');
  entry.verified = true;
  entry.resetToken = resetToken;
  entry.resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // valid 15 menit
  otpStore.set(email.toLowerCase(), entry);
  return resetToken;
}

function clearOTP(email) {
  otpStore.delete(email.toLowerCase());
}

// ── Kirim OTP via Gmail SMTP ─────────────────────────────────────────────────
async function sendOTPEmail(toEmail, otp) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    throw new Error('Konfigurasi email belum diatur. Hubungi administrator.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: gmailUser, pass: gmailPass },
  });

  await transporter.sendMail({
    from: `"DashUMKM" <${gmailUser}>`,
    to: toEmail,
    subject: '🔐 Kode OTP Reset Password DashUMKM',
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
        <div style="text-align:center;margin-bottom:28px;">
          <span style="font-size:24px;font-weight:800;color:#102e4a;">DashUMKM</span>
        </div>
        <div style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;">Reset Password</h2>
          <p style="color:#64748b;margin:0 0 24px;font-size:14px;line-height:1.6;">
            Gunakan kode OTP berikut untuk mereset password akun DashUMKM Anda.
            Kode berlaku selama <strong>10 menit</strong>.
          </p>
          <div style="background:#f0f7ff;border:2px dashed #3b82f6;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
            <p style="margin:0;font-size:12px;color:#64748b;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Kode OTP Anda</p>
            <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:0.15em;color:#1a4a7a;font-family:monospace;">${otp}</p>
          </div>
          <p style="color:#94a3b8;font-size:12px;margin:0;line-height:1.6;">
            ⚠️ Jangan bagikan kode ini kepada siapapun. Tim DashUMKM tidak pernah meminta kode OTP Anda.
            Jika Anda tidak meminta reset password, abaikan email ini.
          </p>
        </div>
        <p style="text-align:center;color:#cbd5e1;font-size:11px;margin-top:20px;">© 2025 DashUMKM · Email otomatis, jangan dibalas</p>
      </div>
    `,
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
