const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const authenticateToken = require('../middleware/authenticateToken');

// GET all inventory items for the user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await Inventory.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create a new inventory item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id, product_name, description, category_id, imageUrl, skus } = req.body;

    if (!product_name || !skus || skus.length === 0) {
      return res.status(400).json({ msg: 'Mohon lengkapi data produk' });
    }

    const item = new Inventory({
      user: req.user.id,
      product_id,
      product_name,
      description,
      category_id,
      imageUrl,
      skus
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
    const { product_id, product_name, description, category_id, imageUrl, skus } = req.body;
    
    let item = await Inventory.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

    item.product_id = product_id || item.product_id;
    item.product_name = product_name || item.product_name;
    item.description = description != null ? description : item.description;
    item.category_id = category_id || item.category_id;
    item.imageUrl = imageUrl != null ? imageUrl : item.imageUrl;
    item.skus = skus != null ? skus : item.skus;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE an inventory item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Inventory.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ msg: 'Produk tidak ditemukan' });
    
    await item.deleteOne();
    res.json({ msg: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
