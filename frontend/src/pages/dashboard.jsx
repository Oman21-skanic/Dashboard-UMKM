import {
  BarChart3,
  Boxes,
  LogOut,
  Package,
  Store,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { label: "Dashboard", icon: BarChart3, active: true },
  { label: "Inventori", icon: Boxes, active: false },
  { label: "Toko", icon: Store, active: false },
];

const metrics = [
  {
    label: "Total Produk",
    value: "1.248",
    description: "+12% dari minggu lalu",
  },
  {
    label: "Pesanan Aktif",
    value: "138",
    description: "24 pesanan perlu diproses",
  },
  {
    label: "Pendapatan Bulan Ini",
    value: "Rp 82.450.000",
    description: "+8.4% vs bulan lalu",
  },
];

const chartData = [
  { name: "Sen", omzet: 14, target: 18 },
  { name: "Sel", omzet: 22, target: 18 },
  { name: "Rab", omzet: 20, target: 18 },
  { name: "Kam", omzet: 26, target: 18 },
  { name: "Jum", omzet: 24, target: 18 },
  { name: "Sab", omzet: 30, target: 22 },
  { name: "Min", omzet: 28, target: 22 },
];

const lowStockItems = [
  { name: "Tas Rajut Premium", stock: 4, sku: "SKU-TRP-019" },
  { name: "Kopi House Blend 250gr", stock: 6, sku: "SKU-KOP-204" },
  { name: "Keripik Pisang Coklat", stock: 3, sku: "SKU-KRP-103" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground md:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xl font-bold">DashUMKM</p>
              <p className="text-xs text-sidebar-foreground/75">
                Control Center
              </p>
            </div>
          </div>

          <nav className="mt-8 space-y-1.5">
            {menuItems.map((item) => {
              const MenuIcon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    item.active
                      ? "bg-white/10 text-sidebar-foreground"
                      : "text-sidebar-foreground/80 hover:bg-white/6 hover:text-sidebar-foreground"
                  }`}
                >
                  <MenuIcon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/8 p-4">
            <p className="text-sm font-semibold">
              {user?.businessName || "Bisnis Anda"}
            </p>
            <p className="mt-1 text-xs text-sidebar-foreground/75">
              {user?.email}
            </p>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="mt-4 h-10 w-full justify-start rounded-xl bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4 md:px-8">
            <div>
              <p className="text-lg font-bold text-foreground md:text-2xl">
                Dashboard Operasional
              </p>
              <p className="text-xs text-muted-foreground md:text-sm">
                Ringkasan performa bisnis hari ini.
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-xl md:hidden"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </header>

          <main className="space-y-6 p-5 md:p-8">
            <section className="grid gap-4 lg:grid-cols-3">
              {metrics.map((item) => (
                <Card key={item.label}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      Performa Omzet Mingguan
                    </CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Data simulasi untuk monitoring harian.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-soft px-3 py-1.5 text-xs text-foreground">
                    <TrendingUp className="h-4 w-4 text-success" />
                    +8.4%
                  </div>
                </CardHeader>
                <CardContent className="h-72 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid
                        stroke="rgba(16,46,74,0.08)"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#5C6B7A", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#5C6B7A", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid rgba(16,46,74,0.12)",
                          backgroundColor: "#FFFFFF",
                        }}
                        labelStyle={{ color: "#102E4A", fontWeight: 700 }}
                      />
                      <Bar
                        dataKey="omzet"
                        fill="#102E4A"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="target"
                        fill="#3BA7F0"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-foreground">
                    Peringatan Stok Menipis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.sku}
                      className="rounded-xl border-l-4 px-3 py-3"
                      style={{
                        background: "rgba(230,57,70,0.08)",
                        borderLeftColor: "#E63946",
                        color: "#E63946",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-[#A1333E]">{item.sku}</p>
                        </div>
                        <span className="rounded-lg bg-white/70 px-2 py-1 text-xs font-semibold">
                          Sisa {item.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-xl bg-soft p-3 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2 font-semibold text-foreground">
                      <TriangleAlert className="h-4 w-4 text-warning" />
                      Rekomendasi
                    </p>
                    <p className="mt-1">
                      Aktifkan notifikasi reorder otomatis agar tidak kehilangan
                      momentum penjualan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
