// server/index.js — Qurani Online Platform v2.0
"use strict";

const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const rateLimit  = require("express-rate-limit");
require("dotenv").config();

const { connectDB } = require("./config/db");

// ─── Routes ───────────────────────────────────────────────────────────────────
const authRoutes          = require("./routes/auth");
const coursesRoutes       = require("./routes/courses");
const teachersRoutes      = require("./routes/teachers");
const usersRoutes         = require("./routes/users");
const lessonsRoutes       = require("./routes/lessons");
const mediaRoutes         = require("./routes/media");
const progressRoutes      = require("./routes/progress");
const notificationsRoutes = require("./routes/notifications");
const subscriptionsRoutes = require("./routes/subscriptions");
const reviewsRoutes       = require("./routes/reviews");
const aiRoutes            = require("./routes/ai");

// ─── App Setup ────────────────────────────────────────────────────────────────
const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Global rate limiter (broad protection)
app.use(rateLimit({
  windowMs:        15 * 60 * 1000, // 15 min
  max:             500,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: "طلبات كثيرة جداً، يُرجى المحاولة لاحقاً" },
}));

// ─── Routes Registration ──────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/courses",       coursesRoutes);
app.use("/api/teachers",      teachersRoutes);
app.use("/api/users",         usersRoutes);
app.use("/api/lessons",       lessonsRoutes);
app.use("/api/media",         mediaRoutes);
app.use("/api/progress",      progressRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/reviews",       reviewsRoutes);
app.use("/api/ai",            aiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV, time: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `المسار غير موجود: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Error]", err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "خطأ داخلي في الخادم" : err.message,
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Qurani Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🤖 AI:  http://localhost:${PORT}/api/ai/chat\n`);
  });
});
