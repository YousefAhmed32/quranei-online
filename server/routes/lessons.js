// lessons.js
const express = require('express')
const router = express.Router()
const Lesson = require('../models/Lesson')
const { protect, adminOnly } = require('../middlewares/auth')

router.get('/course/:courseId', protect, async (req, res) => {
  const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({ order: 1 })
  res.json(lessons)
})

router.post('/', protect, adminOnly, async (req, res) => {
  const lesson = await Lesson.create(req.body)
  res.status(201).json(lesson)
})

router.put('/:id', protect, adminOnly, async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(lesson)
})

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.id)
  res.json({ message: 'تم حذف الدرس' })
})

module.exports = router
