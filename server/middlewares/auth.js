const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'غير مصرح' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'qurani-secret-key-2024')
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'المستخدم غير موجود' })

    next()
  } catch {
    res.status(401).json({ message: 'رمز غير صالح' })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'غير مسموح' })
  next()
}

const teacherOrAdmin = (req, res, next) => {
  if (!['teacher', 'admin'].includes(req.user?.role)) return res.status(403).json({ message: 'غير مسموح' })
  next()
}

module.exports = { protect, adminOnly, teacherOrAdmin }
