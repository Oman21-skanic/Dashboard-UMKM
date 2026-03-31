const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema({
  sku_id: { type: String, required: true },
  stock_info: {
    available_stock: { type: Number, required: true }
  },
  price_info: {
    original_price: { type: Number, required: true }
  },
  // Variant values per SKU row
  variant_value_1: { type: String, default: '' },
  variant_value_2: { type: String, default: '' },
  variant_image: { type: String, default: '' }
});

const inventorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: String, sparse: true },
  product_name: { type: String, required: true },
  description: { type: String, default: '' },
  category_id: { type: String },
  imageUrl: { type: String, default: '' },
  skus: [skuSchema],

  // === TikTok Shop fields ===
  brand: { type: String, default: '' },
  images: { type: [String], default: [] },           // gambar 2-9 (up to 8 URLs)

  // Variant theme names (shared across all SKUs)
  variant_name_1: { type: String, default: '' },      // e.g. "Warna"
  variant_name_2: { type: String, default: '' },      // e.g. "Ukuran"

  // Package dimensions
  parcel_weight: { type: Number },                     // gram
  parcel_length: { type: Number },                     // cm
  parcel_width: { type: Number },                      // cm
  parcel_height: { type: Number },                     // cm

  // Optional fields
  minimum_order_quantity: { type: Number },
  size_chart: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
