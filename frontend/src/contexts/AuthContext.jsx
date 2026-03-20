import { createContext, useContext, useMemo, useState } from "react";

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

  const register = async (fullName, businessName, email, whatsapp, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, businessName, email, whatsapp, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registrasi gagal");
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Support identifier = email atau whatsapp
  const login = async (identifier, password) => {
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
      const userInfo = { email: identifier, token: data.token };
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const getToken = () => localStorage.getItem("token");

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    getToken,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}