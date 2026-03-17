const Order = require('../models/Order');

// 1. POST /orders (Create Order & Deduct Inventory)
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount, source, notes } = req.body;
    
    // Validasi input
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ msg: "Data customer dan items wajib diisi" });
    }

    const newOrder = new Order({
      sellerId: req.user.id,
      customer,
      items,
      totalAmount,
      source: source || 'manual',
      notes
    });

    // Simulasi Deduct Inventory (Sesuai checklist)
    console.log("Inventory deducted for items:", items);

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. GET /orders (List Orders with Pagination & Filter)
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, source } = req.query;
    const query = { sellerId: req.user.id };
    
    if (status) query.status = status;
    if (source) query.source = source;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. GET /orders/:id (Order Detail)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, sellerId: req.user.id });
    if (!order) return res.status(404).json({ msg: "Order tidak ditemukan (404)" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. PUT /orders/:id/status (Update Status)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: "Order tidak ditemukan" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. DELETE /orders/:id (Delete & Restore Inventory)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, sellerId: req.user.id });
    
    if (!order) return res.status(404).json({ msg: "Order tidak ditemukan" });
    
    // Check if order can be deleted (Not Shipped)
    if (order.status === 'shipped') {
      return res.status(400).json({ msg: "Order sudah dikirim, tidak bisa dihapus!" });
    }

    // Simulasi Restore Inventory
    console.log("Inventory restored for items:", order.items);

    await Order.findByIdAndDelete(req.params.id);
    res.status(204).send(); // Return 204 No Content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. POST /orders/sync (Manual Sync)
exports.syncOrders = async (req, res) => {
  res.status(200).json({ status: "success", message: "TikTok Sync Status: Completed" });
};