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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
      </div>

    </div>
  );
}
