import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import InventoriPage from "./pages/Inventori.jsx";
import PesananPage from "./pages/Pesanan.jsx";
<<<<<<< HEAD
import AnalitikPage from "./pages/Analitik.jsx";
import SetelanPage from "./pages/Setelan.jsx";
=======
import ChannelsPage from "./pages/Channels.jsx";
import LandingPage from "./pages/LandingPage.jsx";
>>>>>>> 093a0760f0a704a3d96b3ec519bf726e3effef2b
import ProtectedRoute from "./component/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
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
<<<<<<< HEAD
        path="/analitik"
        element={
          <ProtectedRoute>
            <AnalitikPage />
=======
        path="/dashboard/channels"
        element={
          <ProtectedRoute>
            <ChannelsPage />
>>>>>>> 093a0760f0a704a3d96b3ec519bf726e3effef2b
          </ProtectedRoute>
        }
      />
      <Route
<<<<<<< HEAD
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
=======
        path="/pesanan"
        element={
          <ProtectedRoute>
            <PesananPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> 093a0760f0a704a3d96b3ec519bf726e3effef2b
    </Routes>
  );
}