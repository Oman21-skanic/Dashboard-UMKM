# DashUMKM Backend API Documentation

API ini dirancang dengan standar struktur data yang terinspirasi dari **TikTok Shop Partner API**. Semua respons dan request menggunakan format JSON bersarang (*nested JSON*).

**Base URL:** `http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)

Semua endpoint kecuali `/register` dan `/login` membutuhkan Header `Authorization: Bearer <token>`.

### POST `/api/auth/register`
Mendaftarkan akun seller baru.
- **Body**: `{ email, password, businessName, channels }`
- **Response (201)**: `{ msg: 'User berhasil didaftarkan!' }`

### POST `/api/auth/login`
Autentikasi akun.
- **Body**: `{ email, password }`
- **Response (200)**: `{ token, msg: 'Login berhasil' }`

### GET `/api/auth/profile`
Mendapatkan profil user saat ini.
- **Response (200)**:
```json
{
  "_id": "user_id_obj",
  "email": "user@example.com",
  "businessName": "Toko Berkah"
}
```

---

## 2. Inventory (`/api/inventory`)

Manajemen produk dan SKU (Varian).

### GET `/api/inventory`
Mendapatkan semua inventori milik user.
- **Response (200)**:
```json
[
  {
    "product_id": "P1235",
    "product_name": "Kemeja Pria",
    "description": "Kemeja katun premium",
    "category_id": "Pakaian",
    "imageUrl": "http://...",
    "skus": [
      {
        "sku_id": "SKU-KEM-M",
        "stock_info": { "available_stock": 50 },
        "price_info": { "original_price": 100000 }
      }
    ]
  }
]
```

### POST `/api/inventory`
Menambahkan produk baru.
- **Body Requirement**: Wajib menyertakan `product_name` dan array `skus` berisikan minimal 1 objek.
```json
{
  "product_name": "Nama Produk",
  "skus": [
    {
      "sku_id": "SKU-UNIK",
      "stock_info": { "available_stock": 20 },
      "price_info": { "original_price": 45000 }
    }
  ]
}
```

### PUT `/api/inventory/:id`
Memperbarui data produk/SKU. Format sama dengan POST.

### DELETE `/api/inventory/:id`
Menghapus produk berdasar ID MongoDB produk.

---

## 3. Orders (`/api/orders`)

Pesanan dibuat dari manual origin, tetapi menggunakan susunan data ala TikTok E-Commerce. Saat order dibuat, sistem **otomatis** akan memotong `available_stock` di koleksi Inventory.

### GET `/api/orders`
Mendapatkan daftar pesanan.
- **Response (200)**:
```json
[
  {
    "order_id": "ORD-12345",
    "order_status": "AWAITING_SHIPMENT",
    "source": "Manual",
    "payment_info": {
      "total_amount": 150000
    },
    "shipping_info": {
      "buyer_name": "Budi Santoso",
      "buyer_phone": "081234567890",
      "buyer_address": "Jl. Kemerdekaan No. 1"
    },
    "item_list": [
      {
        "sku_id": "SKU-KEM-M",
        "product_name": "Kemeja Pria",
        "quantity": 2,
        "subtotal": 150000
      }
    ]
  }
]
```

### POST `/api/orders`
Membuat pesanan manual (Hanya membuat order, bukan sync API eksternal). Membutuhkan fields lengkap agar tidak di-*reject* oleh validator dan harus divalidasi ketersediaan stoknya.
- **Body Requirement**:
```json
{
  "order_id": "ORD-MANUAL-001",
  "shipping_info": {
    "buyer_name": "Siti Aminah",
    "buyer_phone": "081223344",
    "buyer_address": "Jl. Mawar 2"
  },
  "payment_info": {
    "total_amount": 50000
  },
  "item_list": [
    {
      "sku_id": "SKU-UNIK",
      "product_name": "Kain Batik",
      "quantity": 1,
      "subtotal": 50000
    }
  ]
}
```
**Error Handling (Stok Habis):** Jika `quantity` di atas `available_stock` produk aslinya, Endpoint mengembalikan respon HTTP 400 `msg: Stok produk [nama] tidak mencukupi`.

### PUT `/api/orders/:id/status`
Memperbarui status pengiriman.
- **Body**: `{ "order_status": "SHIPPED" }` (Enum: `UNPAID`, `AWAITING_SHIPMENT`, `IN_TRANSIT`, `DELIVERED`, dll).

### DELETE `/api/orders/:id`
Bisa dihapus apabila status masih dalam tahap awal.

---

## Security (Production-Ready)
- **Helmet**: Disetel di root endpoint (App Headers).
- **Express Rate Limit**: Panggilan API dibatasi 100 hits per 15 Menit.
- **Mongo/NoSQL Sanitize (Global)**: Perlindungan otomatis dari SQL/NoSQL Injection di semua param, body, dan queries.
- **CORS**: Sudah di-set terpisah untuk support port 5173 (Vite).