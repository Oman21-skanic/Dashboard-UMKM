import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ChannelsPage() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tiktokStatus, setTiktokStatus] = useState(null); // null | "connected" | "disconnected"
  const [tiktokShopId, setTiktokShopId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text: string }

  // 1. Cek status koneksi TikTok dari backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { "x-auth-token": token },
        });
        const data = await res.json();

        const tiktokChannel = data.channels?.find(ch => ch.platform === "tiktok");
        if (tiktokChannel) {
          setTiktokStatus("connected");
          setTiktokShopId(tiktokChannel.tiktokShopId);
        } else {
          setTiktokStatus("disconnected");
        }
      } catch (err) {
        console.error(err);
        setTiktokStatus("disconnected");
      }
    };

    fetchProfile();
  }, []);

  // 2. Cek query params dari callback TikTok
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "tiktok_connected") {
      setMessage({ type: "success", text: "✅ TikTok berhasil terhubung!" });
      setTiktokStatus("connected");
    } else if (error === "tiktok_auth_rejected") {
      setMessage({ type: "error", text: "❌ Kamu membatalkan koneksi TikTok." });
    } else if (error === "token_exchange_failed") {
      setMessage({ type: "error", text: "❌ Koneksi TikTok gagal. Coba lagi." });
    }

    // Bersihkan query params dari URL
    if (success || error) {
      navigate("/dashboard/channels", { replace: true });
    }
  }, [searchParams]);

  // 3. Handle klik tombol Connect TikTok
  const handleConnectTikTok = () => {
    const token = getToken();
    if (!token) {
      setMessage({ type: "error", text: "❌ Kamu harus login dulu." });
      return;
    }
    setIsConnecting(true);
    // Redirect ke backend yang akan redirect ke TikTok OAuth
    window.location.href = `${API_URL}/api/auth/tiktok?token=${token}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Channel</h1>
        <p className="text-gray-500 mb-8">Hubungkan toko online kamu di sini.</p>

        {/* Notifikasi success/error */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message.text}
          </div>
        )}

        {/* Card TikTok */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* TikTok Icon */}
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">TikTok Shop</h2>
                {tiktokStatus === "connected" && tiktokShopId ? (
                  <p className="text-sm text-gray-500">ID: {tiktokShopId}</p>
                ) : (
                  <p className="text-sm text-gray-500">Belum terhubung</p>
                )}
              </div>
            </div>

            {/* Tombol aksi */}
            <div>
              {tiktokStatus === null && (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              )}

              {tiktokStatus === "connected" && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  ✅ Terhubung
                </span>
              )}

              {tiktokStatus === "disconnected" && (
                <button
                  onClick={handleConnectTikTok}
                  disabled={isConnecting}
                  className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menghubungkan...
                    </>
                  ) : (
                    "Hubungkan TikTok"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tombol kembali ke dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          ← Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}