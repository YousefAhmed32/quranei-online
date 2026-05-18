// client/src/components/ai/AIAssistant.jsx
// Qurani AI v3.1 — Multilingual · Production SaaS · Premium Islamic Chat Experience
"use strict";

import {
  useState, useRef, useEffect, useCallback, memo, useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE  = import.meta.env.VITE_API_URL  || "http://localhost:5000/api";
const WA_NUMBER = import.meta.env.VITE_WHATSAPP || "201008148164";

const SUGGESTED_PROMPTS = [
  { text: "أريد تعلم التجويد",       icon: "📖", tag: "تجويد"    },
  { text: "How do I start memorizing the Quran?", icon: "🌙", tag: "Hifz" },
  { text: "كورسات للأطفال",          icon: "⭐", tag: "أطفال"    },
  { text: "What are the available plans?",  icon: "💎", tag: "Pricing" },
  { text: "أريد معلمة للنساء",       icon: "🌸", tag: "معلمات"   },
  { text: "Is there a free trial?",   icon: "✨", tag: "Free"     },
];

const LEVEL_MAP = {
  beginner:     "مبتدئ / Beginner",
  intermediate: "متوسط / Intermediate",
  advanced:     "متقدم / Advanced",
  all:          "All levels",
};
const CAT_MAP = {
  tajweed:      "Tajweed / تجويد",
  memorization: "Memorization / حفظ",
  recitation:   "Recitation / قراءة",
  ijazah:       "Ijazah / إجازة",
  makhraj:      "Makhraj / مخارج",
  correction:   "Correction / تصحيح",
  arabic:       "Arabic / عربية",
  foundation:   "Foundation / أساسيات",
};
const levelLabel = (l) => LEVEL_MAP[l] || l || "";
const catLabel   = (c) => CAT_MAP[c]   || c || "";

// ─── Multilingual UI Strings ──────────────────────────────────────────────────
const UI = {
  ar: {
    assistantName: "مساعد قُرآني",
    statusOnline:  "متاح الآن · GPT-4o",
    statusThinking:"يفكر الآن...",
    placeholder:   "اكتب سؤالك هنا...",
    footer:        "مساعد ذكي · مدعوم بـ GPT-4o · قُرآني أونلاين",
    welcome:       "دليلك الذكي لتعلم القرآن الكريم",
    startChat:     "ابدأ محادثتك",
    newChat:       "محادثة جديدة",
    coursesLabel:  "✦ الكورسات المتاحة",
    packagesLabel: "✦ باقات الاشتراك",
    teachersLabel: "✦ المعلمون المتاحون",
    viewCourse:    "عرض الكورس ←",
    free:          "مجاني",
    students:      "طالب",
    perMonth:      " ر/شهر",
    sessions:      "جلسات",
    minutes:       "دقيقة",
    popular:       "★ الأكثر طلباً",
    errorMsg:      "عذراً، حدث خطأ تقني. يمكنك التواصل معنا عبر واتساب.",
    waLabel:       "فتح واتساب",
    dir:           "rtl",
  },
  en: {
    assistantName: "Qurani Assistant",
    statusOnline:  "Online · GPT-4o",
    statusThinking:"Thinking...",
    placeholder:   "Type your question here...",
    footer:        "AI Assistant · Powered by GPT-4o · Qurani Online",
    welcome:       "Your smart guide to learning the Quran",
    startChat:     "Start a conversation",
    newChat:       "New chat",
    coursesLabel:  "✦ Available Courses",
    packagesLabel: "✦ Subscription Plans",
    teachersLabel: "✦ Available Teachers",
    viewCourse:    "View Course →",
    free:          "Free",
    students:      "students",
    perMonth:      "/mo",
    sessions:      "sessions",
    minutes:       "min",
    popular:       "★ Most Popular",
    errorMsg:      "Sorry, a technical error occurred. Please contact us via WhatsApp.",
    waLabel:       "Open WhatsApp",
    dir:           "ltr",
  },
  fr: {
    assistantName: "Assistant Qurani",
    statusOnline:  "En ligne · GPT-4o",
    statusThinking:"Réflexion...",
    placeholder:   "Écrivez votre question ici...",
    footer:        "Assistant IA · Propulsé par GPT-4o · Qurani Online",
    welcome:       "Votre guide intelligent pour apprendre le Coran",
    startChat:     "Commencer une conversation",
    newChat:       "Nouvelle conversation",
    coursesLabel:  "✦ Cours disponibles",
    packagesLabel: "✦ Abonnements",
    teachersLabel: "✦ Professeurs disponibles",
    viewCourse:    "Voir le cours →",
    free:          "Gratuit",
    students:      "étudiants",
    perMonth:      "/mois",
    sessions:      "séances",
    minutes:       "min",
    popular:       "★ Le plus populaire",
    errorMsg:      "Désolé, une erreur technique s'est produite. Contactez-nous via WhatsApp.",
    waLabel:       "Ouvrir WhatsApp",
    dir:           "ltr",
  },
  tr: {
    assistantName: "Kurani Asistan",
    statusOnline:  "Çevrimiçi · GPT-4o",
    statusThinking:"Düşünüyor...",
    placeholder:   "Sorunuzu buraya yazın...",
    footer:        "Yapay Zeka Asistan · GPT-4o · Qurani Online",
    welcome:       "Kuran öğreniminiz için akıllı rehberiniz",
    startChat:     "Konuşmaya başla",
    newChat:       "Yeni sohbet",
    coursesLabel:  "✦ Mevcut Kurslar",
    packagesLabel: "✦ Abonelik Paketleri",
    teachersLabel: "✦ Mevcut Hocalar",
    viewCourse:    "Kursu Görüntüle →",
    free:          "Ücretsiz",
    students:      "öğrenci",
    perMonth:      "/ay",
    sessions:      "ders",
    minutes:       "dak",
    popular:       "★ En Popüler",
    errorMsg:      "Üzgünüm, teknik bir hata oluştu. WhatsApp üzerinden bizimle iletişime geçin.",
    waLabel:       "WhatsApp'ı Aç",
    dir:           "ltr",
  },
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  gold:      "#c9a227",
  goldLight: "#e8c040",
  goldDim:   "rgba(201,162,39,0.18)",
  goldBorder:"rgba(201,162,39,0.25)",
  bg0:       "#07090f",
  bg1:       "#0c0f1a",
  bg2:       "#111425",
  bg3:       "#171c2e",
  surface:   "rgba(255,255,255,0.04)",
  surfaceHov:"rgba(255,255,255,0.07)",
  text1:     "#f0e9d6",
  text2:     "rgba(240,233,214,0.65)",
  text3:     "rgba(240,233,214,0.35)",
  border:    "rgba(255,255,255,0.07)",
  borderGold:"rgba(201,162,39,0.3)",
  green:     "#34d399",
};

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, `<code style="background:rgba(201,162,39,0.15);padding:1px 5px;border-radius:4px;font-size:0.85em">$1</code>`)
    .replace(/\n/g, "<br/>");
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const TriggerButton = memo(({ isOpen, onClick, hasUnread }) => (
  <motion.button
    onClick={onClick}
    aria-label={isOpen ? "Close assistant" : "Open Qurani AI"}
    className="relative flex items-center justify-center w-14 h-14 rounded-full focus:outline-none select-none"
    style={{
      background: `linear-gradient(145deg, ${T.goldLight} 0%, ${T.gold} 45%, #7a5c10 100%)`,
      boxShadow: isOpen
        ? `0 0 0 2px ${T.goldBorder}, 0 8px 32px rgba(0,0,0,0.5)`
        : `0 0 40px rgba(201,162,39,0.4), 0 0 0 1px ${T.goldBorder}, 0 8px 32px rgba(0,0,0,0.6)`,
    }}
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.93 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    {!isOpen && (
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: `2px solid ${T.gold}` }}
        animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    )}
    {hasUnread && !isOpen && (
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 flex items-center justify-center"
        style={{ borderColor: T.bg0, fontSize: 9, color: "#fff", fontWeight: 700 }}>!</span>
    )}
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.span key="close"
          initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}
          className="text-white text-lg font-light">✕</motion.span>
      ) : (
        <motion.span key="open"
          initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}
          style={{ fontSize: 22 }}>✦</motion.span>
      )}
    </AnimatePresence>
  </motion.button>
));

const ChatHeader = memo(({ isThinking, isFullscreen, onToggleFullscreen, onClose, onClear, hasMessages, ui }) => (
  <div
    className="flex items-center justify-between px-4 py-3 flex-shrink-0"
    style={{
      borderBottom: `1px solid ${T.border}`,
      background: `linear-gradient(180deg, rgba(14,17,30,0.95) 0%, transparent 100%)`,
    }}
  >
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
          style={{
            background: `linear-gradient(145deg, ${T.goldLight}, ${T.gold}, #7a5c10)`,
            boxShadow: `0 0 14px rgba(201,162,39,0.35)`,
          }}>✦</div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
          style={{ background: T.green, borderColor: T.bg1 }} />
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight" style={{ color: T.text1, letterSpacing: "0.01em" }}>
          {ui.assistantName}
        </p>
        <p className="text-xs leading-tight mt-0.5" style={{ color: isThinking ? T.goldLight : T.text3 }}>
          {isThinking ? (
            <span className="flex items-center gap-1">
              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>●</motion.span>
              {ui.statusThinking}
            </span>
          ) : ui.statusOnline}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-1.5">
      {hasMessages && (
        <HeaderBtn onClick={onClear} title={ui.newChat}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </HeaderBtn>
      )}
      <HeaderBtn onClick={onToggleFullscreen} title={isFullscreen ? "Minimize" : "Expand"}>
        {isFullscreen ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 9L4 4m0 0h5m-5 0v5M15 9l5-5m0 0h-5m5 0v5M9 15l-5 5m0 0h5m-5 0v-5M15 15l5 5m0 0h-5m5 0v-5" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </HeaderBtn>
      {!isFullscreen && (
        <HeaderBtn onClick={onClose} title="Close">
          <span className="text-xs">✕</span>
        </HeaderBtn>
      )}
    </div>
  </div>
));

const HeaderBtn = memo(({ onClick, title, children }) => (
  <motion.button
    onClick={onClick}
    title={title}
    className="w-7 h-7 rounded-lg flex items-center justify-center focus:outline-none"
    style={{ background: T.surface, color: T.text3, border: `1px solid transparent` }}
    whileHover={{ background: T.surfaceHov, color: T.text1, borderColor: T.border }}
    whileTap={{ scale: 0.92 }}
    transition={{ duration: 0.12 }}
  >{children}</motion.button>
));

const TypingIndicator = memo(() => (
  <motion.div
    className="flex items-end gap-2.5 px-5"
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }}
  >
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
      style={{ background: `linear-gradient(135deg,${T.goldLight},${T.gold})` }}>✦</div>
    <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-md"
      style={{ background: T.bg3, border: `1px solid ${T.borderGold}` }}>
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: T.gold }}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.13 }} />
      ))}
    </div>
  </motion.div>
));

const CourseCarousel = memo(({ courses, onNav, ui }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => { checkScroll(); }, [courses]);
  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  if (!courses?.length) return null;

  return (
    <motion.div className="mt-2 relative"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <p className="text-xs font-medium mb-2 px-1" style={{ color: T.gold, letterSpacing: "0.05em" }}>
        {ui.coursesLabel}
      </p>
      <div className="relative">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => scroll(-1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${T.gold}, #7a5c10)`, boxShadow: "0 2px 12px rgba(0,0,0,0.4)", marginRight: -10 }}>
              <span className="text-white text-xs">›</span>
            </motion.button>
          )}
          {canScrollRight && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => scroll(1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${T.gold}, #7a5c10)`, boxShadow: "0 2px 12px rgba(0,0,0,0.4)", marginLeft: -10 }}>
              <span className="text-white text-xs">‹</span>
            </motion.button>
          )}
        </AnimatePresence>
        <div ref={scrollRef} onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
          {courses.map((course, idx) => (
            <CourseCard key={course.id || idx} course={course} onNav={onNav} ui={ui} />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

const CourseCard = memo(({ course, onNav, ui }) => (
  <motion.div
    onClick={() => onNav(course.url || `/courses/${course.slug}`)}
    className="flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden"
    style={{ width: 195, background: `linear-gradient(160deg, ${T.bg3} 0%, ${T.bg2} 100%)`, border: `1px solid ${T.borderGold}` }}
    whileHover={{ scale: 1.03, boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px ${T.gold}55` }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 320, damping: 22 }}
  >
    <div className="h-24 relative overflow-hidden" style={{ background: T.goldDim }}>
      {course.image?.startsWith("http") ? (
        <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-90" />
      ) : (
        <div className="w-full h-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${T.bg3}, ${T.bg2})` }}>
          <span style={{ fontSize: 32, opacity: 0.7 }}>{course.image || "📖"}</span>
        </div>
      )}
      <div className="absolute top-2 left-2">
        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
          style={{
            background: course.isFree ? "rgba(52,211,153,0.2)" : T.goldDim,
            color: course.isFree ? T.green : T.goldLight,
            border: `1px solid ${course.isFree ? "rgba(52,211,153,0.4)" : T.borderGold}`,
          }}>
          {course.isFree ? ui.free : `${course.price} SAR`}
        </span>
      </div>
    </div>
    <div className="p-3">
      <p className="text-sm font-semibold leading-snug line-clamp-2 mb-2" style={{ color: T.text1 }}>{course.title}</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: T.goldDim, color: T.gold, border: `1px solid ${T.borderGold}` }}>
          {catLabel(course.category)}
        </span>
        <span className="text-xs" style={{ color: T.text3 }}>{levelLabel(course.level)}</span>
      </div>
      {course.students > 0 && (
        <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: T.text3 }}>
          <span>👥</span> {course.students.toLocaleString()} {ui.students}
        </p>
      )}
    </div>
    <div className="px-3 pb-3">
      <div className="w-full py-1.5 rounded-xl text-xs font-medium text-center"
        style={{ background: T.goldDim, color: T.gold, border: `1px solid ${T.borderGold}` }}>
        {ui.viewCourse}
      </div>
    </div>
  </motion.div>
));

const PackagesRow = memo(({ packages, ui }) => {
  if (!packages?.length) return null;
  return (
    <motion.div className="mt-2"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
      <p className="text-xs font-medium mb-2 px-1" style={{ color: T.gold, letterSpacing: "0.05em" }}>
        {ui.packagesLabel}
      </p>
      <div className="flex flex-col gap-2">
        {packages.map((pkg, i) => <PackageCard key={pkg.id || i} pkg={pkg} ui={ui} />)}
      </div>
    </motion.div>
  );
});

const PackageCard = memo(({ pkg, ui }) => (
  <motion.div className="relative rounded-xl p-3.5"
    style={{ background: `linear-gradient(135deg, ${T.bg3}, ${T.bg2})`, border: `1px solid ${pkg.color}44` }}
    whileHover={{ scale: 1.01, borderColor: pkg.color + "88" }}
    transition={{ duration: 0.15 }}>
    {pkg.isRecommended && (
      <span className="absolute -top-2.5 right-3 text-xs px-2.5 py-0.5 rounded-full font-bold"
        style={{ background: pkg.color, color: "#000", fontSize: 10 }}>
        {ui.popular}
      </span>
    )}
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold" style={{ color: T.text1 }}>{pkg.name}</p>
        <p className="text-xs mt-0.5" style={{ color: T.text3 }}>
          {pkg.sessions} {ui.sessions} · {pkg.duration} {ui.minutes}
        </p>
      </div>
      <div className="text-left">
        <span className="text-xl font-extrabold" style={{ color: pkg.color }}>{pkg.price}</span>
        <span className="text-xs" style={{ color: T.text3 }}>{ui.perMonth}</span>
      </div>
    </div>
  </motion.div>
));

const TeachersRow = memo(({ teachers, onNav, ui }) => {
  if (!teachers?.length) return null;
  return (
    <motion.div className="mt-2"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
      <p className="text-xs font-medium mb-2 px-1" style={{ color: T.gold, letterSpacing: "0.05em" }}>
        {ui.teachersLabel}
      </p>
      <div className="flex flex-col gap-2">
        {teachers.map((t, i) => <TeacherCard key={t.id || i} teacher={t} onNav={onNav} ui={ui} />)}
      </div>
    </motion.div>
  );
});

const TeacherCard = memo(({ teacher, onNav, ui }) => (
  <motion.div
    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
    style={{ background: T.surface, border: `1px solid ${T.border}` }}
    whileHover={{ background: T.surfaceHov, borderColor: T.borderGold }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onNav(teacher.url || "/teachers")}
    transition={{ duration: 0.12 }}>
    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold})` }}>
      {teacher.avatar
        ? <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
        : <span className="text-lg">{teacher.gender === "female" ? "👩" : "👨"}</span>}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold truncate" style={{ color: T.text1 }}>{teacher.name}</p>
      <p className="text-xs" style={{ color: T.text2 }}>{catLabel(teacher.specialty)}</p>
    </div>
    <div className="text-left flex-shrink-0">
      <p className="text-sm font-bold" style={{ color: T.gold }}>★ {teacher.rating}</p>
      <p className="text-xs" style={{ color: T.text3 }}>{teacher.students} {ui.students}</p>
    </div>
  </motion.div>
));

const RichPanel = memo(({ richContent, onNav, ui }) => {
  const { courses = [], packages = [], teachers = [] } = richContent || {};
  if (!courses.length && !packages.length && !teachers.length) return null;
  return (
    <div className="flex flex-col gap-1 mt-1 w-full">
      {courses.length  > 0 && <CourseCarousel courses={courses} onNav={onNav} ui={ui} />}
      {packages.length > 0 && <PackagesRow packages={packages} ui={ui} />}
      {teachers.length > 0 && <TeachersRow teachers={teachers} onNav={onNav} ui={ui} />}
    </div>
  );
});

const ActionButtons = memo(({ actions, onAction }) => {
  if (!actions?.length) return null;
  const S = {
    navigate: { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.35)", color: "#a5b4fc", icon: "→" },
    whatsapp: { bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.3)",  color: "#6ee7b7", icon: "💬" },
    register: { bg: T.goldDim,               border: T.borderGold,            color: T.goldLight,icon: "✦" },
  };
  return (
    <motion.div className="flex flex-wrap gap-2 mt-2"
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
      {actions.map((action, i) => {
        const s = S[action.type] || S.navigate;
        return (
          <motion.button key={i}
            onClick={() => onAction(action)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
            whileHover={{ scale: 1.05, opacity: 0.9 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1 }}>
            <span>{s.icon}</span>{action.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
});

const MessageBubble = memo(({ msg, onAction, onNav, ui }) => {
  const isUser = msg.role === "user";
  return (
    <motion.div
      className={`flex items-end gap-2.5 px-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mb-0.5 self-end"
          style={{ background: `linear-gradient(135deg, ${T.goldLight}, ${T.gold})`, flexShrink: 0 }}>
          ✦
        </div>
      )}
      <div className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}
        style={{ maxWidth: isUser ? "78%" : "88%" }}>
        <div
          className="px-4 py-3 text-sm leading-relaxed"
          style={isUser ? {
            background: `linear-gradient(135deg, ${T.goldLight} 0%, ${T.gold} 100%)`,
            color: "#0a0a0a",
            borderRadius: "18px 18px 4px 18px",
            fontWeight: 500,
            boxShadow: `0 4px 20px rgba(201,162,39,0.2)`,
          } : {
            background: T.bg3,
            border: `1px solid ${T.borderGold}`,
            color: T.text1,
            borderRadius: "4px 18px 18px 18px",
            boxShadow: `0 2px 12px rgba(0,0,0,0.25)`,
          }}
        >
          {isUser ? (
            <span>{msg.content}</span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
              className="whitespace-pre-wrap" />
          )}
          {msg.isStreaming && (
            <motion.span
              className="inline-block w-0.5 h-4 ml-1 align-middle rounded-sm"
              style={{ background: T.gold, verticalAlign: "text-bottom" }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </div>
        {!isUser && (msg.richContent?.courses?.length > 0 ||
                     msg.richContent?.packages?.length > 0 ||
                     msg.richContent?.teachers?.length > 0) && (
          <RichPanel richContent={msg.richContent} onNav={onNav} ui={ui} />
        )}
        {!isUser && msg.actions?.length > 0 && (
          <ActionButtons actions={msg.actions} onAction={onAction} />
        )}
      </div>
    </motion.div>
  );
});

const WelcomeScreen = memo(({ onPrompt, ui }) => (
  <motion.div
    className="flex flex-col items-center gap-6 py-8 px-4"
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
  >
    <div className="relative">
      <motion.div
        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
        style={{
          background: `linear-gradient(145deg, ${T.goldLight}, ${T.gold}, #7a5c10)`,
          boxShadow: `0 0 40px rgba(201,162,39,0.4), 0 0 80px rgba(201,162,39,0.15)`,
        }}
        animate={{
          boxShadow: [
            `0 0 30px rgba(201,162,39,0.3), 0 0 60px rgba(201,162,39,0.1)`,
            `0 0 50px rgba(201,162,39,0.5), 0 0 90px rgba(201,162,39,0.2)`,
            `0 0 30px rgba(201,162,39,0.3), 0 0 60px rgba(201,162,39,0.1)`,
          ]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >✦</motion.div>
      <motion.div
        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center"
        style={{ background: T.green, borderColor: T.bg0 }}>
        <motion.span className="block w-2 h-2 rounded-full bg-white"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.div>
    </div>
    <div className="text-center space-y-1.5">
      <h3 className="text-base font-bold" style={{ color: T.text1 }}>{ui.assistantName}</h3>
      <p className="text-xs leading-relaxed" style={{ color: T.text3, maxWidth: 260 }}>
        {ui.welcome}
      </p>
    </div>
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: T.border }} />
      <span className="text-xs" style={{ color: T.text3 }}>{ui.startChat}</span>
      <div className="flex-1 h-px" style={{ background: T.border }} />
    </div>
    <div className="w-full grid grid-cols-2 gap-2">
      {SUGGESTED_PROMPTS.map((p, i) => (
        <motion.button
          key={p.text}
          onClick={() => onPrompt(p.text)}
          className="flex flex-col gap-1.5 p-3 rounded-xl text-right"
          style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text2 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          whileHover={{ background: T.surfaceHov, borderColor: T.borderGold, color: T.text1 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-xl">{p.icon}</span>
          <span className="text-xs leading-snug font-medium">{p.text}</span>
          <span className="text-xs rounded-full px-1.5 py-0.5 w-fit"
            style={{ background: T.goldDim, color: T.gold, fontSize: 10 }}>
            {p.tag}
          </span>
        </motion.button>
      ))}
    </div>
  </motion.div>
));

const ChatInput = memo(({ value, onChange, onSend, onKeyDown, isThinking, inputRef, ui }) => {
  const hasText = value.trim().length > 0;
  return (
    <div className="flex-shrink-0 p-3" style={{ borderTop: `1px solid ${T.border}` }}>
      <div
        className="flex items-end gap-2 px-3.5 py-2.5 rounded-2xl transition-all duration-150"
        style={{
          background: T.bg3,
          border: `1px solid ${hasText ? T.borderGold : T.border}`,
          boxShadow: hasText ? `0 0 0 3px ${T.goldDim}` : "none",
          // Flip direction for RTL languages
          direction: ui.dir,
        }}
      >
        <textarea
          ref={inputRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={ui.placeholder}
          rows={1}
          disabled={isThinking}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
          style={{
            color: T.text1,
            maxHeight: 100,
            fontFamily: "'Cairo','Tajawal',sans-serif",
            direction: ui.dir,
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
          }}
        />
        <motion.button
          onClick={onSend}
          disabled={!hasText || isThinking}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: hasText && !isThinking
              ? `linear-gradient(135deg, ${T.goldLight}, ${T.gold})`
              : T.surface,
            color: hasText && !isThinking ? "#000" : T.text3,
            marginBottom: 1,
          }}
          whileHover={hasText && !isThinking ? { scale: 1.08 } : {}}
          whileTap={hasText && !isThinking ? { scale: 0.94 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {isThinking ? (
            <motion.span style={{ fontSize: 14, color: T.gold }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>◌</motion.span>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m-7 7l7-7 7 7" />
            </svg>
          )}
        </motion.button>
      </div>
      <p className="text-center text-xs mt-1.5" style={{ color: T.text3, fontSize: 10 }}>
        {ui.footer}
      </p>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AIAssistant() {
  const navigate = useNavigate();

  const [isOpen,       setIsOpen]       = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState("");
  const [isThinking,   setIsThinking]   = useState(false);
  const [sessionId,    setSessionId]    = useState(null);
  const [hasUnread,    setHasUnread]    = useState(true);
  const [showWelcome,  setShowWelcome]  = useState(true);
  const [detectedLang, setDetectedLang] = useState("ar"); // default Arabic

  const endRef   = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Derive UI strings from detected language
  const ui = useMemo(() => UI[detectedLang] || UI.ar, [detectedLang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 280);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isFullscreen) document.body.style.overflow = "hidden";
    else              document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((v) => !v);
    setIsOpen(true);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen((v) => {
      if (v && isFullscreen) setIsFullscreen(false);
      return !v;
    });
  }, [isFullscreen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsFullscreen(false);
  }, []);

  const handleClear = useCallback(() => {
    setMessages([]);
    setShowWelcome(true);
    setSessionId(null);
  }, []);

  const handleAction = useCallback((action) => {
    if (action.type === "whatsapp") {
      window.open(action.target || `https://wa.me/${WA_NUMBER}`, "_blank", "noopener,noreferrer");
    } else {
      navigate(action.target);
      if (!isFullscreen) setIsOpen(false);
    }
  }, [navigate, isFullscreen]);

  const handleNav = useCallback((url) => {
    navigate(url);
    if (!isFullscreen) setIsOpen(false);
  }, [navigate, isFullscreen]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || isThinking) return;

    setInput("");
    setShowWelcome(false);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const userMsgId = Date.now();
    const aiMsgId   = userMsgId + 1;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user",      content: userText },
      { id: aiMsgId,   role: "assistant", content: "", isStreaming: true, actions: [], richContent: {} },
    ]);
    setIsThinking(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat/stream`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: userText, sessionId }),
        signal:  ctrl.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let parsed;
          try { parsed = JSON.parse(line.slice(6)); } catch { continue; }

          if (parsed.type === "meta") {
            if (parsed.sessionId) setSessionId(parsed.sessionId);
            // Update UI language based on server-detected lang
            if (parsed.lang && UI[parsed.lang]) setDetectedLang(parsed.lang);
            setMessages((prev) => prev.map((m) =>
              m.id === aiMsgId
                ? { ...m, actions: parsed.actions || [], richContent: parsed.richContent || {} }
                : m
            ));
          } else if (parsed.type === "text") {
            aiText += parsed.delta;
            setMessages((prev) => prev.map((m) =>
              m.id === aiMsgId ? { ...m, content: aiText } : m
            ));
          } else if (parsed.type === "done") {
            setMessages((prev) => prev.map((m) =>
              m.id === aiMsgId ? { ...m, isStreaming: false } : m
            ));
          } else if (parsed.type === "error") {
            throw new Error(parsed.message);
          }
        }
      }

    } catch (err) {
      if (err.name === "AbortError") return;

      try {
        const res  = await fetch(`${API_BASE}/ai/chat`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ message: userText, sessionId }),
        });
        const data = await res.json();
        if (data.sessionId) setSessionId(data.sessionId);
        if (data.lang && UI[data.lang]) setDetectedLang(data.lang);
        setMessages((prev) => prev.map((m) =>
          m.id === aiMsgId ? {
            ...m,
            content:     data.reply        || ui.errorMsg,
            isStreaming: false,
            actions:     data.actions      || [],
            richContent: data.richContent  || {},
          } : m
        ));
      } catch {
        setMessages((prev) => prev.map((m) =>
          m.id === aiMsgId ? {
            ...m,
            content:     ui.errorMsg,
            isStreaming: false,
            actions:     [{ label: ui.waLabel, type: "whatsapp", target: `https://wa.me/${WA_NUMBER}` }],
            richContent: {},
          } : m
        ));
      }
    } finally {
      setIsThinking(false);
    }
  }, [input, isThinking, sessionId, ui]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const windowStyle = useMemo(() => {
    if (isFullscreen) {
      return { position: "fixed", inset: 0, width: "100vw", height: "100vh", borderRadius: 0, border: "none", zIndex: 99999 };
    }
    return {
      width: "min(420px, calc(100vw - 20px))",
      height: "min(640px, calc(100vh - 96px))",
      borderRadius: 20,
      border: `1px solid ${T.borderGold}`,
    };
  }, [isFullscreen]);

  return (
    <>
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-[99998]"
            style={{ background: "rgba(4,6,14,0.85)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <div
        className={`${isFullscreen ? "fixed inset-0 z-[99999]" : "fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-3"}`}
        style={{ fontFamily: "'Cairo','Tajawal',sans-serif", direction: "rtl" }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="chat"
              className="flex flex-col overflow-hidden"
              style={{
                ...windowStyle,
                background: `linear-gradient(160deg, ${T.bg1} 0%, ${T.bg0} 100%)`,
                boxShadow: isFullscreen
                  ? "none"
                  : "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
              }}
              initial={isFullscreen
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.88, y: 28, transformOrigin: "bottom left" }}
              animate={isFullscreen ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isFullscreen  ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 28 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
            >
              <div className="absolute top-0 left-0 right-0 h-px z-10"
                style={{ background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`, opacity: 0.6 }} />

              <ChatHeader
                isThinking={isThinking}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
                onClose={handleClose}
                onClear={handleClear}
                hasMessages={messages.length > 0}
                ui={ui}
              />

              <div className="flex-1 overflow-y-auto flex flex-col"
                style={{ scrollbarWidth: "thin", scrollbarColor: `${T.borderGold} transparent`, paddingBottom: 8 }}>
                {showWelcome && messages.length === 0 ? (
                  <WelcomeScreen onPrompt={sendMessage} ui={ui} />
                ) : (
                  <div className={`flex flex-col gap-5 py-5 ${isFullscreen ? "max-w-3xl mx-auto w-full px-4" : ""}`}>
                    {messages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} onAction={handleAction} onNav={handleNav} ui={ui} />
                    ))}
                    <AnimatePresence>
                      {isThinking && <TypingIndicator key="typing" />}
                    </AnimatePresence>
                    <div ref={endRef} style={{ height: 4 }} />
                  </div>
                )}
              </div>

              <div className={isFullscreen ? "max-w-3xl mx-auto w-full" : ""}>
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onSend={sendMessage}
                  onKeyDown={handleKeyDown}
                  isThinking={isThinking}
                  inputRef={inputRef}
                  ui={ui}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isFullscreen && (
          <TriggerButton isOpen={isOpen} onClick={handleOpen} hasUnread={hasUnread} />
        )}
      </div>
    </>
  );
}