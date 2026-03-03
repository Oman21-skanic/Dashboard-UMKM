import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Package, Store } from "lucide-react";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { useAuth } from "@/contexts/AuthContext";

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { level: "Lemah", color: "bg-danger", width: "25%" };
  if (score === 2) return { level: "Sedang", color: "bg-warning", width: "50%" };
  if (score === 3) return { level: "Kuat", color: "bg-info", width: "75%" };
  return { level: "Sangat Kuat", color: "bg-success", width: "100%" };
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const validate = () => {
    if (!email.trim()) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format email tidak valid.";
    if (!businessName.trim()) return "Nama bisnis wajib diisi.";
    if (businessName.trim().length < 2) return "Nama bisnis minimal 2 karakter.";
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
      await register(email, businessName, password);
      navigate("/login", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-[0_10px_25px_rgba(16,46,74,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden bg-primary px-10 py-12 text-primary-foreground lg:block">
          <div className="pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-12 left-8 h-56 w-56 rounded-full bg-white/8 blur-3xl" />
          <div className="relative space-y-9">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Package className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold tracking-tight">DashUMKM</p>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">Bangun pusat kontrol bisnis UMKM Anda.</h1>
              <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">
                Dengan satu akun, Anda bisa memantau performa penjualan, inventori, dan aktivitas toko secara menyeluruh.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-5">
              <p className="text-sm font-semibold">Keuntungan langsung setelah daftar:</p>
              <ul className="mt-3 space-y-2 text-xs text-primary-foreground/80">
                <li>- Dashboard operasional real-time.</li>
                <li>- Pengingat stok menipis otomatis.</li>
                <li>- Laporan performa harian siap pakai.</li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 lg:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Package className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-foreground">DashUMKM</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">Daftar akun baru</h2>
              <p className="text-sm text-muted-foreground">Mulai kelola bisnis Anda dengan sistem yang lebih rapi.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Bisnis</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    placeholder="nama@bisnis.com"
                    className="h-12 rounded-xl border-input bg-white pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nama Bisnis</label>
                <div className="relative">
                  <Store className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    type="text"
                    placeholder="Contoh: Reyhan Craft"
                    className="h-12 rounded-xl border-input bg-white pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    placeholder="Minimal 8 karakter"
                    className="h-12 rounded-xl border-input bg-white pl-10"
                    disabled={isLoading}
                  />
                </div>
                {password ? (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Kekuatan password: <span className="font-semibold text-foreground">{strength.level}</span>
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type="password"
                    placeholder="Ulangi password"
                    className="h-12 rounded-xl border-input bg-white pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error ? (
                <p className="rounded-xl border-l-4 border-danger bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
              ) : null}

              <Button className="h-12 w-full gap-2 rounded-xl text-sm font-semibold" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Daftar Sekarang"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
                Masuk sekarang
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
