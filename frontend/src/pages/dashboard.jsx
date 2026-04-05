import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  FileDown,
  Menu,
  Percent,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  Truck,
  Users,
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/component/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/apiClient";

const statusTone = {
  UNPAID: "bg-[#fee2e2] text-[#ef4444]",
  AWAITING_SHIPMENT: "bg-[#fff2e7] text-[#f97316]",
  IN_TRANSIT: "bg-[#eaf3fc] text-[#1c4f7a]",
  DELIVERED: "bg-[#e7f7ef] text-[#1f9d6a]",
  COMPLETED: "bg-[#ecfdf5] text-[#10b981]",
  CANCELLED: "bg-[#f1f5f9] text-[#64748b]",
};

const STATUS_LABEL = {
  UNPAID: "Belum Bayar",
  AWAITING_SHIPMENT: "Menunggu Kirim",
  IN_TRANSIT: "Dalam Perjalanan",
  DELIVERED: "Diterima",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const platformCards = [
  {
    name: "TikTok Shop",
    id: "ID: 8829103",
    status: "AKTIF",
    icon: TikTokIcon,
    iconStyle: "bg-[#0f172a] text-white",
    gmv: "Rp72,4jt",
    gmvChange: "+15.2%",
    liveRevenue: "Rp34,1jt",
    liveChange: "+12 Sesi/Minggu",
    metrics: [
      { label: "Click Through Rate (CTR)", value: 4.2, tone: "#0f2a43" },
      { label: "Order Conversion Rate", value: 2.8, tone: "#38bdf8" },
    ],
  },
  {
    name: "Shopee",
    id: "ID: SP_OFFICIAL_1",
    status: "AKTIF",
    icon: Store,
    iconStyle: "bg-[#f97316] text-white",
    gmv: "Rp56,0jt",
    gmvChange: "+5.8%",
    liveRevenue: "Rp8,5jt",
    liveChange: "ROAS 6.5x",
    metrics: [
      { label: "Search Rank (Top 10)", value: 72, tone: "#f97316" },
      { label: "Chat Response Rate", value: 98, tone: "#10b981" },
    ],
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);

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

  // Fetch real data
  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get("/api/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const fetchInventory = useCallback(async () => {
    try {
      const { data } = await api.get("/api/inventory");
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch inventory error:", err);
    } finally {
      setLoadingInventory(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchInventory();
  }, [fetchOrders, fetchInventory]);

  // ── Computed KPIs ──
  const totalPenjualan = orders.reduce(
    (sum, o) => sum + (o.payment_info?.total_amount || 0),
    0,
  );
  const totalPesanan = orders.length;
  const totalProduk = inventory.length;

  const formatRupiah = (val) => {
    if (val >= 1_000_000) return `Rp${(val / 1_000_000).toFixed(1)}jt`;
    if (val >= 1_000) return `Rp${(val / 1_000).toFixed(0)}rb`;
    return `Rp${val.toLocaleString("id-ID")}`;
  };

  const kpiCards = [
    {
      label: "Total Penjualan",
      value: formatRupiah(totalPenjualan),
      change: `${totalPesanan} pesanan`,
      description: "Akumulasi dari semua order",
      icon: ShoppingBag,
      iconStyle: "bg-[#e8f1fb] text-[#3b6d9c]",
      changeStyle: "bg-[#e7f7ef] text-[#1f9d6a]",
    },
    {
      label: "Total Pesanan",
      value: totalPesanan.toLocaleString("id-ID"),
      change:
        orders.filter(
          (o) =>
            o.order_status === "DELIVERED" || o.order_status === "COMPLETED",
        ).length + " selesai",
      description: "Pesanan terdaftar",
      icon: ShoppingCart,
      iconStyle: "bg-[#e7f7ef] text-[#1f9d6a]",
      changeStyle: "bg-[#e7f7ef] text-[#1f9d6a]",
    },
    {
      label: "Rata-rata Order",
      value:
        totalPesanan > 0
          ? formatRupiah(Math.round(totalPenjualan / totalPesanan))
          : "Rp0",
      change: totalPesanan > 0 ? `dari ${totalPesanan} order` : "—",
      description: "Nilai rata-rata per pesanan",
      icon: Percent,
      iconStyle: "bg-[#fff2e7] text-[#f97316]",
      changeStyle: "bg-[#eaf3fc] text-[#1c4f7a]",
    },
    {
      label: "Total Produk",
      value: totalProduk.toLocaleString("id-ID"),
      change: `${inventory.filter((i) => (i.skus || []).reduce((s, sk) => s + (sk.stock_info?.available_stock || 0), 0) <= 10).length} stok menipis`,
      description: "Produk di inventory",
      icon: Users,
      iconStyle: "bg-[#f1eaff] text-[#7c3aed]",
      changeStyle:
        inventory.filter(
          (i) =>
            (i.skus || []).reduce(
              (s, sk) => s + (sk.stock_info?.available_stock || 0),
              0,
            ) <= 10,
        ).length > 0
          ? "bg-[#fff2e7] text-[#f97316]"
          : "bg-[#e7f7ef] text-[#1f9d6a]",
    },
  ];

  // ── Trend Data (group orders by day of month) ──
  const trendData = (() => {
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
    const data = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      value: 0,
    }));
    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      if (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        data[d.getDate() - 1].value += order.payment_info?.total_amount || 0;
      }
    });
    // Normalize to millions for chart readability
    return data.map((d) => ({ ...d, value: Math.round(d.value / 1000) }));
  })();

  const maxTrendDay = trendData.reduce(
    (max, d) => (d.value > max.value ? d : max),
    trendData[0],
  );
  const highlightDays = new Set(maxTrendDay ? [maxTrendDay.day] : []);

  // ── Recent Orders (latest 5) ──
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((o) => ({
      _id: o._id,
      name: o.shipping_info?.buyer_name || "—",
      platform: o.source || "Manual",
      time: new Date(o.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: o.order_status,
      statusLabel: STATUS_LABEL[o.order_status] || o.order_status,
      amount: `Rp${(o.payment_info?.total_amount || 0).toLocaleString("id-ID")}`,
    }));

  // ── Top Products (by order items frequency) ──
  const topProducts = (() => {
    const productMap = {};
    orders.forEach((o) => {
      (o.item_list || []).forEach((item) => {
        const key = item.product_name || "Unknown";
        if (!productMap[key]) productMap[key] = { count: 0, revenue: 0 };
        productMap[key].count += item.quantity || 0;
        productMap[key].revenue += item.subtotal || 0;
      });
    });
    return Object.entries(productMap)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        sales: `${data.count} pcs sold`,
        revenue: formatRupiah(data.revenue),
      }));
  })();

  // ── Logistics ──
  const statusCounts = {
    UNPAID: orders.filter((o) => o.order_status === "UNPAID").length,
    AWAITING_SHIPMENT: orders.filter(
      (o) => o.order_status === "AWAITING_SHIPMENT",
    ).length,
    IN_TRANSIT: orders.filter((o) => o.order_status === "IN_TRANSIT").length,
    DELIVERED: orders.filter((o) => o.order_status === "DELIVERED").length,
    COMPLETED: orders.filter((o) => o.order_status === "COMPLETED").length,
    CANCELLED: orders.filter((o) => o.order_status === "CANCELLED").length,
  };

  const logisticsSummary = [
    {
      label: "Dalam Perjalanan",
      detail: `${statusCounts.IN_TRANSIT} Paket sedang dikirim kurir`,
      percent:
        totalPesanan > 0
          ? ((statusCounts.IN_TRANSIT / totalPesanan) * 100).toFixed(1)
          : 0,
      color: "#102e4a",
      icon: Truck,
      iconStyle: "bg-[#dbeafe] text-[#1d4ed8]",
    },
    {
      label: "Diterima Pembeli",
      detail: `${statusCounts.DELIVERED + statusCounts.COMPLETED} Paket telah sampai tujuan`,
      percent:
        totalPesanan > 0
          ? (
              ((statusCounts.DELIVERED + statusCounts.COMPLETED) /
                totalPesanan) *
              100
            ).toFixed(1)
          : 0,
      color: "#059669",
      icon: CheckCircle2,
      iconStyle: "bg-[#d1fae5] text-[#059669]",
    },
  ];

  const statusLogistics = [
    {
      name: "Diterima",
      value: statusCounts.DELIVERED + statusCounts.COMPLETED,
      color: "#102e4a",
    },
    {
      name: "Dalam Perjalanan",
      value: statusCounts.IN_TRANSIT,
      color: "#38bdf8",
    },
    {
      name: "Menunggu Kirim",
      value: statusCounts.AWAITING_SHIPMENT,
      color: "#f97316",
    },
    { name: "Belum Bayar", value: statusCounts.UNPAID, color: "#facc15" },
  ].filter((s) => s.value > 0);

  // ── Comparison data (daily orders this week) ──
  const comparisonData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = days.map((day) => ({ day, manual: 0, tiktok: 0 }));
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());

    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      if (d >= weekStart) {
        const dayIndex = d.getDay();
        if (o.source === "TikTok") data[dayIndex].tiktok++;
        else data[dayIndex].manual++;
      }
    });
    return data;
  })();

  const isLoading = loadingOrders || loadingInventory;

  return (
    <div className="min-h-screen bg-[#fffcf5] text-[#102e4a]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-[#102e4a] text-white md:flex">
          <SidebarContent
            displayName={displayName}
            initials={initials}
            onLogout={handleLogout}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#f1f5f9] bg-[#fffcf5]/80 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
              <div className="hidden flex-col gap-1 md:flex">
                <div className="text-xs font-semibold text-[#94a3b8]">
                  DashUMKM /{" "}
                  <span className="text-[#475569]">
                    Dashboard Performa Platform
                  </span>
                </div>
                <h1 className="text-2xl font-semibold text-[#0f172a]">
                  Statistik Platform
                </h1>
              </div>

              <div className="flex items-center gap-3 md:hidden">
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
                    className="w-72 border-r-0 bg-[#102e4a] p-0 text-white"
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
                  <p className="text-[0.65rem] font-semibold text-[#94a3b8]">
                    DashUMKM
                  </p>
                  <h1 className="text-sm font-semibold text-[#0f172a]">
                    Statistik Platform
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  <Input
                    placeholder="Cari platform..."
                    className="h-10 w-64 rounded-xl border border-[#e2e8f0] bg-white pl-9 text-sm focus-visible:ring-[#3bb0f3]"
                  />
                </div>
                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#fffcf5] bg-[#ef4444]" />
                </button>
                <Button className="hidden h-10 rounded-xl bg-[#4e7da9] px-4 text-sm font-semibold text-white hover:bg-[#3b6d9c] md:inline-flex">
                  Sinkronisasi Data
                </Button>
              </div>
            </div>

            <div className="px-5 pb-4 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <Input
                  placeholder="Cari platform..."
                  className="h-9 w-full rounded-xl border border-[#e2e8f0] bg-white/90 pl-9 text-sm focus-visible:ring-[#3bb0f3]"
                />
              </div>
              <Button className="mt-3 h-9 w-full rounded-xl bg-[#4e7da9] text-xs font-semibold text-white hover:bg-[#3b6d9c]">
                Sinkronisasi Data
              </Button>
            </div>
          </header>

          <main className="space-y-8 px-5 py-6 md:px-8">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Welcome */}
                <section className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#0f172a]">
                      Selamat datang, {displayName} 👋
                    </h2>
                    <p className="text-sm text-[#94a3b8]">
                      Update terakhir:{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#1c4f7a]">
                      <Calendar className="h-4 w-4" />
                      Rentang Waktu
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#475569]">
                      <FileDown className="h-4 w-4" />
                      Export PDF
                    </button>
                  </div>
                </section>

                {/* KPI Cards */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {kpiCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <Card
                        key={card.label}
                        className="border-[#f1f5f9] shadow-[0_12px_30px_rgba(15,42,67,0.08)]"
                      >
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconStyle}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${card.changeStyle}`}
                          >
                            {card.change}
                          </span>
                        </CardHeader>
                        <CardContent className="space-y-1">
                          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#9aa6b2]">
                            {card.label}
                          </p>
                          <p className="text-2xl font-semibold text-[#14293d]">
                            {card.value}
                          </p>
                          <p className="text-xs text-[#7c8ca0]">
                            {card.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </section>

                {/* Revenue Trend + Platform Cards */}
                <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                  <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                      <div>
                        <CardTitle className="text-lg font-semibold text-[#14293d]">
                          Pendapatan Harian — Bulan Ini
                        </CardTitle>
                        <p className="text-xs text-[#7c8ca0]">
                          {formatRupiah(totalPenjualan)} total bulan ini (dalam
                          ribuan)
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
                            formatter={(value) => [
                              `Rp${value}rb`,
                              "Pendapatan",
                            ]}
                          />
                          <Bar
                            dataKey="value"
                            barSize={16}
                            radius={[8, 8, 0, 0]}
                          >
                            {trendData.map((entry) => {
                              const fill = highlightDays.has(entry.day)
                                ? "#0f2a43"
                                : entry.value > 0
                                  ? "#38bdf8"
                                  : "#cfe9fb";
                              return <Cell key={entry.day} fill={fill} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6">
                    {platformCards.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <Card
                          key={platform.name}
                          className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]"
                        >
                          <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${platform.iconStyle}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-base font-semibold text-[#14293d]">
                                  {platform.name}
                                </CardTitle>
                                <p className="text-xs text-[#7c8ca0]">
                                  {platform.id}
                                </p>
                              </div>
                            </div>
                            <span className="rounded-full bg-[#e7f7ef] px-2.5 py-1 text-[0.65rem] font-semibold text-[#1f9d6a]">
                              {platform.status}
                            </span>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-xl border border-[#eef2f7] bg-[#f8fafc] p-3">
                                <p className="text-[0.65rem] font-semibold uppercase text-[#94a3b8]">
                                  GMV (30 Hari)
                                </p>
                                <p className="text-lg font-semibold text-[#14293d]">
                                  {platform.gmv}
                                </p>
                                <p className="text-xs text-[#1f9d6a]">
                                  {platform.gmvChange}
                                </p>
                              </div>
                              <div className="rounded-xl border border-[#eef2f7] bg-[#f8fafc] p-3">
                                <p className="text-[0.65rem] font-semibold uppercase text-[#94a3b8]">
                                  Live Revenue
                                </p>
                                <p className="text-lg font-semibold text-[#14293d]">
                                  {platform.liveRevenue}
                                </p>
                                <p className="text-xs text-[#3b82f6]">
                                  {platform.liveChange}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              {platform.metrics.map((metric) => (
                                <div key={metric.label} className="space-y-2">
                                  <div className="flex items-center justify-between text-xs text-[#7c8ca0]">
                                    <span>{metric.label}</span>
                                    <span className="font-semibold text-[#14293d]">
                                      {metric.value}%
                                    </span>
                                  </div>
                                  <div className="h-2 w-full rounded-full bg-[#e2e8f0]">
                                    <div
                                      className="h-2 rounded-full"
                                      style={{
                                        width: `${metric.value}%`,
                                        backgroundColor: metric.tone,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>

                {/* Recent Orders + Top Products */}
                <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                  <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base font-semibold text-[#14293d]">
                          Pesanan Terbaru
                        </CardTitle>
                        <p className="text-xs text-[#7c8ca0]">
                          {recentOrders.length > 0
                            ? `${recentOrders.length} pesanan terakhir`
                            : "Belum ada pesanan"}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/pesanan")}
                        className="text-xs font-semibold text-[#1c4f7a]"
                      >
                        Lihat Semua
                      </button>
                    </CardHeader>
                    <CardContent>
                      {recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-3xl mb-2">📦</p>
                          <p className="text-sm">Belum ada pesanan</p>
                        </div>
                      ) : (
                        <>
                          {/* Desktop table */}
                          <div className="hidden md:block">
                            <div className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.7fr] gap-4 border-b border-[#eef2f7] pb-3 text-[0.65rem] font-semibold uppercase text-[#9aa6b2]">
                              <span>Customer</span>
                              <span>Sumber</span>
                              <span>Tanggal</span>
                              <span className="text-right">Total</span>
                            </div>
                            <div className="divide-y divide-[#eef2f7]">
                              {recentOrders.map((order) => (
                                <div
                                  key={order._id}
                                  className="grid grid-cols-[1.2fr_0.9fr_0.9fr_0.7fr] items-center gap-4 py-4 text-sm"
                                >
                                  <div>
                                    <p className="font-semibold text-[#14293d]">
                                      {order.name}
                                    </p>
                                    <p className="text-xs text-[#7c8ca0]">
                                      {order.platform}
                                    </p>
                                  </div>
                                  <span className="text-xs text-[#475569]">
                                    {order.platform}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#7c8ca0]">
                                      {order.time}
                                    </span>
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                                        statusTone[order.status] ||
                                        "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {order.statusLabel}
                                    </span>
                                  </div>
                                  <span className="text-right text-sm font-semibold text-[#14293d]">
                                    {order.amount}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mobile cards */}
                          <div className="space-y-3 md:hidden">
                            {recentOrders.map((order) => (
                              <div
                                key={`${order._id}-mobile`}
                                className="rounded-xl border border-[#eef2f7] bg-white p-4 shadow-[0_8px_20px_rgba(15,42,67,0.08)]"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-[#14293d]">
                                      {order.name}
                                    </p>
                                    <p className="text-xs text-[#7c8ca0]">
                                      {order.platform}
                                    </p>
                                  </div>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                                      statusTone[order.status] ||
                                      "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {order.statusLabel}
                                  </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-[#7c8ca0]">
                                  <span>{order.time}</span>
                                  <span className="text-sm font-semibold text-[#14293d]">
                                    {order.amount}
                                  </span>
                                </div>
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
                        Produk Terlaris
                      </CardTitle>
                      <p className="text-xs text-[#7c8ca0]">
                        Berdasarkan jumlah pesanan
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {topProducts.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 text-sm">
                          Belum ada data produk
                        </div>
                      ) : (
                        topProducts.map((product) => (
                          <div
                            key={product.name}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b]">
                              <ShoppingBag className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[#14293d]">
                                {product.name}
                              </p>
                              <p className="text-xs text-[#7c8ca0]">
                                {product.sales}
                              </p>
                            </div>
                            <span className="text-xs font-semibold text-[#1f9d6a]">
                              {product.revenue}
                            </span>
                          </div>
                        ))
                      )}
                      <Button
                        variant="outline"
                        onClick={() => navigate("/inventori")}
                        className="h-9 w-full rounded-xl border-[#e2e8f0] text-xs font-semibold text-[#475569]"
                      >
                        Lihat Inventory
                      </Button>
                    </CardContent>
                  </Card>
                </section>

                {/* Source Comparison */}
                <section>
                  <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base font-semibold text-[#14293d]">
                          Perbandingan Sumber Order
                        </CardTitle>
                        <p className="text-xs text-[#7c8ca0]">
                          Manual vs TikTok (Mingguan)
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-[#7c8ca0]">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#102e4a]" />
                          Manual
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8]" />
                          TikTok
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="h-56 sm:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} barGap={6}>
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
                          <Bar
                            dataKey="manual"
                            fill="#102e4a"
                            radius={[6, 6, 0, 0]}
                          />
                          <Bar
                            dataKey="tiktok"
                            fill="#38bdf8"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </section>

                {/* Logistics */}
                <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                  <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold text-[#14293d]">
                        Logistik Summary
                      </CardTitle>
                      <p className="text-xs text-[#7c8ca0]">
                        Status pengiriman paket
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {logisticsSummary.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.label}
                            className="flex items-center justify-between rounded-xl bg-[#f8fafc] p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconStyle}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#14293d]">
                                  {item.label}
                                </p>
                                <p className="text-xs text-[#7c8ca0]">
                                  {item.detail}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span
                                className="text-sm font-semibold"
                                style={{ color: item.color }}
                              >
                                {item.percent}%
                              </span>
                              <div className="h-2 w-24 rounded-full bg-[#e2e8f0]">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${item.percent}%`,
                                    backgroundColor: item.color,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Card className="border-[#eef2f7] shadow-[0_18px_40px_rgba(15,42,67,0.08)]">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold text-[#14293d]">
                        Status Logistik
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                      {statusLogistics.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          Belum ada data pengiriman
                        </div>
                      ) : (
                        <>
                          <div className="relative h-44 w-44">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={statusLogistics}
                                  dataKey="value"
                                  innerRadius={58}
                                  outerRadius={75}
                                  stroke="none"
                                >
                                  {statusLogistics.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <p className="text-2xl font-semibold text-[#14293d]">
                                {totalPesanan.toLocaleString("id-ID")}
                              </p>
                              <p className="text-xs font-semibold uppercase text-[#94a3b8]">
                                Pesanan
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-6 text-xs text-[#7c8ca0]">
                            {statusLogistics.map((entry) => (
                              <div
                                key={entry.name}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <div>
                                  <p className="font-semibold text-[#1e293b]">
                                    {entry.name}
                                  </p>
                                  <p>{entry.value} pesanan</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
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
