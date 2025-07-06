const express  = require('express');
const { body, validationResult } = require('express-validator');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const auth     = require('../middleware/auth');

const router = express.Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

/* ───────── REGISTER ───────── */
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).isAlphanumeric(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { username, email, password } = req.body;
    try {
      if (await User.findOne({ $or: [{ email }, { username }] })) {
        return res.status(409).json({ success: false, message: 'User already exists' });
      }

      const user = await User.create({ username, email, password });
      return res.status(201).json({
        success: true,
        token:   sign(user._id),
        user:    { id: user._id, username: user.username, email: user.email }
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/* ───────── LOGIN ───────── */
router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
        token:   sign(user._id),
        user:    { id: user._id, username: user.username, email: user.email, lastLogin: user.lastLogin }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/* ───────── ME ───────── */
router.get('/me', auth, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
