import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Store,
  User,
  Shield,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import AuthBottomNav from "@/component/AuthBottomNav";
import AuthShell from "@/component/AuthShell";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const OTP_DIGITS = 6;

function normalizeWhatsapp(value) {
  return value.replace(/\D/g, "");
}

export default function Register() {
  const navigate = useNavigate();
  const { register, sendRegisterOTP, verifyRegisterOTP } = useAuth();

  // Step state: 1 = Form, 2 = OTP
  const [step, setStep] = useState(1);

  // Form states
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // OTP states
  const [otpValues, setOtpValues] = useState(Array(OTP_DIGITS).fill(""));
  const otpRefs = useRef([]);
  const [maskedDestination, setMaskedDestination] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");

  // Helpers
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate Step 1
  const validateForm = () => {
    if (!fullName.trim()) return "Nama lengkap wajib diisi.";
    if (!businessName.trim()) return "Nama toko wajib diisi.";
    if (!email.trim()) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Format email tidak valid.";

    const normalizedPhone = normalizeWhatsapp(whatsapp);
    if (!normalizedPhone) return "No. WhatsApp wajib diisi.";
    if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      return "No. WhatsApp harus 10-15 digit.";
    }

    if (!password.trim()) return "Password wajib diisi.";
    if (password.length < 8) return "Password minimal 8 karakter.";
    if (password !== confirmPassword) return "Konfirmasi password tidak cocok.";
    return null;
  };

  // Step 1: Submit Form -> Send OTP
  const handleStartRegistration = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      // Kirim DATA LENGKAP ke BE
      const userData = {
        email: email.toLowerCase().trim(),
        password,
        fullName,
        businessName,
        phoneNumber: whatsapp,
      };
      const data = await sendRegisterOTP(userData);
      setMaskedDestination(data.maskedDestination || email);
      setStep(2);
      // focus first otp box
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message || "Gagal mengirim OTP. Email mungkin sudah terdaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Finalize
  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    setError("");
    const code = otpValues.join("");
    if (code.length < OTP_DIGITS) {
      setError("Masukkan semua 6 digit kode OTP.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyRegisterOTP(email.toLowerCase().trim(), code);
      setStep(3); // Success state
    } catch (err) {
      setError(err.message || "Kode OTP salah atau pendaftaran gagal.");
      setOtpValues(Array(OTP_DIGITS).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
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

  if (step === 3) {
    return (
      <AuthShell activeTab="register" showCommunityCard={false}>
        <div className="flex flex-col items-center text-center py-8 space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#123a5e]">Registrasi Berhasil!</h1>
            <p className="mt-2 text-[#647387]">
              Akun Anda telah aktif. Silakan masuk untuk mulai mengelola bisnis Anda.
            </p>
          </div>
          <Button 
            onClick={() => navigate("/login")}
            className="h-12 w-full max-w-xs rounded-xl bg-[#123d62] text-white hover:bg-[#103759]"
          >
            Masuk Sekarang
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell activeTab="register" showCommunityCard={false}>
      <section className="space-y-5 lg:space-y-6">
        
        {step === 1 && (
          <>
            <div>
              <h1 className="text-3xl leading-[1.1] font-semibold tracking-[-0.02em] text-[#123a5e] sm:text-4xl lg:text-[2.45rem]">
                Mulai kelola bisnis Anda sekarang!
              </h1>
              <p className="mt-1.5 text-base text-[#647387] lg:text-[1.2rem]">
                Daftar gratis dan verifikasi akun Anda via email.
              </p>
            </div>

            <form onSubmit={handleStartRegistration} className="space-y-3.5 lg:space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="auth-field-label">Nama Lengkap</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8f98a6]" />
                    <Input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      type="text"
                      placeholder="Ujang Sudrajat"
                      className="auth-input pl-11"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="auth-field-label">Nama Toko</label>
                  <div className="relative">
                    <Store className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8f98a6]" />
                    <Input
                      value={businessName}
                      onChange={(event) => setBusinessName(event.target.value)}
                      type="text"
                      placeholder="Toko Berkah"
                      className="auth-input pl-11"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="auth-field-label">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8f98a6]" />
                  <Input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="ujang@tokoku.id"
                    className="auth-input pl-11"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="auth-field-label">WhatsApp</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8f98a6]" />
                  <Input
                    value={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.value)}
                    type="text"
                    inputMode="numeric"
                    placeholder="081234567890"
                    className="auth-input pl-11"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="auth-field-label">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8f98a6]" />
                    <Input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      className="auth-input pl-11 pr-11"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#8f98a6]"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-[0.7rem] text-[#8f98a6]">
                    Rekomendasi: Minimal 8 karakter, gunakan campuran huruf, angka, dan simbol.
                  </p>
                </div>

                <div>
                  <label className="auth-field-label">Konfirmasi Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8f98a6]" />
                    <Input
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi password"
                      className="auth-input pl-11 pr-11"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#8f98a6]"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {error ? <p className="auth-error">{error}</p> : null}

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-[#123d62] text-base font-semibold text-[#f2efe8] hover:bg-[#103759] lg:h-[3.35rem] lg:text-[1.15rem]"
              >
                {isLoading ? "Memproses..." : "Daftar & Kirim OTP"}
                <ArrowRight className="h-[1em] w-[1em] shrink-0" />
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm text-[#647387] hover:text-[#123a5e] mb-4"
              >
                <ArrowLeft className="h-4 w-4" /> Kembali ke form
              </button>
              <h1 className="text-3xl font-semibold text-[#123a5e]">Verifikasi Email</h1>
              <p className="mt-1.5 text-[#647387]">
                Masukkan 6 digit kode OTP yang kami kirim ke <strong>{maskedDestination}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex gap-2 justify-between">
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#123a5e] focus:ring-4 focus:ring-[#123a5e]/10 outline-none transition-all"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error ? <p className="auth-error">{error}</p> : null}

              <Button
                type="submit"
                disabled={isLoading || otpValues.some(v => !v)}
                className="h-12 w-full rounded-xl bg-[#123d62] text-white hover:bg-[#103759]"
              >
                {isLoading ? "Memverifikasi..." : "Verifikasi & Buat Akun"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleStartRegistration}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#123a5e] hover:underline"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Kirim ulang kode
                </button>
              </div>
            </form>
          </div>
        )}

        <AuthBottomNav activeItem="login" />
      </section>
    </AuthShell>
  );
}
