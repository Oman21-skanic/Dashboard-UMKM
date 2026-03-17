import {
  Bell,
  Eye,
  FileDown,
  Instagram,
  Menu,
  Receipt,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SidebarContent from "@/component/SidebarContent";
import TikTokIcon from "@/component/TikTokIcon";
import { Button } from "@/component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/component/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const statCards = [
  {
    label: "Total Pendapatan",
    value: "Rp18,4jt",
    change: "+18.5%",
    tone: "bg-[#e7f7ef] text-[#1f9d6a]",
    iconBg: "bg-[#e8f1fb] text-[#3b6d9c]",
    icon: Wallet,
  },
  {
    label: "Total Pesanan",
    value: "487",
    change: "+24.1%",
    tone: "bg-[#e7f7ef] text-[#1f9d6a]",
    iconBg: "bg-[#e7f7ef] text-[#1f9d6a]",
    icon: ShoppingCart,
  },
  {
    label: "Rata-rata Order",
    value: "Rp37,8rb",
    change: "-3.2%",
    tone: "bg-[#fde8e8] text-[#ef4444]",
    iconBg: "bg-[#fff2e7] text-[#f97316]",
    icon: Receipt,
  },
  {
    label: "TikTok Views",
    value: "284K",
    change: "+67.3%",
    tone: "bg-[#e7f7ef] text-[#1f9d6a]",
    iconBg: "bg-[#ffe6ee] text-[#e11d48]",
    icon: Eye,
  },
];

const trendValues = [
  6, 10, 9, 14, 18, 12, 20, 11, 16, 24, 13, 18, 22, 15, 26, 18, 20, 28,
  14, 12, 18, 10, 16, 20, 15, 30, 18, 22, 19, 21,
];

const trendData = trendValues.map((value, index) => ({
  day: index + 1,
  value,
}));

const highlightedTrendDays = new Set([26]);

const topProducts = [
  {
    name: "Sabun Aloe Vera",
    value: "Rp1,8jt",
    percent: 92,
    tone: "bg-[#3b82f6]",
  },
  {
    name: "Toner Vit C Serum",
    value: "Rp1,2jt",
    percent: 68,
    tone: "bg-[#6366f1]",
  },
  {
    name: "Eye Cream Retinol",
    value: "Rp875rb",
    percent: 52,
    tone: "bg-[#22c55e]",
  },
  {
    name: "Micellar Water",
    value: "Rp520rb",
    percent: 36,
    tone: "bg-[#f97316]",
  },
  {
    name: "Masker Lumpur",
    value: "Rp310rb",
    percent: 22,
    tone: "bg-[#ef4444]",
  },
];

const orderStatusData = [
  { name: "Selesai", value: 51.1, color: "#3b82f6" },
  { name: "Dikirim", value: 27.3, color: "#0f2a43" },
  { name: "Diproses", value: 14.4, color: "#f97316" },
  { name: "Pending", value: 5.8, color: "#facc15" },
];

const platformPerformance = [
  {
    name: "TikTok Shop",
    value: "Rp8,2jt",
    percent: 88,
    color: "#38bdf8",
    icon: TikTokIcon,
  },
  {
    name: "Shopee",
    value: "Rp5,7jt",
    percent: 62,
    color: "#f97316",
    icon: ShoppingBag,
  },
  {
    name: "Instagram",
    value: "Rp2,9jt",
    percent: 44,
    color: "#ec4899",
    icon: Instagram,
  },
  {
    name: "Tokopedia",
    value: "Rp1,6jt",
    percent: 28,
    color: "#22c55e",
    icon: Store,
  },
];

export default function Analitik() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.businessName || user?.fullName || "Ujang Santosa";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-[#102e4a]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-[#0f2a43] text-white md:flex">
          <SidebarContent
            displayName={displayName}
            initials={initials}
            onLogout={handleLogout}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/60 bg-white/60 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-3 md:hidden">
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]"
                      aria-label="Buka menu"
                    >
                      <Menu className="h-4 w-4" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-72 border-r-0 bg-[#0f2a43] p-0 text-white"
                  >
                    <SidebarContent
                      displayName={displayName}
                      initials={initials}
                      onLogout={handleLogout}
                      CloseWrapper={SheetClose}
                    />
                  </SheetContent>
                </Sheet>
                <div>
                  <p className="text-[0.65rem] font-semibold text-[#7c8ca0]">
                    DashUMKM
                  </p>
                  <h1 className="text-sm font-semibold text-[#14293d]">
                    Analytics Dashboard
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]">
                  <Bell className="h-4 w-4" />
                </button>
                <Button className="h-9 rounded-xl bg-[#3b6d9c] px-3 text-xs font-semibold text-white hover:bg-[#2f5f87]">
                  <FileDown className="mr-2 h-4 w-4" />
                  CSV
                </Button>
              </div>
            </div>

            <div className="mt-3 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <Input
                  placeholder="Cari data analitik..."
                  className="h-9 w-full rounded-xl border border-[#e2e8f0] bg-white/90 pl-9 text-sm focus-visible:ring-[#3bb0f3]"
                />
              </div>
            </div>

            <div className="hidden flex-wrap items-center justify-between gap-4 md:flex">
              <div>
                <p className="text-xs font-semibold text-[#7c8ca0]">
                  DashUMKM / Analitik
                </p>
                <h1 className="text-2xl font-semibold text-[#14293d] md:text-3xl">
                  Analytics Dashboard
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  <Input
                    placeholder="Cari data analitik..."
                    className="h-10 w-60 rounded-xl border border-[#e2e8f0] bg-white/90 pl-9 text-sm focus-visible:ring-[#3bb0f3]"
                  />
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]">
                  <Bell className="h-4 w-4" />
                </button>
                <Button className="h-10 rounded-xl bg-[#3b6d9c] px-4 text-sm font-semibold text-white hover:bg-[#2f5f87]">
                  <FileDown className="mr-2 h-4 w-4" />
                  Ekspor CSV
                </Button>
              </div>
            </div>
          </header>

          <main className="space-y-6 px-5 py-6 md:px-8">
            <section className="grid gap-4 lg:grid-cols-4">
              {statCards.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.label}
                    className="border-[#eef2f7] shadow-[0_16px_40px_rgba(15,42,67,0.08)]"
                  >
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${item.tone}`}
                      >
                        {item.change}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa6b2]">
                        {item.label}
                      </p>
                      <p className="text-2xl font-semibold text-[#14293d]">
                        {item.value}
                      </p>
                      <p className="text-xs text-[#7c8ca0]">Bulan ini</p>
                    </CardContent>
                  </Card>
                );
              })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-lg font-semibold text-[#14293d]">
                      Tren Pendapatan — 30 Hari
                    </CardTitle>
                    <p className="text-xs text-[#7c8ca0]">
                      Rp18,4jt total bulan ini
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg bg-[#eaf3fc] px-3 py-1.5 text-xs font-semibold text-[#1c4f7a]">
                      Bar
                    </button>
                    <button className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#94a3b8]">
                      Line
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="h-56 pt-0 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid
                        stroke="rgba(15,42,67,0.08)"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        interval={4}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid rgba(15,42,67,0.12)",
                          backgroundColor: "#ffffff",
                        }}
                        labelStyle={{ color: "#0f2a43", fontWeight: 700 }}
                      />
                      <Bar dataKey="value" barSize={16} radius={[8, 8, 0, 0]}>
                        {trendData.map((entry) => {
                          const fill = highlightedTrendDays.has(entry.day)
                            ? "#0f2a43"
                            : entry.day % 3 === 0
                              ? "#3bb0f3"
                              : "#cfe9fb";
                          return (
                            <Cell key={`cell-${entry.day}`} fill={fill} />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-[#14293d]">
                    Produk Terlaris
                  </CardTitle>
                  <p className="text-xs text-[#7c8ca0]">
                    Performa produk teratas bulan ini.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-semibold text-[#14293d]">
                        <span>{product.name}</span>
                        <span className="text-xs text-[#1f3a52]">
                          {product.value}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#e2e8f0]">
                        <div
                          className={`h-2 rounded-full ${product.tone}`}
                          style={{ width: `${product.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-[#14293d]">
                    Status Pesanan
                  </CardTitle>
                  <p className="text-xs text-[#7c8ca0]">
                    Total order bulan ini.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="relative h-36 w-36 sm:h-40 sm:w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          dataKey="value"
                          innerRadius={52}
                          outerRadius={70}
                          stroke="none"
                        >
                          {orderStatusData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-semibold text-[#14293d]">
                        487
                      </p>
                      <p className="text-xs text-[#7c8ca0]">TOTAL ORDER</p>
                    </div>
                  </div>
                  <div className="grid w-full gap-2 text-xs text-[#7c8ca0] sm:grid-cols-2">
                    {orderStatusData.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.name}
                        </span>
                        <span className="font-semibold text-[#14293d]">
                          {entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-[#14293d]">
                    Performa Platform
                  </CardTitle>
                  <p className="text-xs text-[#7c8ca0]">
                    Pendapatan per platform penjualan
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platformPerformance.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div
                        key={platform.name}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                          style={{ backgroundColor: platform.color }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between text-sm font-semibold text-[#14293d]">
                            <span>{platform.name}</span>
                            <span className="text-xs text-[#1f3a52]">
                              {platform.value}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-[#e2e8f0]">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${platform.percent}%`,
                                backgroundColor: platform.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
