import { useState } from "react";
import {
  ArrowLeft, Check, ChevronDown, ChevronRight, Download,
  FileSpreadsheet, Loader2, Menu, Plus, Trash2, Upload, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarContent from "@/component/SidebarContent";
import { Button } from "@/component/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/component/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api/apiClient";

// ════════════════════════════════════════════
// Main Page Component
// ════════════════════════════════════════════
export default function TikTokExport() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  const displayName = user?.businessName || user?.email || "Pengguna";
  const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();

  // State
  const [step, setStep] = useState(1); // 1: upload, 2: fill form, 3: done
  const [templateFile, setTemplateFile] = useState(null);
  const [schema, setSchema] = useState(null);        // parsed form schema from backend
  const [products, setProducts] = useState([{}]);     // array of products to fill
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [openSections, setOpenSections] = useState({}); // track open/closed sections

  // ── Step 1: Upload & parse template ──
  const handleParseTemplate = async () => {
    if (!templateFile) return;
    setLoading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("template", templateFile);
      const { data } = await api.post("/api/tiktok-template/parse", fd, {
        headers: { "Content-Type": undefined }
      });
      setSchema(data);
      // Initialize first product with empty values for all fields
      const emptyProduct = {};
      data.fields.forEach(f => { emptyProduct[f.name] = ""; });
      setProducts([emptyProduct]);
      // Open "basic" section by default
      const defaultOpen = {};
      data.sections.forEach(s => { defaultOpen[s.id] = s.id === "basic" || s.id === "images"; });
      setOpenSections(defaultOpen);
      setStep(2);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.msg || "Gagal membaca template." });
    } finally { setLoading(false); }
  };

  // ── Step 2: Export filled template ──
  const handleExport = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("template", templateFile);
      fd.append("products", JSON.stringify(
        products.map(p => ({ values: p }))
      ));
      
      // Use raw axios to avoid default Content-Type header conflicts
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/tiktok-template/fill-and-export`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: fd,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ msg: "Gagal export" }));
        throw new Error(errData.msg || "Gagal export file.");
      }

      // Download the blob as Excel
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `tiktok_filled_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      const savedCount = response.headers.get("x-saved-products") || products.length;
      setMessage({ type: "success", text: `✅ File berhasil di-export! ${savedCount} produk juga tersimpan di inventori.` });
      setStep(3);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Gagal export file." });
    } finally { setLoading(false); }
  };

  // ── Product helpers ──
  const updateProduct = (idx, fieldName, value) => {
    setProducts(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [fieldName]: value };
      return copy;
    });
  };

  const addProduct = () => {
    if (!schema) return;
    const emptyProduct = {};
    schema.fields.forEach(f => { emptyProduct[f.name] = ""; });
    setProducts(prev => [...prev, emptyProduct]);
  };

  const removeProduct = (idx) => {
    if (products.length <= 1) return;
    setProducts(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    setStep(1);
    setSchema(null);
    setProducts([{}]);
    setTemplateFile(null);
    setMessage(null);
  };

  // ── Count filled required fields ──
  const getProgress = (productIdx) => {
    if (!schema) return { filled: 0, total: 0 };
    const required = schema.fields.filter(f => f.isRequired);
    const filled = required.filter(f => products[productIdx]?.[f.name]?.toString().trim()).length;
    return { filled, total: required.length };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-[260px] min-h-screen flex-col bg-gradient-to-b from-[#0b1e36] to-[#102e4a] text-white sticky top-0 h-screen">
          <SidebarContent displayName={displayName} initials={initials} onLogout={handleLogout} />
        </aside>

        {/* Mobile header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-gradient-to-r from-[#0b1e36] to-[#102e4a] px-4 py-3 text-white">
          <Sheet>
            <SheetTrigger asChild><button className="rounded-lg bg-white/10 p-2"><Menu className="h-5 w-5" /></button></SheetTrigger>
            <SheetContent side="left" className="w-[280px] border-none bg-gradient-to-b from-[#0b1e36] to-[#102e4a] p-0 text-white">
              <SidebarContent displayName={displayName} initials={initials} onLogout={handleLogout} CloseWrapper={SheetClose} />
            </SheetContent>
          </Sheet>
          <h1 className="text-base font-bold">TikTok Template Filler</h1>
          <div className="w-9" />
        </div>

        {/* Main */}
        <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/inventori")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-all">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#0f172a]">TikTok Template Filler</h1>
                <p className="text-xs text-[#94a3b8]">Upload template → Isi form → Export siap import</p>
              </div>
            </div>
            {step > 1 && (
              <button onClick={resetAll} className="text-sm text-[#3182ce] font-semibold hover:underline">
                ← Mulai Ulang
              </button>
            )}
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[
              { num: 1, label: "Upload Template" },
              { num: 2, label: "Isi Form" },
              { num: 3, label: "Selesai" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  step >= s.num ? "bg-[#3182ce] text-white" : "bg-[#e2e8f0] text-[#94a3b8]"
                }`}>
                  {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${step >= s.num ? "text-[#1e293b]" : "text-[#94a3b8]"}`}>
                  {s.label}
                </span>
                {i < 2 && <div className={`w-8 h-0.5 ${step > s.num ? "bg-[#3182ce]" : "bg-[#e2e8f0]"}`} />}
              </div>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center justify-between ${
              message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
              <button onClick={() => setMessage(null)} className="ml-3 font-bold">✕</button>
            </div>
          )}

          {/* ═══════ STEP 1: Upload Template ═══════ */}
          {step === 1 && (
            <Card className="border-[#e2e8f0] shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-[#1e293b]">Upload Template TikTok Shop</CardTitle>
                <p className="text-xs text-[#94a3b8] mt-1">
                  Download template dari TikTok Shop Seller Center, lalu upload ke sini. Website akan membaca semua kolom & pilihan secara otomatis.
                </p>
              </CardHeader>
              <CardContent>
                <label className="flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed border-[#cbd5e1] rounded-2xl cursor-pointer hover:border-[#3182ce] hover:bg-[#eff6ff]/30 transition-all group">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#3182ce] mb-4 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-semibold text-[#1e293b]">
                    {templateFile ? templateFile.name : "Klik untuk pilih file template (.xlsx)"}
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    {templateFile ? `${(templateFile.size / 1024).toFixed(1)} KB` : "File template dari TikTok Shop Seller Center"}
                  </p>
                  <input type="file" accept=".xlsx,.xls" className="hidden" onChange={e => { setTemplateFile(e.target.files[0]); }} />
                </label>

                <Button
                  onClick={handleParseTemplate}
                  disabled={!templateFile || loading}
                  className="w-full mt-4 bg-gradient-to-r from-[#0b1e36] to-[#102e4a] hover:from-[#102e4a] hover:to-[#1a3f5c] text-white rounded-xl py-5 text-sm font-bold shadow-lg disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Membaca Template...</> : <><Upload className="h-4 w-4 mr-2" />Baca & Analisis Template</>}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ═══════ STEP 2: Dynamic Form ═══════ */}
          {step === 2 && schema && (
            <div className="space-y-5">
              {/* Template info banner */}
              <div className="flex flex-wrap gap-2 px-4 py-3 bg-[#eff6ff] rounded-xl border border-[#bfdbfe]">
                <span className="px-3 py-1 rounded-full bg-white text-[#3182ce] text-xs font-bold shadow-sm">
                  📋 {schema.totalFields} Kolom
                </span>
                <span className="px-3 py-1 rounded-full bg-white text-red-600 text-xs font-bold shadow-sm">
                  ⚠️ {schema.requiredFields} Wajib
                </span>
                <span className="px-3 py-1 rounded-full bg-white text-emerald-600 text-xs font-bold shadow-sm">
                  📦 {products.length} Produk
                </span>
                {schema.categories.length > 0 && (
                  <span className="px-3 py-1 rounded-full bg-white text-purple-600 text-xs font-bold shadow-sm">
                    🏷️ {schema.categories.length} Kategori
                  </span>
                )}
              </div>

              {/* Products */}
              {products.map((product, pIdx) => {
                const progress = getProgress(pIdx);
                const pct = progress.total > 0 ? Math.round((progress.filled / progress.total) * 100) : 0;

                return (
                  <Card key={pIdx} className="border-[#e2e8f0] shadow-sm overflow-hidden">
                    {/* Product header */}
                    <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#f8fafc] to-[#fff]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3182ce] text-white text-sm font-bold">
                          {pIdx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1e293b]">
                            {product["Nama produk"] || `Produk ${pIdx + 1}`}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-24 h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#3182ce] rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-[#94a3b8] font-semibold">{progress.filled}/{progress.total} wajib</span>
                          </div>
                        </div>
                      </div>
                      {products.length > 1 && (
                        <button onClick={() => removeProduct(pIdx)} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <CardContent className="p-0">
                      {/* Sections */}
                      {schema.sections.map(section => {
                        const sectionFields = section.fields.map(idx => schema.fields[idx]).filter(Boolean);
                        if (sectionFields.length === 0) return null;
                        const isOpen = openSections[section.id] ?? false;

                        return (
                          <div key={section.id} className="border-t border-[#f1f5f9]">
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[#f8fafc] transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-base">{section.icon}</span>
                                <span className="text-sm font-bold text-[#1e293b]">{section.title}</span>
                                <span className="text-[10px] text-[#94a3b8] bg-[#f1f5f9] px-2 py-0.5 rounded-full">
                                  {sectionFields.length} field
                                </span>
                              </div>
                              <ChevronDown className={`h-4 w-4 text-[#94a3b8] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isOpen && (
                              <div className="px-5 pb-4 space-y-3">
                                {sectionFields.map(field => (
                                  <DynamicField
                                    key={field.index}
                                    field={field}
                                    value={product[field.name] || ""}
                                    onChange={(val) => updateProduct(pIdx, field.name, val)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Add product */}
              <button
                onClick={addProduct}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-[#cbd5e1] rounded-xl text-sm font-semibold text-[#3182ce] hover:border-[#3182ce] hover:bg-[#eff6ff]/30 transition-all"
              >
                <Plus className="h-4 w-4" />Tambah Produk Lain
              </button>

              {/* Export */}
              <Button
                onClick={handleExport}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0b1e36] to-[#102e4a] hover:from-[#102e4a] hover:to-[#1a3f5c] text-white rounded-xl py-6 text-sm font-bold shadow-lg disabled:opacity-50"
              >
                {loading
                  ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Generating XLSX...</>
                  : <><Download className="h-5 w-5 mr-2" />Export {products.length} Produk ke Template TikTok</>
                }
              </Button>
            </div>
          )}

          {/* ═══════ STEP 3: Done ═══════ */}
          {step === 3 && (
            <Card className="border-[#e2e8f0] shadow-sm">
              <CardContent className="flex flex-col items-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-4">
                  <Check className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-[#1e293b] mb-2">File Berhasil Di-export! 🎉</h2>
                <p className="text-sm text-[#64748b] text-center max-w-md mb-2">
                  File XLSX sudah terdownload dan siap diimport ke TikTok Shop Seller Center.
                </p>
                <p className="text-sm text-emerald-600 font-semibold text-center max-w-md mb-6">
                  📦 Produk juga sudah otomatis tersimpan di Inventori website kamu!
                </p>
                <div className="flex gap-3">
                  <Button onClick={resetAll} variant="outline" className="rounded-xl border-[#e2e8f0] px-6">
                    <Upload className="h-4 w-4 mr-2" />Isi Template Baru
                  </Button>
                  <Button onClick={() => navigate("/inventori")} className="rounded-xl bg-[#3182ce] hover:bg-[#2b6cb0] text-white px-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />Ke Inventori
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// Dynamic Field Renderer
// Renders the correct input type based on field schema
// ════════════════════════════════════════════
function DynamicField({ field, value, onChange }) {
  const baseInputClass = "w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-[#3182ce]/30";
  const borderClass = field.isRequired && !value?.toString().trim()
    ? "border-red-300 bg-red-50/30"
    : "border-[#e2e8f0] bg-white";

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="text-xs font-semibold text-[#475569]">
          {field.name}
        </label>
        {field.isRequired && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-bold">Wajib</span>}
        {field.isConditional && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 font-bold">Sesuai Syarat</span>}
        {field.isOptional && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-bold">Opsional</span>}
      </div>

      {/* Description tooltip */}
      {field.description && (
        <p className="text-[10px] text-[#94a3b8] mb-1 leading-snug line-clamp-2">{field.description}</p>
      )}

      {/* Render by type */}
      {field.fieldType === "dropdown" && field.options.length > 0 ? (
        <div className="relative">
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`${baseInputClass} ${borderClass} appearance-none pr-8`}
          >
            <option value="">— Pilih {field.name} —</option>
            {field.options.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8] pointer-events-none" />
        </div>
      ) : field.fieldType === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.example || `Masukkan ${field.name}`}
          rows={3}
          className={`${baseInputClass} ${borderClass} resize-none`}
        />
      ) : field.fieldType === "number" ? (
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.example || "0"}
          min={0}
          className={`${baseInputClass} ${borderClass}`}
        />
      ) : field.fieldType === "url" ? (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.example || "https://..."}
          className={`${baseInputClass} ${borderClass}`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={field.example || `Masukkan ${field.name}`}
          className={`${baseInputClass} ${borderClass}`}
        />
      )}
    </div>
  );
}
