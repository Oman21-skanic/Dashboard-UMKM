const Inventory = require('../models/Inventory');

/**
 * Mengurangi stok inventori berdasarkan item_list dari pesanan.
 * @param {Array} itemList - Array of items { sku_id, quantity }
 * @returns {Object} - { success: boolean, message: string }
 */
const deductStock = async (itemList) => {
  try {
    // 1. Validasi awal: Cek apakah semua stok mencukupi sebelum melakukan update
    for (const item of itemList) {
      if (!item.sku_id) continue; // Skip jika item manual tanpa SKU yang terdaftar

      const product = await Inventory.findOne({ "skus.sku_id": item.sku_id });
      if (!product) {
        return { success: false, message: `Produk dengan SKU ${item.sku_id} tidak ditemukan.` };
      }

      const sku = product.skus.find(s => s.sku_id === item.sku_id);
      if (sku.stock_info.available_stock < item.quantity) {
        return { success: false, message: `Stok produk ${product.product_name} (${item.sku_id}) tidak mencukupi. Sisa: ${sku.stock_info.available_stock}` };
      }
    }

    // 2. Lakukan pengurangan stok
    for (const item of itemList) {
      if (!item.sku_id) continue;

      await Inventory.updateOne(
        { "skus.sku_id": item.sku_id },
        { $inc: { "skus.$.stock_info.available_stock": -item.quantity } }
      );
    }

    return { success: true };
  } catch (err) {
    console.error('Error deductStock:', err);
    return { success: false, message: 'Terjadi kesalahan sistem saat memproses stok.' };
  }
};

module.exports = { deductStock };
