import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import AuthShell from "@/component/AuthShell";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { Label } from "@/component/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const OTP_DIGITS = 6;
const STEP = { EMAIL: 1, OTP: 2, PASSWORD: 3, SUCCESS: 4 };

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { sendForgotPasswordOTP, verifyForgotPasswordOTP, resetPassword } = useAuth();

  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState("");
  const [maskedDestination, setMaskedDestination] = useState("");
  const [token, setToken] = useState("");
  
  const [otpValues, setOtpValues] = useState(Array(OTP_DIGITS).fill(""));
  const otpRefs = useRef([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e?.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email wajib diisi."); return; }
    
    setIsLoading(true);
    try {
      const data = await sendForgotPasswordOTP(email.toLowerCase().trim());
      setMaskedDestination(data.maskedDestination || email);
      setStep(STEP.OTP);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message || "Gagal mengirim OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Combined OTP & New Password Reset
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError("");
    const code = otpValues.join("");
    if (code.length < OTP_DIGITS) { setError("Masukkan 6 digit kode OTP."); return; }
    if (newPassword.length < 8) { setError("Password minimal 8 karakter."); return; }
    if (newPassword !== confirmPassword) { setError("Password tidak cocok."); return; }

    setIsLoading(true);
    try {
      await resetPassword(email.toLowerCase().trim(), code, newPassword);
      setStep(STEP.SUCCESS);
    } catch (err) {
      setError(err.message || "Kode OTP salah atau gagal mereset password.");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Handlers
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

  return (
    <AuthShell activeTab="login">
      <section className="space-y-6">
        {step !== STEP.SUCCESS && (
          <button 
            onClick={() => step === STEP.EMAIL ? navigate("/login") : setStep(prev => prev - 1)}
            className="flex items-center gap-2 text-sm text-[#647387] hover:text-[#123a5e]"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
        )}

        {step === STEP.EMAIL && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-[#123a5e]">Lupa Password?</h1>
              <p className="mt-1.5 text-[#647387]">Masukkan email Anda untuk menerima kode OTP.</p>
            </div>
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label>Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f98a6]" />
                  <Input 
                    type="email" 
                    placeholder="contoh@mail.com" 
                    className="auth-input pl-11"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              {error && <p className="auth-error">{error}</p>}
              <Button type="submit" disabled={isLoading} className="h-12 w-full bg-[#123d62] text-white">
                {isLoading ? "Mengirim..." : "Kirim Kode OTP"}
              </Button>
            </form>
          </div>
        )}

        {step === STEP.OTP && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-[#123a5e]">Reset Password</h1>
              <p className="mt-1.5 text-[#647387]">Masukkan kode OTP dan buat password baru.</p>
            </div>
            
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* OTP Section */}
              <div className="space-y-3">
                <Label className="text-[#123a5e] font-semibold">Kode OTP (Cek Email)</Label>
                <div className="flex gap-2 justify-between">
                  {otpValues.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text" inputMode="numeric" maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#123a5e] outline-none"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Baru</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f98a6]" />
                    <Input 
                      type={showNew ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      className="auth-input pl-11 pr-11"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f98a6]">
                      {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-[0.7rem] text-[#8f98a6]">
                    Rekomendasi: Gunakan campuran huruf, angka, dan simbol agar lebih kuat.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8f98a6]" />
                    <Input 
                      type={showConfirm ? "text" : "password"}
                      placeholder="Ulangi password baru"
                      className="auth-input pl-11 pr-11"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f98a6]">
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && <p className="auth-error">{error}</p>}
              <Button type="submit" disabled={isLoading || otpValues.some(v => !v)} className="h-12 w-full bg-[#123d62] text-white">
                {isLoading ? "Memproses..." : "Simpan Password Baru"}
              </Button>
            </form>
          </div>
        )}

        {step === STEP.SUCCESS && (
          <div className="flex flex-col items-center text-center py-8 space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#123a5e]">Reset Berhasil!</h1>
              <p className="mt-2 text-[#647387]">Password Anda telah diperbarui. Silakan login kembali.</p>
            </div>
            <Button onClick={() => navigate("/login")} className="h-12 w-full max-w-xs bg-[#123d62] text-white">
              Kembali ke Login
            </Button>
          </div>
        )}
      </section>
    </AuthShell>
  );
}
