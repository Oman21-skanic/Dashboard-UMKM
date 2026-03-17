const mongoose = require('mongoose');

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