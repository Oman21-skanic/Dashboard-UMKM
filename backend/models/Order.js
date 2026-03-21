const mongoose = require('mongoose');

<<<<<<< HEAD
const OrderSchema = new mongoose.Schema({
  // Menghubungkan order dengan user yang login (seller)
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Data Pembeli
  customer: {
    name: { type: String, required: true },
    phone: String,
    address: String
  },
  
  // Daftar Barang (Array)
  items: [{
    productId: String, 
    name: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  
  totalAmount: { type: Number, required: true },
  source: { type: String, enum: ['manual', 'tiktok'], default: 'manual' },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered'], 
    default: 'pending' 
  },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
=======
const orderItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  source: {
    type: String,
    enum: ['Manual', 'TikTok', 'Instagram', 'Tokopedia'],
    default: 'Manual'
  },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
>>>>>>> 093a0760f0a704a3d96b3ec519bf726e3effef2b
