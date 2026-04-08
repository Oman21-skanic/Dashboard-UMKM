import { Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import InventoriPage from "./pages/Inventori.jsx";
import PesananPage from "./pages/Pesanan.jsx";
import AnalitikPage from "./pages/Analitik.jsx";
import SetelanPage from "./pages/Setelan.jsx";
import ChannelsPage from "./pages/Channels.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import TikTokExportPage from "./pages/TikTokExport.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword.jsx";

export default function App() {
  return (
    <>
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
          path="/analitik"
          element={
            <ProtectedRoute>
              <AnalitikPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/channels"
          element={
            <ProtectedRoute>
              <ChannelsPage />
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
        <Route
          path="/pesanan"
          element={
            <ProtectedRoute>
              <PesananPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tiktok-export"
          element={
            <ProtectedRoute>
              <TikTokExportPage />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </>
  );
}