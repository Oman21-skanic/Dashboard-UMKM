const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const authenticateToken = require('../middleware/authenticateToken');

// GET all inventory items for the user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await Inventory.find({ user: req.user.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create a new inventory item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, sku, category, price, stock, imageUrl, description } = req.body;

    if (!name || !sku || !category || price == null || stock == null) {
      return res.status(400).json({ msg: 'Mohon lengkapi data produk' });
    }

    const item = new Inventory({
      user: req.user.user.id,
      name,
      sku,
      category,
      price,
      stock,
      imageUrl,
      description
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT update an inventory item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, sku, category, price, stock, imageUrl, description } = req.body;
    
    let item = await Inventory.findOne({ _id: req.params.id, user: req.user.user.id });
    if (!item) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

    item.name = name || item.name;
    item.sku = sku || item.sku;
    item.category = category || item.category;
    item.price = price != null ? price : item.price;
    item.stock = stock != null ? stock : item.stock;
    item.imageUrl = imageUrl != null ? imageUrl : item.imageUrl;
    item.description = description != null ? description : item.description;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE an inventory item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Inventory.findOne({ _id: req.params.id, user: req.user.user.id });
    if (!item) return res.status(404).json({ msg: 'Produk tidak ditemukan' });
    
    await item.deleteOne();
    res.json({ msg: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
