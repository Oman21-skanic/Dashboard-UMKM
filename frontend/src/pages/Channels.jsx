import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function useParamMessage() {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const s = searchParams.get("success");
    const e = searchParams.get("error");
    if (s === "tiktok_connected")
      return {
        type: "success",
        text: "✅ TikTok berhasil terhubung!",
        connected: true,
      };
    if (e === "tiktok_auth_rejected")
      return {
        type: "error",
        text: "❌ Kamu membatalkan koneksi TikTok.",
        connected: false,
      };
    if (e === "token_exchange_failed")
      return {
        type: "error",
        text: "❌ Koneksi TikTok gagal. Coba lagi.",
        connected: false,
      };
    return null;
  }, [searchParams]);
}

export default function ChannelsPage() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const paramMsg = useParamMessage();

  const [tiktokStatus, setTiktokStatus] = useState(() =>
    paramMsg?.connected ? "connected" : null,
  );
  const [tiktokShopId, setTiktokShopId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState(() => paramMsg);

  const cleaned = useRef(false);
  useEffect(() => {
    if (paramMsg && !cleaned.current) {
      cleaned.current = true;
      navigate("/dashboard/channels", { replace: true });
    }
  }, [paramMsg, navigate]);

  useEffect(() => {
    let ignore = false;
    const fetchProfile = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const { data } = await axios.get(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ignore) return;
        const ch = data.channels?.find((c) => c.platform === "tiktok");
        if (ch) {
          setTiktokStatus("connected");
          setTiktokShopId(ch.tiktokShopId);
        } else if (!paramMsg?.connected) {
          setTiktokStatus("disconnected");
        }
      } catch {
        if (!ignore && !paramMsg?.connected) setTiktokStatus("disconnected");
      }
    };
    fetchProfile();
    return () => {
      ignore = true;
    };
  }, [getToken, paramMsg]);

  const handleConnect = () => {
    const token = getToken();
    if (!token) {
      setMessage({ type: "error", text: "❌ Kamu harus login dulu." });
      return;
    }
    setIsConnecting(true);
    window.location.href = `${API_URL}/api/auth/tiktok?token=${token}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Kelola Channel
        </h1>
        <p className="text-gray-500 mb-8">
          Hubungkan toko online kamu di sini.
        </p>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
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
                  onClick={handleConnect}
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
