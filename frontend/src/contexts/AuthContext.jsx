import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try { return JSON.parse(savedUser); } catch { return null; }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  // Fetch full profile from backend and update local state
  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
        return null;
      }
      const profile = await res.json();
      const userInfo = {
        id: profile._id,
        email: profile.email,
        businessName: profile.businessName || "",
        channels: profile.channels || [],
      };
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);
      return userInfo;
    } catch {
      return null;
    }
  }, []);

  // On mount, if we have a token, fetch latest profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    }
  }, [fetchProfile]);

  const register = useCallback(async (fullName, businessName, email, whatsapp, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, businessName, channels: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registrasi gagal");
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || "Login gagal");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);

      // Fetch full profile after login
      const profile = await fetchProfile();
      if (!profile) {
        const userInfo = { email: identifier, token: data.token };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
      }

      return data;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: "POST" });
    } catch { /* ignore */ }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    getToken,
    fetchProfile,
  }), [user, loading, login, register, logout, getToken, fetchProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}