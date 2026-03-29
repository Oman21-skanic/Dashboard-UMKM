import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("user");
    if (token && saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const info = {
        id: data._id,
        email: data.email,
        businessName: data.businessName || "",
        channels: data.channels || [],
      };
      localStorage.setItem("user", JSON.stringify(info));
      setUser(info);
      return info;
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
      return null;
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) fetchProfile();
  }, [fetchProfile]);

  const register = useCallback(async (fullName, businessName, email, whatsapp, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        email, password, businessName, channels: [],
      });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email: identifier, password,
      });
      localStorage.setItem("token", data.token);
      const profile = await fetchProfile();
      if (!profile) {
        const info = { email: identifier };
        localStorage.setItem("user", JSON.stringify(info));
        setUser(info);
      }
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Login gagal");
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    try { await axios.post(`${API_URL}/api/auth/logout`); } catch { /* ok */ }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  const value = useMemo(() => ({
    user, isAuthenticated: Boolean(user), loading,
    login, register, logout, getToken, fetchProfile,
  }), [user, loading, login, register, logout, getToken, fetchProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}