const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { Subscription, Notification } = require('../models/index')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'qurani-secret-key-2024', { expiresIn: '30d' })

exports.register = async (req, res) => {
  try {
    const { name, email, password, country, selectedPackage } = req.body

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'البريد الإلكتروني مسجل بالفعل' })
    }

    const user = await User.create({
      name, email, password, country,
      selectedPackage: selectedPackage || 'gold',
      subscriptionStatus: 'pending',
    })

    // Create subscription request
    await Subscription.create({ userId: user._id, package: selectedPackage || 'gold', status: 'pending' })

    res.status(201).json({
      success: true,
      message: 'تم التسجيل بنجاح! سيتواصل معك فريقنا قريباً لتفعيل الحساب.',
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    }

    if (!user.isActive) return res.status(403).json({ message: 'الحساب موقوف' })

    res.json({
      success: true,
      token: generateToken(user._id),
      user: user.toSafeObject(),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getMe = async (req, res) => {
  res.json({ user: req.user.toSafeObject() })
}
