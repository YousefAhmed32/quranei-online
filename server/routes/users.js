// users.js
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { protect, adminOnly } = require('../middlewares/auth')

router.get('/', protect, adminOnly, async (req, res) => {
  const { role, status, page = 1, limit = 20 } = req.query
  const filter = {}
  if (role) filter.role = role
  if (status) filter.subscriptionStatus = status
  const users = await User.find(filter).select('-password').limit(limit).skip((page - 1) * limit).sort({ createdAt: -1 })
  const total = await User.countDocuments(filter)
  res.json({ users, total, pages: Math.ceil(total / limit) })
})

router.patch('/:id/approve', protect, adminOnly, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { subscriptionStatus: 'approved' }, { new: true }).select('-password')
  res.json({ user })
})

router.patch('/:id/reject', protect, adminOnly, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { subscriptionStatus: 'rejected' }, { new: true }).select('-password')
  res.json({ user })
})

router.get('/stats', protect, adminOnly, async (req, res) => {
  const total = await User.countDocuments()
  const students = await User.countDocuments({ role: 'student' })
  const pending = await User.countDocuments({ subscriptionStatus: 'pending' })
  const approved = await User.countDocuments({ subscriptionStatus: 'approved' })
  res.json({ total, students, pending, approved })
})

module.exports = router
