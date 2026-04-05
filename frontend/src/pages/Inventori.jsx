import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Edit,
  FileSpreadsheet,
  Menu,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Tags,
  Trash2,
  X,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import SidebarContent from "@/component/SidebarContent";
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

const ITEMS_PER_PAGE = 10;

// Helpers to read nested SKU data
const getFirstSku = (p) => p.skus?.[0] || {};
const getPrice = (p) => getFirstSku(p).price_info?.original_price || 0;
const getSkuId = (p) => getFirstSku(p).sku_id || "";
const getTotalStock = (p) =>
  (p.skus || []).reduce(
    (s, sku) => s + (sku.stock_info?.available_stock || 0),
    0,
  );

export default function Inventori() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const displayName = user?.businessName || user?.email || "Pengguna";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get("/api/inventory");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Gagal memuat data inventori." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Stats from real data
  const totalProduk = products.length;
  const stokMenipis = products.filter(
    (p) => getTotalStock(p) > 0 && getTotalStock(p) <= 10,
  ).length;
  const stokHabis = products.filter((p) => getTotalStock(p) === 0).length;
  const categories = [
    ...new Set(products.map((p) => p.category_id).filter(Boolean)),
  ];
  const totalKategori = categories.length;

  const statCards = [
    {
      label: "Total Produk",
      value: totalProduk,
      subtext: `${totalProduk} item terdaftar`,
      chip: `${totalProduk}`,
      chipStyle: "bg-[#ecfdf5] text-[#10b981]",
      icon: Boxes,
      iconStyle: "bg-[#eff6ff] text-[#2563eb]",
    },
    {
      label: "Stok Menipis",
      value: stokMenipis,
      subtext: "Stok ≤ 10 unit",
      chip: "Restock",
      chipStyle: "bg-[#fff7ed] text-[#f97316]",
      icon: AlertTriangle,
      iconStyle: "bg-[#fff7ed] text-[#f97316]",
    },
    {
      label: "Stok Habis",
      value: stokHabis,
      subtext: "Perlu restock segera",
      chip: "Urgent",
      chipStyle: "bg-[#fee2e2] text-[#ef4444]",
      icon: AlertCircle,
      iconStyle: "bg-[#fee2e2] text-[#ef4444]",
    },
    {
      label: "Kategori",
      value: totalKategori,
      subtext: "Kategori aktif",
      chip: `${totalKategori} Aktif`,
      chipStyle: "bg-[#ecfdf5] text-[#10b981]",
      icon: Tags,
      iconStyle: "bg-[#ecfdf5] text-[#10b981]",
    },
  ];

  const tabs = ["Semua", ...categories];
  const filtered = products
    .filter((p) => activeTab === "Semua" || p.category_id === activeTab)
    .filter(
      (p) =>
        !search ||
        (p.product_name || p.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        getSkuId(p).toLowerCase().includes(search.toLowerCase()),
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const getStockDot = (stock) =>
    stock === 0
      ? "bg-[#ef4444]"
      : stock <= 10
        ? "bg-[#f59e0b]"
        : "bg-[#10b981]";

  const handleDelete = async (id) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;
    try {
      await api.delete(`/api/inventory/${id}`);
      setMessage({ type: "success", text: "✅ Produk berhasil dihapus!" });
      setActionMenuId(null);
      fetchProducts();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "❌ Gagal hapus." });
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#fffcf5] text-[#102e4a]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-[#102e4a] text-white md:flex">
          <SidebarContent
            displayName={displayName}
            initials={initials}
            onLogout={handleLogout}
          />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <header className="border-b border-[#f1f5f9] bg-[#fffcf5]/80 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="hidden flex-col gap-1 md:flex">
                <div className="text-xs font-semibold text-[#64748b]">
                  DashUMKM / <span className="text-[#3182ce]">Inventori</span>
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
              <div className="hidden min-w-0 flex-1 shrink flex-wrap items-center justify-end gap-3 md:flex">
                <div className="relative w-48 shrink xl:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  <Input
                    placeholder="Cari SKU, nama produk..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="h-10 w-full rounded-xl border border-[#e2e8f0] bg-white pl-9 text-sm focus-visible:ring-[#3bb0f3]"
                  />
                </div>
                <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ef4444]" />
                </button>
                <Button
                  onClick={() => setShowExportModal(true)}
                  variant="outline"
                  className="h-10 rounded-xl border-[#e2e8f0] bg-white px-4 text-sm font-semibold text-[#64748b]"
                >
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </Button>
                <Button
                  onClick={() => navigate("/tiktok-export")}
                  variant="outline"
                  className="h-10 rounded-xl border-[#e2e8f0] px-4 text-sm font-semibold text-[#3182ce] hover:bg-[#eff6ff]"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  TikTok Export
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="h-10 rounded-xl bg-[#4e7da9] px-4 text-sm font-semibold text-white hover:bg-[#3b6d9c]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-3 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <Input
                  placeholder="Cari..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 w-full rounded-xl border border-[#e2e8f0] bg-white pl-9 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setShowExportModal(true)}
                  variant="outline"
                  className="h-9 w-full rounded-xl bg-white border-[#e2e8f0] text-[#64748b] text-xs font-semibold px-2"
                >
                  <Download className="mr-1 h-3 w-3 shrink-0" />
                  Export
                </Button>
                <Button
                  onClick={() => navigate("/tiktok-export")}
                  variant="outline"
                  className="h-9 w-full rounded-xl border-[#e2e8f0] bg-white text-xs font-semibold text-[#3182ce] hover:bg-[#eff6ff] px-2"
                >
                  <FileSpreadsheet className="mr-1 h-3 w-3 shrink-0" />
                  TikTok Export
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="col-span-2 h-9 w-full rounded-xl bg-[#4e7da9] text-xs font-semibold text-white hover:bg-[#3b6d9c]"
                >
                  <Plus className="mr-2 h-4 w-4 shrink-0" />
                  Tambah Produk
                </Button>
              </div>
            </div>
          </header>

          <main className="space-y-6 px-5 py-6 md:px-8">
            {message && (
              <div
                className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${message.type === "success" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}
              >
                {message.text}
                <button
                  onClick={() => setMessage(null)}
                  className="font-bold ml-3"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

            {/* Product List */}
            <Card className="border-[#f1f5f9] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between space-y-0">
                <div className="flex w-full min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <CardTitle className="shrink-0 text-base font-semibold text-[#1e293b]">
                    Daftar Produk
                  </CardTitle>
                  <div className="flex w-full min-w-0 flex-1 items-center gap-2 overflow-x-auto rounded-xl bg-[#f8fafc] p-1 pb-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab);
                          setPage(1);
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${tab === activeTab ? "bg-white text-[#0f172a] shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#64748b]"}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="shrink-0 h-9 rounded-xl border-[#e2e8f0] text-xs font-semibold text-[#3182ce]"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filter Lanjutan
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : paginated.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-3">📦</p>
                    <p>Belum ada produk{search ? " yang cocok" : ""}</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile cards */}
                    <div className="space-y-3 p-4 md:hidden">
                      {paginated.map((product) => {
                        const stock = getTotalStock(product);
                        return (
                          <div
                            key={product._id}
                            className="rounded-xl border border-[#f1f5f9] bg-white p-4 shadow-[0_8px_20px_rgba(15,42,67,0.08)]"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f1f5f9] text-lg font-bold text-[#94a3b8]">
                                {(product.product_name || product.name || "P")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                <p className="truncate text-sm font-semibold text-[#1e293b]">
                                  {product.product_name || product.name}
                                </p>
                                <p className="truncate text-xs text-[#94a3b8]">
                                  SKU: {getSkuId(product)}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                  {product.category_id && (
                                    <span className="rounded-full px-3 py-1 text-[10px] font-bold bg-[#eff6ff] text-[#2563eb]">
                                      {product.category_id}
                                    </span>
                                  )}
                                  <span className="text-sm font-semibold text-[#0f172a]">
                                    Rp
                                    {getPrice(product).toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setActionMenuId(
                                      actionMenuId === product._id
                                        ? null
                                        : product._id,
                                    )
                                  }
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#94a3b8]"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                                {actionMenuId === product._id && (
                                  <ActionMenu
                                    onEdit={() => {
                                      setEditingProduct(product);
                                      setActionMenuId(null);
                                    }}
                                    onDelete={() => handleDelete(product._id)}
                                    onClose={() => setActionMenuId(null)}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs text-[#94a3b8]">
                              <span className="flex items-center gap-2">
                                <span
                                  className={`h-2 w-2 rounded-full ${getStockDot(stock)}`}
                                />
                                Stok {stock}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                      <table className="min-w-[880px] w-full text-left text-[12px]">
                        <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase tracking-[1px] text-[#94a3b8]">
                          <tr>
                            <th className="px-6 py-4">SKU</th>
                            <th className="px-6 py-4">Nama Produk</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4 text-right">Harga</th>
                            <th className="px-6 py-4 text-center">Stok</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9] text-[12px] font-medium text-[#1e293b]">
                          {paginated.map((product) => {
                            const stock = getTotalStock(product);
                            return (
                              <tr key={product._id}>
                                <td className="px-6 py-5 text-[14px] font-semibold font-mono">
                                  {getSkuId(product)}
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1f5f9] text-sm font-bold text-[#94a3b8]">
                                      {(
                                        product.product_name ||
                                        product.name ||
                                        "P"
                                      )
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="text-[14px] font-semibold text-[#1e293b]">
                                        {product.product_name || product.name}
                                      </p>
                                      <p className="text-[10px] text-[#94a3b8]">
                                        {product.description || "—"}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  {product.category_id ? (
                                    <span className="rounded-full px-3 py-1 text-[10px] font-bold bg-[#eff6ff] text-[#2563eb]">
                                      {product.category_id}
                                    </span>
                                  ) : (
                                    "—"
                                  )}
                                </td>
                                <td className="px-6 py-5 text-right text-[14px] font-semibold">
                                  Rp{getPrice(product).toLocaleString("id-ID")}
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center justify-center gap-2">
                                    <span
                                      className={`h-2 w-2 rounded-full ${getStockDot(stock)}`}
                                    />
                                    <span className="text-[14px] font-semibold">
                                      {stock}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                  <div className="relative inline-block">
                                    <button
                                      onClick={() =>
                                        setActionMenuId(
                                          actionMenuId === product._id
                                            ? null
                                            : product._id,
                                        )
                                      }
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#94a3b8]"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </button>
                                    {actionMenuId === product._id && (
                                      <ActionMenu
                                        onEdit={() => {
                                          setEditingProduct(product);
                                          setActionMenuId(null);
                                        }}
                                        onDelete={() =>
                                          handleDelete(product._id)
                                        }
                                        onClose={() => setActionMenuId(null)}
                                      />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f1f5f9] px-6 py-5 text-xs text-[#94a3b8]">
                    <span>
                      Menampilkan {(page - 1) * ITEMS_PER_PAGE + 1}-
                      {Math.min(page * ITEMS_PER_PAGE, filtered.length)} dari{" "}
                      {filtered.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => i + 1,
                      ).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${p === page ? "bg-[#102e4a] text-white" : "text-[#64748b]"}`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] disabled:opacity-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {showExportModal && (
        <ExportInventoryModal
          categories={categories}
          inventory={products}
          onClose={() => setShowExportModal(false)}
        />
      )}
      {showCreateModal && (
        <ProductFormModal
          title="Tambah Produk Baru"
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchProducts();
            setShowCreateModal(false);
            setMessage({
              type: "success",
              text: "✅ Produk berhasil ditambahkan!",
            });
          }}
        />
      )}
      {editingProduct && (
        <ProductFormModal
          title="Edit Produk"
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            fetchProducts();
            setEditingProduct(null);
            setMessage({
              type: "success",
              text: "✅ Produk berhasil diperbarui!",
            });
          }}
        />
      )}
    </div>
  );
}

function ActionMenu({ onEdit, onDelete, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-xl bg-white border border-[#e2e8f0] shadow-lg py-1">
        <button
          onClick={onEdit}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#1e293b] hover:bg-[#f8fafc]"
        >
          <Edit className="h-4 w-4" /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" /> Hapus
        </button>
      </div>
    </>
  );
}

// Form sends TikTok-style payload
function ProductFormModal({ title, product, onClose, onSuccess }) {
  const isEdit = Boolean(product);
  const firstSku = product?.skus?.[0] || {};

  const [form, setForm] = useState({
    product_name: product?.product_name || "",
    product_id: product?.product_id || "",
    category_id: product?.category_id || "",
    description: product?.description || "",
    imageUrl: product?.imageUrl || "",
    brand: product?.brand || "",
    sku_id: firstSku.sku_id || "",
    price: firstSku.price_info?.original_price || 0,
    stock: firstSku.stock_info?.available_stock || 0,
    variant_name_1: product?.variant_name_1 || "",
    variant_name_2: product?.variant_name_2 || "",
    variant_value_1: firstSku.variant_value_1 || "",
    variant_value_2: firstSku.variant_value_2 || "",
    parcel_weight: product?.parcel_weight || "",
    parcel_length: product?.parcel_length || "",
    parcel_width: product?.parcel_width || "",
    parcel_height: product?.parcel_height || "",
    minimum_order_quantity: product?.minimum_order_quantity || "",
    size_chart: product?.size_chart || "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (
      !form.product_name ||
      !form.sku_id ||
      form.price == null ||
      form.stock == null
    )
      return setError("Nama produk, SKU, harga, dan stok wajib diisi!");

    const payload = {
      product_name: form.product_name,
      product_id: form.product_id || undefined,
      category_id: form.category_id || undefined,
      description: form.description,
      imageUrl: form.imageUrl || undefined,
      brand: form.brand || undefined,
      variant_name_1: form.variant_name_1 || undefined,
      variant_name_2: form.variant_name_2 || undefined,
      parcel_weight: form.parcel_weight
        ? Number(form.parcel_weight)
        : undefined,
      parcel_length: form.parcel_length
        ? Number(form.parcel_length)
        : undefined,
      parcel_width: form.parcel_width ? Number(form.parcel_width) : undefined,
      parcel_height: form.parcel_height
        ? Number(form.parcel_height)
        : undefined,
      minimum_order_quantity: form.minimum_order_quantity
        ? Number(form.minimum_order_quantity)
        : undefined,
      size_chart: form.size_chart || undefined,
      skus: [
        {
          sku_id: form.sku_id,
          stock_info: { available_stock: Number(form.stock) },
          price_info: { original_price: Number(form.price) },
          variant_value_1: form.variant_value_1 || "",
          variant_value_2: form.variant_value_2 || "",
        },
      ],
    };

    setSaving(true);
    try {
      if (isEdit) await api.put(`/api/inventory/${product._id}`, payload);
      else await api.post("/api/inventory", payload);
      onSuccess();
    } catch (err) {
      setError(err.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#3182ce] focus:ring-1 focus:ring-[#3182ce] outline-none transition-all";
  const labelClass = "text-xs font-semibold text-[#64748b] mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* === Informasi Dasar === */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">
                Informasi Dasar
              </p>
              <div>
                <label className={labelClass}>Nama Produk *</label>
                <input
                  placeholder="Kemeja Pria Premium"
                  value={form.product_name}
                  onChange={(e) =>
                    setForm({ ...form, product_name: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>SKU ID *</label>
                  <input
                    placeholder="SKU-KEM-M"
                    value={form.sku_id}
                    onChange={(e) =>
                      setForm({ ...form, sku_id: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Kategori</label>
                  <input
                    placeholder="Pakaian/Kemeja"
                    value={form.category_id}
                    onChange={(e) =>
                      setForm({ ...form, category_id: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Harga (Rp) *</label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Stok *</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Merek</label>
                <input
                  placeholder="Nama brand (opsional)"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Deskripsi</label>
                <textarea
                  placeholder="Kemeja katun premium, bahan adem..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className={inputClass}
                  rows={2}
                />
              </div>
              <div>
                <label className={labelClass}>URL Gambar Utama</label>
                <input
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            {/* === Toggle Advanced === */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-[#f8fafc] rounded-xl text-sm font-semibold text-[#3182ce] hover:bg-[#eff6ff] transition-all"
            >
              <span>📦 Field TikTok Shop (Varian, Dimensi, dll)</span>
              <span
                className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {showAdvanced && (
              <div className="space-y-4 pl-1 border-l-2 border-[#3182ce]/20 ml-2">
                {/* Varian */}
                <div className="space-y-3 pl-3">
                  <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">
                    Varian
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Nama Varian 1</label>
                      <input
                        placeholder="Warna"
                        value={form.variant_name_1}
                        onChange={(e) =>
                          setForm({ ...form, variant_name_1: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Nilai Varian 1</label>
                      <input
                        placeholder="Hitam"
                        value={form.variant_value_1}
                        onChange={(e) =>
                          setForm({ ...form, variant_value_1: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Nama Varian 2</label>
                      <input
                        placeholder="Ukuran"
                        value={form.variant_name_2}
                        onChange={(e) =>
                          setForm({ ...form, variant_name_2: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Nilai Varian 2</label>
                      <input
                        placeholder="XL"
                        value={form.variant_value_2}
                        onChange={(e) =>
                          setForm({ ...form, variant_value_2: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensi Paket */}
                <div className="space-y-3 pl-3">
                  <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">
                    Dimensi Paket
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Berat (gram)</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="200"
                        value={form.parcel_weight}
                        onChange={(e) =>
                          setForm({ ...form, parcel_weight: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Panjang (cm)</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="10"
                        value={form.parcel_length}
                        onChange={(e) =>
                          setForm({ ...form, parcel_length: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Lebar (cm)</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="15"
                        value={form.parcel_width}
                        onChange={(e) =>
                          setForm({ ...form, parcel_width: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Tinggi (cm)</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="5"
                        value={form.parcel_height}
                        onChange={(e) =>
                          setForm({ ...form, parcel_height: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Opsional */}
                <div className="space-y-3 pl-3">
                  <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">
                    Opsional
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Min. Order</label>
                      <input
                        type="number"
                        min={1}
                        placeholder="1"
                        value={form.minimum_order_quantity}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            minimum_order_quantity: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>URL Bagan Ukuran</label>
                      <input
                        placeholder="https://..."
                        value={form.size_chart}
                        onChange={(e) =>
                          setForm({ ...form, size_chart: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-[#4e7da9] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3b6d9c] disabled:opacity-60 transition-all"
            >
              {saving ? "Menyimpan..." : isEdit ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Export Inventory Modal ──
function ExportInventoryModal({ inventory, categories, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("Semua");
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      // 1. Filter Data
      const filtered = inventory.filter((item) => {
        const itemDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
        const sDate = startDate
          ? new Date(startDate).setHours(0, 0, 0, 0)
          : null;
        const eDate = endDate
          ? new Date(endDate).setHours(23, 59, 59, 999)
          : null;

        const matchStart = !sDate || itemDate >= sDate;
        const matchEnd = !eDate || itemDate <= eDate;
        const matchCategory =
          category === "Semua" || item.category_id === category;

        return matchStart && matchEnd && matchCategory;
      });

      if (filtered.length === 0) {
        alert("Tidak ada data inventori yang sesuai dengan filter.");
        setLoading(false);
        return;
      }

      // 2. Map ke Array JSON yang di-flatten berdasarkan SKU
      const dataForExcel = [];
      filtered.forEach((p) => {
        // Jika produk tidak punya SKU, buat baris kosong untuk representasi
        if (!p.skus || p.skus.length === 0) {
          dataForExcel.push({
            "Nama Produk": p.product_name || p.name || "—",
            Kategori: p.category_id || "—",
            Brand: p.brand || "—",
            "SKU ID": "—",
            Stok: 0,
            Harga: 0,
            "Tanggal Dibuat": new Date(p.createdAt).toLocaleDateString("id-ID"),
            Deskripsi: p.description || "—",
          });
          return;
        }

        p.skus.forEach((sku) => {
          dataForExcel.push({
            "Nama Produk": p.product_name || p.name || "—",
            Kategori: p.category_id || "—",
            Brand: p.brand || "—",
            "SKU ID": sku.sku_id || "—",
            Stok: sku.stock_info?.available_stock || 0,
            Harga: sku.price_info?.original_price || 0,
            "Tanggal Dibuat": new Date(p.createdAt).toLocaleDateString("id-ID"),
            Deskripsi: p.description || "—",
          });
        });
      });

      // 3. Konversi dan Download
      const ws = XLSX.utils.json_to_sheet(dataForExcel);

      const colWidths = [
        { wch: 40 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 50 },
      ];
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventori");

      const fileName = `Export_Inventori_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(wb, fileName);

      setLoading(false);
      onClose();
    }, 500);
  };

  const inputClass =
    "w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm focus:border-[#3182ce] focus:ring-1 focus:ring-[#3182ce] outline-none transition-all";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1e293b]">
              Export Inventori
            </h2>
            <button
              onClick={onClose}
              className="text-[#94a3b8] hover:text-[#1e293b] font-bold text-xl"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-2">
                Tanggal Input Barang (Opsional)
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
                <span className="text-[#94a3b8] font-bold">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <p className="text-[10px] text-[#94a3b8] mt-1 italic">
                *kosongkan jika ingin export semua waktu.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-2">
                Kategori Produk
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="Semua">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 border border-[#e2e8f0] text-[#1e293b] font-semibold py-2.5 rounded-xl text-sm hover:bg-[#f8fafc] transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 focus:ring-4 focus:ring-green-100 disabled:opacity-60 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                "Memproses..."
              ) : (
                <>
                  <Download className="h-4 w-4" /> Ekspor Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
