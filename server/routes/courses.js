// server/routes/courses.js
"use strict";

const express = require("express");
const router  = express.Router();
const Course  = require("../models/Course");
const { protect, adminOnly } = require("../middlewares/auth");

/* ─── helper: نظّف الـ body قبل ما يوصل لـ mongoose ───────────────────────────
   ⚠️  IMPORTANT: هذه الدالة تعمل مع FULL saves و Partial updates.
       لضمان عدم الكتابة فوق حقول غير مرسلة، نتحقق من وجود الحقل في الـ body
       قبل تعديله (باستخدام 'key' in data).
   ─────────────────────────────────────────────────────────────────────────── */
function sanitizeCourse(body) {
  const data = { ...body };

  // ✅ pricingType + price — فقط إذا pricingType موجود في الطلب
  if ('pricingType' in data) {
    if (!['free', 'paid', 'contact'].includes(data.pricingType)) {
      data.pricingType = 'contact';
    }
    if (data.pricingType !== 'paid') data.price = 0;
  }

  // ✅ حقول رقمية — احذفها لو فاضية (وهي موجودة في الطلب)
  ['lessonsCount','studentsCount','rating','reviewsCount','price'].forEach(f => {
    if (f in data && (data[f] === '' || data[f] === undefined)) delete data[f];
  });

  // ✅ priorityOrder — فقط إذا موجود في الطلب
  if ('priorityOrder' in data) {
    if (data.priorityOrder === '' || data.priorityOrder === null || data.priorityOrder === undefined) {
      data.priorityOrder = 999;
    }
  }

  // ✅ حقول نصية — نظّف null/undefined فقط إذا الحقل موجود في الطلب
  const textFields = ['shortDescription','description','thumbnail','heroVideo',
                      'teacherName','currency','whatsapp','ctaText',
                      'duration','seoTitle','seoDescription'];
  textFields.forEach(f => {
    if (f in data && (data[f] === null || data[f] === undefined)) data[f] = '';
  });

  // ✅ arrays — نظّف فقط إذا الحقل موجود في الطلب
  ['learningOutcomes','targetStudents','highlights','tags'].forEach(f => {
    if (f in data && !Array.isArray(data[f])) data[f] = [];
  });

  // ✅ Multi-category support — backward compatible
  //    RULE: لا نلمس categories إلا إذا كانت موجودة صراحةً في الطلب.
  //    هذا يمنع partial updates (مثل toggle publish) من مسح التصنيفات.
  if (Array.isArray(data.categories)) {
    // الحالة الجديدة: categories array مرسلة صراحةً من الـ frontend
    data.categories = data.categories.filter(c => typeof c === 'string' && c.trim());
    // زامِن الحقل القديم (legacy) مع أول تصنيف
    if (data.categories.length > 0) {
      data.category = data.categories[0];
    }
  } else if ('categories' in data) {
    // categories موجودة لكن ليست array — نعاملها كـ empty
    data.categories = [];
  } else if ('category' in data) {
    // Legacy path: فقط category القديمة مرسلة (client قديم) → اشتقّ categories منها
    data.categories = data.category ? [data.category] : [];
  }
  // إذا لم تكن categories ولا category في الطلب (partial update مثل { isPublished: true })
  // → لا نلمس أي حقل → البيانات الموجودة في قاعدة البيانات تبقى كما هي ✅

  return data;
}

// ── Public ─────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { search, category, level } = req.query;
    const filter = { isPublished: true };

    // ✅ Backward-compatible category filter:
    //    Matches docs with the new `categories` array OR the legacy `category` field.
    if (category) {
      filter.$or = [
        { categories: category },   // new multi-cat documents
        { category:   category },   // legacy single-cat documents
      ];
    }
    if (level)    filter.level = level;
    if (search)   filter.title = { $regex: search, $options: "i" };

    const courses = await Course.find(filter)
      .sort({ featured: -1, priorityOrder: 1, createdAt: -1 })
      .populate("teacher", "fullName imageUrl");

    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true, featured: true })
      .sort({ priorityOrder: 1 })
      .limit(6);
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin ──────────────────────────────────────────────────────────────────────
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const { search, category, isPublished } = req.query;
    const filter = {};

    // ✅ Same backward-compatible category filter as the public route
    if (category) {
      filter.$or = [
        { categories: category },
        { category:   category },
      ];
    }
    if (isPublished === "true")  filter.isPublished = true;
    if (isPublished === "false") filter.isPublished = false;
    if (search) filter.title = { $regex: search, $options: "i" };

    const courses = await Course.find(filter)
      .sort({ priorityOrder: 1, createdAt: -1 })
      .populate("teacher", "fullName");

    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/create", protect, adminOnly, async (req, res) => {
  try {
    const payload = sanitizeCourse(req.body);
    const course  = await Course.create(payload);
    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const payload = sanitizeCourse(req.body);
    // ✅ استخدم $set صراحةً لضمان تحديث حقل categories كـ array كاملة
    //    (بدون $set قد يتصرف Mongoose بشكل مختلف مع arrays في بعض الإصدارات)
    const course  = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: false }
    );
    if (!course) return res.status(404).json({ success: false, message: "الدورة غير موجودة" });
    res.json({ success: true, course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "تم حذف الدورة" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admin/reorder", protect, adminOnly, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    await Promise.all(
      (orderedIds || []).map(({ id, priorityOrder }) =>
        Course.findByIdAndUpdate(id, { priorityOrder })
      )
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Public slug — must be last ─────────────────────────────────────────────────
router.get("/:slug", async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isPublished: true })
      .populate("teacher", "fullName imageUrl bio");
    if (!course) return res.status(404).json({ success: false, message: "الدورة غير موجودة" });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;