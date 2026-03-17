import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import InventoriPage from "./pages/Inventori.jsx";
import PesananPage from "./pages/Pesanan.jsx";
import AnalitikPage from "./pages/Analitik.jsx";
import SetelanPage from "./pages/Setelan.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analitik"
        element={
          <ProtectedRoute>
            <AnalitikPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventori"
        element={
          <ProtectedRoute>
            <InventoriPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setelan"
        element={
          <ProtectedRoute>
            <SetelanPage />
          </ProtectedRoute>
        }
      />
      <Route path="/pesanan" element={<PesananPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
