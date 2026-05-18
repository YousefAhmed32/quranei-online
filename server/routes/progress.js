// progress.js
const express = require('express')
const router = express.Router()
const { Progress } = require('../models/index')
const { protect } = require('../middlewares/auth')

router.get('/my', protect, async (req, res) => {
  const progress = await Progress.find({ studentId: req.user._id }).populate('courseId', 'title')
  res.json(progress)
})

router.post('/complete-lesson', protect, async (req, res) => {
  const { courseId, lessonId } = req.body
  let progress = await Progress.findOne({ studentId: req.user._id, courseId })
  if (!progress) {
    progress = await Progress.create({ studentId: req.user._id, courseId, completedLessons: [lessonId] })
  } else {
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId)
    }
    progress.lastViewedLesson = lessonId
    progress.updatedAt = Date.now()
    await progress.save()
  }
  res.json(progress)
})

module.exports = router
