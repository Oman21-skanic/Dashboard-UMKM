import { Link } from "react-router-dom";
import { cn } from "@/utils/utils";

export default function AuthTabs({ activeTab }) {
  return (
    <div className="auth-tab-shell">
      <div className="grid grid-cols-2 gap-1">
        <Link
          to="/login"
          className={cn(
            "auth-tab-item",
            activeTab === "login" ? "auth-tab-item-active" : "auth-tab-item-inactive",
          )}
        >
          Masuk
        </Link>
        <Link
          to="/register"
          className={cn(
            "auth-tab-item",
            activeTab === "register" ? "auth-tab-item-active" : "auth-tab-item-inactive",
          )}
        >
          Daftar
        </Link>
      </div>
    </div>
  );
}
