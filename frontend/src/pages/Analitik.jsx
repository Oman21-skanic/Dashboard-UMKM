import { useCallback, useEffect, useState } from "react";
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
import api from "@/api/apiClient";

export default function Analitik() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.businessName || user?.email || "Pengguna";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, inventoryRes] = await Promise.all([
        api.get("/api/orders"),
        api.get("/api/inventory"),
      ]);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setInventory(Array.isArray(inventoryRes.data) ? inventoryRes.data : []);
    } catch (err) {
      console.error("Fetch analytics error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Computed Stats ──
  const totalPendapatan = orders.reduce((sum, o) => sum + (o.payment_info?.total_amount || 0), 0);
  const totalPesanan = orders.length;
  const rataRataOrder = totalPesanan > 0 ? Math.round(totalPendapatan / totalPesanan) : 0;
  const totalProduk = inventory.length;

  const formatRupiah = (val) => {
    if (val >= 1_000_000) return `Rp${(val / 1_000_000).toFixed(1)}jt`;
    if (val >= 1_000) return `Rp${(val / 1_000).toFixed(0)}rb`;
    return `Rp${val.toLocaleString("id-ID")}`;
  };

  const statCards = [
    {
      label: "Total Pendapatan",
      value: formatRupiah(totalPendapatan),
      change: totalPesanan > 0 ? `${totalPesanan} order` : "—",
      tone: "bg-[#e7f7ef] text-[#1f9d6a]",
      iconBg: "bg-[#e8f1fb] text-[#3b6d9c]",
      icon: Wallet,
    },
    {
      label: "Total Pesanan",
      value: totalPesanan.toLocaleString("id-ID"),
      change: `${orders.filter((o) => o.order_status === "DELIVERED" || o.order_status === "COMPLETED").length} selesai`,
      tone: "bg-[#e7f7ef] text-[#1f9d6a]",
      iconBg: "bg-[#e7f7ef] text-[#1f9d6a]",
      icon: ShoppingCart,
    },
    {
      label: "Rata-rata Order",
      value: formatRupiah(rataRataOrder),
      change: totalPesanan > 0 ? `dari ${totalPesanan} order` : "—",
      tone: "bg-[#eaf3fc] text-[#1c4f7a]",
      iconBg: "bg-[#fff2e7] text-[#f97316]",
      icon: Receipt,
    },
    {
      label: "Total Produk",
      value: totalProduk.toLocaleString("id-ID"),
      change: `${inventory.filter((i) => (i.skus || []).reduce((s, sk) => s + (sk.stock_info?.available_stock || 0), 0) <= 10).length} stok menipis`,
      tone: inventory.filter((i) => (i.skus || []).reduce((s, sk) => s + (sk.stock_info?.available_stock || 0), 0) <= 10).length > 0
        ? "bg-[#fff2e7] text-[#f97316]"
        : "bg-[#e7f7ef] text-[#1f9d6a]",
      iconBg: "bg-[#ffe6ee] text-[#e11d48]",
      icon: Eye,
    },
  ];

  // ── Trend Data ──
  const trendData = (() => {
    const now = new Date();
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data = Array.from({ length: days }, (_, i) => ({ day: i + 1, value: 0 }));
    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        data[d.getDate() - 1].value += o.payment_info?.total_amount || 0;
      }
    });
    return data.map((d) => ({ ...d, value: Math.round(d.value / 1000) }));
  })();

  const maxDay = trendData.reduce((m, d) => (d.value > m.value ? d : m), trendData[0]);
  const highlightedDays = new Set(maxDay ? [maxDay.day] : []);

  // ── Top Products ──
  const topProducts = (() => {
    const map = {};
    orders.forEach((o) => {
      (o.item_list || []).forEach((item) => {
        const key = item.product_name || "Unknown";
        if (!map[key]) map[key] = { revenue: 0, count: 0 };
        map[key].revenue += item.subtotal || 0;
        map[key].count += item.quantity || 0;
      });
    });
    const maxRevenue = Math.max(...Object.values(map).map((v) => v.revenue), 1);
    const tones = ["bg-[#3b82f6]", "bg-[#6366f1]", "bg-[#22c55e]", "bg-[#f97316]", "bg-[#ef4444]"];
    return Object.entries(map)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(([name, data], i) => ({
        name,
        value: formatRupiah(data.revenue),
        percent: Math.round((data.revenue / maxRevenue) * 100),
        tone: tones[i] || tones[0],
      }));
  })();

  // ── Order Status ──
  const orderStatusData = (() => {
    const counts = {
      DELIVERED: orders.filter((o) => o.order_status === "DELIVERED" || o.order_status === "COMPLETED").length,
      IN_TRANSIT: orders.filter((o) => o.order_status === "IN_TRANSIT").length,
      AWAITING_SHIPMENT: orders.filter((o) => o.order_status === "AWAITING_SHIPMENT").length,
      UNPAID: orders.filter((o) => o.order_status === "UNPAID").length,
      CANCELLED: orders.filter((o) => o.order_status === "CANCELLED").length,
    };
    const total = Math.max(totalPesanan, 1);
    return [
      { name: "Selesai", value: parseFloat(((counts.DELIVERED / total) * 100).toFixed(1)), color: "#3b82f6", raw: counts.DELIVERED },
      { name: "Dalam Perjalanan", value: parseFloat(((counts.IN_TRANSIT / total) * 100).toFixed(1)), color: "#0f2a43", raw: counts.IN_TRANSIT },
      { name: "Menunggu Kirim", value: parseFloat(((counts.AWAITING_SHIPMENT / total) * 100).toFixed(1)), color: "#f97316", raw: counts.AWAITING_SHIPMENT },
      { name: "Belum Bayar", value: parseFloat(((counts.UNPAID / total) * 100).toFixed(1)), color: "#facc15", raw: counts.UNPAID },
      { name: "Dibatalkan", value: parseFloat(((counts.CANCELLED / total) * 100).toFixed(1)), color: "#94a3b8", raw: counts.CANCELLED },
    ].filter((s) => s.raw > 0);
  })();

  // ── Platform Performance ──
  const platformPerformance = (() => {
    const sources = { Manual: 0, TikTok: 0, Instagram: 0, Tokopedia: 0 };
    orders.forEach((o) => {
      const src = o.source || "Manual";
      if (sources[src] !== undefined) sources[src] += o.payment_info?.total_amount || 0;
    });
    const maxVal = Math.max(...Object.values(sources), 1);
    const icons = { Manual: ShoppingBag, TikTok: TikTokIcon, Instagram: Instagram, Tokopedia: Store };
    const colors = { Manual: "#3b82f6", TikTok: "#38bdf8", Instagram: "#ec4899", Tokopedia: "#22c55e" };
    return Object.entries(sources)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([name, val]) => ({
        name,
        value: formatRupiah(val),
        percent: Math.round((val / maxVal) * 100),
        color: colors[name] || "#64748b",
        icon: icons[name] || ShoppingBag,
      }));
  })();

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
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Stat Cards */}
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

                {/* Revenue Trend + Top Products */}
                <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                  <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                      <div>
                        <CardTitle className="text-lg font-semibold text-[#14293d]">
                          Tren Pendapatan — 30 Hari
                        </CardTitle>
                        <p className="text-xs text-[#7c8ca0]">
                          {formatRupiah(totalPendapatan)} total bulan ini (dalam ribuan)
                        </p>
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
                            formatter={(value) => [`Rp${value}rb`, "Pendapatan"]}
                          />
                          <Bar dataKey="value" barSize={16} radius={[8, 8, 0, 0]}>
                            {trendData.map((entry) => {
                              const fill = highlightedDays.has(entry.day)
                                ? "#0f2a43"
                                : entry.value > 0
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
                        Berdasarkan pendapatan bulan ini.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {topProducts.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 text-sm">
                          Belum ada data produk
                        </div>
                      ) : (
                        topProducts.map((product) => (
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
                        ))
                      )}
                    </CardContent>
                  </Card>
                </section>

                {/* Order Status + Platform Performance */}
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
                      {orderStatusData.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          Belum ada data pesanan
                        </div>
                      ) : (
                        <>
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
                                {totalPesanan}
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
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold text-[#14293d]">
                        Performa Sumber Order
                      </CardTitle>
                      <p className="text-xs text-[#7c8ca0]">
                        Pendapatan per sumber pesanan
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {platformPerformance.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 text-sm">
                          Belum ada data
                        </div>
                      ) : (
                        platformPerformance.map((platform) => {
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
                        })
                      )}
                    </CardContent>
                  </Card>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
