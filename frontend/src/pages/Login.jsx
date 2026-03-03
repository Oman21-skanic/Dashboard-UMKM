import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Lock, Mail, Package, ShieldCheck, ShoppingBag } from "lucide-react";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const highlights = [
  { label: "Produk Terkelola", value: "4.2 jt+" },
  { label: "Seller Aktif", value: "18.4 rb" },
  { label: "Pesanan Hari Ini", value: "138" },
];

const features = [
  { title: "Analitik Penjualan", icon: BarChart3, description: "Pantau omzet, traffic, dan produk terlaris secara real-time." },
  { title: "Keamanan Data", icon: ShieldCheck, description: "Akun dan data bisnis tersimpan aman dalam satu dashboard." },
  { title: "Multi-Channel", icon: ShoppingBag, description: "Kelola semua channel jualan dalam workflow yang rapi." },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Gagal masuk. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_10px_25px_rgba(16,46,74,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
        <aside className="relative hidden overflow-hidden bg-primary px-10 py-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-6 right-8 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

          <div className="relative space-y-9">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Package className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold tracking-tight">DashUMKM</p>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-md text-4xl font-bold leading-tight">
                Kelola bisnis UMKM lebih cepat dari satu dashboard.
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80">
                Semua insight operasional, stok, dan performa penjualan tampil rapi dalam visual modern yang siap dipakai harian.
              </p>
            </div>

            <div className="grid gap-4">
              {features.map((item) => {
                const FeatureIcon = item.icon;
                return (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mt-0.5 rounded-xl bg-white/15 p-2">
                    <FeatureIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-primary-foreground/75">{item.description}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/8 p-4">
            {highlights.map((item) => (
              <div key={item.label}>
                <p className="text-lg font-bold">{item.value}</p>
                <p className="text-xs text-primary-foreground/75">{item.label}</p>
              </div>
            ))}
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
              <h2 className="text-3xl font-bold text-foreground">Selamat datang kembali</h2>
              <p className="text-sm text-muted-foreground">Masuk untuk melanjutkan pengelolaan bisnis Anda.</p>
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
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    placeholder="Masukkan password"
                    className="h-12 rounded-xl border-input bg-white pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error ? (
                <p className="rounded-xl border-l-4 border-danger bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
              ) : null}

              <Button className="h-12 w-full gap-2 rounded-xl text-sm font-semibold" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
