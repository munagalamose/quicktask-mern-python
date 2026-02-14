const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

function generateToken(user) {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await User.create({ email, password, name: name || '' });
    const token = generateToken(user);
    res.status(201).json({
      user: { id: user._id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.json({
      user: { id: user._id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed' });
  }
});

// GET /api/auth/me (protected)
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
