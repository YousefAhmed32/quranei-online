
"use strict";
const mongoose = require("mongoose");
 
const CourseSchema = new mongoose.Schema({
  // ── Required ──────────────────────────────────────────────────────────
  title:    { type: String, required: true, trim: true },
  slug:     { type: String, required: true, unique: true, trim: true, lowercase: true },
 
  // ── Content ───────────────────────────────────────────────────────────
  shortDescription: { type: String, default: '' },
  description:      { type: String, default: '' },
 
  // ── Classification ────────────────────────────────────────────────────
  // Removed strict enum — allows new categories without schema change
  category: { type: String, default: 'quran', trim: true },
  level:    { type: String, default: 'beginner', enum: ['beginner','intermediate','advanced','all'] },
  tags:     [{ type: String, trim: true }],
 
  // ── Media ─────────────────────────────────────────────────────────────
  thumbnail: { type: String, default: null },
  heroVideo: { type: String, default: null },
 
  // ── Teacher ───────────────────────────────────────────────────────────
  teacher:     { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
  teacherName: { type: String, default: '' },
 
  // ── Pricing ───────────────────────────────────────────────────────────
  pricingType: { type: String, enum: ['free','paid','contact'], default: 'contact' },
  price:       { type: Number, default: 0, min: 0 },
  currency:    { type: String, default: 'ريال' },
  showPrice:   { type: Boolean, default: false },
 
  // ── CTA ───────────────────────────────────────────────────────────────
  ctaText:  { type: String, default: 'اشترك الآن' },
  whatsapp: { type: String, default: '' },
 
  // ── Stats ─────────────────────────────────────────────────────────────
  duration:      { type: String, default: '' },
  lessonsCount:  { type: Number, default: 0 },
  studentsCount: { type: Number, default: 0 },
  rating:        { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount:  { type: Number, default: 0 },
 
  // ── Learning Content ──────────────────────────────────────────────────
  learningOutcomes: [String],
  targetStudents:   [String],
  highlights:       [String],
 
  // ── SEO ───────────────────────────────────────────────────────────────
  seoTitle:       { type: String, default: '' },
  seoDescription: { type: String, default: '' },
 
  // ── Visibility ────────────────────────────────────────────────────────
  isPublished:   { type: Boolean, default: false },
  isActive:      { type: Boolean, default: true },
  featured:      { type: Boolean, default: false },
  priorityOrder: { type: Number, default: 999 },
 
}, { timestamps: true });
 
CourseSchema.index({ category: 1, level: 1 });
CourseSchema.index({ isPublished: 1, featured: -1, priorityOrder: 1 });
CourseSchema.index({ title: 'text', description: 'text', tags: 'text' });
 
// Auto-normalize price on save
CourseSchema.pre('save', function(next) {
  if (this.pricingType !== 'paid') this.price = 0;
  next();
});
 
module.exports = mongoose.model('Course', CourseSchema);