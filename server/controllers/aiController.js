// server/controllers/aiController.js
// Qurani AI — Production Agent v2.1
// OpenAI GPT-4o-mini · Function Calling · SSE Streaming · MongoDB RAG · Multilingual
"use strict";

const OpenAI    = require("openai");
const Course    = require("../models/Course");
const Teacher   = require("../models/Teacher");
const { AIChat, Package } = require("../models/index");

// ─── OpenAI Client ────────────────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey:     process.env.OPENAI_API_KEY,
  timeout:    30_000,
  maxRetries: 2,
});

// ─── Language Detection ───────────────────────────────────────────────────────
/**
 * Detects the language of the incoming message.
 * Returns a BCP-47 language tag: "ar" | "en" | "fr" | "tr" | "ur" | "id" | "other"
 */
function detectLanguage(text = "") {
  // Arabic
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  // Urdu (shares Arabic script but common extended range)
  if (/[\u0750-\u077F\uFB50-\uFDFF]/.test(text)) return "ur";
  // Turkish common words + letters
  if (/\b(merhaba|nasıl|öğren|kuran|ders|fiyat|hoca|teşekkür)\b/i.test(text)) return "tr";
  // French
  if (/\b(bonjour|salut|merci|apprendre|coran|cours|professeur|tarif|disponible)\b/i.test(text)) return "fr";
  // Indonesian / Malay
  if (/\b(halo|selamat|belajar|quran|guru|harga|tersedia|terima kasih)\b/i.test(text)) return "id";
  // Default to English for Latin script
  if (/[a-zA-Z]/.test(text)) return "en";
  return "other";
}

// ─── System Prompt Builder ────────────────────────────────────────────────────
/**
 * Returns a language-aware system prompt.
 * The core identity, rules and tool instructions remain constant;
 * only the response language instruction changes.
 */
function buildSystemPrompt(lang) {
  const langInstructions = {
    ar: `أجب دائماً باللغة العربية الفصحى.`,
    en: `Always respond in English. Keep a warm, spiritual, professional tone. Translate any course/teacher names naturally.`,
    fr: `Réponds toujours en français. Garde un ton chaleureux, spirituel et professionnel.`,
    tr: `Her zaman Türkçe yanıt ver. Sıcak, manevi ve profesyonel bir ton kullan.`,
    ur: `ہمیشہ اردو میں جواب دیں۔ گرم، روحانی اور پیشہ ورانہ لہجہ رکھیں۔`,
    id: `Selalu jawab dalam Bahasa Indonesia. Gunakan nada hangat, spiritual, dan profesional.`,
    other: `Detect the user's language from their message and respond in the same language. Be warm and professional.`,
  };

  const langRule = langInstructions[lang] || langInstructions.other;

  return `\
You are "Qurani Assistant" — the exclusive AI assistant for the "Qurani Online" Quran teaching platform.

## Language Rule — CRITICAL
${langRule}
Mirror the user's language in every response. If the user switches language mid-conversation, switch with them.

## Identity
- Name: Qurani Assistant / مساعد قُرآني
- Style: Warm, spiritual, human — never robotic. 3-5 sentences unless detail is requested.
- Never open with "Of course!" / "بالتأكيد!" / "Sure!" type filler phrases.

## Tool Usage Rules — CRITICAL
- ANY question about courses / programs / curriculum → call get_courses immediately
- Tajweed / memorization / ijazah / recitation questions → call get_courses with the matching category
- Price / subscription / packages questions → call get_packages
- Teacher / instructor / sheikh questions → call get_teachers
- NEVER say "no information available" before calling the relevant tool first
- Only report "no results" AFTER the tool returned empty

## Strict Rules
1. Never invent data — always fetch from tools
2. If no data after tool call → say "I don't have that info right now, please contact us directly"
3. Never quote prices or details not returned by the database
4. Always end with a concrete next step for the user

## User Empathy
- Parent asking about a child → extra warmth and reassurance
- Woman seeking a female teacher → proactively filter by gender=female
- Ijazah seeker → show respect for the noble goal
- Hesitant user → offer the free trial with zero commitment`;
}

// ─── AI Tools ─────────────────────────────────────────────────────────────────
const AI_TOOLS = [
  {
    type: "function",
    function: {
      name: "get_courses",
      description: "Fetch available courses filtered by category and level. Call this for ANY question about courses, programs, or curricula.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["tajweed", "memorization", "recitation", "ijazah", "makhraj", "correction", "arabic", "foundation", "all"],
            description: "Course category",
          },
          level: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced", "all"],
            description: "Course level",
          },
          limit: { type: "number", description: "Number of results (default 3, max 6)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_packages",
      description: "Fetch subscription packages and pricing",
      parameters: {
        type: "object",
        properties: {
          user_type: {
            type: "string",
            description: "User type: beginner | advanced | child | intensive | family",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_teachers",
      description: "Fetch teachers filtered by specialty and gender",
      parameters: {
        type: "object",
        properties: {
          specialty: {
            type: "string",
            enum: ["tajweed", "memorization", "recitation", "ijazah", "makhraj", "all"],
          },
          gender: {
            type: "string",
            enum: ["male", "female", "all"],
            description: "Important when the user prefers a female teacher",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_free_trial",
      description: "Get free trial details and conditions",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_platform_info",
      description: "Platform info: registration, payment, contact, guarantees, schedule",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            enum: ["registration", "payment", "contact", "platform", "guarantee", "schedule"],
          },
        },
        required: ["topic"],
      },
    },
  },
];

// ─── Category Map ─────────────────────────────────────────────────────────────
const CATEGORY_MAP = {
  tajweed:      "tajweed",
  hifz:         "memorization",
  memorization: "memorization",
  children:     "recitation",
  quran_reading:"recitation",
  recitation:   "recitation",
  ijaza:        "ijazah",
  ijazah:       "ijazah",
  makhraj:      "makhraj",
  correction:   "correction",
  arabic:       "arabic",
  foundation:   "foundation",
  all:          null,
};

// ─── Tool Executors ───────────────────────────────────────────────────────────
async function runTool(name, args) {
  console.log("TOOL CALLED:", name, args);
  switch (name) {

    case "get_courses": {
      const q = { isPublished: true };
      if (args.category && args.category !== "all") {
        const mappedCategory = CATEGORY_MAP[args.category];
        if (mappedCategory) q.category = mappedCategory;
      }
      if (args.level && args.level !== "all") q.level = args.level;
      const limit = Math.min(Number(args.limit) || 3, 6);
      console.log("Course query:", q);
      const courses = await Course.find(q)
        .sort({ featured: -1, priorityOrder: 1, studentsCount: -1 })
        .limit(limit)
        .select("title slug category level price pricingType studentsCount rating image thumbnail description shortDescription")
        .lean();
      console.log(`Found ${courses.length} courses`);
      return {
        ok:      true,
        count:   courses.length,
        courses: courses.map((c) => ({
          id:          String(c._id),
          title:       c.title,
          slug:        c.slug,
          category:    c.category,
          level:       c.level,
          price:       c.pricingType === "free" ? 0 : (c.price || 0),
          isFree:      c.pricingType === "free",
          students:    c.studentsCount || 0,
          rating:      c.rating        || 5,
          image:       c.thumbnail     || c.image || "",
          description: c.shortDescription || c.description || "",
          url:         `/courses/${c.slug}`,
        })),
      };
    }

    case "get_packages": {
      const packages = await Package.find({ isActive: true })
        .sort({ price: 1 })
        .lean();
      const tierRec = {
        beginner:  "basic",
        child:     "basic",
        advanced:  "premium",
        intensive: "premium",
        family:    "gold",
      };
      const recommended = tierRec[args.user_type] || "gold";
      return {
        ok: true,
        packages: packages.map((p) => ({
          id:            String(p._id),
          name:          p.nameAr || p.name,
          tier:          p.tier,
          price:         p.price,
          sessions:      p.sessions,
          duration:      p.duration,
          features:      p.features || [],
          isRecommended: p.tier === recommended,
          badge:         p.badge || "",
          color:         p.color || (p.tier === "premium" ? "#9b59b6" : p.tier === "gold" ? "#d4a017" : "#64748b"),
        })),
      };
    }

    case "get_teachers": {
      const q = { active: true };
      if (args.specialty && args.specialty !== "all") {
        const mappedSpecialty = CATEGORY_MAP[args.specialty] || args.specialty;
        q.specialty = mappedSpecialty;
      }
      if (args.gender && args.gender !== "all") q.gender = args.gender;
      const teachers = await Teacher.find(q)
        .sort({ rating: -1, displayOrder: 1 })
        .limit(4)
        .select("fullName specialty rating studentsCount gender shortBio imageUrl slug")
        .lean();
      return {
        ok: true,
        teachers: teachers.map((t) => ({
          id:        String(t._id),
          name:      t.fullName,
          specialty: Array.isArray(t.specialty) ? t.specialty[0] : t.specialty,
          rating:    t.rating        || 5,
          students:  t.studentsCount || 0,
          gender:    t.gender,
          bio:       t.shortBio      || "",
          avatar:    t.imageUrl      || "",
          url:       `/teachers/${t.slug || t._id}`,
        })),
      };
    }

    case "check_free_trial": {
      return {
        ok:        true,
        available: true,
        sessions:  1,
        duration:  30,
        terms:     "For new students only — one free 30-min session, no commitment",
        howToBook: "Contact us via WhatsApp or create an account on the platform",
      };
    }

    case "get_platform_info": {
      const wa = process.env.WHATSAPP_NUMBER || "201008148164";
      const info = {
        registration: {
          steps: [
            "Create an account on the platform",
            "Choose the right package",
            "Contact us via WhatsApp to schedule your first session",
          ],
          url:  "/register",
          note: "Registration is free; payment only after confirming your package",
        },
        payment: {
          methods:  ["WhatsApp", "Bank transfer", "Credit card"],
          currency: "SAR",
          cycle:    "Monthly, cancel anytime",
        },
        contact: {
          whatsapp: `https://wa.me/${wa}`,
          hours:    "Sat – Thu: 9 AM – 10 PM",
        },
        platform: {
          name:     "Qurani Online",
          about:    "Specialized platform for Quran education: Tajweed, Memorization, Recitation, Ijazah",
          students: "+10,000 students",
          teachers: "+50 male and female teachers",
          years:    "5+ years of experience",
        },
        guarantee: {
          trial:   "Free trial session",
          refund:  "7-day money-back guarantee",
          quality: "All teachers hold certified Ijazahs",
        },
        schedule: {
          flexibility: "Flexible schedules to fit your timezone",
          sessions:    "One-on-one or small groups",
          platforms:   ["Zoom", "Google Meet"],
        },
      };
      return { ok: true, data: info[args.topic] || {} };
    }

    default:
      return { ok: false, error: `Unknown tool: ${name}` };
  }
}

// ─── Intent Classifier (language-agnostic patterns) ───────────────────────────
function classifyIntent(msg) {
  const m = msg.toLowerCase();

  // Arabic patterns
  if (/تجويد/.test(msg))                                                  return "tajweed";
  if (/حفظ|حافظ/.test(msg))                                               return "hifz";
  if (/طفل|أطفال|ابن|ابنت|ولد|بنت|صغير/.test(msg))                       return "children";
  if (/سعر|باقة|تكلف|اشتراك|تكاليف|دفع/.test(msg))                       return "pricing";
  if (/معلم|أستاذ|معلمة|مدرس|شيخ/.test(msg))                             return "teachers";
  if (/إجازة|سند|رواية/.test(msg))                                        return "ijaza";
  if (/تسجيل|انضمام|بدء|اشترك/.test(msg))                                return "register";
  if (/مجاني|تجربة|تجريب/.test(msg))                                      return "free_trial";
  if (/واتساب|تواصل|اتصال/.test(msg))                                     return "contact";
  if (/كورس|دورة|برنامج|تعلم|دروس/.test(msg))                            return "courses";

  // English patterns
  if (/tajweed|pronunciation|makharij/.test(m))                           return "tajweed";
  if (/memoriz|hifz|memoris/.test(m))                                     return "hifz";
  if (/child|kid|son|daughter|junior/.test(m))                            return "children";
  if (/pric|package|plan|cost|fee|subscri|pay/.test(m))                   return "pricing";
  if (/teacher|instructor|sheikh|tutor|professor/.test(m))                return "teachers";
  if (/ijazah?|certification|chain|sanad/.test(m))                        return "ijaza";
  if (/register|sign.?up|join|enroll|start/.test(m))                      return "register";
  if (/free|trial|try/.test(m))                                           return "free_trial";
  if (/whatsapp|contact|reach|support/.test(m))                           return "contact";
  if (/course|class|lesson|program|learn|study/.test(m))                  return "courses";

  // French patterns
  if (/tajwid|pronunciation/.test(m))                                     return "tajweed";
  if (/mémoris|mémorisation/.test(m))                                     return "hifz";
  if (/enfant|fils|fille|gosse/.test(m))                                  return "children";
  if (/prix|tarif|abonnement|forfait|coût/.test(m))                       return "pricing";
  if (/professeur|enseignant|cheikh|tuteur/.test(m))                      return "teachers";
  if (/gratuit|essai|essayer/.test(m))                                    return "free_trial";
  if (/cours|leçon|programme|apprendre/.test(m))                          return "courses";

  // Turkish patterns
  if (/tecvit|tecvid/.test(m))                                            return "tajweed";
  if (/ezber|hafız/.test(m))                                              return "hifz";
  if (/çocuk|oğul|kız/.test(m))                                          return "children";
  if (/fiyat|ücret|paket|abonelik/.test(m))                               return "pricing";
  if (/hoca|öğretmen|şeyh/.test(m))                                       return "teachers";
  if (/ücretsiz|deneme/.test(m))                                          return "free_trial";
  if (/kurs|ders|program|öğren/.test(m))                                  return "courses";

  return "general";
}

// ─── Action Builder (bilingual labels) ───────────────────────────────────────
function buildActions(intent, toolResults, lang) {
  const wa = process.env.WHATSAPP_NUMBER
    ? `https://wa.me/${process.env.WHATSAPP_NUMBER}`
    : "https://wa.me/201008148164";

  // Labels per language
  const L = {
    ar: {
      courses:   "تصفح الكورسات",   register:    "سجّل الآن",
      whatsapp:  "تحدث معنا",       tajweed:     "كورسات التجويد",
      hifz:      "كورسات الحفظ",    children:    "كورسات الأطفال",
      pricing:   "مشاهدة الباقات",  teachers:    "تصفح المعلمين",
      ijaza:     "برنامج الإجازة",  free_trial:  "جلسة مجانية",
      contact:   "صفحة التواصل",    try_free:    "احجز جلستك المجانية",
    },
    en: {
      courses:   "Browse Courses",   register:    "Sign Up Free",
      whatsapp:  "Chat with Us",     tajweed:     "Tajweed Courses",
      hifz:      "Memorization Courses", children: "Kids' Courses",
      pricing:   "View Plans",       teachers:    "Browse Teachers",
      ijaza:     "Ijazah Program",   free_trial:  "Free Trial",
      contact:   "Contact Page",     try_free:    "Book Free Session",
    },
    fr: {
      courses:   "Voir les cours",   register:    "S'inscrire",
      whatsapp:  "Nous contacter",   tajweed:     "Cours de Tajwid",
      hifz:      "Cours de Mémorisation", children: "Cours pour enfants",
      pricing:   "Voir les tarifs",  teachers:    "Voir les professeurs",
      ijaza:     "Programme Ijazah", free_trial:  "Essai gratuit",
      contact:   "Page contact",     try_free:    "Réserver un essai gratuit",
    },
    tr: {
      courses:   "Kurslara Göz At", register:    "Kayıt Ol",
      whatsapp:  "Bize Yaz",        tajweed:     "Tecvid Kursları",
      hifz:      "Ezberleme Kursları", children: "Çocuk Kursları",
      pricing:   "Paketleri Gör",   teachers:    "Hocalara Göz At",
      ijaza:     "İcazet Programı", free_trial:  "Ücretsiz Ders",
      contact:   "İletişim",        try_free:    "Ücretsiz Ders Al",
    },
  };
  const t = L[lang] || L.en;

  const map = {
    tajweed:    [{ label: t.tajweed,    type: "navigate", target: "/courses?category=tajweed" },
                 { label: t.whatsapp,   type: "whatsapp", target: wa }],
    hifz:       [{ label: t.hifz,       type: "navigate", target: "/courses?category=memorization" },
                 { label: t.register,   type: "register", target: "/register" }],
    children:   [{ label: t.children,   type: "navigate", target: "/courses?category=recitation" },
                 { label: t.whatsapp,   type: "whatsapp", target: wa }],
    pricing:    [{ label: t.pricing,    type: "navigate", target: "/pricing" },
                 { label: t.free_trial, type: "register", target: "/register" }],
    teachers:   [{ label: t.teachers,   type: "navigate", target: "/teachers" },
                 { label: t.whatsapp,   type: "whatsapp", target: wa }],
    ijaza:      [{ label: t.ijaza,      type: "navigate", target: "/courses?category=ijazah" },
                 { label: t.whatsapp,   type: "whatsapp", target: wa }],
    register:   [{ label: t.register,   type: "register", target: "/register" },
                 { label: t.whatsapp,   type: "whatsapp", target: wa }],
    free_trial: [{ label: t.try_free,   type: "whatsapp", target: wa },
                 { label: t.register,   type: "register", target: "/register" }],
    contact:    [{ label: t.whatsapp,   type: "whatsapp", target: wa },
                 { label: t.contact,    type: "navigate", target: "/contact" }],
    courses:    [{ label: t.courses,    type: "navigate", target: "/courses" },
                 { label: t.free_trial, type: "register", target: "/register" }],
    general:    [{ label: t.register,   type: "register", target: "/register" },
                 { label: t.whatsapp,   type: "whatsapp", target: wa }],
  };

  const hasCourses = toolResults.some((r) => r?.courses?.length > 0);
  if (hasCourses && !["pricing"].includes(intent)) {
    return [
      { label: t.courses,  type: "navigate", target: "/courses"   },
      { label: t.register, type: "register", target: "/register"  },
    ];
  }

  return map[intent] || map.general;
}

// ─── Rich Content Extractor ───────────────────────────────────────────────────
function extractRich(toolResults) {
  const rich = { courses: [], packages: [], teachers: [] };
  for (const r of toolResults) {
    if (!r?.ok) continue;
    if (r.courses?.length)  rich.courses  = r.courses;
    if (r.packages?.length) rich.packages = r.packages;
    if (r.teachers?.length) rich.teachers = r.teachers;
  }
  return rich;
}

// ─── Two-Phase Agent ──────────────────────────────────────────────────────────
async function runAgent(messages, intent = "general") {
  const phase1 = await openai.chat.completions.create({
    model:       "gpt-4o-mini",
    messages,
    tools:       AI_TOOLS,
    tool_choice: ["courses", "tajweed", "hifz", "children", "ijaza"].includes(intent)
      ? { type: "function", function: { name: "get_courses" } }
      : "auto",
    temperature: 0.6,
    max_tokens:  900,
  });

  const msg1      = phase1.choices[0].message;
  const toolCalls = msg1.tool_calls || [];
  const toolResults = [];

  if (!toolCalls.length) {
    return { content: msg1.content, toolResults };
  }

  const toolMsgs = [msg1];
  for (const tc of toolCalls) {
    let args = {};
    try { args = JSON.parse(tc.function.arguments); } catch {}
    const result = await runTool(tc.function.name, args);
    toolResults.push(result);
    toolMsgs.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
  }

  const phase2 = await openai.chat.completions.create({
    model:       "gpt-4o-mini",
    messages:    [...messages, ...toolMsgs],
    temperature: 0.6,
    max_tokens:  800,
  });

  return { content: phase2.choices[0].message.content, toolResults };
}

// ─── Fallback reply per language ──────────────────────────────────────────────
function fallbackReply(lang) {
  const msgs = {
    ar: "عذراً، لم أتمكن من معالجة طلبك. يمكنك التواصل معنا عبر واتساب.",
    en: "Sorry, I couldn't process your request. Please reach out to us via WhatsApp.",
    fr: "Désolé, je n'ai pas pu traiter votre demande. Contactez-nous via WhatsApp.",
    tr: "Üzgünüm, isteğinizi işleyemedim. Lütfen WhatsApp üzerinden bizimle iletişime geçin.",
    ur: "معذرت، میں آپ کی درخواست پر کارروائی نہیں کر سکا۔ براہ کرم واٹس ایپ کے ذریعے ہم سے رابطہ کریں۔",
    id: "Maaf, saya tidak dapat memproses permintaan Anda. Silakan hubungi kami melalui WhatsApp.",
  };
  return msgs[lang] || msgs.en;
}

// ─── POST /api/ai/chat ────────────────────────────────────────────────────────
exports.chat = async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

    const lang   = detectLanguage(message);
    const intent = classifyIntent(message);

    const session = sessionId ? await AIChat.findById(sessionId).lean() : null;
    const history = (session?.messages || [])
      .slice(-12)
      .filter((m) => ["user", "assistant"].includes(m.role))
      .map((m) => ({ role: m.role, content: m.content }));

    const messages = [
      { role: "system", content: buildSystemPrompt(lang) },
      ...history,
      { role: "user", content: message },
    ];

    const { content, toolResults } = await runAgent(messages, intent);
    const reply = content || fallbackReply(lang);

    let newSessionId = session?._id;
    if (!session) {
      const created = await AIChat.create({
        userId:   userId || null,
        messages: [{ role: "user", content: message }, { role: "assistant", content: reply }],
        metadata: { intent, lang, interests: [intent] },
      });
      newSessionId = created._id;
    } else {
      await AIChat.findByIdAndUpdate(sessionId, {
        $push: { messages: { $each: [{ role: "user", content: message }, { role: "assistant", content: reply }] } },
        $set:  { "metadata.intent": intent, "metadata.lang": lang },
        $addToSet: { "metadata.interests": intent },
      });
    }

    return res.json({
      reply,
      intent,
      lang,
      actions:     buildActions(intent, toolResults, lang),
      richContent: extractRich(toolResults),
      sessionId:   newSessionId,
    });
  } catch (err) {
    console.error("[AI /chat error]", err.message);
    const wa   = `https://wa.me/${process.env.WHATSAPP_NUMBER || "201008148164"}`;
    const lang = detectLanguage(req.body?.message || "");
    return res.status(500).json({
      reply:       fallbackReply(lang),
      intent:      "error",
      lang,
      actions:     [{ label: "WhatsApp", type: "whatsapp", target: wa }],
      richContent: { courses: [], packages: [], teachers: [] },
    });
  }
};

// ─── POST /api/ai/chat/stream ─────────────────────────────────────────────────
exports.chatStream = async (req, res) => {
  res.setHeader("Content-Type",                "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control",               "no-cache, no-transform");
  res.setHeader("Connection",                  "keep-alive");
  res.setHeader("X-Accel-Buffering",           "no");
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL || "*");

  const send = (data) => {
    try { res.write(`data: ${JSON.stringify(data)}\n\n`); } catch {}
  };

  const { message, sessionId, userId } = req.body;
  if (!message?.trim()) { send({ type: "error", message: "Message required" }); return res.end(); }

  try {
    const lang   = detectLanguage(message);
    const intent = classifyIntent(message);

    const session = sessionId ? await AIChat.findById(sessionId).lean() : null;
    const history = (session?.messages || [])
      .slice(-12)
      .filter((m) => ["user", "assistant"].includes(m.role))
      .map((m) => ({ role: m.role, content: m.content }));

    const messages = [
      { role: "system", content: buildSystemPrompt(lang) },
      ...history,
      { role: "user", content: message },
    ];

    // Phase 1: tool dispatch (non-streaming)
    const phase1 = await openai.chat.completions.create({
      model:       "gpt-4o-mini",
      messages,
      tools:       AI_TOOLS,
      tool_choice: ["courses", "tajweed", "hifz", "children", "ijaza"].includes(intent)
        ? { type: "function", function: { name: "get_courses" } }
        : "auto",
      temperature: 0.6,
    });

    const msg1        = phase1.choices[0].message;
    const toolCalls   = msg1.tool_calls || [];
    const toolResults = [];
    const toolMsgs    = [msg1];

    for (const tc of toolCalls) {
      let args = {};
      try { args = JSON.parse(tc.function.arguments); } catch {}
      const result = await runTool(tc.function.name, args);
      toolResults.push(result);
      toolMsgs.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
    }

    // Send metadata first (includes lang for frontend)
    send({
      type:        "meta",
      intent,
      lang,
      actions:     buildActions(intent, toolResults, lang),
      richContent: extractRich(toolResults),
    });

    // Phase 2: stream response
    let fullReply = "";

    if (!toolCalls.length && msg1.content) {
      fullReply = msg1.content;
      send({ type: "text", delta: msg1.content });
    } else {
      const streamMsgs = toolCalls.length ? [...messages, ...toolMsgs] : messages;
      const stream = await openai.chat.completions.create({
        model:       "gpt-4o-mini",
        messages:    streamMsgs,
        stream:      true,
        temperature: 0.6,
        max_tokens:  800,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) { fullReply += delta; send({ type: "text", delta }); }
      }
    }

    send({ type: "done" });
    res.end();

    // Persist (non-blocking)
    const replyText = fullReply || fallbackReply(lang);
    if (!session) {
      AIChat.create({
        userId:   userId || null,
        messages: [{ role: "user", content: message }, { role: "assistant", content: replyText }],
        metadata: { intent, lang, interests: [intent] },
      }).catch(() => {});
    } else {
      AIChat.findByIdAndUpdate(sessionId, {
        $push: { messages: { $each: [{ role: "user", content: message }, { role: "assistant", content: replyText }] } },
        $set:  { "metadata.intent": intent, "metadata.lang": lang },
        $addToSet: { "metadata.interests": intent },
      }).catch(() => {});
    }
  } catch (err) {
    console.error("[AI /stream error]", err.message);
    send({ type: "error", message: "Technical error — please contact us via WhatsApp" });
    res.end();
  }
};

// ─── GET /api/ai/history ──────────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const sessions = await AIChat.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("messages metadata createdAt")
      .lean();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE /api/ai/session/:id ───────────────────────────────────────────────
exports.deleteSession = async (req, res) => {
  try {
    await AIChat.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};