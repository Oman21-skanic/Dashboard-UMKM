# Dokumentasi Backend DashUMKM

Dokumentasi ini ditulis untuk mempermudah tim frontend menjalankan backend secara lokal, memahami kontrak API, lalu menghubungkan frontend ke backend tanpa tebak-tebakan.

## 1. Ringkasan

Backend menggunakan stack berikut:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- TikTok OAuth (PKCE)

Base URL default backend:
- `http://localhost:5000`

Base URL frontend default (untuk CORS):
- `http://localhost:5173`

Health check endpoint:
- `GET /api/health`

---

## 2. Struktur Folder Backend

```text
backend/
  server.js
  package.json
  routes/
    auth.js
    tiktokAuth.js
    orders.js
    inventory.js
  middleware/
    authenticateToken.js
  models/
    User.js
    Order.js
    Inventory.js
  utils/
    encryption.js
```

Penjelasan singkat:
- `server.js`: entrypoint aplikasi, setup Express, CORS, koneksi MongoDB, mount routes.
- `routes/`: definisi endpoint API.
- `middleware/authenticateToken.js`: verifikasi JWT untuk endpoint protected.
- `models/`: skema data MongoDB.
- `utils/encryption.js`: enkripsi/dekripsi token TikTok.

---

## 3. Prasyarat Menjalankan Backend

Pastikan sudah terpasang:
- Node.js (disarankan versi LTS terbaru)
- npm
- MongoDB (lokal atau cloud, misalnya MongoDB Atlas)

---

## 4. Setup Backend Lokal (Step-by-Step)

### 4.1 Masuk ke folder backend

```bash
cd Dashboard-UMKM/backend
```

### 4.2 Install dependencies

```bash
npm install
```

### 4.3 Buat file environment `.env`

Buat file `.env` di folder backend, lalu isi seperti contoh berikut:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dashumkm
FRONTEND_URL=http://localhost:5173
JWT_SECRET=ganti_dengan_secret_yang_aman

# TikTok OAuth (opsional kalau belum integrasi TikTok)
CLIENT_KEY=isi_dari_tiktok_developer
CLIENT_SECRET=isi_dari_tiktok_developer
TIKTOK_REDIRECT_URI=http://localhost:5000/api/auth/tiktok/callback

# Enkripsi token TikTok
ENCRYPTION_KEY=ganti_dengan_kunci_aman
```

Catatan penting:
- `MONGO_URI` wajib ada. Tanpa ini backend gagal konek DB.
- `JWT_SECRET` wajib diisi untuk token yang aman.
- `FRONTEND_URL` harus sama dengan origin frontend agar CORS tidak error.
- `CLIENT_KEY`, `CLIENT_SECRET`, `TIKTOK_REDIRECT_URI` wajib jika fitur TikTok dipakai.

### 4.4 Jalankan backend

```bash
npm run dev
```

Expected log jika berhasil:
- `Koneksi database berhasil terhubung.`
- `Server berjalan pada port 5000`

### 4.5 Verifikasi backend aktif

Buka:
- `http://localhost:5000/api/health`

Response yang diharapkan:
- `API is healthy`

---

## 5. Alur Request dan Authentication

### 5.1 Login flow

1. Frontend kirim `POST /api/auth/login` dengan email + password.
2. Backend validasi user dan password.
3. Backend mengembalikan JWT token.
4. Frontend simpan token (contoh: `localStorage`).
5. Untuk endpoint protected, frontend wajib kirim header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### 5.2 Middleware auth

Middleware `authenticateToken` melakukan:
- Ambil token dari header `authorization`.
- Verifikasi dengan `JWT_SECRET`.
- Jika valid, set `req.user` dari payload JWT.

Error auth:
- `401` jika token tidak ada: `Akses ditolak, token tidak ada`
- `403` jika token invalid/expired: `Token tidak valid`

---

## 6. Data Contract (Schema Inti)

### 6.1 User

Field utama:
- `email` (string, unique, required)
- `password` (string, required, hashed)
- `businessName` (string)
- `channels` (array)

`channels` item:
- `platform`
- `tiktokShopId`
- `accessToken` (terenkripsi)
- `refreshToken` (terenkripsi)
- `expiresAt`

### 6.2 Order

Field utama:
- `user` (ObjectId, ref User)
- `customerName` (required)
- `customerPhone` (required)
- `customerAddress` (required)
- `items[]` (required)
- `totalAmount` (required)
- `status` enum: `Pending | Processing | Shipped | Delivered`
- `source` enum: `Manual | TikTok | Instagram | Tokopedia`
- `notes`

### 6.3 Inventory

Field utama:
- `user` (ObjectId, ref User)
- `name` (required)
- `sku` (required)
- `category` (required)
- `price` (required)
- `stock` (required)
- `imageUrl` (default `""`)
- `description` (default `""`)

---

## 7. Referensi Endpoint Lengkap

## 7A. Auth

### 7A.1 Register

- Method: `POST`
- Path: `/api/auth/register`
- Auth: Tidak perlu

Request body:

```json
{
  "email": "user@mail.com",
  "password": "password123",
  "businessName": "Toko Berkah",
  "channels": []
}
```

Validasi:
- Email harus valid format.
- Password minimal 8 karakter.
- Email tidak boleh duplikat.

Success response:
- Status: `201`

```json
{
  "msg": "User berhasil didaftarkan!"
}
```

Error umum:
- `400` format email salah
- `400` password < 8
- `400` email sudah terdaftar
- `500` server error

---

### 7A.2 Login

- Method: `POST`
- Path: `/api/auth/login`
- Auth: Tidak perlu

Request body:

```json
{
  "email": "user@mail.com",
  "password": "password123"
}
```

Success response:
- Status: `200`

```json
{
  "token": "<JWT_TOKEN>",
  "msg": "Login berhasil"
}
```

Error umum:
- `400` email tidak terdaftar
- `400` password salah
- `500` server error

---

### 7A.3 Profile

- Method: `GET`
- Path: `/api/auth/profile`
- Auth: Perlu JWT

Header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Success response:
- Status: `200`
- Body: object user tanpa password

Error umum:
- `401` token tidak ada
- `403` token invalid
- `404` user tidak ditemukan
- `500` server error

---

### 7A.4 Logout

- Method: `POST`
- Path: `/api/auth/logout`
- Auth: Tidak perlu

Success response:

```json
{
  "msg": "Logout berhasil"
}
```

Catatan:
- Logout bersifat stateless. Frontend tetap perlu hapus token dari storage.

---

### 7A.5 Refresh Token

- Method: `POST`
- Path: `/api/auth/refresh`
- Auth: Tidak perlu (token lama dikirim di body)

Request body:

```json
{
  "token": "<OLD_JWT_TOKEN>"
}
```

Success response:
- Status: `200`

```json
{
  "token": "<NEW_JWT_TOKEN>"
}
```

Error umum:
- `401` token tidak dikirim
- `403` token invalid

---

### 7A.6 Forgot Password

- Method: `POST`
- Path: `/api/auth/forgot-password`
- Status: stub, belum implementasi reset password

Response saat ini:

```json
{
  "msg": "Fitur forgot password sedang dikembangkan"
}
```

---

## 7B. TikTok OAuth

### 7B.1 Inisiasi OAuth TikTok

- Method: `GET`
- Path: `/api/auth/tiktok?token=<JWT_USER>`
- Auth: via query token JWT

Behavior:
- Verifikasi JWT dari query param.
- Generate `state` + PKCE (`code_verifier`, `code_challenge`).
- Redirect ke halaman otorisasi TikTok.

Error umum:
- `401` token tidak ada
- `401` token tidak valid

### 7B.2 Callback TikTok

- Method: `GET`
- Path: `/api/auth/tiktok/callback`

Behavior:
1. Verifikasi state.
2. Exchange `code` ke TikTok token API.
3. Encrypt access token + refresh token.
4. Simpan ke `user.channels` platform `tiktok`.
5. Redirect kembali ke frontend.

Redirect sukses:
- `${FRONTEND_URL}/dashboard/channels?success=tiktok_connected`

Redirect gagal:
- `${FRONTEND_URL}/dashboard/channels?error=tiktok_auth_rejected`
- `${FRONTEND_URL}/dashboard/channels?error=token_exchange_failed`

---

## 7C. Orders

Semua endpoint Orders membutuhkan header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### 7C.1 Ambil semua order

- Method: `GET`
- Path: `/api/orders`

Success:
- Status `200`
- Body: array order

### 7C.2 Buat order baru

- Method: `POST`
- Path: `/api/orders`

Request body:

```json
{
  "customerName": "Andi",
  "customerPhone": "081234567890",
  "customerAddress": "Jl. Mawar No. 10",
  "items": [
    {
      "productName": "Produk A",
      "quantity": 2,
      "price": 50000,
      "subtotal": 100000
    }
  ],
  "notes": "Kirim cepat",
  "source": "Manual"
}
```

Validasi:
- `customerName`, `customerPhone`, `customerAddress`, `items` wajib.
- `items` tidak boleh kosong.
- `totalAmount` dihitung dari penjumlahan `items.subtotal`.

Success:
- Status `201`
- Body: objek order baru

### 7C.3 Update status order

- Method: `PUT`
- Path: `/api/orders/:id/status`

Request body:

```json
{
  "status": "Shipped"
}
```

Success:
- Status `200`
- Body: objek order yang sudah di-update

Error umum:
- `404` order tidak ditemukan

### 7C.4 Hapus order

- Method: `DELETE`
- Path: `/api/orders/:id`

Rules:
- Hanya order dengan status `Pending` yang bisa dihapus.

Success:

```json
{
  "msg": "Order berhasil dihapus"
}
```

Error umum:
- `404` order tidak ditemukan
- `400` status order bukan Pending

---

## 7D. Inventory

Semua endpoint Inventory membutuhkan header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### 7D.1 Ambil semua inventory

- Method: `GET`
- Path: `/api/inventory`

Success:
- Status `200`
- Body: array item inventory

### 7D.2 Tambah item inventory

- Method: `POST`
- Path: `/api/inventory`

Request body:

```json
{
  "name": "Produk A",
  "sku": "SKU-001",
  "category": "Makanan",
  "price": 25000,
  "stock": 100,
  "imageUrl": "",
  "description": "Produk contoh"
}
```

Validasi:
- `name`, `sku`, `category`, `price`, `stock` wajib.

Success:
- Status `201`
- Body: objek inventory baru

### 7D.3 Update item inventory

- Method: `PUT`
- Path: `/api/inventory/:id`

Request body bersifat partial update (boleh kirim sebagian field).

Success:
- Status `200`
- Body: objek item ter-update

Error umum:
- `404` produk tidak ditemukan

### 7D.4 Hapus item inventory

- Method: `DELETE`
- Path: `/api/inventory/:id`

Success:

```json
{
  "msg": "Produk berhasil dihapus"
}
```

Error umum:
- `404` produk tidak ditemukan

---

## 8. Tutorial Integrasi Frontend ke Backend

Bagian ini dibuat agar FE bisa langsung connect.

### 8.1 Set API base URL di frontend

Di frontend, gunakan base URL backend, bukan endpoint health.

Contoh:

```env
VITE_API_URL=http://localhost:5000
```

### 8.2 Contoh login dari frontend

```js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Login gagal");

  localStorage.setItem("token", data.token);
  return data;
}
```

### 8.3 Contoh panggil endpoint protected

```js
const token = localStorage.getItem("token");

const res = await fetch(`${API_URL}/api/auth/profile`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
```

### 8.4 Contoh refresh token

```js
async function refreshToken() {
  const oldToken = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: oldToken })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Refresh token gagal");

  localStorage.setItem("token", data.token);
  return data.token;
}
```

### 8.5 Urutan integrasi yang disarankan untuk FE

1. Jalankan backend, cek `/api/health`.
2. Integrasikan register + login.
3. Simpan token login ke localStorage.
4. Integrasikan profile (header Authorization Bearer).
5. Integrasikan orders CRUD.
6. Integrasikan inventory CRUD.
7. Integrasikan TikTok OAuth flow jika dibutuhkan.
8. Tambahkan fallback refresh token untuk kasus expired.

---

## 9. Known Gaps yang Perlu Diketahui Tim FE

Bagian ini penting agar FE tidak bingung saat testing.

1. Di `routes/orders.js` dan sebagian `routes/inventory.js`, beberapa query masih menggunakan `req.user.user.id`.
   - Sementara middleware auth mengisi `req.user` sebagai payload JWT yang berisi `id`.
   - Dampak: endpoint protected tertentu bisa gagal akses data user.

2. Di halaman FE channels, header profile saat ini ada pola `x-auth-token`.
   - Backend membaca header `Authorization: Bearer <token>`.
   - Jika tetap pakai `x-auth-token`, endpoint profile akan gagal auth.

3. Payload register FE saat ini mengirim field tambahan seperti `fullName` dan `whatsapp`.
   - Backend register aktif memproses `email`, `password`, `businessName`, `channels`.
   - Field tambahan akan diabaikan kecuali backend disesuaikan.

4. Endpoint forgot password masih placeholder.
   - Jangan jadikan flow utama untuk reset password saat ini.

---

## 10. Troubleshooting Cepat

### 10.1 401 Akses ditolak, token tidak ada

Cek:
- Header sudah pakai `Authorization`?
- Format sudah `Bearer <token>`?
- Token tersimpan di storage?

### 10.2 403 Token tidak valid

Cek:
- Token expired
- `JWT_SECRET` backend berubah
- Token rusak/terpotong

Aksi:
- Lakukan login ulang atau refresh token.

### 10.3 CORS error di browser

Cek:
- `FRONTEND_URL` di `.env` backend harus sama dengan origin frontend.
- Backend sudah restart setelah ubah `.env`.

### 10.4 Koneksi MongoDB gagal

Cek:
- `MONGO_URI` benar
- MongoDB service aktif
- Network/IP whitelist (jika pakai Atlas)

### 10.5 TikTok callback gagal

Cek:
- `CLIENT_KEY`, `CLIENT_SECRET`, `TIKTOK_REDIRECT_URI`
- URL callback di TikTok Developer sama persis
- Backend bisa mengakses internet untuk token exchange

---

## 11. Checklist Integrasi FE-BE

Gunakan checklist ini sebelum testing end-to-end:

- [ ] Backend `npm run dev` sukses dan health check OK
- [ ] Frontend memakai `VITE_API_URL=http://localhost:5000`
- [ ] Login berhasil dan token tersimpan
- [ ] Header protected route memakai `Authorization: Bearer <token>`
- [ ] Endpoint profile bisa mengembalikan data user
- [ ] Orders CRUD bisa dipanggil dari FE
- [ ] Inventory CRUD bisa dipanggil dari FE
- [ ] Error handling FE sudah membaca `data.msg`
- [ ] TikTok OAuth redirect + callback berjalan (jika fitur dipakai)

---

## 12. Ringkasan Endpoint

| Group | Method | Endpoint | Auth |
|---|---|---|---|
| Health | GET | `/api/health` | No |
| Auth | POST | `/api/auth/register` | No |
| Auth | POST | `/api/auth/login` | No |
| Auth | GET | `/api/auth/profile` | Yes |
| Auth | POST | `/api/auth/logout` | No |
| Auth | POST | `/api/auth/refresh` | No |
| Auth | POST | `/api/auth/forgot-password` | No |
| TikTok | GET | `/api/auth/tiktok?token=<jwt>` | Query JWT |
| TikTok | GET | `/api/auth/tiktok/callback` | No |
| Orders | GET | `/api/orders` | Yes |
| Orders | POST | `/api/orders` | Yes |
| Orders | PUT | `/api/orders/:id/status` | Yes |
| Orders | DELETE | `/api/orders/:id` | Yes |
| Inventory | GET | `/api/inventory` | Yes |
| Inventory | POST | `/api/inventory` | Yes |
| Inventory | PUT | `/api/inventory/:id` | Yes |
| Inventory | DELETE | `/api/inventory/:id` | Yes |

Selesai. Dengan panduan ini tim frontend seharusnya bisa langsung menjalankan backend, memahami kontrak API, dan melakukan integrasi secara bertahap.