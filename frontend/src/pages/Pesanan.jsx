import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/apiClient";

// Backend order_status enum
const STATUS_OPTIONS = [
  "UNPAID",
  "AWAITING_SHIPMENT",
  "IN_TRANSIT",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
];

const STATUS_COLORS = {
  UNPAID: "bg-red-100 text-red-700 border border-red-300",
  AWAITING_SHIPMENT: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  AWAITING_COLLECTION: "bg-orange-100 text-orange-700 border border-orange-300",
  IN_TRANSIT: "bg-purple-100 text-purple-700 border border-purple-300",
  DELIVERED: "bg-green-100 text-green-700 border border-green-300",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  CANCELLED: "bg-gray-100 text-gray-500 border border-gray-300",
};

const STATUS_LABEL = {
  UNPAID: "Belum Bayar",
  AWAITING_SHIPMENT: "Menunggu Kirim",
  AWAITING_COLLECTION: "Siap Diambil",
  IN_TRANSIT: "Dalam Perjalanan",
  DELIVERED: "Diterima",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const SOURCE_COLORS = {
  Manual: "bg-gray-100 text-gray-700",
  TikTok: "bg-black text-white",
  Instagram: "bg-pink-100 text-pink-700",
  Tokopedia: "bg-green-100 text-green-700",
};

const ITEMS_PER_PAGE = 10;

export default function Pesanan() {
  const navigate = useNavigate();

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

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get("/api/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Filter & search using BE field names
  const filtered = orders
    .filter(o => !filterStatus || o.order_status === filterStatus)
    .filter(o => !filterSource || o.source === filterSource)
    .filter(o => !search || (o.shipping_info?.buyer_name || o.customerName || "").toLowerCase().includes(search.toLowerCase()))
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Daftar Pesanan</h1>
            <p className="text-gray-500 text-sm">Kelola semua pesanan kamu di sini</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/dashboard")} className="text-sm text-gray-500 hover:text-gray-700">
              ← Dashboard
            </button>
            <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
              + Buat Pesanan
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === "success" ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-3 font-bold">✕</button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
          <input type="text" placeholder="Cari nama pembeli..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]" />
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s] || s}</option>)}
          </select>
          <select value={filterSource} onChange={e => { setFilterSource(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua Source</option>
            <option value="Manual">Manual</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="Tokopedia">Tokopedia</option>
          </select>
          <button onClick={() => setSortDesc(prev => !prev)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
            Tanggal {sortDesc ? "↓" : "↑"}
          </button>
        </div>

        {/* Table */}
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
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Pembeli</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Total</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Source</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-medium">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(order => (
                    <tr key={order._id} onClick={() => setSelectedOrder(order)}
                      className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {order.order_id || `#${order._id.slice(-6).toUpperCase()}`}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {order.shipping_info?.buyer_name || order.customerName || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        Rp {(order.payment_info?.total_amount || order.totalAmount || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.order_status] || "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABEL[order.order_status] || order.order_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${SOURCE_COLORS[order.source] || "bg-gray-100 text-gray-600"}`}>
                          {order.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">Halaman {page} dari {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50">← Prev</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50">Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Detail Order {selectedOrder.order_id || `#${selectedOrder._id.slice(-6).toUpperCase()}`}
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="font-semibold text-gray-800 mb-2">Info Pembeli</p>
                <p className="text-sm text-gray-600">👤 {selectedOrder.shipping_info?.buyer_name || selectedOrder.customerName}</p>
                <p className="text-sm text-gray-600">📞 {selectedOrder.shipping_info?.buyer_phone || selectedOrder.customerPhone || "—"}</p>
                <p className="text-sm text-gray-600">📍 {selectedOrder.shipping_info?.buyer_address || selectedOrder.customerAddress || "—"}</p>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-800 mb-2">Item Pesanan</p>
                <div className="space-y-2">
                  {(selectedOrder.item_list || selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-700">{item.product_name || item.productName} x{item.quantity}</span>
                      <span className="font-medium">Rp {(item.subtotal || 0).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-gray-800 mt-3 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>Rp {(selectedOrder.payment_info?.total_amount || selectedOrder.totalAmount || 0).toLocaleString("id-ID")}</span>
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
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => handleUpdateStatus(selectedOrder._id, s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                        selectedOrder.order_status === s
                          ? (STATUS_COLORS[s] || "") + " ring-2 ring-offset-1"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}>
                      {STATUS_LABEL[s] || s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedOrder(null)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50">
                  Tutup
                </button>
                {canDelete(selectedOrder.order_status) && (
                  <button onClick={() => handleDelete(selectedOrder._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm hover:bg-red-600">
                    Hapus Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
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
    notes: "", source: "Manual",
  });
  const [items, setItems] = useState([{ sku_id: "", product_name: "", quantity: 1, price: 0, subtotal: 0 }]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
    if (!form.buyer_name || !form.buyer_phone || !form.buyer_address)
      return setError("Nama, telepon, dan alamat wajib diisi!");
    if (items.some(i => !i.product_name || i.quantity < 1 || i.price < 1))
      return setError("Lengkapi semua item pesanan!");

    setSaving(true);
    try {
      await api.post("/api/orders", {
        order_id: `ORD-MANUAL-${Date.now()}`,
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Buat Pesanan Baru</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          {error && <div className="mb-4 px-4 py-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          <div className="space-y-3">
            <input placeholder="Nama Pembeli *" value={form.buyer_name}
              onChange={e => setForm({ ...form, buyer_name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="No. Telepon *" value={form.buyer_phone}
              onChange={e => setForm({ ...form, buyer_phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <textarea placeholder="Alamat *" value={form.buyer_address}
              onChange={e => setForm({ ...form, buyer_address: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} />
            <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
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
                  <div className="flex gap-2">
                    <input placeholder="SKU (opsional)" value={item.sku_id}
                      onChange={e => updateItem(i, "sku_id", e.target.value)}
                      className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    <input placeholder="Nama Produk *" value={item.product_name}
                      onChange={e => updateItem(i, "product_name", e.target.value)}
                      className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Qty" min={1} value={item.quantity}
                      onChange={e => updateItem(i, "quantity", Number(e.target.value))}
                      className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    <input type="number" placeholder="Harga" min={0} value={item.price}
                      onChange={e => updateItem(i, "price", Number(e.target.value))}
                      className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    <div className="w-1/3 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-500">
                      Rp {item.subtotal.toLocaleString("id-ID")}
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                      className="text-red-500 text-xs hover:underline">Hapus item</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setItems([...items, { sku_id: "", product_name: "", quantity: 1, price: 0, subtotal: 0 }])}
              className="mt-2 text-blue-600 text-sm hover:underline">+ Tambah Item</button>
          </div>

          <div className="flex justify-between font-bold text-gray-800 mt-4 pt-4 border-t border-gray-200">
            <span>Total</span>
            <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
          </div>

          <textarea placeholder="Catatan (opsional)" value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-3" rows={2} />

          <div className="flex gap-3 mt-4">
            <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50">Batal</button>
            <button onClick={handleSubmit} disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-60">
              {saving ? "Menyimpan..." : "Buat Pesanan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}