const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema({
  sku_id: { type: String, required: true },
  stock_info: {
    available_stock: { type: Number, required: true }
  },
  price_info: {
    original_price: { type: Number, required: true }
  }
});

const inventorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: String, sparse: true },
  product_name: { type: String, required: true },
  description: { type: String, default: '' },
  category_id: { type: String },
  imageUrl: { type: String, default: '' },
  skus: [skuSchema]
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
