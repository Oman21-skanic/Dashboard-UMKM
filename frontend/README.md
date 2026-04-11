# 💻 DashUMKM - Frontend Application

Bagian ini berisi aplikasi antarmuka dari **DashUMKM**. Aplikasi ini dibangun sebagai Single Page Application (SPA) modern yang sangat responsif, menampilkan desain yang cantik, mudah, dan elegan berkat arsitektur berbasis *components*.

## 🛠️ Tech Stack & Library Utama
Proyek frontend dibangun menggunakan teknologi paling mutakhir (2026 standards):
- **Framework**: React.js (v19) via Vite
- **Styling**: Tailwind CSS (v4)
- **UI Components**: Kombinasi Radix UI, Lucide React (untuk ikon).
- **Forms & Data Flow**: React Hook Form berkolaborasi dengan Zod (*schema validation*).
- **Data Fetching**: Axios untuk integrasi REST API backend.
- **Charts / Analitik**: library Recharts untuk melukis grafik visual performa toko secara dinamis.
- **Excel/XLSX Parser**: SheetJS (XLSX) ditarik via CDN untuk mengolah manipulasi format Excel.

## 🗂️ Struktur Folder
- `src/components/` : Komponen antar-muka *reusable* (Kartu, Tombol, Tabel, Modals).
- `src/pages/`      : Tata letak halaman (Dashboard Home, Inventory, Pesanan, dsb).
- `src/api/`        : Konfigurasi Axios dan endpoint.
- `src/hooks/`      : *Custom hooks* React untuk mengelola state lokal maupun logika.

## 🚀 Jalankan di Lokal (Local Development)

**1. Install dependensi:**
```bash
npm install
```

**2. Setup *Environment Variables*:**
Buat file `.env` di atas *root* folder `/frontend` (sejajar dengan package.json)
```env
VITE_API_URL=http://localhost:5000/api
```
*(Sesuaikan port localhost tersebut dengan port yang digunakan di backend Anda)*

**3. Mulai *Dev Server*:**
```bash
npm run dev
```

Aplikasi frontend kemudian dapat dilihat beroperasi secara langsung pada [http://localhost:5173](http://localhost:5173).

---
*Dibangun dengan ❤️ oleh Tim Capstone CC26-PS025*
