const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/authenticateToken');

// ==========================================
// Task 1 - 6: Fitur Manajemen Pesanan (Orders)
// ==========================================

// 1. POST /orders (Create Order)
router.post('/', authenticateToken, orderController.createOrder);

// 2. GET /orders (List Orders)
router.get('/', authenticateToken, orderController.getOrders);

// 3. GET /orders/:id (Order Detail)
router.get('/:id', authenticateToken, orderController.getOrderById);

// 4. PUT /orders/:id/status (Update Status)
router.put('/:id/status', authenticateToken, orderController.updateStatus);

// 5. DELETE /orders/:id (Delete Order)
router.delete('/:id', authenticateToken, orderController.deleteOrder);

// 6. POST /orders/sync (Manual Sync TikTok)
router.post('/sync', authenticateToken, orderController.syncOrders);
=======
const Order = require('../models/Order');
const authenticateToken = require('../middleware/authenticateToken');

// GET semua orders milik user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.user.id })
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
      user: req.user.user.id,
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
      { _id: req.params.id, user: req.user.user.id },
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
    const order = await Order.findOne({ _id: req.params.id, user: req.user.user.id });
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
>>>>>>> 093a0760f0a704a3d96b3ec519bf726e3effef2b

module.exports = router;