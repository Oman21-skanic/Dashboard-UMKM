const express = require('express');
const router = express.Router();
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

module.exports = router;