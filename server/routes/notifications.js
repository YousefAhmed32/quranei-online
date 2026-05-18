const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/auth');
const { Notification } = require('../models/index');

// GET /api/notifications — get user notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/:id/read — mark as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/read-all — mark all as read
router.patch('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/notifications/broadcast — admin: send to all students
router.post('/broadcast', protect, adminOnly, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const User = require('../models/User');
    const students = await User.find({ role: 'student' }, '_id');
    const notifications = students.map(s => ({
      userId: s._id,
      title,
      message,
      type: type || 'announcement',
    }));
    await Notification.insertMany(notifications);
    res.json({ success: true, count: notifications.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
