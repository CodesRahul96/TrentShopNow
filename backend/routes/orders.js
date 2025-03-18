const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, async (req, res) => {
  const { items, total, shippingAddress, paymentMethod } = req.body;
  try {
    const order = new Order({
      user: req.userId,
      items: items.map(item => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total,
      shippingAddress,
      paymentMethod
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

router.get('/', authenticate, async (req, res) => {
  const orders = await Order.find({ user: req.userId })
    .populate('items.product', 'name price');
  res.json(orders);
});

// New endpoint to cancel an order
router.put('/cancel/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'pending') return res.status(400).json({ message: 'Only pending orders can be cancelled' });

    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Failed to cancel order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

module.exports = router;