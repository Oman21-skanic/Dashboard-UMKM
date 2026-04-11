# ⚙️ DashUMKM - Backend Server / API

Ini adalah kode backend server untuk menopang platform **DashUMKM**. Backend ini bertanggung jawab menangkap koneksi klien, meverifikasi keamanan berbasis JWT, menyimpan inventaris pesanan, hingga mengeksekusi layanan pengolahan template dokumen dari *marketplace*.

## 🛠️ Tech Stack & Modul Utama
- **Runtime**: Node.js
- **Web Framework**: Express (v5.2.1)
- **Database**: MongoDB (dipetakan dengan ODM Mongoose)
- **Authentication**: JsonWebToken (JWT) + bcryptjs (Hashing Password).
- **Keamanan Lengkap**: Helmet, cors, express-rate-limit, hpp, mongo-sanitize (Mencegah ancaman serangan NoSQL injection dan DDoS).
- **Engine "Template Assistant"**: ExcelJS dan *xlsx-populate* untuk membedah/menulis struktur dokumen template dari TikTok Shop.
- **Testing**: Jest & Supertest untuk uji integritas endpoints *integration test*.

## 🚀 Cara Menjalankan Backend Secara Lokal

**1. Install Modul Meringkas via NPM:**
```bash
npm install
```

**2. Setup File `.env`:**
Buat salinan atau file baru dengan nama `.env` di dalam folder `backend` ini dengan isian berikut:
```env
# Server
PORT=5000
NODE_ENV=development

# Database Access URL
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_URL>/namadb

# JWT Authorization
JWT_SECRET=super_rahasia_dan_aman_key_anda
JWT_EXPIRE=7d
```

**3. Nyalakan Server Development:**
Untuk mengaktifkan fitur server yang menyala otomatis setiap ada modifikasi kode (menggunakan Nodemon):
```bash
npm run dev
```
Jika berhasil, terminal akan menampilkan konfirmasi "Terhubung ke MongoDB". Server utama berjalan di `http://localhost:5000`.

## 🧪 Panduan Testing
Anda dapat menggunakan fitur *Integration Testing* kami untuk menjamin kualitas rute endpoints inventaris:
```bash
npm run test
```

---
*Dibangun dengan ❤️ oleh Tim Capstone CC26-PS025*