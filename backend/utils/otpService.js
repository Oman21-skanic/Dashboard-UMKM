const axios = require('axios');
const crypto = require('crypto');

// ── In-memory OTP Store ─────────────────────────────────────────────────────
// Format: { [email]: { otp, expiresAt, verified, resetToken, resetTokenExpiresAt } }
const otpStore = new Map();
const OTP_TTL_MS = 10 * 60 * 1000; // 10 menit

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

function storeOTP(email, otp, type = 'forgot-password', userData = null) {
  otpStore.set(email.toLowerCase(), {
    otp,
    type,
    userData, // Data user sementara untuk registrasi
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
  // Ambil dan bersihkan key (proteksi terhadap spasi/tanda kutip di Railway)
  const rawKey = process.env.BREVO_API_KEY || "";
  const brevoKey = rawKey.trim().replace(/^["']|["']$/g, '');

  if (!brevoKey) {
    console.error('CRITICAL: BREVO_API_KEY is missing in environment variables!');
    throw new Error('Konfigurasi BREVO_API_KEY belum diatur. Hubungi administrator.');
  }

  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: 'DashUMKM Security', email: 'dashumkm21@gmail.com' },
      to: [{ email: toEmail }],
      subject: `[DashUMKM] ${otp} adalah kode verifikasi Anda`,
      htmlContent: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; background-color: #f4f7fa;">
          <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e1e8f0;">
            <!-- Header -->
            <div style="background-color: #123d62; padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">DashUMKM</h1>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px 32px;">
              <h2 style="color: #123d62; margin: 0 0 16px; font-size: 22px; font-weight: 700;">Verifikasi Akun</h2>
              <p style="color: #64748b; margin: 0 0 32px; font-size: 16px; line-height: 1.6;">
                Halo! Gunakan kode di bawah ini untuk mengamankan akun Anda. Kode ini rahasia dan berlaku selama <strong>10 menit</strong>.
              </p>
              
              <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
                <p style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">KODE OTP ANDA</p>
                <div style="font-size: 48px; font-weight: 800; color: #123d62; letter-spacing: 0.15em; font-family: 'Courier New', Courier, monospace;">${otp}</div>
              </div>

              <div style="background-color: #fff9eb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
                <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;">
                  <strong>Peringatan Keamanan:</strong> Jangan berikan kode ini kepada siapapun, termasuk pihak yang mengaku dari DashUMKM.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="padding: 24px; text-align: center; background-color: #f8fafc; border-top: 1px solid #eef2f6;">
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">&copy; 2026 DashUMKM · Partner Digital UMKM Indonesia</p>
            </div>
          </div>
          <p style="text-align: center; margin-top: 24px; font-size: 12px; color: #cbd5e1;">Email ini dikirim secara otomatis. Mohon tidak membalas.</p>
        </div>
      `
    }, {
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('[Brevo Error]', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Gagal mengirim email lewat Brevo.');
  }
}

module.exports = {
  generateOTP,
  storeOTP,
  getStoredOTP,
  markVerified,
  clearOTP,
  sendOTPEmail,
};
