import { useState } from "react";
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
} from "lucide-react";
import AuthBottomNav from "@/component/AuthBottomNav";
import AuthShell from "@/component/AuthShell";
import TikTokIcon from "@/component/TikTokIcon";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { useAuth } from "@/contexts/AuthContext";

function normalizeWhatsapp(value) {
  return value.replace(/\D/g, "");
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await register(fullName, businessName, email, whatsapp, password);
      navigate("/login", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell activeTab="register" showCommunityCard={false}>
      <section className="space-y-5 lg:space-y-6">
        <div>
          <h1 className="text-4xl leading-[1.1] font-semibold tracking-[-0.02em] text-[#123a5e] lg:text-[2.45rem]">
            Mulai kelola bisnis Anda sekarang!
          </h1>
          <p className="mt-1.5 text-base text-[#647387] lg:text-[1.2rem]">
            Daftar gratis untuk 14 hari pertama penggunaan premium.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 lg:space-y-4">
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
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan konfirmasi password"
                    : "Lihat konfirmasi password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-[#123d62] text-base font-semibold text-[#f2efe8] hover:bg-[#103759] lg:h-[3.35rem] lg:text-[1.15rem]"
          >
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
            <ArrowRight className="h-[1em] w-[1em] shrink-0" />
          </Button>
        </form>

        <div className="flex items-center gap-3 lg:gap-4">
          <span className="h-px flex-1 bg-[rgba(21,58,92,0.15)]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#7c858f] lg:text-[0.82rem] lg:tracking-[0.02em]">
            ATAU HUBUNGKAN AKUN
          </span>
          <span className="h-px flex-1 bg-[rgba(21,58,92,0.15)]" />
        </div>

        <Button
          type="button"
          className="h-12 w-full rounded-xl bg-black text-base font-semibold text-white hover:bg-black/90 lg:h-[3.35rem] lg:text-[1.15rem]"
        >
          <TikTokIcon className="h-[1em]! w-[1em]! shrink-0" />
          Hubungkan TikTok Shop
        </Button>

        <AuthBottomNav activeItem="login" />
      </section>
    </AuthShell>
  );
}
