const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    // ─── بيانات أساسية ───────────────────────────────────────
    fullName:    { type: String, required: true, trim: true },
    title:       { type: String, default: "" },
    slug:        { type: String, unique: true, lowercase: true, trim: true },
    gender:      { type: String, enum: ["male", "female"], default: "male" },

    // ─── صورة ────────────────────────────────────────────────
    imageId:     { type: String, default: "" }, // GridFS ID
    imageUrl:    { type: String, default: "" }, // fallback URL

    // ─── نبذة ────────────────────────────────────────────────
    bio:         { type: String, default: "" },
    shortBio:    { type: String, default: "" },

    // ─── تخصص (يدعم array للـ AI filtering + string للعرض) ──
    specialization: { type: String, default: "" },
    specialty:   [{ type: String, enum: ["tajweed", "hifz", "children", "ijaza", "quran_reading"] }],
    experience:  { type: String, default: "" },

    // ─── لغات وجنسية ─────────────────────────────────────────
    languages:   [String],
    nationality: { type: String, default: "" },

    // ─── إحصائيات ────────────────────────────────────────────
    rating:        { type: Number, default: 5.0, min: 0, max: 5 },
    studentsCount: { type: Number, default: 0 },

    // ─── ربط بالكورسات ───────────────────────────────────────
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

    // ─── ترتيب وحالة ─────────────────────────────────────────
    displayOrder: { type: Number, default: 0 },
    active:       { type: Boolean, default: true },
    featured:     { type: Boolean, default: false },

    // ─── تواصل ───────────────────────────────────────────────
    whatsapp: { type: String, default: "" },
    socialLinks: {
      youtube:   { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter:   { type: String, default: "" },
      facebook:  { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Auto-generate slug from fullName
TeacherSchema.pre("save", function (next) {
  if (!this.slug && this.fullName) {
    this.slug = this.fullName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0621-\u064A-]/g, "");
  }
  next();
});

// Index for AI gender/specialty filtering
TeacherSchema.index({ specialty: 1, gender: 1, active: 1 });

module.exports = mongoose.model("Teacher", TeacherSchema);