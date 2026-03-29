const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  sku_id: { type: String },
  product_id: { type: String },
  product_name: { type: String, required: true },
  sku_name: { type: String },
  quantity: { type: Number, required: true },
  sku_original_price: { type: Number },
  subtotal: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_id: { type: String, unique: true, sparse: true },
  buyer_email: { type: String },
  buyer_message: { type: String },
  payment_info: {
    total_amount: { type: Number, required: true },
    original_total_product_price: { type: Number },
    shipping_fee: { type: Number },
    platform_discount: { type: Number }
  },
  shipping_info: {
    buyer_name: { type: String, required: true },
    buyer_phone: { type: String, required: true },
    buyer_address: { type: String, required: true },
    tracking_number: { type: String }
  },
  item_list: [orderItemSchema],
  order_status: {
    type: String,
    enum: ['UNPAID', 'AWAITING_SHIPMENT', 'AWAITING_COLLECTION', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED'],
    default: 'AWAITING_SHIPMENT'
  },
  source: {
    type: String,
    enum: ['Manual', 'TikTok', 'Instagram', 'Tokopedia'],
    default: 'Manual'
  },
  create_time: { type: Number },
  update_time: { type: Number },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
