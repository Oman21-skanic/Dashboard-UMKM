import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Menu,
  Plus,
  Search,
  SlidersHorizontal,
  Tags,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarContent from "@/component/SidebarContent";
import { Button } from "@/component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/component/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const productImages = {
  kemeja: "https://www.figma.com/api/mcp/asset/3b27e350-78c9-4893-9ced-3e7880293d2e",
  sepatu: "https://www.figma.com/api/mcp/asset/1919f430-8223-47f5-955c-ad2f8f05501c",
  tshirt: "https://www.figma.com/api/mcp/asset/c5894ad9-06fe-4719-9be5-1e964e6b889d",
};

const statCards = [
  {
    label: "Total Produk",
    value: "4,320",
    subtext: "Bulan ini vs 3,840",
    chip: "+12.5%",
    chipStyle: "bg-[#ecfdf5] text-[#10b981]",
    icon: Boxes,
    iconStyle: "bg-[#eff6ff] text-[#2563eb]",
  },
  {
    label: "Stok Menipis",
    value: "18",
    subtext: "Segera perbarui stok",
    chip: "Restock",
    chipStyle: "bg-[#fff7ed] text-[#f97316]",
    icon: AlertTriangle,
    iconStyle: "bg-[#fff7ed] text-[#f97316]",
  },
  {
    label: "Barang Rusak",
    value: "5",
    subtext: "Menunggu pengecekan",
    chip: "-2.1%",
    chipStyle: "bg-[#fee2e2] text-[#ef4444]",
    icon: AlertCircle,
    iconStyle: "bg-[#fee2e2] text-[#ef4444]",
  },
  {
    label: "Kategori",
    value: "24",
    subtext: "Kategori aktif saat ini",
    chip: "92% Aktif",
    chipStyle: "bg-[#ecfdf5] text-[#10b981]",
    icon: Tags,
    iconStyle: "bg-[#ecfdf5] text-[#10b981]",
  },
];

const tabs = ["Semua", "Pakaian", "Aksesoris"];

const products = [
  {
    id: "#PRD-INV-001",
    name: "Kemeja Flanel Slim Fit",
    variant: "Warna: Navy Blue - Size: L",
    category: "Pakaian Pria",
    categoryStyle: "bg-[#eff6ff] text-[#2563eb]",
    price: "Rp249.000",
    stock: 124,
    stockDot: "bg-[#10b981]",
    image: productImages.kemeja,
  },
  {
    id: "#PRD-INV-002",
    name: "Sepatu Sneakers Sport",
    variant: "Warna: Merah - Size: 42",
    category: "Alas Kaki",
    categoryStyle: "bg-[#fffbeb] text-[#d97706]",
    price: "Rp799.000",
    stock: 12,
    stockDot: "bg-[#f59e0b]",
    image: productImages.sepatu,
  },
  {
    id: "#PRD-INV-003",
    name: "T-Shirt Polos Premium",
    variant: "Warna: Putih - Size: M",
    category: "Pakaian Pria",
    categoryStyle: "bg-[#eff6ff] text-[#2563eb]",
    price: "Rp89.000",
    stock: 256,
    stockDot: "bg-[#10b981]",
    image: productImages.tshirt,
  },
];

const pages = [1, 2, 3];

export default function Inventori() {
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
          <header className="border-b border-[#f1f5f9] bg-[#fffcf5]/80 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="hidden flex-col gap-1 md:flex">
                <div className="text-xs font-semibold text-[#64748b]">
                  DashUMKM /{" "}
                  <span className="text-[#3182ce]">Inventori</span>
                </div>
                <h1 className="text-2xl font-semibold text-[#0f172a]">
                  Manajemen Inventori
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
                    Inventori
                  </h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  <Input
                    placeholder="Cari SKU, nama produk..."
                    className="h-10 w-72 rounded-xl border border-[#e2e8f0] bg-white pl-9 text-sm focus-visible:ring-[#3bb0f3]"
                  />
                </div>
                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ef4444]" />
                </button>
                <Button className="h-10 rounded-xl bg-[#4e7da9] px-4 text-sm font-semibold text-white hover:bg-[#3b6d9c]">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-3 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <Input
                  placeholder="Cari SKU, nama produk..."
                  className="h-9 w-full rounded-xl border border-[#e2e8f0] bg-white pl-9 text-sm focus-visible:ring-[#3bb0f3]"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ef4444]" />
                </button>
                <Button className="h-9 flex-1 rounded-xl bg-[#4e7da9] text-xs font-semibold text-white hover:bg-[#3b6d9c]">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk
                </Button>
              </div>
            </div>
          </header>

          <main className="space-y-6 px-5 py-6 md:px-8">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.label}
                    className="border-[#f1f5f9] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  >
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconStyle}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${card.chipStyle}`}
                      >
                        {card.chip}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-1">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#94a3b8]">
                        {card.label}
                      </p>
                      <p className="text-2xl font-semibold text-[#0f172a]">
                        {card.value}
                      </p>
                      <p className="text-xs text-[#94a3b8]">{card.subtext}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </section>

            <Card className="border-[#f1f5f9] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <CardHeader className="flex flex-wrap items-center justify-between gap-3 space-y-0">
                <div className="flex flex-wrap items-center gap-4">
                  <CardTitle className="text-base font-semibold text-[#1e293b]">
                    Daftar Produk
                  </CardTitle>
                  <div className="flex items-center gap-2 rounded-xl bg-[#f8fafc] p-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          tab === "Semua"
                            ? "bg-white text-[#0f172a] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                            : "text-[#64748b]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="h-9 rounded-xl border-[#e2e8f0] text-xs font-semibold text-[#3182ce]"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filter Lanjutan
                </Button>
              </CardHeader>

              <CardContent className="p-0">
                <div className="space-y-3 p-4 md:hidden">
                  {products.map((product) => (
                    <div
                      key={`${product.id}-mobile`}
                      className="rounded-xl border border-[#f1f5f9] bg-white p-4 shadow-[0_8px_20px_rgba(15,42,67,0.08)]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f1f5f9]">
                          <img
                            alt=""
                            className="h-full w-full rounded-lg object-cover"
                            src={product.image}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-[#1e293b]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#94a3b8]">
                            {product.variant}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-bold ${product.categoryStyle}`}
                            >
                              {product.category}
                            </span>
                            <span className="text-sm font-semibold text-[#0f172a]">
                              {product.price}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#94a3b8]"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-[#94a3b8]">
                        <span className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${product.stockDot}`}
                          />
                          Stok {product.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-[880px] w-full text-left text-[12px]">
                    <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase tracking-[1px] text-[#94a3b8]">
                      <tr>
                        <th className="px-6 py-4">ID Produk</th>
                        <th className="px-6 py-4">Nama Produk</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4 text-right">Harga</th>
                        <th className="px-6 py-4 text-center">Stok</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] text-[12px] font-medium text-[#1e293b]">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-5 text-[14px] font-semibold">
                            {product.id}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1f5f9]">
                                <img
                                  alt=""
                                  className="h-full w-full rounded-lg object-cover"
                                  src={product.image}
                                />
                              </div>
                              <div>
                                <p className="text-[14px] font-semibold text-[#1e293b]">
                                  {product.name}
                                </p>
                                <p className="text-[10px] text-[#94a3b8]">
                                  {product.variant}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-bold ${product.categoryStyle}`}
                            >
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right text-[14px] font-semibold">
                            {product.price}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${product.stockDot}`}
                              />
                              <span className="text-[14px] font-semibold">
                                {product.stock}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#94a3b8]"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f1f5f9] px-6 py-5 text-xs text-[#94a3b8]">
                  <span>Menampilkan 1-10 dari 1,284 produk</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {pages.map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                          page === 1
                            ? "bg-[#102e4a] text-white"
                            : "border border-transparent text-[#64748b]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b]"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
