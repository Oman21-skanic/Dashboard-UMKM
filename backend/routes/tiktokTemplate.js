const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const multer = require('multer');
const authenticateToken = require('../middleware/authenticateToken');
const Inventory = require('../models/Inventory');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// ═══════════════════════════════════════════════
// POST /api/tiktok-template/parse
// Deep-parse a TikTok template XLSX → return form schema
// ═══════════════════════════════════════════════
router.post('/parse', authenticateToken, upload.single('template'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'File template wajib diupload.' });

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

    const tplSheet = workbook.Sheets['Template'];
    if (!tplSheet) return res.status(400).json({ msg: 'Sheet "Template" tidak ditemukan.' });
    const tplData = XLSX.utils.sheet_to_json(tplSheet, { header: 1, defval: '' });

    const headers = (tplData[0] || []).map(h => String(h).trim());
    const requiredRow = (tplData[1] || []).map(r => String(r).trim());
    const descRow = (tplData[2] || []).map(d => String(d));
    const exampleRow = (tplData[3] || []).map(e => String(e));

    // Build fields
    const fields = headers.map((name, i) => {
      const req_status = requiredRow[i] || '';
      let fieldType = 'text';
      if (/gambar|image/i.test(name)) fieldType = 'url';
      else if (/harga|price/i.test(name)) fieldType = 'number';
      else if (/kuantitas|quantity|berat|panjang|lebar|tinggi|minimum/i.test(name)) fieldType = 'number';
      else if (/deskripsi|description/i.test(name)) fieldType = 'textarea';
      else if (/kategori/i.test(name)) fieldType = 'dropdown';
      else if (/merek/i.test(name)) fieldType = 'dropdown';

      return {
        index: i, name, required: req_status,
        isRequired: req_status === 'Wajib',
        isConditional: req_status === 'Wajib Diisi Sesuai Syarat',
        isOptional: req_status === 'Opsional' || req_status === '',
        description: descRow[i] || '', example: exampleRow[i] || '',
        fieldType, options: []
      };
    });

    // Categories from Category sheet
    const catSheet = workbook.Sheets['Category'];
    const categories = [];
    if (catSheet) {
      XLSX.utils.sheet_to_json(catSheet, { header: 1, defval: '' }).forEach(row => {
        if (row[0] && String(row[0]).trim())
          categories.push({ label: String(row[0]).trim(), value: String(row[0]).trim(), id: String(row[1] || '').trim() });
      });
    }
    const catField = fields.find(f => /kategori/i.test(f.name));
    if (catField) catField.options = categories;

    // Brands from Brand sheet
    const brandSheet = workbook.Sheets['Brand'];
    const brands = [];
    if (brandSheet) {
      XLSX.utils.sheet_to_json(brandSheet, { header: 1, defval: '' }).forEach(row => {
        if (row[0] && String(row[0]).trim())
          brands.push({ label: String(row[0]).trim(), value: String(row[0]).trim() });
      });
    }
    const brandField = fields.find(f => /merek/i.test(f.name));
    if (brandField) {
      brandField.options = brands;
      if (brands.length <= 1) brandField.fieldType = 'text';
    }

    // TemplateConfig metadata
    const configSheet = workbook.Sheets['TemplateConfig'];
    let templateConfig = {};
    if (configSheet) {
      const cd = XLSX.utils.sheet_to_json(configSheet, { header: 1, defval: '' });
      const cv = cd[1] || [];
      templateConfig = { version: String(cv[0] || ''), mode: String(cv[1] || ''), unit: String(cv[2] || ''), platform: String(cv[7] || '') };
    }

    // Group fields into UI sections
    const sections = [
      { id: 'basic', title: 'Informasi Produk', icon: '📦',
        fields: fields.filter(f => /kategori|merek|nama produk|deskripsi/i.test(f.name)).map(f => f.index) },
      { id: 'images', title: 'Gambar Produk', icon: '🖼️',
        fields: fields.filter(f => /gambar/i.test(f.name) && !/varian/i.test(f.name)).map(f => f.index) },
      { id: 'variants', title: 'Varian Produk', icon: '🎨',
        fields: fields.filter(f => /varian/i.test(f.name)).map(f => f.index) },
      { id: 'shipping', title: 'Pengiriman & Paket', icon: '🚚',
        fields: fields.filter(f => /berat|panjang|lebar|tinggi|pengiriman|opsi/i.test(f.name)).map(f => f.index) },
      { id: 'pricing', title: 'Harga & Stok', icon: '💰',
        fields: fields.filter(f => /harga|kuantitas|sku|minimum/i.test(f.name)).map(f => f.index) },
      { id: 'other', title: 'Lainnya', icon: '📋',
        fields: fields.filter(f => /bagan|ukuran/i.test(f.name)).map(f => f.index) }
    ].filter(s => s.fields.length > 0);

    res.json({ fields, sections, categories, brands, templateConfig, totalFields: fields.length, requiredFields: fields.filter(f => f.isRequired).length });
  } catch (err) {
    console.error('Parse template error:', err);
    res.status(500).json({ msg: 'Gagal membaca template.' });
  }
});

// ═══════════════════════════════════════════════
// POST /api/tiktok-template/fill-and-export
// Fill template XLSX + save to Inventory DB
// ═══════════════════════════════════════════════
router.post('/fill-and-export', authenticateToken, upload.single('template'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'File template wajib diupload.' });

    const products = req.body.products
      ? (typeof req.body.products === 'string' ? JSON.parse(req.body.products) : req.body.products)
      : [];
    if (!products.length) return res.status(400).json({ msg: 'Minimal 1 produk untuk export.' });

    // Read original template
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const tplSheet = workbook.Sheets['Template'];
    if (!tplSheet) return res.status(400).json({ msg: 'Sheet "Template" tidak ditemukan.' });

    const tplData = XLSX.utils.sheet_to_json(tplSheet, { header: 1, defval: '' });
    const headers = tplData[0] || [];
    const requiredRow = tplData[1] || [];
    const descRow = tplData[2] || [];

    // Helper: find value by column name pattern
    const getVal = (values, pattern) => {
      const key = Object.keys(values).find(k => pattern.test(k));
      return key ? String(values[key] || '').trim() : '';
    };

    // Build XLSX rows AND save to Inventory
    const dataRows = [];
    const savedProducts = [];

    for (const product of products) {
      const values = product.values || {};

      // 1. Build XLSX row
      const mainRow = headers.map(h => values[h] !== undefined ? values[h] : '');
      dataRows.push(mainRow);

      if (product.extraRows && product.extraRows.length > 0) {
        product.extraRows.forEach(extra => {
          const extraRow = headers.map(h => extra[h] !== undefined ? extra[h] : (values[h] !== undefined ? values[h] : ''));
          dataRows.push(extraRow);
        });
      }

      // 2. Save to Inventory DB
      const productName = getVal(values, /nama produk/i);
      if (!productName) continue;

      // Extra images (Gambar 2-9)
      const images = [];
      for (let i = 2; i <= 9; i++) {
        const imgKey = Object.keys(values).find(k =>
          (i <= 7 && new RegExp(`gambar\\s*${i}`, 'i').test(k)) ||
          (i > 7 && new RegExp(`gambar\\s*produk\\s*${i}`, 'i').test(k))
        );
        if (imgKey && values[imgKey]) images.push(values[imgKey]);
      }

      const skuId = getVal(values, /sku penjual/i) || `SKU-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      const inventoryItem = new Inventory({
        user: req.user.id,
        product_name: productName,
        description: getVal(values, /deskripsi/i),
        category_id: getVal(values, /kategori/i),
        brand: getVal(values, /merek/i),
        imageUrl: getVal(values, /gambar utama/i),
        images,
        variant_name_1: getVal(values, /nama varian utama/i),
        variant_name_2: getVal(values, /nama varian sekunder/i),
        parcel_weight: Number(getVal(values, /berat/i)) || undefined,
        parcel_length: Number(getVal(values, /panjang/i)) || undefined,
        parcel_width: Number(getVal(values, /lebar/i)) || undefined,
        parcel_height: Number(getVal(values, /tinggi/i)) || undefined,
        minimum_order_quantity: Number(getVal(values, /minimum/i)) || undefined,
        size_chart: getVal(values, /bagan/i),
        skus: [{
          sku_id: skuId,
          stock_info: { available_stock: Number(getVal(values, /kuantitas/i)) || 0 },
          price_info: { original_price: Number(getVal(values, /harga/i)) || 0 },
          variant_value_1: getVal(values, /nilai varian utama/i),
          variant_value_2: getVal(values, /nilai varian sekunder/i),
          variant_image: getVal(values, /gambar varian/i),
        }]
      });

      await inventoryItem.save();
      savedProducts.push(inventoryItem);
    }

    // Rebuild sheet with data
    const newData = [headers, requiredRow, descRow, ...dataRows];
    workbook.Sheets['Template'] = XLSX.utils.aoa_to_sheet(newData);

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="tiktok_filled_${Date.now()}.xlsx"`);
    res.setHeader('X-Saved-Products', savedProducts.length.toString());
    res.send(buffer);

  } catch (err) {
    console.error('Fill & export error:', err);
    res.status(500).json({ msg: 'Gagal export data.' });
  }
});

module.exports = router;
