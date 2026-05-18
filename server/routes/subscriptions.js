const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/auth');
const { Subscription } = require('../models/index');

// GET /api/subscriptions — admin: all subscriptions
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const subs = await Subscription.find({})
      .populate('userId', 'name email selectedPackage')
      .sort({ createdAt: -1 });
    res.json({ success: true, subscriptions: subs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/subscriptions/my — student: own subscription
router.get('/my', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ userId: req.user._id });
    res.json({ success: true, subscription: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/subscriptions/:id — admin: update status
router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, package: pkg, expiresAt } = req.body;
    const sub = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status, package: pkg, expiresAt },
      { new: true }
    );
    res.json({ success: true, subscription: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
