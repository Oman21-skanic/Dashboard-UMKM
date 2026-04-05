import { useCallback, useEffect, useState } from "react";
import { Menu, Plus, Search, Download, Calendar } from "lucide-react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import api from "@/api/apiClient";
import SidebarContent from "@/component/SidebarContent";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/component/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/component/ui/card";

// Backend order_status enum
const STATUS_OPTIONS = [
  "UNPAID",
  "AWAITING_SHIPMENT",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_COLORS = {
  UNPAID: "bg-red-100 text-red-700 border border-red-300",
  AWAITING_SHIPMENT: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  AWAITING_COLLECTION: "bg-orange-100 text-orange-700 border border-orange-300",
  IN_TRANSIT: "bg-purple-100 text-purple-700 border border-purple-300",
  DELIVERED: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  CANCELLED: "bg-gray-100 text-gray-500 border border-gray-300",
};

const STATUS_LABEL = {
  UNPAID: "Belum Bayar",
  AWAITING_SHIPMENT: "Menunggu Kirim",
  AWAITING_COLLECTION: "Siap Diambil",
  IN_TRANSIT: "Dalam Perjalanan",
  DELIVERED: "Selesai",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const SOURCE_COLORS = {
  Manual: "bg-[#f1f5f9] text-[#64748b]",
  TikTok: "bg-black text-white",
  Instagram: "bg-pink-50 text-pink-600",
  Tokopedia: "bg-emerald-50 text-emerald-600",
};

const ITEMS_PER_PAGE = 10;

export default function Pesanan() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  const displayName = user?.businessName || user?.email || "Pengguna";
  const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get("/api/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "❌ Gagal memuat data pesanan." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Filter & search using BE field names
  const filtered = orders
    .filter(o => !filterStatus || o.order_status === filterStatus)
    .filter(o => !filterSource || o.source === filterSource)
    .filter(o => !search || (o.shipping_info?.buyer_name || o.customerName || o.order_id || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDesc
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleUpdateStatus = async (orderId, order_status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { order_status });
      setMessage({ type: "success", text: "✅ Status berhasil diupdate!" });
      fetchOrders();
      setSelectedOrder(prev => prev ? { ...prev, order_status } : null);
    } catch {
      setMessage({ type: "error", text: "❌ Gagal update status." });
    }
  };

  const canDelete = (status) => status === "AWAITING_SHIPMENT" || status === "UNPAID";

  const handleDelete = async (orderId) => {
    if (!confirm("Yakin mau hapus order ini?")) return;
    try {
      await api.delete(`/api/orders/${orderId}`);
      setMessage({ type: "success", text: "✅ Order berhasil dihapus!" });
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "❌ Gagal hapus order." });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf5] text-[#102e4a]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-[#102e4a] text-white md:flex">
          <SidebarContent displayName={displayName} initials={initials} onLogout={handleLogout} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#f1f5f9] bg-[#fffcf5]/80 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="hidden flex-col gap-1 md:flex">
                <div className="text-xs font-semibold text-[#64748b]">DashUMKM / <span className="text-[#3182ce]">Pesanan</span></div>
                <h1 className="text-2xl font-semibold text-[#0f172a]">Daftar Pesanan</h1>
              </div>
              
              <div className="flex items-center gap-3 md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]">
                      <Menu className="h-4 w-4" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 border-r-0 bg-[#102e4a] p-0 text-white">
                    <SidebarContent displayName={displayName} initials={initials} onLogout={handleLogout} CloseWrapper={SheetClose} />
                  </SheetContent>
                </Sheet>
                <div>
                  <p className="text-[0.65rem] font-semibold text-[#94a3b8]">DashUMKM</p>
                  <h1 className="text-sm font-semibold text-[#0f172a]">Pesanan</h1>
                </div>
              </div>

              <div className="hidden flex-wrap items-center justify-end gap-3 md:flex">
                <Button onClick={() => setShowExportModal(true)} variant="outline" className="h-10 rounded-xl px-4 text-sm font-semibold text-[#64748b] bg-white border-[#e2e8f0]">
                  <Download className="mr-2 h-4 w-4" /> Export Data
                </Button>
                <Button onClick={() => setShowCreateModal(true)} className="h-10 rounded-xl bg-[#4e7da9] px-4 text-sm font-semibold text-white hover:bg-[#3b6d9c]">
                  <Plus className="mr-2 h-4 w-4" />Buat Pesanan
                </Button>
              </div>
            </div>
            
            {/* Mobile Actions Header Add-on */}
            <div className="mt-4 flex gap-2 md:hidden px-5">
              <Button onClick={() => setShowExportModal(true)} variant="outline" className="h-9 flex-1 rounded-xl bg-white border-[#e2e8f0] text-[#64748b] text-xs font-semibold px-2">
                <Download className="mr-1 h-3 w-3 shrink-0" /> Export
              </Button>
              <Button onClick={() => setShowCreateModal(true)} className="h-9 flex-1 rounded-xl bg-[#4e7da9] text-xs font-semibold text-white hover:bg-[#3b6d9c] px-2">
                <Plus className="mr-1 h-4 w-4 shrink-0" /> Buat Pesanan
              </Button>
            </div>
          </header>

          <main className="space-y-6 px-5 py-6 md:px-8">
            {message && (
              <div className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                message.type === "success" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"
              }`}>
                {message.text}
                <button onClick={() => setMessage(null)} className="font-bold ml-3">✕</button>
              </div>
            )}

            {/* Filters */}
            <Card className="border-[#f1f5f9] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    <Input 
                      placeholder="Cari order atau nama pembeli..."
                      value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                      className="h-10 w-full rounded-xl border-[#e2e8f0] bg-white pl-9 text-sm focus-visible:ring-[#3bb0f3]" 
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                      className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f172a] focus:ring-[#3bb0f3] min-w-[130px]">
                      <option value="">Semua Status</option>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s] || s}</option>)}
                    </select>
                    <select value={filterSource} onChange={e => { setFilterSource(e.target.value); setPage(1); }}
                      className="h-10 rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f172a] focus:ring-[#3bb0f3] min-w-[130px]">
                      <option value="">Semua Source</option>
                      <option value="Manual">Manual</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Tokopedia">Tokopedia</option>
                    </select>
                    <Button variant="outline" onClick={() => setSortDesc(prev => !prev)} className="h-10 rounded-xl border-[#e2e8f0] px-4 text-sm font-semibold text-[#64748b] whitespace-nowrap">
                      Tanggal {sortDesc ? "↓" : "↑"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table Area */}
            <Card className="border-[#f1f5f9] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-[#3bb0f3] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : paginated.length === 0 ? (
                  <div className="text-center py-16 text-[#94a3b8]">
                    <p className="text-4xl mb-3">📦</p>
                    <p className="text-sm font-semibold">Belum ada pesanan{search ? " yang cocok" : ""}</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile cards */}
                    <div className="space-y-3 p-4 md:hidden">
                      {paginated.map(order => (
                        <div
                          key={`${order._id}-mobile`}
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-xl border border-[#eef2f7] bg-white p-4 shadow-[0_4px_12px_rgba(15,42,67,0.06)] cursor-pointer hover:shadow-[0_8px_24px_rgba(15,42,67,0.1)] hover:border-[#d5e0ea] transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#1e293b] truncate">
                                {order.shipping_info?.buyer_name || order.customerName || "—"}
                              </p>
                              <p className="text-xs text-[#94a3b8] font-mono mt-0.5">
                                {order.order_id || `#${order._id.slice(-6).toUpperCase()}`}
                              </p>
                            </div>
                            <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[order.order_status] || "bg-gray-100 text-gray-600"}`}>
                              {STATUS_LABEL[order.order_status] || order.order_status}
                            </span>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-2 min-w-0">
                              <div>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider font-bold ${SOURCE_COLORS[order.source] || "bg-gray-100 text-gray-600"}`}>
                                  {order.source || "Manual"}
                                </span>
                              </div>
                              <span className="text-[15px] font-extrabold text-[#0f172a] truncate">
                                Rp{(order.payment_info?.total_amount || order.totalAmount || 0).toLocaleString("id-ID")}
                              </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5 text-[#64748b] bg-[#f8fafc] px-2 py-1 rounded-lg border border-[#f1f5f9]">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="text-[10px] font-bold tracking-wide">
                                {new Date(order.createdAt).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                      <table className="min-w-[880px] w-full text-left text-[12px]">
                        <thead className="bg-[#f8fafc] text-[10px] font-bold uppercase tracking-[1px] text-[#94a3b8]">
                          <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Pembeli</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Source</th>
                            <th className="px-6 py-4">Tanggal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9] text-[12px] font-medium text-[#1e293b]">
                          {paginated.map(order => (
                            <tr key={order._id} onClick={() => setSelectedOrder(order)}
                              className="hover:bg-[#f8fafc] cursor-pointer transition-colors">
                              <td className="px-6 py-5 font-mono font-semibold text-[#64748b] text-[13px]">
                                {order.order_id || `#${order._id.slice(-6).toUpperCase()}`}
                              </td>
                              <td className="px-6 py-5">
                                <p className="text-[14px] font-semibold text-[#1e293b]">
                                  {order.shipping_info?.buyer_name || order.customerName || "—"}
                                </p>
                              </td>
                              <td className="px-6 py-5 text-[14px] font-semibold">
                                Rp{(order.payment_info?.total_amount || order.totalAmount || 0).toLocaleString("id-ID")}
                              </td>
                              <td className="px-6 py-5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[order.order_status] || "bg-gray-100 text-gray-600"}`}>
                                  {STATUS_LABEL[order.order_status] || order.order_status}
                                </span>
                              </td>
                              <td className="px-6 py-5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${SOURCE_COLORS[order.source] || "bg-gray-100 text-gray-600"}`}>
                                  {order.source}
                                </span>
                              </td>
                              <td className="px-6 py-5 text-[#64748b]">
                                {new Date(order.createdAt).toLocaleDateString("id-ID")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#f1f5f9] px-6 py-5 text-xs text-[#94a3b8]">
                    <span>Halaman {page} dari {totalPages}</span>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="outline" className="h-8 rounded-lg border-[#e2e8f0] px-3 font-semibold text-[#64748b]">Prev</Button>
                      <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="outline" className="h-8 rounded-lg border-[#e2e8f0] px-3 font-semibold text-[#64748b]">Next</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </main>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1e293b]">
                  Detail Order <span className="text-[#64748b] text-base font-medium ml-1">{selectedOrder.order_id || `#${selectedOrder._id.slice(-6).toUpperCase()}`}</span>
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="text-[#94a3b8] hover:text-[#1e293b] text-xl font-bold">✕</button>
              </div>

              <div className="bg-[#f8fafc] rounded-xl p-4 mb-4 border border-[#e2e8f0]">
                <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-3">Info Pembeli</p>
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-[#475569] flex items-center gap-2">👤 {selectedOrder.shipping_info?.buyer_name || selectedOrder.customerName}</p>
                  <p className="text-sm text-[#475569] flex items-center gap-2">📞 {selectedOrder.shipping_info?.buyer_phone || selectedOrder.customerPhone || "—"}</p>
                  <p className="text-sm text-[#475569] flex items-center gap-2">📍 {selectedOrder.shipping_info?.buyer_address || selectedOrder.customerAddress || "—"}</p>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-3">Item Pesanan</p>
                <div className="space-y-2">
                  {(selectedOrder.item_list || selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-[#f1f5f9] pb-2 last:border-0 last:pb-0">
                      <span className="text-[#475569] font-medium">{item.product_name || item.productName} <span className="text-[#94a3b8] ml-1">x{item.quantity}</span></span>
                      <span className="font-semibold text-[#1e293b]">Rp{(item.subtotal || 0).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[#1e293b] mt-4 pt-3 border-t-2 border-[#f1f5f9]">
                  <span className="font-bold">Total Pembayaran</span>
                  <span className="font-bold text-lg text-[#3182ce]">Rp{(selectedOrder.payment_info?.total_amount || selectedOrder.totalAmount || 0).toLocaleString("id-ID")}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-amber-50 rounded-xl p-3 mb-5 text-sm text-amber-700 border border-amber-200">
                  <span className="font-bold tracking-wide text-xs mb-1 block">CATATAN :</span>
                  {selectedOrder.notes}
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-3">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => handleUpdateStatus(selectedOrder._id, s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        selectedOrder.order_status === s
                          ? (STATUS_COLORS[s] || "") + " ring-2 ring-[#3bb0f3] ring-offset-2 scale-105"
                          : "border-[#e2e8f0] text-[#64748b] bg-white hover:bg-[#f8fafc]"
                      }`}>
                      {STATUS_LABEL[s] || s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedOrder(null)}
                  className="flex-1 border border-[#e2e8f0] text-[#1e293b] font-semibold py-2.5 rounded-xl text-sm hover:bg-[#f8fafc] transition-colors">
                  Tutup
                </button>
                {canDelete(selectedOrder.order_status) && (
                  <button onClick={() => handleDelete(selectedOrder._id)}
                    className="flex-1 bg-red-50 text-red-600 border border-red-200 font-bold py-2.5 rounded-xl text-sm hover:bg-red-100 transition-colors">
                    Hapus Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <ExportOrderModal
          orders={orders}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { fetchOrders(); setShowCreateModal(false); setMessage({ type: "success", text: "✅ Order berhasil dibuat!" }); }}
        />
      )}
    </div>
  );
}

// ── Create Order Modal — sends TikTok-style payload ──
function CreateOrderModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    buyer_name: "", buyer_phone: "", buyer_address: "",
    notes: "", source: "TikTok", // Changed default to TikTok based on user request focus
  });
  const [items, setItems] = useState([{ sku_id: "", product_name: "", quantity: 1, price: 0, subtotal: 0 }]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [inventoryProducts, setInventoryProducts] = useState([]);

  useEffect(() => {
    // Fetch inventory products so user can select them
    api.get("/api/inventory")
      .then(res => setInventoryProducts(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Gagal load inventori", err));
  }, []);

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    if (field === "quantity" || field === "price") {
      updated[i].subtotal = updated[i].quantity * updated[i].price;
    }
    setItems(updated);
  };

  const handleSelectProduct = (i, productId) => {
    const selected = inventoryProducts.find(p => p._id === productId);
    if (!selected) return;
    
    const sku = selected.skus && selected.skus[0] ? selected.skus[0] : null;
    const price = sku && sku.price_info ? sku.price_info.original_price : 0;
    const skuId = sku ? sku.sku_id : "";

    const updated = [...items];
    updated[i].product_name = selected.product_name || selected.name || "";
    updated[i].sku_id = skuId;
    updated[i].price = price;
    updated[i].subtotal = updated[i].quantity * price;
    setItems(updated);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = async () => {
    setError("");
    if (!form.buyer_name || !form.buyer_phone || !form.buyer_address)
      return setError("Nama, telepon, dan alamat wajib diisi!");
    if (items.some(i => !i.product_name || i.quantity < 1 || i.price < 1))
      return setError("Lengkapi semua item pesanan!");

    setSaving(true);
    try {
      await api.post("/api/orders", {
        order_id: `ORD-${form.source.toUpperCase()}-${Date.now()}`,
        shipping_info: {
          buyer_name: form.buyer_name,
          buyer_phone: form.buyer_phone,
          buyer_address: form.buyer_address,
        },
        payment_info: { total_amount: totalAmount },
        item_list: items.map(i => ({
          sku_id: i.sku_id || undefined,
          product_name: i.product_name,
          quantity: i.quantity,
          subtotal: i.subtotal,
        })),
        source: form.source,
        notes: form.notes || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err.message || "Gagal membuat order");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm focus:border-[#3182ce] focus:ring-1 focus:ring-[#3182ce] outline-none transition-all";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1e293b]">Buat Pesanan Baru</h2>
            <button onClick={onClose} className="text-[#94a3b8] hover:text-[#1e293b] font-bold text-xl">✕</button>
          </div>

          {error && <div className="mb-4 px-4 py-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">{error}</div>}

          <div className="space-y-3">
            <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-2">Informasi Pembeli</p>
            <input placeholder="Nama Lengkap Pembeli *" value={form.buyer_name}
              onChange={e => setForm({ ...form, buyer_name: e.target.value })}
              className={inputClass} />
            <input placeholder="No. Telepon / WhatsApp *" value={form.buyer_phone}
              onChange={e => setForm({ ...form, buyer_phone: e.target.value })}
              className={inputClass} />
            <textarea placeholder="Alamat Pengiriman Lengkap *" value={form.buyer_address}
              onChange={e => setForm({ ...form, buyer_address: e.target.value })}
              className={inputClass} rows={2} />
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#475569] whitespace-nowrap">Source Order:</span>
              <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}
                className={inputClass}>
                <option value="TikTok">TikTok Shop</option>
                <option value="Manual">Manual (WA/Toko)</option>
                <option value="Instagram">Instagram</option>
                <option value="Tokopedia">Tokopedia</option>
              </select>
            </div>
          </div>

          <div className="mt-6 border-t border-[#f1f5f9] pt-4">
            <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-3">Item Pesanan</p>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 space-y-3 relative group">
                  {/* Pilihan Produk dari Inventori */}
                  <div className="flex flex-col gap-2">
                    <select 
                      onChange={(e) => {
                        const val = e.target.value;
                        if(val === "") {
                           updateItem(i, "product_name", "");
                           updateItem(i, "sku_id", "");
                           updateItem(i, "price", 0);
                        } else {
                           handleSelectProduct(i, val);
                        }
                      }}
                      className={inputClass + " font-semibold text-[#1e293b] cursor-pointer bg-blue-50/30"}
                      defaultValue=""
                    >
                      <option value="" disabled>Pilih Produk dari Inventori (Opsional)</option>
                      {inventoryProducts.map(inv => (
                        <option key={inv._id} value={inv._id}>
                          📦 {inv.product_name || inv.name} — Rp{(inv.skus?.[0]?.price_info?.original_price || 0).toLocaleString("id-ID")}
                        </option>
                      ))}
                    </select>

                    {/* Jika ingin edit manual namanya */}
                    <div className="flex gap-2">
                      <input placeholder="SKU (opsional)" value={item.sku_id}
                        onChange={e => updateItem(i, "sku_id", e.target.value)}
                        className={inputClass + " w-1/3 text-xs"} />
                      <input placeholder="Nama Produk *" value={item.product_name}
                        onChange={e => updateItem(i, "product_name", e.target.value)}
                        className={inputClass + " w-2/3"} />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Qty" min={1} value={item.quantity}
                      onChange={e => updateItem(i, "quantity", Number(e.target.value))}
                      className={inputClass + " w-1/4"} />
                    <span className="text-[#94a3b8] text-xs font-bold">×</span>
                    <input type="number" placeholder="Harga Satuan" min={0} value={item.price}
                      onChange={e => updateItem(i, "price", Number(e.target.value))}
                      className={inputClass + " w-1/3 flex-1"} />
                    <span className="font-bold text-[#3182ce] whitespace-nowrap px-2">
                      Rp{item.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {items.length > 1 && (
                    <button onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 h-6 w-6 bg-white border border-red-200 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all font-bold text-xs shadow-sm">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setItems([...items, { sku_id: "", product_name: "", quantity: 1, price: 0, subtotal: 0 }])}
              className="mt-3 text-[#3182ce] text-sm font-bold flex items-center gap-1 hover:text-[#2b6cb0]">
              <Plus className="h-4 w-4" /> Tambah Item Lain
            </button>
          </div>

          <div className="flex justify-between items-center bg-[#eff6ff] text-[#1e293b] rounded-xl px-4 py-3 mt-5">
            <span className="font-bold tracking-wide">TOTAL TAGIHAN</span>
            <span className="font-bold text-lg text-[#3182ce]">Rp{totalAmount.toLocaleString("id-ID")}</span>
          </div>

          <textarea placeholder="Catatan untuk pembeli/kurir (opsional)" value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            className={inputClass + " mt-4"} rows={2} />

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 border border-[#e2e8f0] text-[#1e293b] font-semibold py-2.5 rounded-xl text-sm hover:bg-[#f8fafc] transition-colors">Batal</button>
            <button onClick={handleSubmit} disabled={saving}
              className="flex-1 bg-[#4e7da9] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3b6d9c] disabled:opacity-60 transition-all shadow-md">
              {saving ? "Memproses..." : "Buat Pesanan Sekarang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Export Order Modal ──
function ExportOrderModal({ orders, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [source, setSource] = useState("Semua");
  const [status, setStatus] = useState("Semua");
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      // 1. Filter Data
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.createdAt).setHours(0,0,0,0);
        const sDate = startDate ? new Date(startDate).setHours(0,0,0,0) : null;
        const eDate = endDate ? new Date(endDate).setHours(23,59,59,999) : null;

        const matchStart = !sDate || orderDate >= sDate;
        const matchEnd = !eDate || orderDate <= eDate;
        const matchSource = source === "Semua" || order.source === source;
        const matchStatus = status === "Semua" || order.order_status === status;

        return matchStart && matchEnd && matchSource && matchStatus;
      });

      if (filtered.length === 0) {
        alert("Tidak ada data pesanan yang sesuai dengan filter.");
        setLoading(false);
        return;
      }

      // 2. Map ke Array JSON yang siap di-convert jadi baris Excel
      const dataForExcel = filtered.map(o => {
        let totalItems = 0;
        let productNames = [];
        (o.item_list || o.items || []).forEach(i => {
          totalItems += Number(i.quantity);
          productNames.push(`${i.product_name || i.productName} (x${i.quantity})`);
        });

        return {
          "Order ID": o.order_id || `#${o._id.slice(-6).toUpperCase()}`,
          "Tanggal Transaksi": new Date(o.createdAt).toLocaleDateString("id-ID"),
          "Jam Transaksi": new Date(o.createdAt).toLocaleTimeString("id-ID", { hour: '2-digit', minute:'2-digit' }),
          "Platform": o.source || "Manual",
          "Nama Pembeli": o.shipping_info?.buyer_name || o.customerName || "—",
          "No Telepon": o.shipping_info?.buyer_phone || o.customerPhone || "—",
          "Alamat": o.shipping_info?.buyer_address || o.customerAddress || "—",
          "Produk yang Dibeli": productNames.join(", "),
          "Jml Barang": totalItems,
          "Total Bayar": o.payment_info?.total_amount || o.totalAmount || 0,
          "Status Pesanan": STATUS_LABEL[o.order_status] || o.order_status,
          "Catatan": o.notes || "—"
        };
      });

      // 3. Konversi dan Download
      const ws = XLSX.utils.json_to_sheet(dataForExcel);
      
      // Auto-width columns logic based on content
      const colWidths = [
        { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
        { wch: 18 }, { wch: 30 }, { wch: 40 }, { wch: 10 }, { wch: 15 },
        { wch: 18 }, { wch: 25 }
      ];
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Pesanan");

      const fileName = `Laporan_Pesanan_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(wb, fileName);

      setLoading(false);
      onClose();
    }, 500);
  };

  const inputClass = "w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm focus:border-[#3182ce] focus:ring-1 focus:ring-[#3182ce] outline-none transition-all";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#1e293b]">Export Pesanan</h2>
            <button onClick={onClose} className="text-[#94a3b8] hover:text-[#1e293b] font-bold text-xl">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-2">Pilih Rentang Tanggal</p>
              <div className="flex gap-2 items-center">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
                <span className="text-[#94a3b8] font-bold">-</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
              </div>
              <p className="text-[10px] text-[#94a3b8] mt-1 italic">*kosongkan jika ingin export semua waktu.</p>
            </div>

            <div>
              <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-2">Filter Platform</p>
              <select value={source} onChange={e => setSource(e.target.value)} className={inputClass}>
                <option value="Semua">Semua Platform</option>
                <option value="TikTok">TikTok Shop</option>
                <option value="Manual">Manual (WA/Toko)</option>
                <option value="Instagram">Instagram</option>
                <option value="Tokopedia">Tokopedia</option>
                <option value="Shopee">Shopee</option>
              </select>
            </div>

            <div>
              <p className="text-xs font-bold text-[#1e293b] uppercase tracking-wider mb-2">Filter Status</p>
              <select value={status} onChange={e => setStatus(e.target.value)} className={inputClass}>
                <option value="Semua">Semua Status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s] || s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 border border-[#e2e8f0] text-[#1e293b] font-semibold py-2.5 rounded-xl text-sm hover:bg-[#f8fafc] transition-colors">Batal</button>
            <button onClick={handleExport} disabled={loading}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 focus:ring-4 focus:ring-green-100 disabled:opacity-60 transition-all shadow-md flex items-center justify-center gap-2">
              {loading ? "Memproses..." : <><Download className="h-4 w-4"/> Ekspor Excel</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}