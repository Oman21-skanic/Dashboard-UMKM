<<<<<<< HEAD
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarContent from "@/component/SidebarContent";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/component/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const assets = {
  breadcrumb: "https://www.figma.com/api/mcp/asset/10406e39-c9dd-42d2-bf88-c94eef30e8a7",
  search: "https://www.figma.com/api/mcp/asset/402858de-39c8-440c-a860-0d6a8857580d",
  bell: "https://www.figma.com/api/mcp/asset/d6e09a07-fe47-43f1-955c-76a6ef2e16b9",
  plus: "https://www.figma.com/api/mcp/asset/9811edd0-032c-4f77-b3a7-5f9f1806aefc",
  statOrders: "https://www.figma.com/api/mcp/asset/4a072d49-e57c-49a5-ae88-80c7b6277efc",
  statShip: "https://www.figma.com/api/mcp/asset/8ebcbcaa-0f83-4fdc-b960-4df613209b81",
  statQueue: "https://www.figma.com/api/mcp/asset/488a0070-a715-4d63-ad8c-8fd299e058ad",
  statQueueChip: "https://www.figma.com/api/mcp/asset/56571c53-9a60-4d9d-b30b-f0fe97b58fde",
  statDelivery: "https://www.figma.com/api/mcp/asset/9db43ef2-c79e-424e-a388-d8d1f12bf084",
  statDeliveryChip: "https://www.figma.com/api/mcp/asset/1130b878-37cb-48c0-b425-5ff9f4927b21",
  statDone: "https://www.figma.com/api/mcp/asset/034ea3d8-0cb2-418d-9abb-50b4e16e5d6e",
  statDoneChip: "https://www.figma.com/api/mcp/asset/f98a7eb7-b367-48f1-9b66-6e1863b50ddb",
  filter: "https://www.figma.com/api/mcp/asset/610a00b4-9cfa-4a3f-ae20-71cc39e3d355",
  actionDots: "https://www.figma.com/api/mcp/asset/d0da0517-107d-486e-a15b-af970dc18302",
  pagePrev: "https://www.figma.com/api/mcp/asset/776e6f91-47ad-4c2f-8ab1-8ccbcde51f69",
  pageNext: "https://www.figma.com/api/mcp/asset/47863057-a4b3-49f9-86a5-e6cdecbe8353",
};

const statCards = [
  {
    label: "Total Pesanan",
    value: "1,284",
    subtext: "Bulan ini vs 1,082",
    icon: assets.statOrders,
    iconBg: "bg-[#eff6ff]",
    chip: "18.5%",
    chipTone: "text-[#10b981]",
    chipBg: "bg-[#ecfdf5]",
    chipIcon: assets.statShip,
  },
  {
    label: "Perlu Dikirim",
    value: "42",
    subtext: "12 pesanan prioritas",
    icon: assets.statQueue,
    iconBg: "bg-[#fffbeb]",
    chip: "Antrean",
    chipTone: "text-[#f59e0b]",
    chipBg: "bg-[#fffbeb]",
    chipIcon: assets.statQueueChip,
  },
  {
    label: "Dalam Pengiriman",
    value: "156",
    subtext: "Rata-rata 2.1 hari",
    icon: assets.statDelivery,
    iconBg: "bg-[#faf5ff]",
    chip: "3.2%",
    chipTone: "text-[#f43f5e]",
    chipBg: "bg-[#fff1f2]",
    chipIcon: assets.statDeliveryChip,
  },
  {
    label: "Selesai",
    value: "1,086",
    subtext: "Bulan ini",
    icon: assets.statDone,
    iconBg: "bg-[#ecfdf5]",
    chip: "98% Sukses",
    chipTone: "text-[#10b981]",
    chipBg: "bg-[#ecfdf5]",
    chipIcon: assets.statDoneChip,
  },
];

const orders = [
  {
    id: "#ORD-2024-001",
    customer: "Andi Saputra",
    location: "Jakarta Selatan",
    date: "22 Mar 2024",
    time: "14:30 WIB",
    payment: "ShopeePay",
    amount: "Rp458.000",
    status: "Selesai",
    statusTone: "bg-[#dcfce7] text-[#16a34a]",
    avatar: "AS",
    dot: "bg-[#2563eb]",
  },
  {
    id: "#ORD-2024-002",
    customer: "Siti Nurhaliza",
    location: "Bandung",
    date: "22 Mar 2024",
    time: "12:15 WIB",
    payment: "Bank Transfer",
    amount: "Rp1.240.000",
    status: "Diproses",
    statusTone: "bg-[#fef3c7] text-[#d97706]",
    avatar: "SN",
    dot: "bg-[#f97316]",
  },
];

const tabs = ["Semua", "Diproses", "Selesai"];

export default function Pesanan() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.businessName || user?.fullName || "Ujang Santosa";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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

        <main className="flex-1 px-5 pb-32 pt-6 md:px-8 md:pt-8">
          <header className="space-y-4">
            <div className="flex items-center justify-between gap-3 md:hidden">
              <div className="flex items-center gap-3">
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
                    Pesanan
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  <img alt="" className="h-5 w-4" src={assets.bell} />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ef4444]" />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-[#4e7da9] px-3 py-2 text-xs font-bold text-white shadow-[0_10px_15px_-3px_rgba(52,152,219,0.2),0_4px_6px_-4px_rgba(52,152,219,0.2)]"
                >
                  <img alt="" className="h-[11px] w-[11px]" src={assets.plus} />
                  <span className="hidden sm:inline">Tambah Pesanan</span>
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <div className="relative">
                <img
                  alt=""
                  className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2"
                  src={assets.search}
                />
                <input
                  className="h-10 w-full rounded-xl bg-white pl-9 pr-4 text-sm text-[#475569] shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:outline-none"
                  placeholder="Cari ID pesanan, nama..."
                />
              </div>
            </div>

            <div className="hidden flex-wrap items-start justify-between gap-6 md:flex">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[12px] font-medium leading-[16px] text-[#94a3b8]">
                  <span>DashUMKM</span>
                  <img alt="" className="h-[6px] w-[4px]" src={assets.breadcrumb} />
                  <span className="text-[#3b82f6]">Pesanan</span>
                </div>
                <h1 className="text-2xl font-extrabold leading-tight text-[#102e4a] sm:text-[30px] sm:leading-[36px]">
                  Manajemen Pesanan
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full max-w-xs">
                  <img
                    alt=""
                    className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2"
                    src={assets.search}
                  />
                  <input
                    className="h-10 w-full rounded-xl bg-white pl-9 pr-4 text-sm text-[#475569] shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:outline-none"
                    placeholder="Cari ID pesanan, nama..."
                  />
                </div>
                <button
                  type="button"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  <img alt="" className="h-5 w-4" src={assets.bell} />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ef4444]" />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl bg-[#4e7da9] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_15px_-3px_rgba(52,152,219,0.2),0_4px_6px_-4px_rgba(52,152,219,0.2)]"
                >
                  <img alt="" className="h-[11px] w-[11px]" src={assets.plus} />
                  Tambah Pesanan
                </button>
              </div>
            </div>
          </header>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="relative overflow-hidden rounded-2xl border border-[#f1f5f9] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}
                  >
                    <img alt="" className="h-5 w-5" src={card.icon} />
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-bold leading-[16px] ${card.chipBg} ${card.chipTone}`}
                  >
                    <img alt="" className="h-[6px] w-[10px]" src={card.chipIcon} />
                    {card.chip}
                  </div>
                </div>
                <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.6px] text-[#94a3b8]">
                  {card.label}
                </p>
                <p className="mt-1 text-[24px] font-extrabold leading-[32px] text-[#1e293b]">
                  {card.value}
                </p>
                <p className="mt-2 text-[10px] font-medium leading-[15px] text-[#94a3b8]">
                  {card.subtext}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-2xl border border-[#f1f5f9] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f5f9] px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-[16px] font-extrabold leading-[24px] text-[#1e293b]">
                  Daftar Pesanan Terbaru
                </h2>
                <span className="h-4 w-px bg-[#e2e8f0]" />
                <div className="flex items-center gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                        tab === "Semua"
                          ? "bg-[#102e4a] text-white"
                          : "text-[#64748b]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 text-xs font-semibold text-[#3b82f6]"
              >
                Filter Lanjutan
                <img alt="" className="h-[14px] w-[14px]" src={assets.filter} />
              </button>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {orders.map((order) => (
                <div
                  key={`${order.id}-mobile`}
                  className="rounded-xl border border-[#f1f5f9] bg-white p-4 shadow-[0_8px_20px_rgba(15,42,67,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e2e8f0] text-[10px] font-bold text-[#1e293b]">
                        {order.avatar}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#1e293b]">
                          {order.customer}
                        </p>
                        <p className="text-xs text-[#94a3b8]">
                          {order.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold ${order.statusTone}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-[#64748b] sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-[#1e293b]">Tanggal</p>
                      <p>
                        {order.date} • {order.time}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1e293b]">
                        Metode Pembayaran
                      </p>
                      <p className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${order.dot}`} />
                        {order.payment}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-[#94a3b8]">Total Bayar</span>
                    <span className="text-sm font-semibold text-[#1e293b]">
                      {order.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-[860px] w-full text-left text-[12px]">
                <thead className="text-[10px] font-bold uppercase text-[#94a3b8]">
                  <tr>
                    <th className="px-6 py-4">ID Pesanan</th>
                    <th className="px-6 py-4">Nama Pelanggan</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Metode Pembayaran</th>
                    <th className="px-6 py-4">Total Bayar</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[12px] font-medium text-[#1e293b]">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-5 text-[14px] font-semibold">
                        {order.id}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e2e8f0] text-[10px] font-bold text-[#1e293b]">
                            {order.avatar}
                          </span>
                          <div>
                            <p className="text-[14px] font-semibold">
                              {order.customer}
                            </p>
                            <p className="text-[10px] leading-[15px] text-[#94a3b8]">
                              {order.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[12px] leading-[18px] text-[#64748b]">
                        <p>{order.date}</p>
                        <p>{order.time}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-[12px] text-[#475569]">
                          <span className={`h-2 w-2 rounded-full ${order.dot}`} />
                          {order.payment}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[14px] font-semibold">
                        {order.amount}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold ${order.statusTone}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0]"
                        >
                          <img alt="" className="h-4 w-1" src={assets.actionDots} />
                        </button>
=======
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  Processing: "bg-blue-100 text-blue-700 border border-blue-300",
  Shipped: "bg-purple-100 text-purple-700 border border-purple-300",
  Delivered: "bg-green-100 text-green-700 border border-green-300",
};

const SOURCE_COLORS = {
  Manual: "bg-gray-100 text-gray-700",
  TikTok: "bg-black text-white",
  Instagram: "bg-pink-100 text-pink-700",
  Tokopedia: "bg-green-100 text-green-700",
};

export default function Pesanan() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = getToken();
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [message, setMessage] = useState(null);

  const ITEMS_PER_PAGE = 10;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { ...getAuthHeader() },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders
    .filter(o => !filterStatus || o.status === filterStatus)
    .filter(o => !filterSource || o.source === filterSource)
    .filter(o => !search || o.customerName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDesc
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setMessage({ type: "success", text: "✅ Status berhasil diupdate!" });
      fetchOrders();
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      setMessage({ type: "error", text: "❌ Gagal update status." });
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm("Yakin mau hapus order ini?")) return;
    try {
      await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });
      setMessage({ type: "success", text: "✅ Order berhasil dihapus!" });
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      setMessage({ type: "error", text: "❌ Gagal hapus order." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Daftar Pesanan</h1>
            <p className="text-gray-500 text-sm">Kelola semua pesanan kamu di sini</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >← Dashboard</button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
            >+ Buat Pesanan</button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-3 font-bold">✕</button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Cari nama customer..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]"
          />
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <select
            value={filterSource}
            onChange={e => { setFilterSource(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Semua Source</option>
            <option value="Manual">Manual</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="Tokopedia">Tokopedia</option>
          </select>
          <button
            onClick={() => setSortDesc(prev => !prev)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            Tanggal {sortDesc ? "↓" : "↑"}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📦</p>
              <p>Belum ada pesanan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Order ID</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Total</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Source</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(order => (
                    <tr
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{order.customerName}</td>
                      <td className="px-4 py-3 text-gray-700">
                        Rp {order.totalAmount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${SOURCE_COLORS[order.source]}`}>
                          {order.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
>>>>>>> 093a0760f0a704a3d96b3ec519bf726e3effef2b
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
<<<<<<< HEAD

            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 text-xs text-[#94a3b8] sm:px-6 sm:py-5">
              <span>Menampilkan 1–10 dari 1,284 pesanan</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white"
                >
                  <img alt="" className="h-[7px] w-[5px]" src={assets.pagePrev} />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#102e4a] text-xs font-bold text-white"
                >
                  1
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-xs font-bold text-[#1e293b]"
                >
                  2
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-xs font-bold text-[#1e293b]"
                >
                  3
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white"
                >
                  <img alt="" className="h-[7px] w-[5px]" src={assets.pageNext} />
                </button>
              </div>
            </div>
          </section>
        </main>
=======
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50"
                >← Prev</button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50"
                >Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Detail Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="font-semibold text-gray-800 mb-2">Info Customer</p>
                <p className="text-sm text-gray-600">👤 {selectedOrder.customerName}</p>
                <p className="text-sm text-gray-600">📞 {selectedOrder.customerPhone}</p>
                <p className="text-sm text-gray-600">📍 {selectedOrder.customerAddress}</p>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-800 mb-2">Item Pesanan</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-700">{item.productName} x{item.quantity}</span>
                      <span className="font-medium">Rp {item.subtotal.toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-gray-800 mt-3 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>Rp {selectedOrder.totalAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-yellow-50 rounded-xl p-3 mb-4 text-sm text-yellow-800">
                  📝 {selectedOrder.notes}
                </div>
              )}

              <div className="mb-4">
                <p className="font-semibold text-gray-800 mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {["Pending", "Processing", "Shipped", "Delivered"].map(s => (
                    <button
                      key={s}
                      onClick={() => handleUpdateStatus(selectedOrder._id, s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                        selectedOrder.status === s
                          ? STATUS_COLORS[s] + " ring-2 ring-offset-1"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50"
                >Tutup</button>
                {selectedOrder.status === "Pending" && (
                  <button
                    onClick={() => handleDelete(selectedOrder._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm hover:bg-red-600"
                  >Hapus Order</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchOrders();
            setShowCreateModal(false);
            setMessage({ type: "success", text: "✅ Order berhasil dibuat!" });
          }}
          getAuthHeader={getAuthHeader}
        />
      )}
    </div>
  );
}

function CreateOrderModal({ onClose, onSuccess, getAuthHeader }) {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    notes: "",
    source: "Manual",
  });
  const [items, setItems] = useState([{ productName: "", quantity: 1, price: 0, subtotal: 0 }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    if (field === "quantity" || field === "price") {
      updated[i].subtotal = updated[i].quantity * updated[i].price;
    }
    setItems(updated);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async () => {
    setError("");
    if (!form.customerName || !form.customerPhone || !form.customerAddress) {
      return setError("Nama, telepon, dan alamat wajib diisi!");
    }
    if (items.some(i => !i.productName || i.quantity < 1 || i.price < 1)) {
      return setError("Lengkapi semua item pesanan!");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, totalAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      onSuccess();
    } catch (err) {
      setError(err.message || "Gagal membuat order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Buat Pesanan Baru</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <div className="space-y-3">
            <input
              placeholder="Nama Customer *"
              value={form.customerName}
              onChange={e => setForm({ ...form, customerName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="No. Telepon *"
              value={form.customerPhone}
              onChange={e => setForm({ ...form, customerPhone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Alamat *"
              value={form.customerAddress}
              onChange={e => setForm({ ...form, customerAddress: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              rows={2}
            />
            <select
              value={form.source}
              onChange={e => setForm({ ...form, source: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="Manual">Manual</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
              <option value="Tokopedia">Tokopedia</option>
            </select>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-gray-800 mb-2">Item Pesanan</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <input
                    placeholder="Nama Produk *"
                    value={item.productName}
                    onChange={e => updateItem(i, "productName", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      min={1}
                      value={item.quantity}
                      onChange={e => updateItem(i, "quantity", Number(e.target.value))}
                      className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Harga"
                      min={0}
                      value={item.price}
                      onChange={e => updateItem(i, "price", Number(e.target.value))}
                      className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <div className="w-1/3 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-500">
                      Rp {item.subtotal.toLocaleString("id-ID")}
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                      className="text-red-500 text-xs hover:underline"
                    >Hapus item</button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setItems([...items, { productName: "", quantity: 1, price: 0, subtotal: 0 }])}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >+ Tambah Item</button>
          </div>

          <div className="flex justify-between font-bold text-gray-800 mt-4 pt-4 border-t border-gray-200">
            <span>Total</span>
            <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
          </div>

          <textarea
            placeholder="Catatan (opsional)"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-3"
            rows={2}
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50"
            >Batal</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-60"
            >{loading ? "Menyimpan..." : "Buat Pesanan"}</button>
          </div>
        </div>
>>>>>>> 093a0760f0a704a3d96b3ec519bf726e3effef2b
      </div>

    </div>
  );
}