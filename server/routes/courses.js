// server/routes/courses.js
"use strict";

const express = require("express");
const router  = express.Router();
const Course  = require("../models/Course");
const { protect, adminOnly } = require("../middlewares/auth");

/* ─── helper: نظّف الـ body قبل ما يوصل لـ mongoose ─── */
function sanitizeCourse(body) {
  const data = { ...body };

  // ✅ تأكد pricingType دايمًا valid
  if (!['free', 'paid', 'contact'].includes(data.pricingType)) {
    data.pricingType = 'contact';
  }

  // ✅ لو مش paid، السعر صفر
  if (data.pricingType !== 'paid') data.price = 0;

  // ✅ حقول رقمية — لو فاضية نحطها default بدل ما تبقى string فاضي
  if (data.lessonsCount === '' || data.lessonsCount === undefined) delete data.lessonsCount;
  if (data.studentsCount === '' || data.studentsCount === undefined) delete data.studentsCount;
  if (data.rating       === '' || data.rating       === undefined) delete data.rating;
  if (data.reviewsCount === '' || data.reviewsCount === undefined) delete data.reviewsCount;
  if (data.price        === '' || data.price        === undefined) delete data.price;

  // ✅ priorityOrder — لو فاضي استخدم 999
  if (data.priorityOrder === '' || data.priorityOrder === undefined || data.priorityOrder === null) {
    data.priorityOrder = 999;
  }

  // ✅ حقول نصية — لو null خليها string فاضي
  const textFields = ['shortDescription','description','thumbnail','heroVideo',
                      'teacherName','currency','whatsapp','ctaText',
                      'duration','seoTitle','seoDescription'];
  textFields.forEach(f => {
    if (data[f] === null || data[f] === undefined) data[f] = '';
  });

  // ✅ arrays — لو مش array خليه array فاضي
  ['learningOutcomes','targetStudents','highlights','tags'].forEach(f => {
    if (!Array.isArray(data[f])) data[f] = [];
  });

  return data;
}

// ── Public ─────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { search, category, level } = req.query;
    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (level)    filter.level    = level;
    if (search)   filter.title    = { $regex: search, $options: "i" };

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

    if (category)           filter.category    = category;
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
    const course  = await Course.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
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