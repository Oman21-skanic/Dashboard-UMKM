import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const revealRefs = useRef([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("vis"), i * 110);
          }
        });
      },
      { threshold: 0.1 },
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addReveal = (el) => {
    if (el) revealRefs.current.push(el);
  };

  const goLogin = () => { setMobileMenuOpen(false); navigate("/login"); };
  const goRegister = () => { setMobileMenuOpen(false); navigate("/register"); };
  const closeMobileLinkClick = () => setMobileMenuOpen(false);

  const bars = [42, 62, 50, 88, 72, 91, 76];

  const orders = [
    {
      name: "Budi Santoso",
      status: "Terkirim",
      cls: "lp-bg-g",
      amt: "Rp 250K",
    },
    { name: "Siti Rahma", status: "Proses", cls: "lp-bg-b", amt: "Rp 180K" },
    { name: "Dede Kurnia", status: "Pending", cls: "lp-bg-y", amt: "Rp 420K" },
  ];

  const sideCards = [
    {
      cls: "blue",
      ico: "🎵",
      label: "TikTok Shop",
      val: "Rp 1,8M penjualan",
      badge: "Terhubung",
      badgeCls: "active",
    },
    {
      cls: "orange",
      ico: "🛒",
      label: "Shopee",
      val: "142 pesanan baru",
      badge: "+24%",
      badgeCls: "up",
    },
    {
      cls: "green",
      ico: "📦",
      label: "Stok tersinkron",
      val: "64 produk aktif",
      badge: "Real-time",
      badgeCls: "up",
    },
  ];

  const features = [
    {
      ico: "🔄",
      title: "Sinkronisasi Stok Real-time",
      desc: "Hubungkan semua kanal penjualan Anda. Stok berkurang otomatis di semua marketplace saat terjadi penjualan.",
    },
    {
      ico: "📊",
      title: "Laporan Penjualan Otomatis",
      desc: "Dapatkan insight harian, mingguan, dan bulanan tanpa input manual. Data akurat untuk keputusan tepat.",
    },
    {
      ico: "🔔",
      title: "Notifikasi Stok & Pesanan",
      desc: "Peringatan dini saat stok menipis dan notifikasi instan untuk setiap pesanan baru yang masuk.",
    },
  ];

  const intCards = [
    { ico: "🎵", name: "TikTok Shop" },
    { ico: "🛒", name: "Shopee" },
    { ico: "🟢", name: "Tokopedia" },
    { ico: "🚚", name: "Logistik" },
  ];

  const intList = [
    "TikTok Shop Integration — kelola produk & pesanan TikTok",
    "Shopee & Tokopedia Sync — sinkronisasi otomatis stok & order",
    "Manajemen Kurir Terpadu — JNE, SiCepat, Gojek, dan lainnya",
    "Laporan terintegrasi dari semua channel dalam satu dashboard",
  ];

  const stats = [
    { num: "10.000+", label: "UMKM Aktif" },
    { num: "99.9%", label: "Uptime System" },
    { num: "Rp500M+", label: "Transaksi Diproses" },
    { num: "4.9★", label: "Rating Pengguna" },
  ];

  const testimonials = [
    {
      av: "BS",
      name: "Budi Santoso",
      role: "Pemilik Toko Batik Online, Yogyakarta",
      text: "Sejak pakai DashUMKM, waktu saya untuk kelola pesanan berkurang 70%. Semua tersinkron otomatis dari TikTok dan Shopee. Luar biasa!",
    },
    {
      av: "SR",
      name: "Siti Rahma",
      role: "CEO Hijab Cantik Store, Bandung",
      text: "Dashboard-nya sangat membantu. Saya bisa pantau semua penjualan dari HP tanpa harus buka banyak aplikasi. Recommended banget!",
    },
    {
      av: "DK",
      name: "Dede Kurnia",
      role: "Founder Snack Nusantara, Surabaya",
      text: "Laporan otomatis setiap hari sangat membantu saya ambil keputusan. Omzet naik 40% dalam 3 bulan setelah pakai DashUMKM!",
    },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav className="lp-nav">
        <button className="lp-logo" onClick={() => navigate("/")}>
          <div className="lp-logo-dot"></div>
          Dash<span>UMKM</span>
        </button>
        <ul className="lp-nav-links">
          <li>
            <a href="#fitur">Fitur</a>
          </li>
          <li>
            <a href="#integrasi">Integrasi</a>
          </li>
          <li>
            <a href="#harga">Harga</a>
          </li>
          <li>
            <a href="#tentang">Tentang</a>
          </li>
        </ul>
        <div className="lp-nav-actions">
          <button className="lp-btn-ghost" onClick={goLogin}>
            Login
          </button>
          <button className="lp-btn-solid" onClick={goRegister}>
            Get Started
          </button>
        </div>
        {/* Hamburger — mobile only */}
        <button
          className={`lp-hamburger${mobileMenuOpen ? " open" : ""}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`lp-mobile-menu${mobileMenuOpen ? " open" : ""}`}>
        <div className="lp-mobile-menu-inner">
          <a href="#fitur" className="lp-mobile-menu-link" onClick={closeMobileLinkClick}>Fitur</a>
          <a href="#integrasi" className="lp-mobile-menu-link" onClick={closeMobileLinkClick}>Integrasi</a>
          <a href="#harga" className="lp-mobile-menu-link" onClick={closeMobileLinkClick}>Harga</a>
          <a href="#tentang" className="lp-mobile-menu-link" onClick={closeMobileLinkClick}>Tentang</a>
          <div className="lp-mobile-menu-divider" />
          <div className="lp-mobile-menu-actions">
            <button className="lp-btn-ghost" onClick={goLogin}>Login</button>
            <button className="lp-btn-solid" onClick={goRegister}>Get Started</button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-left">
          <div className="lp-badge">
            <div className="lp-badge-dot"></div>
            Platform No.1 untuk UMKM Indonesia
          </div>
          <h1 className="lp-h1">
            Kelola Bisnis Anda
            <br />
            Lebih Mudah dalam
            <br />
            Satu Tempat
          </h1>
          <p className="lp-sub">
            Kelola operasional toko online Anda dari satu platform terintegrasi.
            Mudah, cepat, dan efisien untuk pertumbuhan berkelanjutan.
          </p>
          <div className="lp-cta">
            <button className="lp-btn-primary" onClick={goRegister}>
              Mulai Sekarang →
            </button>
            <button className="lp-btn-outline" onClick={goLogin}>
              ▶ Lihat Demo
            </button>
          </div>
          <div className="lp-social">
            <div className="lp-avatars">
              {["BS", "SR", "DK", "+"].map((a, i) => (
                <div key={i} className="lp-av">
                  {a}
                </div>
              ))}
            </div>
            <span className="lp-social-text">
              Bergabung dengan <strong>10.000+</strong> UMKM Indonesia
            </span>
          </div>
        </div>

        <div className="lp-hero-right">
          <div style={{ position: "relative" }}>
            <div className="lp-dash-card">
              <div className="lp-dash-header">
                <div className="lp-dc lp-dc-r"></div>
                <div className="lp-dc lp-dc-y"></div>
                <div className="lp-dc lp-dc-g"></div>
                <span className="lp-dash-title">
                  DashUMKM — Dashboard Utama
                </span>
              </div>
              <div className="lp-dash-body">
                <div className="lp-stats-row">
                  <div className="lp-stat-box">
                    <div className="lp-stat-label">Pendapatan</div>
                    <div className="lp-stat-val">Rp4,5M</div>
                    <div className="lp-stat-chg">↑ +12.4%</div>
                  </div>
                  <div className="lp-stat-box">
                    <div className="lp-stat-label">Pesanan</div>
                    <div className="lp-stat-val">248</div>
                    <div className="lp-stat-chg">↑ +8.1%</div>
                  </div>
                  <div className="lp-stat-box">
                    <div className="lp-stat-label">Produk</div>
                    <div className="lp-stat-val">64</div>
                    <div className="lp-stat-chg">↑ +3</div>
                  </div>
                </div>
                <div className="lp-chart-box">
                  <div className="lp-chart-label">Penjualan Minggu Ini</div>
                  <div className="lp-bars">
                    {bars.map((h, i) => (
                      <div
                        key={i}
                        className={`lp-bar${h === 88 ? " hi" : ""}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="lp-orders-box">
                  {orders.map((o, i) => (
                    <div key={i} className="lp-order-row">
                      <span className="lp-o-name">{o.name}</span>
                      <span className={`lp-badge-sm ${o.cls}`}>{o.status}</span>
                      <span className="lp-o-amt">{o.amt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lp-float-profit">
              <div className="lp-float-icon">📈</div>
              <div>
                <div className="lp-float-label">Profit Bulan Ini</div>
                <div className="lp-float-val">+Rp 4.500.000</div>
              </div>
            </div>
          </div>

          <div className="lp-side-cards">
            {sideCards.map((c, i) => (
              <div key={i} className="lp-side-card">
                <div className={`lp-sc-icon ${c.cls}`}>{c.ico}</div>
                <div>
                  <div className="lp-sc-label">{c.label}</div>
                  <div className="lp-sc-val">{c.val}</div>
                </div>
                <div className={`lp-sc-badge ${c.badgeCls}`}>{c.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <div className="lp-logos">
        <div className="lp-logos-inner">
          <div className="lp-logos-text">Terintegrasi dengan</div>
          <div className="lp-logos-list">
            {[
              "🎵 TikTok Shop",
              "🛒 Shopee",
              "🟢 Tokopedia",
              "📸 Instagram",
              "🚚 JNE",
              "📦 SiCepat",
            ].map((l, i) => (
              <div key={i} className="lp-logo-item">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="fitur" className="lp-features">
        <div className="lp-sec-head reveal" ref={addReveal}>
          <div className="lp-tag">Fitur Unggulan</div>
          <h2 className="lp-h2">Fitur Cerdas untuk Kendali Penuh</h2>
          <p className="lp-sec-sub" style={{ margin: "0 auto" }}>
            Dirancang khusus untuk membantu pemilik bisnis mengotomatiskan
            hal-hal kecil sehingga Anda bisa fokus pada strategi.
          </p>
        </div>
        <div className="lp-feat-grid reveal" ref={addReveal}>
          {features.map((f, i) => (
            <div key={i} className="lp-feat-card">
              <div className="lp-feat-ico">{f.ico}</div>
              <div className="lp-feat-title">{f.title}</div>
              <p className="lp-feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTEGRATION */}
      <section id="integrasi" className="lp-integration">
        <div className="lp-int-grid">
          <div className="lp-int-visual reveal" ref={addReveal}>
            {intCards.map((c, i) => (
              <div key={i} className="lp-int-card">
                <div className="lp-int-card-ico">{c.ico}</div>
                <div className="lp-int-card-name">{c.name}</div>
                <div className="lp-int-card-status">✓ Connected</div>
              </div>
            ))}
            <div className="lp-int-stat">
              <div>
                <div className="lp-int-stat-num">99.9%</div>
                <div className="lp-int-stat-label">
                  Uptime System untuk interkoneksi
                  <br />
                  pesanan Anda secara real-time
                </div>
              </div>
              <div style={{ fontSize: "2.2rem" }}>⚡</div>
            </div>
          </div>
          <div className="reveal" ref={addReveal}>
            <h2 className="lp-h2">Integrasi Tanpa Batas</h2>
            <p className="lp-sec-sub" style={{ marginBottom: "32px" }}>
              DashUMKM terhubung langsung dengan ekosistem digital terbesar di
              Indonesia — dari Marketplace, Logistik, hingga E-commerce Sync.
            </p>
            <div className="lp-int-list">
              {intList.map((t, i) => (
                <div key={i} className="lp-int-item">
                  <div className="lp-int-check">✓</div>
                  <div className="lp-int-item-text">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="lp-stats reveal" ref={addReveal}>
        <div className="lp-tag">Dipercaya Ribuan UMKM</div>
        <h2 className="lp-h2">Bergabung bersama komunitas kami</h2>
        <div className="lp-stats-row">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="lp-stat-big-num">{s.num}</div>
              <div className="lp-stat-big-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lp-testimonials">
        <div className="lp-sec-head reveal" ref={addReveal}>
          <div className="lp-tag">Testimoni</div>
          <h2 className="lp-h2">Kata Mereka Tentang DashUMKM</h2>
          <p className="lp-sec-sub" style={{ margin: "0 auto" }}>
            Ribuan pemilik UMKM sudah merasakan manfaatnya. Sekarang giliran
            Anda!
          </p>
        </div>
        <div className="lp-test-grid reveal" ref={addReveal}>
          {testimonials.map((t, i) => (
            <div key={i} className="lp-test-card">
              <div className="lp-stars">★★★★★</div>
              <p className="lp-test-text">"{t.text}"</p>
              <div className="lp-test-author">
                <div className="lp-test-av">{t.av}</div>
                <div>
                  <div className="lp-test-name">{t.name}</div>
                  <div className="lp-test-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div
          className="reveal"
          style={{ position: "relative", zIndex: 2 }}
          ref={addReveal}
        >
          <h2 className="lp-cta-h2">Tingkatkan Bisnis Anda Hari Ini</h2>
          <p className="lp-cta-desc">
            Mulai perjalanan digitalisasi UMKM Anda bersama DashUMKM. Coba
            gratis selama 14 hari tanpa kartu kredit.
          </p>
          <div className="lp-cta-btns">
            <button className="lp-btn-cta-w" onClick={goRegister}>
              Mulai Sekarang →
            </button>
            <button className="lp-btn-cta-o" onClick={goLogin}>
              💬 Hubungi Sales
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  background: "#60A5FA",
                  borderRadius: "50%",
                }}
              ></div>
              Dash<span>UMKM</span>
            </div>
            <p>
              © 2024 DashUMKM. The Professional Dashboard for UMKM Indonesia.
              UMKM sukses naik kelas melalui teknologi.
            </p>
          </div>
          <div className="lp-footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#">Features</a>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Integrations</a>
              </li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>Follow Us</h4>
            <ul>
              <li>
                <a href="#">📘 Facebook</a>
              </li>
              <li>
                <a href="#">📸 Instagram</a>
              </li>
              <li>
                <a href="#">🎵 TikTok</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <p>© 2024 DashUMKM. Dibuat dengan ❤️ untuk UMKM Indonesia.</p>
          <div className="lp-socials">
            <a href="#" className="lp-soc-btn">
              📘
            </a>
            <a href="#" className="lp-soc-btn">
              📸
            </a>
            <a href="#" className="lp-soc-btn">
              🎵
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
