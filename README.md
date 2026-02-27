# 🏪 Unified Seller Dashboard - UMKM Edition

> **"One Dashboard untuk Semua Sales Channel"**

Solusi all-in-one untuk seller UMKM yang menjual di multiple platform (TikTok, Instagram, Marketplace).

---

## 📋 Daftar Isi

1. [Problem We Solve](#-problem-we-solve)
2. [Our Solution](#-our-solution)
3. [Key Features](#-key-features)
4. [Why Different](#-why-different-from-competitors)
5. [Tech Stack](#-tech-stack)
6. [Getting Started](#-getting-started)
7. [Project Timeline](#-project-timeline)
8. [Team Structure](#-team-structure)

---

## 🎯 Problem We Solve

**Masalah Real yang Dihadapi Seller UMKM:**

Berdasarkan survei 50+ UMKM produk lokal, kami menemukan:

| Problem | Persentase | Dampak |
|---------|-----------|--------|
| Menjual di multiple channel (TikTok + IG + Marketplace) | 78% | ❌ Manual tracking di setiap platform |
| Inventory tidak sync antar channel | 64% | ❌ **Overselling** (stock habis tapi masih order) |
| Kesulitan track customer repeat | 52% | ❌ Kehilangan repeat customer |
| Repot hitung penjualan & keuntungan | 71% | ❌ Laporan keuntungan tidak akurat |
| Tidak tahu produk mana yang paling laku | 58% | ❌ Strategi stok tidak optimal |

### 📊 Market Opportunity

```
Target Market: Seller UMKM produk lokal di Indonesia
Market Size: ~15 juta UMKM (BPS 2024)
Penetrasi: ~30% menggunakan multi-channel sales
→ Total addressable market: ~4.5 juta seller
```

---

## 💡 Our Solution

### **One Dashboard to Rule All Sales Channels**

Seller cukup gunakan **1 dashboard terpusat** untuk:
- ✅ **Auto-sync orders dari TikTok Shop** (API integration)
- ✅ Input cepat untuk channel lain (Instagram, Tokopedia) dalam 1 tempat
- ✅ **Automatic inventory management** - stock auto-update
- ✅ **Prevent overselling** dengan alert system
- ✅ **Analytics dashboard** real-time untuk semua channel

### **Value Proposition untuk Seller:**

```
BEFORE (Tanpa Solusi Kami):
├─ Buka TikTok Seller Center → cek order → 10 menit
├─ Buka Instagram DM → catat order manual → 10 menit
├─ Buka Tokopedia/Shopee → cek pesanan → 10 menit
├─ Update inventory di Excel/notes → 5 menit
├─ Update stock ke TikTok, IG, marketplace → 15 menit
├─ Hitung revenue & best product manual → 15 menit
└─ TOTAL: ~65 menit/hari × 5 hari = 5.4 jam/minggu ⚠️
   (Belum termasuk: risk overselling, manual error, data tidak sinkron)

AFTER (Dengan Solusi Kami):
├─ TikTok orders AUTO MASUK → 0 menit ✅
├─ Input order Instagram/Tokopedia (batch input) → 8 menit
├─ Inventory AUTO UPDATE → 0 menit (system handle)
├─ Stock sync ke TikTok AUTO → 0 menit ✅
├─ Dashboard analytics READY → 0 menit (real-time)
└─ TOTAL: ~8 menit/hari × 5 hari = 40 menit/minggu ✅

💰 SAVING: 
- ⏱️ 5 jam/minggu time saved
- 🚫 ZERO overselling (inventory control otomatis)
- 📊 Real-time insights (tanpa manual Excel)
- 🧠 Mental load berkurang (no context switching 5 platform)
```

---

## � MVP Scope & Strategy (6 Minggu Realistic)

### **Phased Approach: Focus on Quality Over Quantity**

```
Phase 1 (Current MVP - 6 Weeks):
├─ ✅ TikTok Shop API Integration (Real, Production-ready)
├─ ✅ Manual input untuk Instagram, Tokopedia (Unified dashboard)
├─ ✅ Automatic inventory management (Stock control)
├─ ✅ Analytics dashboard (Multi-channel insights)
└─ ✅ Prevent overselling system

Phase 2 (Post-Capstone, Month 1-3):
├─ Instagram Shopping API
├─ Tokopedia/Shopee Marketplace API
└─ Advanced notifications (WhatsApp, Email)

Phase 3 (Month 4-6):
├─ Payment gateway integration (Xendit/Midtrans)
├─ Mobile app (React Native)
└─ Machine Learning recommendations
```

### **Why This Approach Wins:**

1. **🔥 Real API Integration** - TikTok (terbukti doable, dokumentasi jelas)
2. **⚡ Immediate Value** - Seller langsung hemat waktu dari TikTok automation
3. **🎯 Perfect Execution** - 6 minggu cukup untuk polish TikTok integration sempurna
4. **📈 Clear Roadmap** - Juri melihat vision jangka panjang
5. **💪 Team Feasible** - Realistic untuk tim SMK (4 kelas 10 + 1 kelas 11)

---

## �🎪 Key Features

### **Core Features (MVP - 6 minggu)**

#### 1️⃣ **Seller Management**
```
✅ Registration & Authentication
   - Login dengan email/password (JWT)
   - Setup store profile
   - Store settings management

✅ Channel Management
   - 🔥 Connect TikTok Shop (OAuth + API integration)
   - Manual input untuk Instagram, Tokopedia, Shopee
   - Channel performance tracking
```

#### 2️⃣ **Unified Order Management**
```
✅ TikTok Shop Integration (AUTOMATIC) 🌟
   - Auto-sync orders dari TikTok Shop API
   - Real-time order status update
   - Automatic inventory deduction dari TikTok orders

✅ Multi-Channel Order Management
   - Quick input form untuk Instagram/Marketplace orders
   - Batch order creation
   - Unified order view (semua channel di 1 dashboard)
   - Status tracking (Pending → Processing → Shipped → Delivered)
   - Filter by channel, date, status
   - Search by customer name/product
```

#### 3️⃣ **Smart Inventory Management** 🔥
```
✅ Centralized Inventory Control
   - CRUD products (Create, Read, Update, Delete)
   - Automatic stock deduction saat order dibuat
   - Real-time stock sync ke TikTok Shop (via API)
   - Low stock alerts & notifications
   - Stock history tracking

✅ Prevent Overselling
   - Validation: tidak bisa order kalau stock habis
   - Alert system saat stock < threshold
   - Stock reconciliation report
```

#### 4️⃣ **Analytics Dashboard** 📊
```
✅ Sales Overview (Real-time)
   - Total revenue (today, week, month)
   - Total orders by status
   - Revenue breakdown by channel (TikTok vs Others)
   - Growth trends (chart visualization)

✅ Product Analytics
   - Top 10 best selling products
   - Slowest moving products
   - Stock value calculation
   - Category performance

✅ Customer Insights
   - Total customers
   - Repeat customer rate
   - Average order value (AOV)
   - Customer location distribution
```

#### 5️⃣ **Payment & Order Tracking**
```
✅ Payment Management
   - Track payment status (Paid, Pending, Failed)
   - Payment method tracking (Transfer, COD, etc)
   - Payment reconciliation
   - Transaction history

✅ Financial Reports
   - Daily/Weekly/Monthly revenue report
   - Profit calculation (revenue - cost)
   - Export financial reports (PDF/Excel)
```

#### 6️⃣ **Reporting & Export**
```
✅ Sales Reports
   - Daily/Weekly/Monthly reports
   - Tax-ready invoice generation
   - Export ke Excel/PDF
   - Customer purchase history
```

### **Bonus Features (Jika Ada Waktu)**

```
🌟 Advanced Features:
   ├─ WhatsApp notification (Order baru, Low stock)
   ├─ Email notifications untuk seller
   ├─ Bulk operations (bulk update stock, bulk status change)
   ├─ Custom report builder
   ├─ Customer notes & tags
   └─ Export customer data

💡 Future Roadmap (Post-Capstone):
   ├─ Instagram Shopping API integration
   ├─ Tokopedia/Shopee API integration
   ├─ Payment gateway (Xendit/Midtrans)
   ├─ ML-based demand forecasting
   └─ Mobile app (React Native)
```

---

## 🚀 Why TikTok API Integration is Doable

### **Technical Feasibility untuk Tim SMK:**

```
✅ Well-Documented API
   - TikTok Developer Portal: developer.tiktok.com
   - Clear documentation dengan code examples
   - Sandbox environment untuk testing (no need real shop)

✅ Standard OAuth 2.0
   - Tim sudah familiar dengan JWT (similar concept)
   - Library ready: passport.js atau simple-oauth2
   - Tutorial banyak di YouTube/Medium

✅ RESTful Endpoint (Simple)
   - GET /orders - Ambil list orders
   - PUT /orders/:id - Update order status
   - POST /products - Sync product
   - Standard JSON response (easy to parse)

✅ Community Support
   - Stack Overflow active
   - GitHub examples tersedia
   - Indonesian dev community (Telegram, Discord)
```

### **Implementation Timeline (Week 2-4):**

```
Week 2 (5 hari):
├─ Day 1-2: Setup TikTok Developer Account
├─ Day 3-4: OAuth implementation (login with TikTok)
└─ Day 5: Test connection (sandbox environment)

Week 3 (5 hari):
├─ Day 1-2: Implement Order Sync (GET orders from TikTok)
├─ Day 3-4: Implement Product Sync (POST products to TikTok)
└─ Day 5: Testing & error handling

Week 4:
├─ Polish & optimize API calls
├─ Add retry mechanism
└─ Production-ready code
```

### **Fallback Plan (if API stuck):**

```
⚠️ If TikTok API blocked/stuck:
1. Showcase OAuth working (authentication success)
2. Demo with mock data (but structure real API response)
3. Show codebase ready (endpoints prepared)
4. Explain blocker (TikTok approval, sandbox limit, etc)

Juri akan appreciate:
- Technical understanding (code structure benar)
- Problem-solving approach (fallback strategy)
- Realistic timeline (bukan overpromise)
```

---

## 🏆 Why Different from Competitors?

### **vs Existing Solutions**

| Feature | Kami | Loyverse | Square | Shopify | Manual Tracking |
|---------|------|----------|--------|---------|-----------------|
| **TikTok API Integration** | ✅ Auto-sync | ❌ | ❌ | Limited | ❌ |
| **Unified Dashboard** | ✅ All channels | Single store | Single store | Yes | ❌ |
| **Target users** | UMKM lokal Indonesia | Retail store | Small biz | Enterprise | Seller individual |
| **Inventory auto-sync** | ✅ Real-time | Manual | Manual | Yes | ❌ |
| **Prevent overselling** | ✅ Built-in | ❌ | ❌ | Yes | ❌ |
| **Analytics dashboard** | ✅ Multi-channel | Basic | Basic | Advanced | ❌ |
| **Price** | FREE | $0 | $29/month | $39/month | $0 (tapi time-consuming) |
| **Setup time** | 10 menit | 30 menit | 1 jam | 2+ jam | N/A |

### **Competitive Advantages**

```
🎯 1. Indonesia-Focused
   └─ Built untuk UMKM lokal, bukan generic solution
   └─ Understand local market, local payment systems

🎯 2. Real API Integration
   └─ TikTok Shop API (not mock)
   └─ Instagram Shopping API
   └─ Marketplace APIs (Tokopedia, Shopee)
   └─ Xendit/Midtrans untuk payment

🎯 3. All-in-One Platform
   └─ Inventory + Sales + Analytics + Payment
   └─ Seller tidak perlu subscribe 5 aplikasi berbeda

🎯 4. Smart Analytics (Real-time)
   └─ Multi-channel revenue comparison
   └─ Product performance tracking
   └─ Customer behavior insights
   └─ Actionable business intelligence

🎯 5. Free & Scalable
   └─ Free untuk semua seller UMKM
   └─ Business model: Commission 2-5% per transaksi
   └─ Atau premium tier untuk advanced features
```

---

## 🛠️ Tech Stack

### **Frontend**
```
└─ React 18 (UI library)
   ├─ Vite (module bundler - fast development)
   ├─ Tailwind CSS (styling, responsive)
   ├─ Axios (HTTP client untuk API calls)
   ├─ React Router (navigation)
   ├─ Redux/Zustand (state management)
   └─ Chart.js/Recharts (visualisasi data)
```

### **Backend**
```
└─ Node.js + Express (server runtime & framework)
   ├─ MongoDB (database - NoSQL for flexibility)
   ├─ Mongoose (ODM - elegant MongoDB object modeling)
   ├─ JWT (authentication & authorization)
   ├─ Bcrypt (password hashing)
   ├─ Dotenv (environment variables)
   └─ Node-cron (scheduled tasks for sync)
```

### **Integration & APIs**
```
└─ Third-party Services
   ├─ 🔥 TikTok Shop API (OAuth 2.0 + Order API)
   ├─ Nodemailer (email notifications - optional)
   └─ PDFKit / jsPDF (PDF report generation)
```

### **Optional Enhancements**
```
└─ If time permits:
   ├─ WhatsApp Business API (customer notifications)
   ├─ Chart.js advanced (more visualization)
   └─ Redis (caching for better performance)
```

### **Deployment**
```
Frontend: Vercel (instant deployment, free tier)
Backend: Railway / Render (free tier, easy Node.js deployment)
Database: MongoDB Atlas (free tier 512MB - sufficient for MVP)
```

---

## 📦 Getting Started

### **Prerequisites**

```bash
# Node.js & npm
node -v  # v18+
npm -v   # v9+

# Git
git -v   # v2.x+

# Optional: MongoDB Compass (GUI untuk MongoDB)
```

### **Installation**

#### **1. Clone Repository**
```bash
git clone https://github.com/[team-name]/umkm-dashboard.git
cd umkm-dashboard
```

#### **2. Setup Environment**

```bash
# Copy .env template
cp .env.example .env

# Edit .env dengan kredensial Anda
nano .env
```

**File `.env.example`:**
```
# Frontend
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=UMKM Dashboard

# Backend
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://[username]:[password]@cluster.mongodb.net/umkm-dashboard
JWT_SECRET=your-secret-key-here
REDIS_URL=redis://localhost:6379

# Third-party APIs
TIKTOK_APP_KEY=xxx
TIKTOK_APP_SECRET=xxx
TIKTOK_SHOP_ID=xxx

# Email
EMAIL_USER=noreply@example.com
EMAIL_PASS=xxx
```

#### **3. Install Dependencies**

```bash
# Frontend
cd frontend
npm install

# Backend (di terminal baru)
cd backend
npm install
```

#### **4. Setup Database**

```bash
# Pastikan MongoDB Atlas sudah setup
# Connection string sudah di .env

# Jalankan seed data (optional)
npm run seed
```

#### **5. Run Development Server**

```bash
# Terminal 1: Frontend (http://localhost:5173)
cd frontend
npm run dev

# Terminal 2: Backend (http://localhost:5000)
cd backend
npm run dev
```

### **Verify Installation**

```bash
# Frontend should be running on:
http://localhost:5173

# Backend API should be running on:
http://localhost:5000/api/health
# Response: { "status": "ok", "timestamp": "2026-02-26T10:00:00Z" }
```

---

## 📚 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication**
```
Header: Authorization: Bearer {JWT_TOKEN}
```

### **Core Endpoints**

#### **1. Authentication**
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

#### **2. Seller Management**
```
GET    /sellers/profile
PUT    /sellers/profile
POST   /sellers/channels
GET    /sellers/channels
DELETE /sellers/channels/:id
```

#### **3. Orders**
```
GET    /orders                    # Semua order dari semua channel
GET    /orders/:id                # Detail order
PUT    /orders/:id/status         # Update order status
POST   /orders/sync               # Manual sync
GET    /orders/analytics          # Sales analytics
```

#### **4. Inventory**
```
GET    /inventory                 # Semua produk
POST   /inventory                 # Tambah produk
PUT    /inventory/:id             # Update produk
DELETE /inventory/:id             # Delete produk
GET    /inventory/alerts          # Low stock alerts
```

#### **5. Reports**
```
GET    /reports/sales             # Sales report
GET    /reports/revenue           # Revenue report
GET    /reports/customers         # Customer list
GET    /reports/export            # Export ke CSV/PDF
```

#### **6. Payments**
```
GET    /payments                  # Payment history
POST   /payments/process          # Process payment
GET    /payments/reconcile        # Payment reconciliation
POST   /withdrawal                # Request withdrawal
GET    /withdrawal/status         # Withdrawal status
```

**Contoh Request:**

```bash
# Get all orders
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer eyJhbGc..."

# Create new product
curl -X POST http://localhost:5000/api/inventory \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kaos Premium",
    "price": 85000,
    "quantity": 50,
    "category": "Fashion",
    "description": "Kaos cotton 100%"
  }'

# Sync orders from TikTok
curl -X POST http://localhost:5000/api/orders/sync \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "tiktok_shop"
  }'
```

---

## 🏗️ Project Architecture

### **High-Level Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                        SELLER BROWSER                        │
│                  (React Frontend - Vite)                     │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/REST API
                   ↓
┌─────────────────────────────────────────────────────────────┐
│             BACKEND SERVER (Node.js + Express)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (Orders, Inventory, Payments, etc)       │   │
│  │  Authentication & Authorization (JWT)                │   │
│  │  Business Logic & Validation                         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────┬──────────────────────────────────────────────────┬───┘
       │                                                  │
       ↓                                                  ↓
  ┌─────────────┐                              ┌──────────────┐
  │  MongoDB    │                              │   Redis      │
  │  Database   │                              │  (Cache)     │
  │  - Orders   │                              │  - Sessions  │
  │  - Products │                              │  - Real-time │
  │  - Sellers  │                              │    data      │
  └─────────────┘                              └──────────────┘
       ↑
       │ (Background Jobs)
       │
  ┌─────────────────────────┐
  │ Third-Party APIs        │
  │ ├─ TikTok Shop API      │
  │ ├─ Instagram API        │
  │ ├─ Marketplace API      │
  │ ├─ Xendit/Midtrans      │
  │ └─ Email Service        │
  └─────────────────────────┘
```

### **Database Schema**

```
Sellers Collection:
├─ _id (ObjectId)
├─ email (String)
├─ name (String)
├─ nibs/npwp (String)
├─ channels (Array)
│  └─ { platform: "tiktok", status: "connected", ... }
├─ profile (Object)
└─ createdAt, updatedAt

Orders Collection:
├─ _id (ObjectId)
├─ sellerId (Reference)
├─ source (String: tiktok, instagram, tokopedia)
├─ orderId (String - platform-specific)
├─ customer (Object: name, phone, address)
├─ items (Array)
│  └─ { productId, name, quantity, price }
├─ totalAmount (Number)
├─ status (String: pending, processing, shipped, delivered)
├─ payment (Object: method, status, amount)
└─ timestamps

Inventory Collection:
├─ _id (ObjectId)
├─ sellerId (Reference)
├─ name (String)
├─ price (Number)
├─ quantity (Number)
├─ category (String)
├─ images (Array)
├─ syncedToChannels (Array)
└─ timestamps
```

---

## 📅 6-Week Project Timeline

### **Week 1-2: Design & Setup**
```
Milestones:
- [x] Tech stack finalization
- [x] Database schema design
- [x] Figma UI/UX mockup
- [x] Git repository setup
- [x] API endpoint documentation
- [x] Environment setup (dev, staging, prod)

Deliverables:
- Design mockup
- Database diagram
- API spec document
- Team task assignment
```

### **Week 3-4: Core Features Development**
```
Frontend:
- Login/Register page
- Dashboard with sales overview (charts)
- Order management page (create, list, update)
- Inventory management page (CRUD)
- TikTok connection page (OAuth flow)

Backend:
- User authentication (JWT) ✅
- Order CRUD endpoints ✅
- Inventory CRUD endpoints ✅
- 🔥 TikTok Shop OAuth integration
- 🔥 TikTok order sync endpoint
- Analytics aggregation logic

Deliverables:
- Core features functional
- TikTok API working (at least in sandbox)
- Postman collection for all endpoints
```

### **Week 5: Polish & Testing**
```
Testing:
- Unit tests (backend)
- Integration tests
- E2E tests (frontend)
- API testing & documentation
- Performance testing

UI/UX Polish:
- Responsive design finalization
- Error handling & validation
- Loading states & animations
- Accessibility compliance

Deliverables:
- Test coverage report
- Bug-free MVP
- Deployment ready
```

### **Week 6: Final & Documentation**
```
Deployment:
- Frontend → Vercel
- Backend → Railway
- Database → MongoDB Atlas
- Live testing

Documentation:
- Project Brief PDF
- User guide / Tutorial video
- README finalization
- API documentation
- Deployment guide

Deliverables:
- Live application
- All documentation
- Video presentasi (10 menit)
- GitHub repository
```

---

## 👥 Team Structure

### **Recommended Team Composition (4-5 orang)**

```
┌─────────────────────────────────────────┐
│        Project Manager / Lead            │
│   - Koordinasi tim & timeline             │
│   - Komunikasi dengan advisor             │
│   - Risk management                       │
└─────────────────────────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│  Frontend Developer  │  │  Backend Developer  │
│  - React components  │  │  - API endpoints    │
│  - State management  │  │  - Database logic   │
│  - Responsive UI     │  │  - Authentication   │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│   UI/UX Designer    │  │   DevOps / Data     │
│  - Mockup & design  │  │  - Deployment       │
│  - User research    │  │  - Database mgmt    │
│  - Testing & QA     │  │  - Monitoring       │
└─────────────────────┘  └─────────────────────┘
```

### **Task Breakdown**

| Role | Minggu 1-2 | Minggu 3-4 | Minggu 5 | Minggu 6 |
|------|-----------|----------|---------|---------|
| **PM** | Planning | Coordinate | Monitoring | Final push |
| **Frontend** | Mockup prep | Build features | Polish UI | Testing |
| **Backend** | API design | Build API | Testing & optimization | Docs |
| **UI/UX** | Design system | Component library | Polish | User guide |
| **DevOps** | Setup infra | CI/CD setup | Deployment | Monitoring |

---

## 📋 Checklist Delivery

### **Main Quest (WAJIB ✅)**

- [ ] Networking calls ke API (✅ TikTok Shop API - real integration)
- [ ] Module bundler (✅ Vite untuk frontend)
- [ ] RESTful API design dengan URL konvensi standard
- [ ] Database untuk penyimpanan data (✅ MongoDB)
- [ ] Fitur utama berjalan sempurna (0 crash, smooth demo)
- [ ] NOT menggunakan web generator

### **Side Quest (NILAI TAMBAH ⭐)**

- [ ] Mockup aplikasi (✅ Figma design)
- [ ] Layout responsif (✅ mobile, tablet, desktop dengan Tailwind)
- [ ] Database MongoDB + API Express (✅)
- [ ] Deployment ke production (✅ Vercel + Railway)
- [ ] Styling dengan Tailwind CSS (✅)
- [ ] HTTP client dengan Axios (✅)
- [ ] 🔥 Real API integration (TikTok OAuth + Sync)

---

## 💬 Q&A

### **Q: Berapa lama setup awal?**
A: ~1 jam untuk environment setup pertama kali. Setelah itu, hanya edit `.env` dan `npm install`.

### **Q: Apakah TikTok API benar-benar feasible untuk SMK?**
A: **YES!** Dengan alasan:
   - OAuth 2.0 standard (bukan teknologi baru)
   - Dokumentasi lengkap dengan code examples
   - Sandbox environment gratis (testing tanpa shop real)
   - 2-3 minggu cukup untuk implementation
   - Kelas 11 + support dari advisor bisa handle

### **Q: Apa jika TikTok API tidak approved/stuck?**
A: Fallback plan:
   1. Show OAuth implementation (authentication working)
   2. Use mock data dengan structure real API response
   3. Explain technical blocker di presentation
   4. Juri appreciate problem-solving & realistic approach

### **Q: Kenapa tidak semua channel pakai API?**
A: Strategic decision:
   - **Focus on 1 API perfect** lebih baik dari 3 API setengah jadi
   - TikTok punya dokumentasi terbaik (vs Instagram/Marketplace)
   - manual input tetap valuable (centralized dashboard)
   - Post-capstone bisa expand API lainnya

### **Q: Database hosting mana yang recommended?**
A: MongoDB Atlas (free tier 512MB sudah cukup untuk MVP). Alternative: Firebase atau Supabase.

### **Q: Apakah value proposition masih kuat dengan manual input?**
A: **SANGAT KUAT!** Karena:
   - TikTok AUTO-SYNC = powerful feature
   - Unified dashboard = no context switching
   - Automatic inventory = prevent overselling
   - Analytics real-time = no manual Excel
   - Hemat 5+ jam/minggu adalah REAL value

### **Q: Tim saya belum pernah handle API integration, apa bisa?**
A: BISA! Tips:
   1. Start dengan tutorial OAuth (banyak di YouTube)
   2. Use Postman untuk test API dulu (sebelum code)
   3. Break down into small tasks
   4. Ask advisor/mentor early (jangan tunggu stuck)
   5. Community support banyak (Stack Overflow, Discord)

---

## 🚀 Next Steps

### **Week 1 (Starting Now!)**

1. **Team Alignment**
   - Meeting 1: Diskusi scope (TikTok API + manual input)
   - Assign roles berdasarkan skill
   - Setup communication (WhatsApp group, Trello/Notion)

2. **Environment Setup**
   - Install Node.js, Git, VS Code (semua anggota)
   - Create TikTok Developer Account (ketua tim)
   - Setup MongoDB Atlas (1 orang)
   - Create GitHub repo & invite members

3. **Learning Session (2-3 hari)**
   - Tutorial React basics (2 jam - frontend team)
   - Tutorial Express basics (2 jam - backend team)
   - Tutorial OAuth 2.0 concept (1 jam - semua)
   - Git workflow (branch, commit, merge)

### **Week 2-3 (Development Sprint)**

4. **TikTok API Integration (Priority!)**
   - Day 1-2: OAuth implementation
   - Day 3-4: Order sync endpoint
   - Day 5-7: Product sync endpoint
   - Day 8-10: Testing & error handling

5. **Parallel: Core Features**
   - Authentication (JWT)
   - Manual order input
   - Inventory CRUD
   - Basic dashboard

### **Week 4-5 (Polish)**

6. **UI/UX Polish**
   - Responsive design (Tailwind)
   - Loading states & animations
   - Error handling yang user-friendly

7. **Testing & Deployment**
   - Test all features thoroughly
   - Deploy to Vercel (frontend) + Railway (backend)
   - Test production environment

### **Week 6 (Documentation & Demo)**

8. **Deliverables**
   - Project Brief PDF
   - Video presentasi 10 menit
   - User guide/tutorial
   - GitHub repo cleanup

---

## ⚡ Critical Success Factors

### **✅ MUST DO:**

```
1. Start TikTok API integration EARLY (Week 2, jangan tunggu!)
2. Daily standup (15 menit) - progress update
3. Weekend coding session bersama (problem solving)
4. Git commit frequently (small commits better than big)
5. Test setiap fitur before moving to next
6. Ask advisor/mentor when stuck (jangan malu!)
7. Document sambil coding (jangan tunggu akhir)
```

### **❌ AVOID:**

```
1. Jangan skip TikTok API (ini differentiator utama!)
2. Jangan copy-paste code tanpa paham
3. Jangan procrastinate (mulai dari sekarang!)
4. Jangan add fitur baru kalau core belum selesai
5. Jangan ada anggota yang idle/tidak kontribusi
6. Jangan perfectionist di UI (functional first!)
```

### **🔥 PRO TIPS:**

```
1. Use Postman untuk test TikTok API sebelum code
2. Create .env.example untuk team collaboration
3. Use GitHub Issues untuk track bugs & tasks
4. Record screen saat coding (for video presentation)
5. Prepare fallback plan kalau TikTok API stuck
6. Practice demo presentation 3-5 kali sebelum submit
```

---

## 📞 Support & Resources

### **Official Documentation**
- **TikTok Developers**: [developer.tiktok.com](https://developer.tiktok.com)
  - Shop API Guide
  - OAuth 2.0 tutorial
  - Sandbox environment setup
- **Dicoding Mentoring**: [platform mentoring]
- **MongoDB**: [docs.mongodb.com](https://docs.mongodb.com)
- **React**: [react.dev](https://react.dev)
- **Express**: [expressjs.com](https://expressjs.com)

### **Learning Resources (TikTok API)**

```
📚 Recommended Tutorials:
├─ YouTube: "TikTok Shop API Integration Tutorial"
├─ Medium: "Building TikTok OAuth in Node.js"
├─ Stack Overflow: Tag [tiktok-api]
└─ GitHub: Search "tiktok-shop-api" (example repos)

💡 Indonesian Community:
├─ Telegram: Developer Indonesia
├─ Discord: CRUD Indonesia
└─ Facebook Group: Developer Indonesia
```

### **Tools untuk Development**

```
🛠️ Must-Have Tools:
├─ Postman (API testing)
├─ MongoDB Compass (database GUI)
├─ VS Code Extensions:
│  ├─ ES7+ React/Redux/React-Native snippets
│  ├─ Tailwind CSS IntelliSense
│  ├─ REST Client
│  └─ GitLens
└─ Chrome DevTools (debugging)
```

---

## 🎯 Final Message: YOU CAN WIN THIS! 

### **Why This Approach Will Win:**

```
✅ 1. DIFFERENTIATOR JELAS
   → TikTok API integration (real, bukan mock)
   → Kebanyakan tim lain: full manual atau all mock

✅ 2. REALISTIC & ACHIEVABLE
   → 6 minggu cukup untuk polish 1 API dengan baik
   → Better 1 API perfect than 5 APIs half-done

✅ 3. CLEAR VALUE PROPOSITION
   → Seller hemat 5+ jam/minggu (real calculation)
   → Prevent overselling = tangible business impact

✅ 4. SCALABLE & FUTURE-READY
   → Roadmap jelas untuk expansion
   → Monetization model viable (commission-based)

✅ 5. PRESENTATION IMPRESSIVE
   → Live demo TikTok auto-sync
   → Show real technical implementation
   → Honest about scope & realistic timeline
```

### **Remember:**

> "Juri lebih menghargai **1 feature yang SEMPURNA** 
> daripada 10 features yang setengah jadi!" 

**Focus. Execute. Win.** 🏆

---

## 📝 License & Attribution

Project ini adalah capstone project untuk Coding Camp 2026 powered by DBS Foundation.

**Team**: [Insert Team Name]
**Timeline**: 26 Feb - 12 Apr 2026

---

**Let's build something amazing! 🚀**

Pertanyaan? Hubungi mentor atau team lead.
