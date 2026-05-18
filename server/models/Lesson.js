const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  videoType: { type: String, enum: ['upload', 'youtube', 'vimeo', 'external', 'audio'], default: 'upload' },
  videoUrl: { type: String, default: '' },
  mediaId: { type: mongoose.Schema.Types.ObjectId },
  attachments: [{ name: String, url: String, type: String }],
  duration: { type: Number, default: 0 }, // seconds
  order: { type: Number, default: 0 },
  isPreview: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Lesson', lessonSchema)
