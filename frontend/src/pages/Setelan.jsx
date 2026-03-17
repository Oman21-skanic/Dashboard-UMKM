import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarContent from "@/component/SidebarContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/component/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

export default function Setelan() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.businessName || user?.fullName || "Ujang Santosa";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#fffcf5] text-[#102e4a]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-[#102e4a] text-white md:flex">
          <SidebarContent
            displayName={displayName}
            initials={initials}
            onLogout={handleLogout}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#f1f5f9] bg-[#fffcf5]/80 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="hidden flex-col gap-1 md:flex">
                <div className="text-xs font-semibold text-[#64748b]">
                  DashUMKM / <span className="text-[#3182ce]">Setelan</span>
                </div>
                <h1 className="text-2xl font-semibold text-[#0f172a]">
                  Setelan
                </h1>
              </div>

              <div className="flex items-center gap-3 md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b]"
                      aria-label="Buka menu"
                    >
                      <Menu className="h-4 w-4" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-72 border-r-0 bg-[#102e4a] p-0 text-white"
                  >
                    <SidebarContent
                      displayName={displayName}
                      initials={initials}
                      onLogout={handleLogout}
                      CloseWrapper={SheetClose}
                    />
                  </SheetContent>
                </Sheet>
                <div>
                  <p className="text-[0.65rem] font-semibold text-[#94a3b8]">
                    DashUMKM
                  </p>
                  <h1 className="text-sm font-semibold text-[#0f172a]">
                    Setelan
                  </h1>
                </div>
              </div>
            </div>
          </header>

          <main className="px-5 py-6 md:px-8">
            <div className="mx-auto w-full max-w-3xl">
              <Card className="border-[#f1f5f9] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-[#1e293b]">
                    Pengaturan
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[#94a3b8]">
                  Halaman pengaturan sedang disiapkan.
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
