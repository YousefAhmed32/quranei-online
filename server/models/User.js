const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },
  country: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  subscriptionStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'expired'], default: 'pending' },
  selectedPackage: { type: String, enum: ['basic', 'gold', 'vip'], default: 'gold' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.matchPassword = async function(pw) {
  return bcrypt.compare(pw, this.password)
}

userSchema.methods.toSafeObject = function() {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('User', userSchema)
