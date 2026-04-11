# 🏪 DashUMKM (Unified Seller Dashboard - UMKM Edition)

**DashUMKM** adalah platform dashboard terpusat yang dirancang khusus untuk memajukan Usaha Mikro Kecil Menengah (UMKM) di Indonesia. Platform ini mempermudah penjual (*seller*) multi-channel (TikTok Shop, Instagram, Shopee, Tokopedia) mengelola pesanan, stok, dan analitik data.

Dibangun sebagai bagian dari **Capstone Project Coding Camp 2026**, proyek ini fokus menyelesaikan masalah *overselling* dan rumitnya *order management* di banyak platform. Inovasi utamanya adalah **TikTok Template Assistant**, sebuah engine berbasis parser file `.xlsx` yang mampu mengotomatiskan siklus ekspor/impor pesanan tanpa harus mewajibkan UMKM mengurus perizinan badan usaha (PT/CV) untuk integrasi Direct API e-commerce asli.

---

## ⚡ Fitur Utama (Core Features)

1. **Smart Import/Export dengan XLSX Parser**
   - Import pesanan via file Excel standar dari TikTok Shop.
   - Pengecekan data otomatis dan pencegahan duplikasi *order*.
2. **Auto-Inventory Deduction**
   - Memotong stok inventaris secara *real-time* begitu pesanan masuk dari hasil sinkronisasi template.
   - Mencegah insiden kelebihan pesanan (*overselling*).
3. **Real-time Analytics Dashboard**
   - Menghitung margin laba dan rugi secara otomatis.
   - Melacak performa produk (*best seller* vs produk yang lambat terjual).

---

## 🏗️ Struktur Repositori

Proyek ini dibangun menggunakan arsitektur monorepo sederhana yang dipisahkan ke dalam folder *frontend* dan *backend*.

- **`/frontend`** : Antarmuka website pengguna (SPA) dibangun menggunakan **React 19**, **Vite**, **Tailwind CSS 4**, dan **Radix UI**.
- **`/backend`** : Server pemroses logika, otentikasi (JWT), database, dan *parser engine* menggunakan **Node.js**, **Express 5**, dan **MongoDB Atlas**.

(Silakan navigasi ke folder masing-masing untuk panduan instalasi mendalam).

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### Syarat Pemasangan (Prerequisites)
Pastikan hal berikut sudah terinstal di sistem Anda:
- Node.js (Versi 18+ disarankan)
- NPM atau Yarn
- MongoDB / URL MongoDB Atlas

### 1. Kloning Repositori
```bash
git clone https://github.com/Oman21-skanic/Dashboard-UMKM.git
cd Dashboard-UMKM
```

### 2. Setup Server Backend
```bash
cd backend
npm install
cp .env.example .env  # (Isi dengan konfigurasi MongoDB dan JWT Key Anda)
npm run dev
```

### 3. Setup Server Frontend
Buka terminal baru (*tab* baru) di luar folder backend:
```bash
cd frontend
npm install
npm run dev
```

Anda dapat mengakses website melalui browser di tautan `http://localhost:5173`.

---

## Tim Capstone (CC26-PS025)
- **Muhamad Abdul Rohman** (CFS022D6Y114)
- **Raissa Wulan Noviana** (CFS022D6X218)
- **Reyhan Septianto Ramadhan** (CFS022D6Y219)
- **Nasya Fauziyyah** (CFS022D6X226)
- **Keysha Desmayanti** (CFS022D6X228)
