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
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items, notes, source } = req.body;

    if (!customerName || !customerPhone || !customerAddress || !items || items.length === 0) {
      return res.status(400).json({ msg: 'Semua field wajib diisi' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    const order = new Order({
      user: req.user.id,
      customerName,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
      notes,
      source: source || 'Manual'
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
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: 'Order tidak ditemukan' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE order (hanya jika Pending)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ msg: 'Order tidak ditemukan' });
    if (order.status !== 'Pending') {
      return res.status(400).json({ msg: 'Hanya order Pending yang bisa dihapus' });
    }
    await order.deleteOne();
    res.json({ msg: 'Order berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;