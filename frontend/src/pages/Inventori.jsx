import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Edit,
  Menu,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarContent from "@/component/SidebarContent";
import { Button } from "@/component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/component/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet, apiPost, apiPut, apiDelete } from "@/api/apiClient";

const ITEMS_PER_PAGE = 10;

export default function Inventori() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(null);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

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

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      const data = await apiGet("/api/inventory");
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

  // Derived stats
  const totalProduk = products.length;
  const stokMenipis = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const stokHabis = products.filter((p) => p.stock === 0).length;
  const categories = [...new Set(products.map((p) => p.category))];
  const totalKategori = categories.length;

  const statCards = [
    {
      label: "Total Produk",
      value: totalProduk.toLocaleString("id-ID"),
      subtext: `${products.length} item terdaftar`,
      chip: `${totalProduk}`,
      chipStyle: "bg-[#ecfdf5] text-[#10b981]",
      icon: Boxes,
      iconStyle: "bg-[#eff6ff] text-[#2563eb]",
    },
    {
      label: "Stok Menipis",
      value: stokMenipis.toString(),
      subtext: "Stok ≤ 10 unit",
      chip: "Restock",
      chipStyle: "bg-[#fff7ed] text-[#f97316]",
      icon: AlertTriangle,
      iconStyle: "bg-[#fff7ed] text-[#f97316]",
    },
    {
      label: "Stok Habis",
      value: stokHabis.toString(),
      subtext: "Perlu restock segera",
      chip: "Urgent",
      chipStyle: "bg-[#fee2e2] text-[#ef4444]",
      icon: AlertCircle,
      iconStyle: "bg-[#fee2e2] text-[#ef4444]",
    },
    {
      label: "Kategori",
      value: totalKategori.toString(),
      subtext: "Kategori aktif saat ini",
      chip: `${totalKategori} Aktif`,
      chipStyle: "bg-[#ecfdf5] text-[#10b981]",
      icon: Tags,
      iconStyle: "bg-[#ecfdf5] text-[#10b981]",
    },
  ];

  const tabs = ["Semua", ...categories];

  // Filter & search
  const filtered = products
    .filter((p) => activeTab === "Semua" || p.category === activeTab)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const getStockDot = (stock) => {
    if (stock === 0) return "bg-[#ef4444]";
    if (stock <= 10) return "bg-[#f59e0b]";
    return "bg-[#10b981]";
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;
    try {
      await apiDelete(`/api/inventory/${id}`);
      setMessage({ type: "success", text: "✅ Produk berhasil dihapus!" });
      setActionMenuId(null);
      fetchProducts();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "❌ Gagal hapus produk." });
    }
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
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc] active:scale-95 transition-all"
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
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="h-11 w-72 rounded-xl border border-[#e2e8f0] bg-white pl-9 text-sm focus-visible:ring-[#3bb0f3] transition-colors"
                  />
                </div>
                <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc] active:scale-95 transition-all">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-[#ef4444]" />
                </button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="h-11 rounded-xl bg-[#4e7da9] px-4 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#3b6d9c] hover:shadow-lg active:scale-95 transition-all duration-200"
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
                  placeholder="Cari SKU, nama produk..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="h-11 w-full rounded-xl border border-[#e2e8f0] bg-white pl-9 text-sm focus-visible:ring-[#3bb0f3] transition-colors"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc] active:scale-95 transition-all">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-[#ef4444]" />
                </button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="h-11 flex-1 rounded-xl bg-[#4e7da9] text-xs font-semibold text-white hover:-translate-y-0.5 hover:bg-[#3b6d9c] hover:shadow-lg active:scale-95 transition-all duration-200"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk
                </Button>
              </div>
            </div>
          </header>

          <main className="space-y-6 px-5 py-6 md:px-8">
            {/* Message */}
            {message && (
              <div className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}>
                {message.text}
                <button onClick={() => setMessage(null)} className="font-bold ml-3">✕</button>
              </div>
            )}

            {/* Stats */}
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.label}
                    className="border-[#f1f5f9] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
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
            <Card className="border-[#f1f5f9] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-wrap items-center justify-between gap-3 space-y-0">
                <div className="flex flex-wrap items-center gap-4">
                  <CardTitle className="text-base font-semibold text-[#1e293b]">
                    Daftar Produk
                  </CardTitle>
                  <div className="flex items-center gap-2 rounded-xl bg-[#f8fafc] p-1 overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => { setActiveTab(tab); setPage(1); }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                          tab === activeTab
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
                  className="h-11 rounded-xl border-[#e2e8f0] text-xs font-semibold text-[#3182ce] hover:bg-[#f8fafc] active:scale-95 transition-all"
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
                      {paginated.map((product) => (
                        <div
                          key={product._id}
                          className="rounded-xl border border-[#f1f5f9] bg-white p-4 shadow-[0_8px_20px_rgba(15,42,67,0.08)] transition-transform duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f1f5f9] text-lg font-bold text-[#94a3b8]">
                              {product.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-semibold text-[#1e293b]">
                                {product.name}
                              </p>
                              <p className="text-xs text-[#94a3b8]">
                                SKU: {product.sku}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full px-3 py-1 text-[10px] font-bold bg-[#eff6ff] text-[#2563eb]">
                                  {product.category}
                                </span>
                                <span className="text-sm font-semibold text-[#0f172a]">
                                  Rp{product.price.toLocaleString("id-ID")}
                                </span>
                              </div>
                            </div>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setActionMenuId(actionMenuId === product._id ? null : product._id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#94a3b8]"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {actionMenuId === product._id && (
                                <ActionMenu
                                  onEdit={() => { setEditingProduct(product); setActionMenuId(null); }}
                                  onDelete={() => handleDelete(product._id)}
                                  onClose={() => setActionMenuId(null)}
                                />
                              )}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-[#94a3b8]">
                            <span className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${getStockDot(product.stock)}`} />
                              Stok {product.stock}
                            </span>
                          </div>
                        </div>
                      ))}
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
                          {paginated.map((product) => (
                            <tr key={product._id}>
                              <td className="px-6 py-5 text-[14px] font-semibold font-mono">
                                {product.sku}
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f1f5f9] text-sm font-bold text-[#94a3b8]">
                                    {product.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-[14px] font-semibold text-[#1e293b]">
                                      {product.name}
                                    </p>
                                    <p className="text-[10px] text-[#94a3b8]">
                                      {product.description || "—"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <span className="rounded-full px-3 py-1 text-[10px] font-bold bg-[#eff6ff] text-[#2563eb]">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-6 py-5 text-right text-[14px] font-semibold">
                                Rp{product.price.toLocaleString("id-ID")}
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center justify-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${getStockDot(product.stock)}`} />
                                  <span className="text-[14px] font-semibold">
                                    {product.stock}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <div className="relative inline-block">
                                  <button
                                    type="button"
                                    onClick={() => setActionMenuId(actionMenuId === product._id ? null : product._id)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#94a3b8]"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                  {actionMenuId === product._id && (
                                    <ActionMenu
                                      onEdit={() => { setEditingProduct(product); setActionMenuId(null); }}
                                      onDelete={() => handleDelete(product._id)}
                                      onClose={() => setActionMenuId(null)}
                                    />
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f1f5f9] px-6 py-5 text-xs text-[#94a3b8]">
                    <span>
                      Menampilkan {((page - 1) * ITEMS_PER_PAGE) + 1}-
                      {Math.min(page * ITEMS_PER_PAGE, filtered.length)} dari{" "}
                      {filtered.length} produk
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                        (p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPage(p)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                              p === page
                                ? "bg-[#102e4a] text-white"
                                : "border border-transparent text-[#64748b]"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Create Modal */}
      {showCreateModal && (
        <ProductFormModal
          title="Tambah Produk Baru"
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchProducts();
            setShowCreateModal(false);
            setMessage({ type: "success", text: "✅ Produk berhasil ditambahkan!" });
          }}
        />
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <ProductFormModal
          title="Edit Produk"
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            fetchProducts();
            setEditingProduct(null);
            setMessage({ type: "success", text: "✅ Produk berhasil diperbarui!" });
          }}
        />
      )}
    </div>
  );
}

// ── Action Menu Dropdown ──
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

// ── Product Form Modal (Create & Edit) ──
function ProductFormModal({ title, product, onClose, onSuccess }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    category: product?.category || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || "",
    description: product?.description || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.sku || !form.category || form.price == null || form.stock == null) {
      return setError("Nama, SKU, kategori, harga, dan stok wajib diisi!");
    }

    setSaving(true);
    try {
      if (isEdit) {
        await apiPut(`/api/inventory/${product._id}`, form);
      } else {
        await apiPost("/api/inventory", form);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#64748b] mb-1 block">Nama Produk *</label>
              <input
                placeholder="Kemeja Flanel Slim Fit"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#64748b] mb-1 block">SKU *</label>
                <input
                  placeholder="SKU-001"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748b] mb-1 block">Kategori *</label>
                <input
                  placeholder="Pakaian"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#64748b] mb-1 block">Harga *</label>
                <input
                  type="number"
                  placeholder="25000"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748b] mb-1 block">Stok *</label>
                <input
                  type="number"
                  placeholder="100"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748b] mb-1 block">URL Gambar</label>
              <input
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748b] mb-1 block">Deskripsi</label>
              <textarea
                placeholder="Deskripsi produk..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-[#4e7da9] text-white py-2 rounded-xl text-sm hover:bg-[#3b6d9c] disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : isEdit ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
