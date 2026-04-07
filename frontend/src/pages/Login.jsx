import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";
import AuthBottomNav from "@/component/AuthBottomNav";
import AuthShell from "@/component/AuthShell";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPasswordModal from "@/component/ForgotPasswordModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
                placeholder="Masukkan password Anda"
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
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="mt-1 block w-full text-right text-sm font-semibold text-[#153a5c] hover:text-[#2563eb] transition-colors duration-150 lg:text-[0.95rem] cursor-pointer bg-transparent border-none p-0"
            >
              Lupa Password?
            </button>
          </div>

          {error ? <p className="auth-error">{error}</p> : null}

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-[#123d62] text-base font-semibold text-[#f2efe8] hover:bg-[#103759] lg:h-[3.35rem] lg:text-[1.15rem]"
          >
            {isLoading ? "Memproses..." : "Masuk Sekarang"}
            <ArrowRight className="h-[1em] w-[1em] shrink-0" />
          </Button>
        </form>


        <AuthBottomNav activeItem="login" />
      </section>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </AuthShell>
  );
}