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
  // Mulai dengan true jika ada token → tunggu validasi selesai dulu
  // supaya ProtectedRoute tidak redirect ke login sebelum sesi terkonfirmasi
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));

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
        fullName: data.fullName || "",
        businessName: data.businessName || "",
        phoneNumber: data.phoneNumber || "",
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

  // Validasi token saat app pertama kali load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const sendRegisterOTP = useCallback(async (email) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register/send-otp`, { email });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Gagal mengirim OTP pendaftaran");
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyRegisterOTP = useCallback(async (email, otp) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register/verify-otp`, { email, otp });
      return data; // returns { token }
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Gagal memverifikasi OTP");
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (fullName, businessName, email, whatsapp, password, token) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        email, password, fullName, businessName, phoneNumber: whatsapp, token, channels: [],
      });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  }, []);

  const sendForgotPasswordOTP = useCallback(async (email) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/forgot-password/send-otp`, { email });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Gagal mengirim OTP");
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyForgotPasswordOTP = useCallback(async (email, otp) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/forgot-password/verify-otp`, { email, otp });
      return data; // returns { token }
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Gagal memverifikasi OTP");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email, token, newPassword) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/forgot-password/reset`, { email, token, newPassword });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Gagal mereset password");
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
      setLoading(false); // loading selesai setelah proses login
    }
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    try { await axios.post(`${API_URL}/api/auth/logout`); } catch { /* ok */ }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    const token = getToken();
    try {
      const { data } = await axios.put(`${API_URL}/api/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const info = {
        id: data.user._id,
        email: data.user.email,
        fullName: data.user.fullName || "",
        businessName: data.user.businessName || "",
        phoneNumber: data.user.phoneNumber || "",
        channels: data.user.channels || [],
      };
      localStorage.setItem("user", JSON.stringify(info));
      setUser(info);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const updatePassword = useCallback(async (oldPassword, newPassword) => {
    setLoading(true);
    const token = getToken();
    try {
      const { data } = await axios.put(`${API_URL}/api/auth/password`, { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Gagal memperbarui password");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const value = useMemo(() => ({
    user, isAuthenticated: Boolean(user), loading,
    login, register, logout, getToken, fetchProfile, updateProfile, updatePassword,
    sendRegisterOTP, verifyRegisterOTP, sendForgotPasswordOTP, verifyForgotPasswordOTP, resetPassword
  }), [user, loading, login, register, logout, getToken, fetchProfile, updateProfile, updatePassword,
    sendRegisterOTP, verifyRegisterOTP, sendForgotPasswordOTP, verifyForgotPasswordOTP, resetPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}