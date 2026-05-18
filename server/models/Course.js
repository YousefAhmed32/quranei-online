// server/models/Course.js
"use strict";

const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },

    // ✅ Fixed: matches exactly what CoursesPage admin sends
   category: {
  type: String,
  enum: [
    "tajweed",
    "makhraj",
    "memorization",
    "recitation",
    "ijazah",
    "correction",
    "arabic",
    "foundation",
  ],
  required: true,
},

level: {
  type: String,
  enum: [
    "beginner",
    "intermediate",
    "advanced",
    "all"
  ],
  required: true,
},

    price:    { type: Number, default: 0 },
    duration: { type: String, default: "" },

    // Media
    thumbnail: { type: String, default: null }, // media ObjectId or URL
    image:     { type: String, default: null },

    // Teacher ref
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null },

    // Flags
    isActive:    { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false }, // alias kept for compat
    featured:    { type: Boolean, default: false },

    // Display & ordering
    priorityOrder:    { type: Number, default: 999 },
    shortDescription: { type: String, default: "" },

    // Stats
    studentsCount: { type: Number, default: 0 },
    lessonsCount:  { type: Number, default: 0 },
    rating:        { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount:  { type: Number, default: 0 },

    // Pricing display
    pricingType: { type: String, enum: ["free", "paid"], default: "paid" },
    currency:    { type: String, default: "ريال" },
    showPrice:   { type: Boolean, default: true },

    // CTA
    ctaText:  { type: String, default: "اشترك الآن" },
    whatsapp: { type: String, default: "" },

    tags: [String],
  },
  { timestamps: true }
);

CourseSchema.index({ category: 1, level: 1 });
CourseSchema.index({ isActive: 1, featured: -1, priorityOrder: 1 });
CourseSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Course", CourseSchema);