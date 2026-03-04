import { Link } from "react-router-dom";
import { Button } from "@/component/ui/button";

export default function Pesanan() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 shadow-[0_12px_30px_rgba(16,46,74,0.08)]">
        <h1 className="text-3xl font-bold text-foreground">Halaman Pesanan</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Route pesanan sudah aktif. Konten detail pesanan bisa dilanjutkan di
          tahap berikutnya.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/login">Kembali ke Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Buka Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
