import { ClipboardList, LayoutDashboard, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/utils";

const items = [
  {
    key: "login",
    label: "Login",
    to: "/login",
    icon: LogIn,
  },
  {
    key: "dashboard",
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "pesanan",
    label: "Pesanan",
    to: "/pesanan",
    icon: ClipboardList,
  },
];

export default function AuthBottomNav({ activeItem = "login" }) {
  return (
    <nav className="pt-4 lg:pt-6">
      <div className="mx-auto flex w-fit items-center gap-1 rounded-full bg-[#0f3558] p-1.5 shadow-[0_10px_25px_rgba(8,30,50,0.28)]">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.to}
              className={cn(
                "auth-bottom-nav-item",
                activeItem === item.key && "auth-bottom-nav-item-active",
              )}
            >
              <Icon className="h-[1em] w-[1em] shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
