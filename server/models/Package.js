const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    tier: { type: String, enum: ["basic", "gold", "premium"], required: true },
    price: { type: Number, required: true },
    sessions: { type: Number, required: true },
    duration: { type: Number, required: true },
    features: [String],
    badge: String,
    color: String,
    isActive: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);