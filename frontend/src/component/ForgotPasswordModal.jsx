import { useState, useEffect, useRef, useCallback } from "react";
import {
  Eye, EyeOff, KeyRound, Lock, Mail, X, CheckCircle2,
  ArrowLeft, RefreshCw, Shield,
} from "lucide-react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/component/ui/label";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const OTP_DIGITS = 6;
const RESEND_COOLDOWN = 60; // detik

const STEP = { EMAIL: 1, OTP: 2, PASSWORD: 3, SUCCESS: 4 };

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(STEP.EMAIL);

  // Step 1
  const [email, setEmail] = useState("");
  const [maskedDestination, setMaskedDestination] = useState("");

  // Step 2
  const [otpValues, setOtpValues] = useState(Array(OTP_DIGITS).fill(""));
  const [countdown, setCountdown] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);

  // Step 3
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetToken, setResetToken] = useState("");

  // Global
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetAll = useCallback(() => {
    setStep(STEP.EMAIL);
    setEmail(""); setMaskedDestination("");
    setOtpValues(Array(OTP_DIGITS).fill(""));
    setCountdown(600); setResendCooldown(0);
    setNewPassword(""); setConfirmPassword("");
    setShowNew(false); setShowConfirm(false);
    setResetToken(""); setIsLoading(false); setError("");
  }, []);

  const handleClose = () => { resetAll(); onClose(); };

  // ── OTP countdown ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== STEP.OTP || countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [step, countdown]);

  // ── Resend cooldown ───────────────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const fmt = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // ── STEP 1: Kirim OTP ─────────────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email wajib diisi."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Format email tidak valid."); return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/forgot-password/send-otp`,
        { email: email.trim() }
      );
      setMaskedDestination(data.maskedDestination || "");
      setOtpValues(Array(OTP_DIGITS).fill(""));
      setCountdown(600);
      setResendCooldown(RESEND_COOLDOWN);
      setStep(STEP.OTP);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.response?.data?.msg || "Gagal mengirim OTP. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── STEP 2: OTP input handlers ────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otpValues];
    next[i] = digit;
    setOtpValues(next);
    if (digit && i < OTP_DIGITS - 1) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otpValues[i] && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < OTP_DIGITS - 1) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_DIGITS);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_DIGITS).fill("").map((_, i) => pasted[i] || "");
    setOtpValues(next);
    otpRefs.current[Math.min(pasted.length, OTP_DIGITS - 1)]?.focus();
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    setError("");
    const code = otpValues.join("");
    if (code.length < OTP_DIGITS) { setError("Masukkan semua 6 digit kode OTP."); return; }
    if (countdown <= 0) { setError("Kode OTP sudah kedaluwarsa. Kirim ulang."); return; }

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/forgot-password/verify-otp`,
        { email: email.trim(), otp: code }
      );
      setResetToken(data.resetToken);
      setStep(STEP.PASSWORD);
    } catch (err) {
      setError(err.response?.data?.msg || "Kode OTP tidak valid.");
      setOtpValues(Array(OTP_DIGITS).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } finally {
      setIsLoading(false);
    }
  };

  // ── STEP 3: Reset password ────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError("");
    if (newPassword.length < 8) { setError("Password minimal 8 karakter."); return; }
    if (newPassword !== confirmPassword) { setError("Konfirmasi password tidak cocok."); return; }

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password/reset`, {
        email: email.trim(), resetToken, newPassword,
      });
      setStep(STEP.SUCCESS);
    } catch (err) {
      setError(err.response?.data?.msg || "Gagal mereset password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  const otpComplete = otpValues.every((v) => v !== "");

  return (
    <div
      className="fp-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog" aria-modal="true" aria-label="Lupa Password"
    >
      <div className="fp-modal">

        {/* Header */}
        <div className="fp-header">
          <div className="fp-icon-wrap">
            {step === STEP.SUCCESS
              ? <CheckCircle2 className="fp-icon" />
              : step === STEP.OTP
              ? <Shield className="fp-icon" />
              : <KeyRound className="fp-icon" />}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="fp-title">
              {step === STEP.EMAIL && "Lupa Password?"}
              {step === STEP.OTP && "Verifikasi OTP"}
              {step === STEP.PASSWORD && "Buat Password Baru"}
              {step === STEP.SUCCESS && "Berhasil!"}
            </h2>
            <p className="fp-subtitle">
              {step === STEP.EMAIL && "Kode OTP akan dikirim ke email Anda."}
              {step === STEP.OTP && `Kode dikirim ke ${maskedDestination}`}
              {step === STEP.PASSWORD && "OTP terverifikasi. Buat password baru Anda."}
              {step === STEP.SUCCESS && "Password Anda berhasil direset."}
            </p>
          </div>

          {/* Step dots */}
          {step !== STEP.SUCCESS && (
            <div className="fp-steps">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`fp-step-dot ${step === s ? "active" : step > s ? "done" : ""}`}
                />
              ))}
            </div>
          )}

          <button className="fp-close-btn" onClick={handleClose} aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="fp-body">

          {/* ══ STEP 1: Masukkan email ══ */}
          {step === STEP.EMAIL && (
            <form onSubmit={handleSendOTP} className="fp-form">
              <p className="fp-hint">
                Masukkan alamat email yang terdaftar di akun Anda.
                Kami akan mengirim kode OTP 6-digit ke email tersebut.
              </p>

              <div className="fp-field">
                <Label htmlFor="fp-email">Alamat Email Terdaftar</Label>
                <div className="fp-input-wrap">
                  <Mail className="fp-input-icon" />
                  <Input
                    id="fp-email" type="email" placeholder="contoh@mail.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="fp-input" disabled={isLoading}
                    autoComplete="email" autoFocus
                  />
                </div>
              </div>

              {error && <div className="fp-error" role="alert">{error}</div>}

              <Button type="submit" disabled={isLoading} className="fp-submit-btn w-full">
                {isLoading ? "Mengirim..." : "Kirim Kode OTP via Email"}
              </Button>
            </form>
          )}

          {/* ══ STEP 2: Masukkan OTP ══ */}
          {step === STEP.OTP && (
            <form onSubmit={handleVerifyOTP} className="fp-form">
              {/* Info email */}
              <div className="fp-info-box">
                <Mail className="h-4 w-4 shrink-0" />
                <p>
                  Kode OTP 6-digit telah dikirim ke <strong>{maskedDestination}</strong>.
                  Periksa folder Spam jika tidak muncul dalam 1 menit.
                </p>
              </div>

              {/* Countdown */}
              <div className={`fp-countdown ${countdown < 60 ? "urgent" : ""}`}>
                <span>Kode kedaluwarsa dalam</span>
                <span className="fp-countdown-time">{fmt(countdown)}</span>
              </div>

              {/* OTP boxes */}
              <div className="fp-otp-row" onPaste={handleOtpPaste}>
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text" inputMode="numeric" maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`fp-otp-box ${val ? "filled" : ""}`}
                    disabled={isLoading || countdown <= 0}
                    autoComplete="one-time-code"
                    aria-label={`Digit OTP ${i + 1}`}
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="fp-resend">
                {resendCooldown > 0 ? (
                  <span className="fp-resend-wait">Kirim ulang dalam {resendCooldown}s</span>
                ) : (
                  <button
                    type="button" onClick={handleSendOTP}
                    disabled={isLoading} className="fp-resend-btn"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Kirim Ulang OTP
                  </button>
                )}
              </div>

              {error && <div className="fp-error" role="alert">{error}</div>}

              <div className="fp-actions">
                <Button
                  type="button" variant="outline"
                  onClick={() => { setStep(STEP.EMAIL); setError(""); setOtpValues(Array(OTP_DIGITS).fill("")); }}
                  disabled={isLoading} className="fp-back-btn"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !otpComplete || countdown <= 0}
                  className="fp-submit-btn flex-1"
                >
                  {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
                </Button>
              </div>
            </form>
          )}

          {/* ══ STEP 3: Password baru ══ */}
          {step === STEP.PASSWORD && (
            <form onSubmit={handleResetPassword} className="fp-form">
              <div className="fp-field">
                <Label htmlFor="fp-new-password">Password Baru</Label>
                <div className="fp-input-wrap">
                  <Lock className="fp-input-icon" />
                  <Input
                    id="fp-new-password"
                    type={showNew ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="fp-input"
                    disabled={isLoading}
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowNew((p) => !p)} className="fp-eye-btn">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPassword && (
                  <div className="fp-strength-row">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`fp-strength-bar ${getStrengthColor(newPassword, i)}`} />
                    ))}
                    <span className={`fp-strength-label ${getStrengthTextClass(newPassword)}`}>
                      {getStrengthLabel(newPassword)}
                    </span>
                  </div>
                )}
              </div>

              <div className="fp-field">
                <Label htmlFor="fp-confirm-password">Konfirmasi Password</Label>
                <div className="fp-input-wrap">
                  <Lock className="fp-input-icon" />
                  <Input
                    id="fp-confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Ulangi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`fp-input ${
                      confirmPassword && confirmPassword !== newPassword
                        ? "border-red-300"
                        : confirmPassword && confirmPassword === newPassword
                        ? "border-green-400"
                        : ""
                    }`}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowConfirm((p) => !p)} className="fp-eye-btn">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword === newPassword && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Password cocok
                  </p>
                )}
              </div>

              {error && <div className="fp-error" role="alert">{error}</div>}

              <Button
                type="submit"
                disabled={isLoading || newPassword.length < 8 || newPassword !== confirmPassword}
                className="fp-submit-btn w-full"
              >
                {isLoading ? "Memproses..." : "Reset Password Sekarang"}
              </Button>
            </form>
          )}

          {/* ══ STEP 4: Sukses ══ */}
          {step === STEP.SUCCESS && (
            <div className="fp-success">
              <div className="fp-success-anim">
                <CheckCircle2 className="fp-success-icon" />
              </div>
              <h3 className="fp-success-title">Password Berhasil Direset!</h3>
              <p className="fp-success-desc">
                Password akun <strong>{email}</strong> telah diperbarui.
                Silakan login dengan password baru Anda.
              </p>
              <Button className="fp-success-btn" onClick={handleClose}>
                Kembali ke Login
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .fp-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(10,20,40,0.6);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: fp-fade 0.2s ease;
        }
        @keyframes fp-fade { from{opacity:0}to{opacity:1} }

        .fp-modal {
          background: #fff; border-radius: 1.25rem;
          width: 100%; max-width: 460px;
          box-shadow: 0 28px 72px rgba(10,20,40,0.24), 0 2px 8px rgba(10,20,40,0.08);
          animation: fp-up 0.22s cubic-bezier(.34,1.56,.64,1);
          overflow: hidden;
        }
        @keyframes fp-up {
          from{transform:translateY(28px) scale(.97);opacity:0}
          to{transform:translateY(0) scale(1);opacity:1}
        }

        /* Header */
        .fp-header {
          display: flex; align-items: center; gap: 0.85rem;
          padding: 1.4rem 1.5rem 1.2rem;
          border-bottom: 1px solid #f1f5f9;
          background: linear-gradient(135deg,#eef6ff 0%,#f8fbff 100%);
          position: relative;
        }
        .fp-icon-wrap {
          flex-shrink: 0; width: 2.75rem; height: 2.75rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg,#1a4a7a 0%,#2563eb 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(37,99,235,0.28);
        }
        .fp-icon { color:white; width:1.2rem; height:1.2rem; }
        .fp-title { font-size:1.1rem; font-weight:700; color:#0f172a; margin:0; line-height:1.3; }
        .fp-subtitle { font-size:0.8rem; color:#64748b; margin:0.2rem 0 0; }
        .fp-close-btn {
          margin-left:auto; padding:0.3rem; border-radius:0.5rem;
          color:#94a3b8; background:transparent; border:none; cursor:pointer;
          display:flex; align-items:center; transition:background .15s,color .15s;
          flex-shrink:0;
        }
        .fp-close-btn:hover { background:#f1f5f9; color:#0f172a; }

        /* Step dots */
        .fp-steps { display:flex; gap:0.35rem; margin-right:0.5rem; flex-shrink:0; }
        .fp-step-dot {
          width:0.5rem; height:0.5rem; border-radius:50%;
          background:#e2e8f0; transition:all .25s;
        }
        .fp-step-dot.active { background:#2563eb; transform:scale(1.3); }
        .fp-step-dot.done { background:#16a34a; }

        /* Body */
        .fp-body { padding:1.5rem; }
        .fp-form { display:flex; flex-direction:column; gap:1rem; }
        .fp-hint { font-size:0.855rem; color:#64748b; line-height:1.6; margin:0; }
        .fp-field { display:flex; flex-direction:column; gap:0.4rem; }

        /* Input */
        .fp-input-wrap { position:relative; }
        .fp-input-icon {
          position:absolute; left:0.75rem; top:50%; transform:translateY(-50%);
          width:1rem; height:1rem; color:#94a3b8; pointer-events:none;
        }
        .fp-input { padding-left:2.25rem !important; }
        .fp-eye-btn {
          position:absolute; right:0.6rem; top:50%; transform:translateY(-50%);
          padding:0.25rem; background:transparent; border:none; cursor:pointer;
          color:#94a3b8; border-radius:0.35rem; display:flex; align-items:center;
          transition:color .15s;
        }
        .fp-eye-btn:hover { color:#475569; }

        /* Info box */
        .fp-info-box {
          display:flex; align-items:flex-start; gap:0.6rem;
          background:#f0f9ff; border:1px solid #bae6fd; border-radius:0.65rem;
          padding:0.65rem 0.85rem; font-size:0.82rem; color:#0369a1; line-height:1.5;
        }

        /* OTP boxes */
        .fp-otp-row {
          display:flex; gap:0.5rem; justify-content:center; padding:0.25rem 0;
        }
        .fp-otp-box {
          width:3rem; height:3.5rem;
          text-align:center; font-size:1.4rem; font-weight:700;
          border:2px solid #e2e8f0; border-radius:0.75rem;
          background:#f8fafc; color:#0f172a;
          outline:none; transition:all .15s; font-family:monospace;
        }
        .fp-otp-box:focus { border-color:#2563eb; background:#eff6ff; box-shadow:0 0 0 3px rgba(37,99,235,.14); }
        .fp-otp-box.filled { border-color:#16a34a; background:#f0fdf4; color:#15803d; }
        .fp-otp-box:disabled { opacity:0.5; cursor:not-allowed; }

        /* Countdown */
        .fp-countdown {
          display:flex; align-items:center; justify-content:space-between;
          background:#f0f9ff; border:1px solid #bae6fd; border-radius:0.6rem;
          padding:0.5rem 0.9rem; font-size:0.82rem; color:#0369a1;
        }
        .fp-countdown.urgent { background:#fef2f2; border-color:#fecaca; color:#b91c1c; animation:pulse-r 1.5s ease infinite; }
        @keyframes pulse-r { 0%,100%{opacity:1}50%{opacity:.65} }
        .fp-countdown-time { font-weight:800; font-family:monospace; font-size:1rem; }

        /* Resend */
        .fp-resend { text-align:center; }
        .fp-resend-wait { font-size:0.8rem; color:#94a3b8; }
        .fp-resend-btn {
          background:none; border:none; cursor:pointer;
          font-size:0.82rem; color:#2563eb; font-weight:600;
          display:inline-flex; align-items:center; gap:0.35rem;
          padding:0.3rem 0.5rem; border-radius:0.4rem; transition:background .15s;
        }
        .fp-resend-btn:hover { background:#eff6ff; }
        .fp-resend-btn:disabled { opacity:0.5; cursor:not-allowed; }

        /* Actions */
        .fp-actions { display:flex; gap:0.75rem; }
        .fp-back-btn { flex-shrink:0; }

        /* Strength */
        .fp-strength-row { display:flex; align-items:center; gap:0.35rem; margin-top:0.35rem; }
        .fp-strength-bar { flex:1; height:4px; border-radius:2px; background:#e2e8f0; transition:background .3s; }
        .fp-strength-bar.red { background:#ef4444; }
        .fp-strength-bar.orange { background:#f97316; }
        .fp-strength-bar.yellow { background:#eab308; }
        .fp-strength-bar.green { background:#22c55e; }
        .fp-strength-label { font-size:0.72rem; font-weight:600; margin-left:0.25rem; white-space:nowrap; }
        .fp-strength-label.red { color:#ef4444; }
        .fp-strength-label.orange { color:#f97316; }
        .fp-strength-label.yellow { color:#ca8a04; }
        .fp-strength-label.green { color:#16a34a; }

        /* Error */
        .fp-error {
          background:#fef2f2; border:1px solid #fecaca; color:#b91c1c;
          border-radius:0.5rem; padding:0.6rem 0.8rem;
          font-size:0.84rem; font-weight:500;
        }

        /* Submit */
        .fp-submit-btn {
          background:linear-gradient(135deg,#1a4a7a 0%,#1e3a5f 100%) !important;
          color:white !important; font-weight:600;
          transition:opacity .15s,transform .1s,box-shadow .15s;
          box-shadow:0 3px 10px rgba(26,74,122,.22);
        }
        .fp-submit-btn:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); box-shadow:0 5px 16px rgba(26,74,122,.3); }
        .fp-submit-btn:disabled { opacity:.55; box-shadow:none; }

        /* Success */
        .fp-success {
          display:flex; flex-direction:column; align-items:center;
          text-align:center; gap:0.75rem; padding:0.5rem 0;
        }
        .fp-success-anim { animation:fp-pop .4s cubic-bezier(.34,1.56,.64,1); }
        @keyframes fp-pop { from{transform:scale(0)}to{transform:scale(1)} }
        .fp-success-icon { width:3.75rem; height:3.75rem; color:#16a34a; margin-bottom:0.25rem; }
        .fp-success-title { font-size:1.15rem; font-weight:700; color:#0f172a; margin:0; }
        .fp-success-desc { font-size:0.875rem; color:#64748b; line-height:1.65; max-width:340px; margin:0; }
        .fp-success-btn {
          margin-top:0.5rem;
          background:linear-gradient(135deg,#1a4a7a 0%,#1e3a5f 100%) !important;
          color:white !important; font-weight:600;
          padding:0.6rem 2rem; border-radius:0.65rem;
          box-shadow:0 3px 10px rgba(26,74,122,.22);
        }
      `}</style>
    </div>
  );
}

// ── Password strength helpers ─────────────────────────────────────────────────
function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || /\d/.test(pw)) s++;
  return Math.min(s, 4);
}
function getStrengthLabel(pw) {
  return ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][getStrength(pw)] || "Lemah";
}
function getStrengthTextClass(pw) {
  return ["", "red", "orange", "yellow", "green"][getStrength(pw)] || "red";
}
function getStrengthColor(pw, bar) {
  const s = getStrength(pw);
  if (bar > s) return "";
  return ["", "red", "orange", "yellow", "green"][s] || "";
}
