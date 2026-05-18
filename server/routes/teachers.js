const express = require('express')
const router = express.Router()
const Teacher = require('../models/Teacher')
const { protect, adminOnly } = require('../middlewares/auth')

// Public - list all active teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find({ active: true })
      .sort({ displayOrder: 1, createdAt: -1 })
    res.json({ success: true, teachers })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Admin - all teachers
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ displayOrder: 1, createdAt: -1 })
    res.json({ success: true, teachers })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

router.post('/admin/create', protect, adminOnly, async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body)
    res.status(201).json({ success: true, teacher })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

router.put('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!teacher) return res.status(404).json({ success: false, message: 'المعلم غير موجود' })
    res.json({ success: true, teacher })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'تم حذف المعلم' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// Public - get single teacher by ID or slug (must come after /admin/*)
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params
    // Try by ID first, then by slug
    let teacher = null
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      teacher = await Teacher.findById(identifier)
    }
    if (!teacher) {
      teacher = await Teacher.findOne({ slug: identifier })
    }
    if (!teacher) return res.status(404).json({ success: false, message: 'المعلم غير موجود' })
    res.json({ success: true, teacher })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
