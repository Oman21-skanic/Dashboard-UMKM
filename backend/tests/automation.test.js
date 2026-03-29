const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Inventory = require('../models/Inventory');

describe('Inventory & Orders API (Automation)', () => {
  let token = '';
  let userId = '';
  const testSku = 'SKU-JEST-' + Date.now();

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create test user and login
    const email = `tester-${Date.now()}@test-jest.com`;
    const user = new User({ email, password: 'hashedpassword', businessName: 'Test' });
    await user.save();
    userId = user._id;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'password123' }); // Note: This assumes simple login or requires real hashing for real DB test
    // To make it simpler for Jest, let's just bypass login or use a fixed test token if possible.
    // Actually, I'll just use the /api/auth/register then login flow for a real integration test.
  });

  afterAll(async () => {
    await User.deleteMany({ email: /@test-jest\.com/ });
    await Inventory.deleteMany({ "skus.sku_id": /SKU-JEST-/ });
    await mongoose.connection.close();
  });

  test('Integration: Setup, Order, and Auto-Deduct Stock', async () => {
    // 1. Register & Login
    const email = `flow-${Date.now()}@test-jest.com`;
    await request(app).post('/api/auth/register').send({ email, password: 'password123', businessName: 'Flow' });
    const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'password123' });
    token = loginRes.data?.token || loginRes.body.token;

    // 2. Create Product (Stock: 50)
    const invRes = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product_name: 'Product Jest',
        skus: [{
          sku_id: testSku,
          stock_info: { available_stock: 50 },
          price_info: { original_price: 10000 }
        }]
      });
    expect(invRes.statusCode).toEqual(201);

    // 3. Create Order (10 units)
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        shipping_info: { buyer_name: 'Jest', buyer_phone: '123', buyer_address: 'Jest St' },
        payment_info: { total_amount: 100000 },
        item_list: [{ sku_id: testSku, product_name: 'Product Jest', quantity: 10, subtotal: 100000 }]
      });
    expect(orderRes.statusCode).toEqual(201);

    // 4. Verify Stock (Expect: 40)
    const verifyRes = await request(app)
      .get('/api/inventory')
      .set('Authorization', `Bearer ${token}`);
    const item = verifyRes.body.find(i => i.skus[0].sku_id === testSku);
    expect(item.skus[0].stock_info.available_stock).toEqual(40);

    // 5. Test Over-Order (Expect: 400 Bad Request)
    const failRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        shipping_info: { buyer_name: 'Jest', buyer_phone: '123', buyer_address: 'Jest St' },
        payment_info: { total_amount: 500000 },
        item_list: [{ sku_id: testSku, product_name: 'Product Jest', quantity: 41, subtotal: 410000 }]
      });
    expect(failRes.statusCode).toEqual(400);
    expect(failRes.body.msg).toMatch(/tidak mencukupi/);
  });
});
