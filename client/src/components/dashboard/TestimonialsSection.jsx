// TestimonialsSection.jsx
// Qurani — Ultra Premium Social Proof Experience
// React · Framer Motion · TailwindCSS · Production Ready
"use strict";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS  (matches existing brand)
═══════════════════════════════════════════════════════ */
const G = {
  gold:       "#c9954a",
  goldLight:  "#e8c98a",
  goldPale:   "#f5e6c8",
  goldDim:    "rgba(201,149,74,0.14)",
  goldBorder: "rgba(201,149,74,0.28)",
  navy0:      "#060d1a",
  navy1:      "#0a1628",
  navy2:      "#0f2040",
  surface:    "rgba(10,22,40,0.72)",
  surfaceHov: "rgba(14,28,52,0.88)",
  text1:      "#f5e6c8",
  text2:      "rgba(245,230,200,0.65)",
  text3:      "rgba(245,230,200,0.35)",
  border:     "rgba(255,255,255,0.07)",
  green:      "#25d366",    // WhatsApp green
  greenDim:   "rgba(37,211,102,0.15)",
};

/* ═══════════════════════════════════════════════════════
   DATA — all image/audio paths are empty placeholders
═══════════════════════════════════════════════════════ */

const VOICE_TESTIMONIALS = [
  {
    id: "v1",
    name:     "أم عبدالله",
    location: "الرياض، السعودية",
    role:     "ولية أمر",
    quote:    "ابني حفظ ٥ أجزاء في ٣ أشهر — لم أصدق عيني",
    duration: "0:42",
    // ← ضع مسار ملف الصوت هنا
    audio:    "./audio/voice-1.mp3",
    // ← ضع مسار صورة العميل هنا
    image:    "/image/MSGC-1.png",
    initials: "أ ع",
    accent:   "#9a6abf",
  },
  {
    id: "v2",
    name:     "يوسف النجار",
    location: "القاهرة، مصر",
    role:     "طالب — ١٧ سنة",
    quote:    "المعلم غيّر طريقة تلاوتي تماماً، الآن أشعر بكل حرف",
    duration: "0:38",
    audio:    "./audio/voice-2.mp3",
    image:      "/image/MSGC-2.png",
    initials: "ي ن",
    accent:   "#5e8abf",
  },
  {
    id: "v3",
    name:     "فاطمة العمري",
    location: "دبي، الإمارات",
    role:     "طالبة — ٢٢ سنة",
    quote:    "حصلت على إجازتي في رواية حفص بعد سنة ونصف فقط",
    duration: "0:55",
    audio:    "./audio/voice-3.mp3",
    image:    "/image/MSGC-3.png",
    initials: "ف ع",
    accent:   "#4a9060",
  },
];

const WHATSAPP_TESTIMONIALS = [
  {
    id: "w1",
    name:     "محمد عادل",
    location: "مصر",
    role:     "طالب",
    stars:    5,
    text:     "كنت أجد صعوبة في القراءة وفهم التجويد، لكن مع معلمي أصبحت أقرأ بثقة وأجد شغفاً لم أكن أتصوره من قبل.",

    image:    "",
    initials: "م ع",
    accent:   "#5e8abf",

    // هنا الصورة الأولى
    proof:    "/image/MSGC-1.png",
    proofAlt: "واتساب 1",
  },

  {
    id: "w2",
    name:     "آية خالد",
    location: "السعودية",
    role:     "طالبة",
    stars:    5,
    text:     "البرنامج غيّر حياتي تماماً، حفظت القرآن وأنا أشعر بالراحة والطمأنينة، وارتبطت بالقرآن أكثر من أي وقت مضى.",

    image:    "",
    initials: "آ خ",
    accent:   "#9a6abf",

    // هنا الصورة الثالثة
    proof:    "/image/MSGC-2.png",
    proofAlt: "واتساب 2",
  },

  {
    id: "w3",
    name:     "أحمد محمود",
    location: "الأردن",
    role:     "ولي أمر",
    stars:    5,
    text:     "رأيت فرقاً كبيراً في ابني، ليس فقط في التلاوة والحفظ، بل في أخلاقه وثقته بنفسه.",

    image:    "",
    initials: "أ م",
    accent:   "#4a9060",

    proof:    "/image/MSGC-2.png",
    proofAlt: " 3 محادثة واتساب",
  },

  {
    id: "w4",
    name:     "نور الدين",
    location: "تونس",
    role:     "طالب — ٢٠ سنة",
    stars:    5,
    text:     "تعلمت مخارج الحروف بشكل صحيح للمرة الأولى في حياتي. المعلم صبور جداً ومتخصص.",

    image:    "",
    initials: "ن د",
    accent:   "#bf6a5e",

    proof:    "/image/MSGC-4.png",
    proofAlt: "محادثة واتساب",
  },
];
const STATS = [
  {
    num: "+٢٥K",
    label: "طالب حول العالم",
    icon: <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />,
  },
  {
    num: "+٤.٩",
    label: "متوسط التقييم",
    icon: <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
  },
  {
    num: "+١٢٠",
    label: "معلم متخصص",
    icon: <><path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 7h8M8 11h8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></>,
  },
  {
    num: "+٣٠",
    label: "دولة حول العالم",
    icon: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.4" fill="none" /></>,
  },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function Stars({ count }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 12 12" aria-hidden>
          <path
            d="M6 1l1.4 2.8 3.1.45-2.25 2.19.53 3.08L6 8.05 3.22 9.52l.53-3.08L1.5 4.25l3.1-.45z"
            fill={i <= count ? G.gold : "rgba(255,255,255,0.1)"}
            stroke={i <= count ? G.goldLight : "transparent"}
            strokeWidth="0.3"
          />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ image, initials, accent, size = 56 }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        width: size, height: size, borderRadius: "50%",
        border: `1.5px solid ${G.goldBorder}`,
        boxShadow: `0 0 0 3px rgba(201,149,74,0.08), 0 0 16px ${accent}33`,
        background: `linear-gradient(135deg, ${G.navy2}, ${G.navy0})`,
      }}
    >
      {image ? (
        <img src={image} alt={initials} className="w-full h-full object-cover" />
      ) : (
        <span style={{
          fontSize: size * 0.27, fontWeight: 700, fontFamily: "'Cairo',sans-serif",
          background: `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{initials}</span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WAVEFORM VISUALIZER
═══════════════════════════════════════════════════════ */
const WaveformVisualizer = memo(({ isPlaying, progress, accentColor }) => {
  const bars = 28;
  const heights = [3,5,8,12,9,14,10,7,13,16,11,8,15,12,9,6,13,10,7,14,11,8,12,9,6,10,7,4];

  return (
    <div className="flex items-center gap-0.5" style={{ height: 32 }}>
      {heights.slice(0, bars).map((h, i) => {
        const filled = progress > 0 && (i / bars) < (progress / 100);
        return (
          <motion.div
            key={i}
            className="rounded-full flex-shrink-0"
            style={{
              width: 2.5,
              background: filled ? accentColor : G.goldBorder,
              originY: 1,
            }}
            animate={isPlaying ? {
              scaleY: [1, 1 + (h / 16) * 0.6, 0.6, 1 + (h / 16) * 0.4, 1],
              opacity: filled ? 1 : 0.5,
            } : {
              scaleY: 1,
              opacity: filled ? 1 : 0.35,
            }}
            transition={isPlaying ? {
              duration: 0.5 + (i % 5) * 0.1,
              repeat: Infinity,
              delay: (i % 7) * 0.07,
              ease: "easeInOut",
            } : { duration: 0.3 }}
            initial={{ height: h }}
            style={{ height: h, width: 2.5, borderRadius: 2 }}
          />
        );
      })}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════
   AUDIO PLAYER HOOK
═══════════════════════════════════════════════════════ */
function useAudioPlayer(src) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [duration,  setDuration]  = useState(0);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    });
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => { setIsPlaying(false); setProgress(0); });

    return () => { audio.pause(); audio.src = ""; };
  }, [src]);

  const toggle = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const seek = useCallback((pct) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
  }, []);

  return { isPlaying, progress, duration, toggle, seek };
}

/* ═══════════════════════════════════════════════════════
   VOICE TESTIMONIAL CARD
═══════════════════════════════════════════════════════ */
const VoiceTestimonialCard = memo(({ t, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { isPlaying, progress, toggle, seek } = useAudioPlayer(t.audio);

  const fmtTime = (pct, dur) => {
    if (!dur) return t.duration;
    const s = Math.floor((pct / 100) * dur);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <motion.div
      ref={ref}
      dir="rtl"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden"
      style={{
        borderRadius: 20,
        background: G.surface,
        border: `1px solid ${G.goldBorder}`,
        backdropFilter: "blur(20px)",
        padding: "24px",
      }}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${G.gold}55,transparent)` }} />

      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${t.accent}10, transparent 65%)` }} />

      {/* Mic badge */}
      <div className="absolute top-3 left-3"
        style={{
          fontSize: 10, fontFamily: "'Cairo',sans-serif", fontWeight: 700,
          padding: "3px 10px", borderRadius: 100, letterSpacing: "0.06em",
          background: `${t.accent}22`, border: `1px solid ${t.accent}44`, color: t.accent,
          display: "flex", alignItems: "center", gap: 5,
        }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
          <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
        </svg>
        تسجيل صوتي
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 mt-2">
        <Avatar image={t.image} initials={t.initials} accent={t.accent} size={52} />
        <div>
          <p style={{ color: G.text1, fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: 14 }}>{t.name}</p>
          <p style={{ color: G.text3, fontFamily: "'Cairo',sans-serif", fontSize: 11, marginTop: 2 }}>
            {t.role} · {t.location}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p style={{
        color: G.text2, fontFamily: "'Cairo',sans-serif",
        fontSize: 13, lineHeight: 1.85, marginBottom: 18,
        borderRight: `2px solid ${G.goldBorder}`, paddingRight: 12,
      }}>
        "{t.quote}"
      </p>

      {/* Player */}
      <div className="rounded-2xl p-3" style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${G.border}` }}>
        <div className="flex items-center gap-3 mb-2.5">
          {/* Play/Pause button */}
          <motion.button
            onClick={toggle}
            className="flex-shrink-0 flex items-center justify-center rounded-full focus:outline-none"
            style={{
              width: 38, height: 38,
              background: isPlaying
                ? `linear-gradient(135deg, ${t.accent}, ${t.accent}bb)`
                : `linear-gradient(135deg, ${G.gold}, #7a5c10)`,
              boxShadow: isPlaying ? `0 0 18px ${t.accent}55` : `0 0 14px rgba(201,149,74,0.3)`,
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.svg key="pause" width="14" height="14" viewBox="0 0 24 24" fill="white"
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
                  <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                </motion.svg>
              ) : (
                <motion.svg key="play" width="14" height="14" viewBox="0 0 24 24" fill="white"
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                  style={{ marginLeft: 2 }}>
                  <path d="M5 3l14 9-14 9V3z"/>
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Waveform */}
          <div className="flex-1">
            <WaveformVisualizer isPlaying={isPlaying} progress={progress} accentColor={t.accent} />
          </div>

          {/* Duration */}
          <span style={{ color: G.text3, fontFamily: "'Cairo',sans-serif", fontSize: 11, minWidth: 28 }}>
            {t.duration}
          </span>
        </div>

        {/* Progress bar (clickable) */}
        <div
          className="h-1 rounded-full cursor-pointer overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = ((e.clientX - rect.left) / rect.width) * 100;
            seek(pct);
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${t.accent}, ${G.gold})`, width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${t.accent}66,transparent)` }} />
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════
   FLOATING WHATSAPP PROOF PREVIEW
═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   WHATSAPP PROOF CARD
═══════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════
   WHATSAPP PROOF CARD
   - Desktop: الصورة تظهر داخل الكارد عند Hover
   - Mobile:  كارد كامل عمودي + زر "عرض المحادثة" يفتح Modal
═══════════════════════════════════════════════════════ */
const WhatsAppProofCard = memo(({ t, delay }) => {
  const cardRef = useRef(null);
  const inView  = useInView(cardRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={cardRef}
      dir="rtl"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden flex flex-col"
      style={{
        borderRadius: 18,
        background: G.surface,
        border: `1px solid ${G.goldBorder}`,
        backdropFilter: "blur(20px)",
        padding: "20px 18px",
        transition: "border-color 0.3s",
      }}
    >
      {/* Top shimmer */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg,transparent,${G.gold}55,transparent)` }} />

      {/* Hover ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${t.accent}0d, transparent 65%)` }} />

      {/* WhatsApp badge */}
      <div className="flex items-center gap-1.5 mb-3 w-fit rounded-full px-2.5 py-1"
        style={{
          background: G.greenDim,
          border: `1px solid rgba(37,211,102,0.3)`,
          fontSize: 10, color: G.green,
          fontFamily: "'Cairo',sans-serif", fontWeight: 700,
        }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill={G.green}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
        </svg>
        واتساب · إثبات حقيقي
      </div>

      {/* Header: avatar + name */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar image={t.image} initials={t.initials} accent={t.accent} size={46} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5 flex-wrap">
            <p style={{ color: G.text1, fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: 13 }}>
              {t.name}
            </p>
            <Stars count={t.stars} />
          </div>
          <p style={{ color: G.text3, fontFamily: "'Cairo',sans-serif", fontSize: 11 }}>
            {t.role} · {t.location}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p style={{
        color: G.text2, fontFamily: "'Cairo',sans-serif",
        fontSize: 12.5, lineHeight: 1.85,
        borderRight: `2px solid ${G.goldBorder}`, paddingRight: 10,
        marginBottom: 12,
      }}>
        {t.text}
      </p>

      {/* Verified tag */}
      <div className="flex items-center gap-1.5 mb-3"
        style={{ color: G.text3, fontSize: 11, fontFamily: "'Cairo',sans-serif" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        رأي موثق من واتساب
      </div>

      {/* WhatsApp proof image — always visible */}
      {t.proof && (
        <div style={{
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid rgba(37,211,102,0.25)`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(37,211,102,0.07)",
          flexShrink: 0,
        }}>
          {/* WA header bar */}
          <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#075e54" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: G.green }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              </svg>
            </div>
            <span style={{ color: "#fff", fontSize: 10, fontFamily: "'Cairo',sans-serif", fontWeight: 700 }}>
              WhatsApp · {t.name}
            </span>
            <div className="mr-auto flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.green }} />
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 9, fontFamily: "'Cairo',sans-serif" }}>online</span>
            </div>
          </div>

          {/* Screenshot */}
          <img
            src={t.proof}
            alt={t.proofAlt}
            style={{
              width: "100%", display: "block",
              objectFit: "cover", objectPosition: "top",
              background: "#e5ddd5",
            }}
          />
        </div>
      )}

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${t.accent}66,transparent)` }} />
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════ */
const StatCard = memo(({ stat, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden flex flex-col items-center text-center gap-2"
      style={{
        padding: "28px 16px",
        borderRadius: 18,
        background: G.surface,
        border: `1px solid ${G.goldBorder}`,
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${G.gold}44,transparent)` }} />

      <div className="flex items-center justify-center rounded-full"
        style={{
          width: 50, height: 50,
          background: G.goldDim,
          border: `1px solid ${G.goldBorder}`,
          color: G.gold, marginBottom: 4,
        }}>
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>{stat.icon}</svg>
      </div>

      <div style={{
        fontFamily: "'Cairo',sans-serif",
        fontSize: "clamp(26px,3.5vw,38px)",
        fontWeight: 900, lineHeight: 1,
        background: `linear-gradient(135deg, ${G.gold} 0%, ${G.goldLight} 55%, ${G.goldPale} 100%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{stat.num}</div>

      <div style={{
        fontFamily: "'Cairo',sans-serif",
        fontSize: 12, color: G.text3, lineHeight: 1.4,
      }}>{stat.label}</div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════════ */
const SectionHeader = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    className="text-center mb-16"
    dir="rtl"
  >
    {/* Eyebrow */}
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-px w-8" style={{ background: `linear-gradient(90deg,transparent,${G.gold})` }} />
      <span style={{
        fontFamily: "'Cairo',sans-serif", fontWeight: 800,
        fontSize: 12, letterSpacing: "0.45em", color: G.gold,
      }}>آراء طلابنا</span>
      <div className="h-px w-8" style={{ background: `linear-gradient(270deg,transparent,${G.gold})` }} />
    </div>

    {/* Title */}
    <h2 style={{
      fontFamily: "'Cairo',sans-serif",
      fontSize: "clamp(30px,5.5vw,58px)",
      fontWeight: 900, lineHeight: 1.2, marginBottom: 12,
    }}>
      <span style={{
        background: `linear-gradient(120deg, ${G.gold} 0%, ${G.goldLight} 45%, ${G.goldPale} 70%, ${G.goldLight} 100%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        filter: `drop-shadow(0 0 22px rgba(201,149,74,0.3))`,
      }}>قصص تُلهم القلوب</span>
    </h2>

    <p style={{
      fontFamily: "'Cairo',sans-serif",
      fontSize: 14, color: G.text3, marginBottom: 16,
    }}>هنا تبدأ رحلة التغيير الحقيقي مع القرآن</p>

    {/* Ornament divider */}
    <div className="flex items-center justify-center gap-2.5">
      <div className="h-px w-10" style={{ background: `linear-gradient(90deg,transparent,${G.goldBorder})` }} />
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z"
          stroke={G.gold} strokeWidth="0.8" fill="none" opacity="0.7" />
      </svg>
      <div className="h-px w-10" style={{ background: `linear-gradient(270deg,transparent,${G.goldBorder})` }} />
    </div>
  </motion.div>
));

/* ═══════════════════════════════════════════════════════
   SUB-SECTION LABEL
═══════════════════════════════════════════════════════ */
const SubLabel = memo(({ icon, text, color }) => (
  <motion.div
    className="flex items-center gap-2.5 mb-6"
    dir="rtl"
    initial={{ opacity: 0, x: 12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex items-center justify-center rounded-xl"
      style={{
        width: 34, height: 34,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        color,
      }}>
      {icon}
    </div>
    <div>
      <p style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 15, color: G.text1 }}>{text}</p>
    </div>
  </motion.div>
));

/* ═══════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════ */
export default function TestimonialsSection() {
  return (
    <section
      dir="rtl"
      style={{
        position: "relative",
        padding: "110px 0 100px",
        overflow: "hidden",
        fontFamily: "'Cairo',sans-serif",
        backgroundImage: "url('./image/TestimonialsSection.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
        .ts-card-hover:hover { border-color: rgba(201,149,74,0.45) !important; }
      `}</style>

      {/* ── BG DECORATIONS ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div style={{
          position: "absolute", top: "15%", right: "-6%",
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(17,40,71,0.45) 0%, transparent 70%)",
          filter: "blur(55px)",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "-6%",
          width: 380, height: 380, borderRadius: "50%",
          background: `radial-gradient(circle, ${G.goldDim} 0%, transparent 70%)`,
          filter: "blur(55px)",
        }} />
        {/* Gold ambient center glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800, height: 400, borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(201,149,74,0.04) 0%, transparent 70%)`,
          filter: "blur(40px)",
        }} />
        {/* Section dividers */}
        <div className="absolute top-0 inset-x-16 h-px"
          style={{ background: `linear-gradient(90deg,transparent,${G.goldBorder},transparent)` }} />
        <div className="absolute bottom-0 inset-x-16 h-px"
          style={{ background: `linear-gradient(90deg,transparent,${G.goldBorder},transparent)` }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <SectionHeader />

        {/* ── VOICE TESTIMONIALS ─────────────────────────── */}
        <div className="mb-16">
          <SubLabel
            color={G.gold}
            text="تسجيلات صوتية حقيقية من طلابنا"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
              </svg>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VOICE_TESTIMONIALS.map((t, i) => (
              <VoiceTestimonialCard key={t.id} t={t} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* ── WHATSAPP PROOF ─────────────────────────────── */}
        <div className="mb-20">
          <SubLabel
            color={G.green}
            text="آراء موثقة من واتساب"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill={G.green}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              </svg>
            }
          />

          {/* 2-col on md, single on mobile */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">            {WHATSAPP_TESTIMONIALS.map((t, i) => (
              <WhatsAppProofCard key={t.id} t={t} delay={i * 0.09} />
            ))}
          </div>

          {/* Trust indicators row */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-8"
            dir="rtl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {[
              { icon: "✓", text: "آراء حقيقية غير مدفوعة" },
              { icon: "✓", text: "محادثات موثقة بالكامل" },
              { icon: "✓", text: "تقييمات من طلاب حقيقيين" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2"
                style={{ fontSize: 12, color: G.text3, fontFamily: "'Cairo',sans-serif" }}>
                <span style={{ color: G.green, fontWeight: 700 }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── STATS ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <StatCard key={i} stat={s} delay={i * 0.08} />
          ))}
        </div>

      </div>
    </section>
  );
}