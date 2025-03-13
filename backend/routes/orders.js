const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

// Middleware to verify user
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create order (for checkout)
router.post('/', authenticate, async (req, res) => {
  const { items, total } = req.body;
  const order = new Order({
    user: req.userId,
    items,
    total,
    status: 'pending'
  });
  await order.save();
  res.status(201).json(order);
});

module.exports = router;