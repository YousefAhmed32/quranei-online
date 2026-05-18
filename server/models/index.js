const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  progressPercentage: { type: Number, default: 0 },
  lastViewedLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  updatedAt: { type: Date, default: Date.now },
})

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: String, enum: ['basic', 'gold', 'vip'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'expired'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String, default: 'whatsapp' },
  startedAt: { type: Date },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

const aiChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{ role: { type: String, enum: ['user', 'assistant'] }, content: String, timestamp: { type: Date, default: Date.now } }],
  sessionId: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String },
  type: { type: String, enum: ['info', 'success', 'warning', 'approval'], default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

module.exports = {
  Progress: mongoose.model('Progress', progressSchema),
  Subscription: mongoose.model('Subscription', subscriptionSchema),
  AIChat: mongoose.model('AIChat', aiChatSchema),
  Review: mongoose.model('Review', reviewSchema),
  Notification: mongoose.model('Notification', notificationSchema),
}
