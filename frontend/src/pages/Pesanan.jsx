import { useCallback, useEffect, useState } from "react";
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

  const fetchOrders = useCallback(async () => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

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
    } catch {
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
    } catch {
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
      </div>
    </div>
  );
}