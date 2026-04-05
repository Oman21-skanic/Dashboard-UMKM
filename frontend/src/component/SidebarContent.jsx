import {
  Archive,
  ClipboardList,
  FileSpreadsheet,
  Home,
  LineChart,
  Package,
  Settings,
  Store,
} from "lucide-react";
import { NavLink } from "@/component/NavLink";
import { Button } from "@/component/ui/button";
import TikTokIcon from "@/component/TikTokIcon";

const mainNav = [
  { label: "Beranda", icon: Home, to: "/dashboard" },
  { label: "Pesanan", icon: ClipboardList, to: "/pesanan" },
  { label: "Inventori", icon: Archive, to: "/inventori" },
  { label: "Analitik", icon: LineChart, to: "/analitik" },
];



const toolsNav = [
  {
    label: "TikTok Export/Import",
    icon: FileSpreadsheet,
    to: "/tiktok-export",
  },
];

const miscNav = [{ label: "Setelan", icon: Settings, to: "/setelan" }];

function SidebarNavItem({ item, CloseWrapper }) {
  const Icon = item.icon;
  const content = item.disabled ? (
    <div className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/50">
      <Icon className="h-4 w-4" />
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
          {item.badge}
        </span>
      ) : null}
    </div>
  ) : (
    <NavLink
      to={item.to}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      activeClassName="bg-white/10 text-white"
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1">{item.label}</span>
      {item.badge ? (
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs text-white/80">
          {item.badge}
        </span>
      ) : null}
    </NavLink>
  );

  if (!CloseWrapper || item.disabled) {
    return content;
  }

  return <CloseWrapper asChild>{content}</CloseWrapper>;
}

export default function SidebarContent({
  displayName,
  initials,
  onLogout,
  CloseWrapper,
}) {
  return (
    <div className="flex h-full flex-col px-5 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
          <Package className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold">DashUMKM</p>
          <p className="text-xs text-white/60">Control Center</p>
        </div>
      </div>

      <div className="mt-8">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Utama
        </p>
        <nav className="mt-4 space-y-1">
          {mainNav.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              CloseWrapper={CloseWrapper}
            />
          ))}
        </nav>
      </div>


      <div className="mt-6">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Alat
        </p>
        <nav className="mt-4 space-y-1">
          {toolsNav.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              CloseWrapper={CloseWrapper}
            />
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Lainnya
        </p>
        <nav className="mt-4 space-y-1">
          {miscNav.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              CloseWrapper={CloseWrapper}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-white/60">Pemilik Toko</p>
          </div>
        </div>
        {CloseWrapper ? (
          <CloseWrapper asChild>
            <Button
              onClick={onLogout}
              variant="ghost"
              className="mt-4 h-10 w-full justify-start rounded-xl bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              Keluar
            </Button>
          </CloseWrapper>
        ) : (
          <Button
            onClick={onLogout}
            variant="ghost"
            className="mt-4 h-10 w-full justify-start rounded-xl bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            Keluar
          </Button>
        )}
      </div>
    </div>
  );
}
