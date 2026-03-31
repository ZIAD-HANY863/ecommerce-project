const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const productsPath = path.join(__dirname, '../data/products.json');
const ordersPath = path.join(__dirname, '../data/orders.json');
const contactsPath = path.join(__dirname, '../data/contacts.json');

router.get('/products', async (req, res) => {
  try {
    const data = await fs.readFile(productsPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const newOrder = req.body;
    newOrder.id = Date.now();
    newOrder.createdAt = new Date().toISOString();
    const data = await fs.readFile(ordersPath, 'utf8');
    const orders = JSON.parse(data);
    orders.push(newOrder);
    await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2));
    res.status(201).json({ message: 'Order saved', orderId: newOrder.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save order' });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const message = req.body;
    message.id = Date.now();
    message.createdAt = new Date().toISOString();
    const data = await fs.readFile(contactsPath, 'utf8');
    const messages = JSON.parse(data);
    messages.push(message);
    await fs.writeFile(contactsPath, JSON.stringify(messages, null, 2));
    res.status(201).json({ message: 'Message saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;