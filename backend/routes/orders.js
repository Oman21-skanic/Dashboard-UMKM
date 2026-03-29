const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateToken = require('../middleware/authenticateToken');

// GET semua orders milik user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST buat order baru
const { deductStock } = require('../utils/inventoryHelper');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { order_id, buyer_email, buyer_message, payment_info, shipping_info, item_list, source, notes } = req.body;

    if (!shipping_info || !shipping_info.buyer_name || !item_list || item_list.length === 0 || !payment_info || payment_info.total_amount == null) {
      return res.status(400).json({ msg: 'Semua field wajib diisi' });
    }

    // OTOMATISASI: Kurangi stok sebelum menyimpan order
    const stockResult = await deductStock(item_list);
    if (!stockResult.success) {
      return res.status(400).json({ msg: stockResult.message });
    }

    const order = new Order({
      user: req.user.id,
      order_id,
      buyer_email,
      buyer_message,
      payment_info,
      shipping_info,
      item_list,
      source: source || 'Manual',
      notes,
      create_time: Date.now(),
      update_time: Date.now()
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update status order
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { order_status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { order_status, update_time: Date.now() },
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: 'Order tidak ditemukan' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE order (hanya jika AWAITING_SHIPMENT atau UNPAID)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ msg: 'Order tidak ditemukan' });
    if (order.order_status !== 'AWAITING_SHIPMENT' && order.order_status !== 'UNPAID') {
      return res.status(400).json({ msg: 'Hanya order yang belum diproses yang bisa dihapus' });
    }
    await order.deleteOne();
    res.json({ msg: 'Order berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;