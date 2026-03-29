import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Auto-attach Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-extract error message from backend response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan";
    return Promise.reject(new Error(msg));
  }
);

export default api;
export { API_URL };
