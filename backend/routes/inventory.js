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
    const {
      product_id, product_name, description, category_id, imageUrl, skus,
      brand, images, variant_name_1, variant_name_2,
      parcel_weight, parcel_length, parcel_width, parcel_height,
      minimum_order_quantity, size_chart
    } = req.body;

    if (!product_name || !skus || skus.length === 0) {
      return res.status(400).json({ msg: 'Mohon lengkapi data produk' });
    }

    const item = new Inventory({
      user: req.user.id,
      product_id, product_name, description, category_id, imageUrl, skus,
      brand, images, variant_name_1, variant_name_2,
      parcel_weight, parcel_length, parcel_width, parcel_height,
      minimum_order_quantity, size_chart
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
    const {
      product_id, product_name, description, category_id, imageUrl, skus,
      brand, images, variant_name_1, variant_name_2,
      parcel_weight, parcel_length, parcel_width, parcel_height,
      minimum_order_quantity, size_chart
    } = req.body;

    let item = await Inventory.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ msg: 'Produk tidak ditemukan' });

    item.product_id = product_id || item.product_id;
    item.product_name = product_name || item.product_name;
    item.description = description != null ? description : item.description;
    item.category_id = category_id || item.category_id;
    item.imageUrl = imageUrl != null ? imageUrl : item.imageUrl;
    item.skus = skus != null ? skus : item.skus;
    // New TikTok fields
    if (brand != null) item.brand = brand;
    if (images != null) item.images = images;
    if (variant_name_1 != null) item.variant_name_1 = variant_name_1;
    if (variant_name_2 != null) item.variant_name_2 = variant_name_2;
    if (parcel_weight != null) item.parcel_weight = parcel_weight;
    if (parcel_length != null) item.parcel_length = parcel_length;
    if (parcel_width != null) item.parcel_width = parcel_width;
    if (parcel_height != null) item.parcel_height = parcel_height;
    if (minimum_order_quantity != null) item.minimum_order_quantity = minimum_order_quantity;
    if (size_chart != null) item.size_chart = size_chart;

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
