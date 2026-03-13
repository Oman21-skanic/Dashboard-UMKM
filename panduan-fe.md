# Panduan Integrasi Frontend (Lengkap)

Dokumen ini adalah referensi utama untuk tim Frontend dalam mengintegrasikan UI dengan Backend (Auth & TikTok).

## 1. Konfigurasi Client

- **Base URL**: `http://localhost:5000/api`
- **Headers**: Untuk semua request yang membutuhkan login (seperti ambil profil), gunakan header berikut:
  ```http
  Authorization: Bearer <token_jwt_anda>
  Content-Type: application/json
  ```

---

## 2. API Endpoints

### A. Autentikasi (`/auth`)

| Method | Endpoint | Auth? | Body | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | No | `{email, password, businessName}` | Daftar user baru. |
| `POST` | `/login` | No | `{email, password}` | Login & dapatkan token JWT. |
| `GET` | `/profile` | **Yes** | - | Ambil data user & channels. |
| `POST` | `/refresh` | No | `{token}` | Refresh token jika expired. |

### B. Integrasi TikTok (`/auth/tiktok`)

1. **Mulai Binding**:
   Arahkan browser user ke:
   `GET /api/auth/tiktok?token=<JWT_TOKEN>`
2. **Callback Handling**:
   Setelah login di TikTok, user akan diredirect kembali ke Frontend Dashboard:
   - Sukses: `/dashboard/channels?success=tiktok_connected`
   - Gagal: `/dashboard/channels?error=tiktok_auth_rejected`

---

## 3. Struktur Data User (Object Profile)

Respons dari `GET /profile` akan mengembalikan data dengan struktur:

```json
{
  "_id": "...",
  "email": "user@mail.com",
  "businessName": "Toko UMKM",
  "channels": [
    {
      "platform": "tiktok",
      "tiktokShopId": "...",
      "expiresAt": "...",
      "_id": "..."
    }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 4. Penanganan Error (Error Handling)

Backend akan mengembalikan format error standar:
- **Status Code**: `400` (Bad Request), `401` (Unauthorized), `500` (Server Error).
- **Body**: `{"msg": "Pesan error dalam bahasa Indonesia"}`

---

## 5. Tips Implementasi (Vite + Axios)

### Melakukan Request dengan Token
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Tambahkan interceptor untuk menyisipkan token otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}` ;
  }
  return config;
});

// Contoh Ambil Profil
const getProfile = async () => {
  try {
    const res = await api.get('/auth/profile');
    console.log(res.data);
  } catch (err) {
    console.error(err.response.data.msg);
  }
};
```

### Menghubungkan TikTok
```javascript
const connectTikTok = () => {
  const token = localStorage.getItem('token');
  window.location.href = `http://localhost:5000/api/auth/tiktok?token=${token}`;
};
```
