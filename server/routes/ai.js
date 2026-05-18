// server/routes/ai.js
"use strict";

const express    = require("express");
const router     = express.Router();
const rateLimit  = require("express-rate-limit");
const { protect } = require("../middlewares/auth");
const { chat, chatStream, getHistory, deleteSession } = require("../controllers/aiController");

const aiLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             30,
  keyGenerator:    (req) => req.user?._id?.toString() || req.ip,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: "طلبات كثيرة جداً — انتظر دقيقة ثم أعد المحاولة" },
});

router.post  ("/chat",        aiLimiter, chat);
router.post  ("/chat/stream", aiLimiter, chatStream);
router.get   ("/history",     protect,   getHistory);
router.delete("/session/:id", protect,   deleteSession);

module.exports = router;
