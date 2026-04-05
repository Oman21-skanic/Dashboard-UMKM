import { ArrowLeftRight, BarChart3, Bell, Package } from "lucide-react";
import AuthTabs from "@/component/AuthTabs";

const features = [
  {
    title: "Sinkronisasi stok real-time",
    icon: ArrowLeftRight,
  },
  {
    title: "Laporan penjualan otomatis",
    icon: BarChart3,
  },
  {
    title: "Notifikasi stok & pesanan",
    icon: Bell,
  },
];

export default function AuthShell({
  activeTab,
  children,
  showCommunityCard = true,
}) {
  return (
    <div className="min-h-screen bg-(--auth-page-bg) p-3 sm:p-4 lg:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1400px] overflow-visible rounded-[1.75rem] bg-(--auth-right-bg) shadow-[0_30px_80px_rgba(0,0,0,0.42)] lg:grid-cols-[1.05fr_0.95fr] lg:overflow-hidden">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#10375a] px-12 py-11 text-[#f0f4f8] lg:flex">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[rgba(119,157,187,0.18)]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[rgba(119,157,187,0.2)]" />

          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.18)]">
                <Package className="h-6 w-6" />
              </div>
              <p className="text-[1.6rem] leading-none font-semibold tracking-[-0.02em]">
                DashUMKM
              </p>
            </div>

            <div className="max-w-132 space-y-5">
              <h1 className="text-[2.45rem] leading-[1.08] font-semibold tracking-[-0.025em]">
                Kelola bisnis Anda lebih mudah dalam satu tempat
              </h1>
              <p className="text-[0.94rem] leading-[1.45] text-[#b6c6d5]">
                Kelola operasional toko online Anda dari satu platform
                terintegrasi. Mudah, cepat, dan efisien.
              </p>
            </div>

            <div className="space-y-6 pt-1">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-4">
                    <div className="mt-1.5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[rgba(111,148,176,0.3)]">
                      <Icon className="h-5 w-5 text-[#e6edf5]" />
                    </div>
                    <div>
                      <p className="pt-2 text-[0.92rem] leading-tight text-[#eef4f9]">
                        {feature.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={
              showCommunityCard ? "relative z-10" : "relative z-10 h-0"
            }
          >
            {showCommunityCard ? (
              <div className="rounded-[1.85rem] border border-[rgba(175,198,217,0.34)] bg-[rgba(95,134,165,0.35)] px-7 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2.5">
                    {["U", "A", "D", "+"].map((item, index) => (
                      <span
                        key={`${item}-${index}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#123b5f] text-xs font-medium text-white"
                        style={{
                          backgroundColor: [
                            "#4e95eb",
                            "#3bd994",
                            "#f5bf33",
                            "#113d65",
                          ][index],
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[#a7bacd]">
                    Bergabung dengan{" "}
                    <span className="block text-[1.35rem] font-semibold text-[#eaf0f6]">
                      10.000+ UMKM
                    </span>
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        <main className="flex items-start justify-center bg-(--auth-right-bg) px-5 py-8 sm:px-8 lg:items-center lg:px-12">
          <div className="w-full max-w-[620px] space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#123d62] text-[#f2ede3]">
                <Package className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold tracking-[-0.01em] text-[#123d62] lg:text-[2.1rem]">
                DashUMKM
              </p>
            </div>
            <AuthTabs activeTab={activeTab} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
