const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { Review } = require('../models/index');

// GET /api/reviews/course/:courseId
router.get('/course/:courseId', async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId, isApproved: true })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const existing = await Review.findOne({ courseId, userId: req.user._id });
    if (existing) return res.status(400).json({ message: 'لقد قمت بتقييم هذا الكورس مسبقاً' });
    const review = await Review.create({ courseId, userId: req.user._id, rating, comment });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
