import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";
import AuthBottomNav from "@/component/AuthBottomNav";
import AuthShell from "@/component/AuthShell";
import TikTokIcon from "@/component/TikTokIcon";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTikTokLoading, setIsTikTokLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Email/No. WhatsApp dan password wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      await login(identifier, password);
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Gagal masuk. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Login dulu pakai email+password, lalu langsung connect TikTok
  const handleTikTokConnect = async () => {
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Isi Email dan Password dulu sebelum hubungkan TikTok.");
      return;
    }

    setIsTikTokLoading(true);
    try {
      const data = await login(identifier, password);
      // Setelah login berhasil, langsung redirect ke TikTok OAuth
      const token = data.token;
      window.location.href = `${API_URL}/api/auth/tiktok?token=${token}`;
    } catch (submitError) {
      setError(submitError.message || "Gagal masuk. Coba lagi.");
      setIsTikTokLoading(false);
    }
  };

  return (
    <AuthShell activeTab="login">
      <section className="space-y-5 lg:space-y-6">
        <div>
          <h1 className="text-3xl leading-[1.1] font-semibold tracking-[-0.02em] text-[#123a5e] sm:text-4xl lg:text-[2.45rem]">
            Selamat datang kembali!
          </h1>
          <p className="mt-1.5 text-base text-[#647387] lg:text-[1.2rem]">
            Masuk untuk mengelola toko Anda hari ini.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-4.5">
          <div>
            <label className="auth-field-label">Email / No. WhatsApp</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8f98a6]" />
              <Input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                type="text"
                placeholder="contoh@mail.com atau 0812..."
                className="auth-input pl-11"
                disabled={isLoading || isTikTokLoading}
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
                placeholder="Masukkan password Anda"
                className="auth-input pl-11 pr-11"
                disabled={isLoading || isTikTokLoading}
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
            <p className="mt-1 text-right text-sm font-semibold text-[#153a5c] lg:text-[0.95rem]">
              Lupa Password?
            </p>
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <Button
            type="submit"
            disabled={isLoading || isTikTokLoading}
            className="h-12 w-full rounded-xl bg-[#123d62] text-base font-semibold text-[#f2efe8] hover:bg-[#103759] lg:h-[3.35rem] lg:text-[1.15rem]"
          >
            {isLoading ? "Memproses..." : "Masuk Sekarang"}
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
          onClick={handleTikTokConnect}
          disabled={isLoading || isTikTokLoading}
          className="h-12 w-full rounded-xl bg-black text-base font-semibold text-white hover:bg-black/90 disabled:opacity-60 disabled:cursor-not-allowed lg:h-[3.35rem] lg:text-[1.15rem]"
        >
          {isTikTokLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Menghubungkan...
            </>
          ) : (
            <>
              <TikTokIcon className="h-[1em]! w-[1em]! shrink-0" />
              Hubungkan TikTok Shop
            </>
          )}
        </Button>

        <AuthBottomNav activeItem="login" />
      </section>
    </AuthShell>
  );
}