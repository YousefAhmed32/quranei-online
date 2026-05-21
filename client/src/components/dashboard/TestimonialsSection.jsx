"use strict";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const G = {
  gold:       "#c9954a",
  goldLight:  "#e8c98a",
  goldPale:   "#f5e6c8",
  goldDim:    "rgba(201,149,74,0.14)",
  goldBorder: "rgba(201,149,74,0.28)",
  navy0:      "#060d1a",
  surface:    "rgba(10,22,40,0.72)",
  text1:      "#f5e6c8",
  text2:      "rgba(245,230,200,0.65)",
  text3:      "rgba(245,230,200,0.35)",
  border:     "rgba(255,255,255,0.07)",
  green:      "#25d366",
  greenDim:   "rgba(37,211,102,0.15)",
};

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const VOICE_TESTIMONIALS = [
  {
    id: "v1", name: "أم عبدالله", location: "الرياض، السعودية", role: "ولية أمر",
    quote: "ابني حفظ ٥ أجزاء في ٣ أشهر — لم أصدق عيني",
    duration: "0:42", audio: "./audio/voice-1.mp3", image: "/image/MSGC-1.png",
    initials: "أ ع", accent: "#9a6abf",
  },
  {
    id: "v2", name: "يوسف النجار", location: "القاهرة، مصر", role: "طالب — ١٧ سنة",
    quote: "المعلم غيّر طريقة تلاوتي تماماً، الآن أشعر بكل حرف",
    duration: "0:38", audio: "./audio/voice-2.mp3", image: "/image/MSGC-2.png",
    initials: "ي ن", accent: "#5e8abf",
  },
  {
    id: "v3", name: "فاطمة العمري", location: "دبي، الإمارات", role: "طالبة — ٢٢ سنة",
    quote: "حصلت على إجازتي في رواية حفص بعد سنة ونصف فقط",
    duration: "0:55", audio: "./audio/voice-3.mp3", image: "/image/MSGC-3.png",
    initials: "ف ع", accent: "#4a9060",
  },
];

const WHATSAPP_TESTIMONIALS = [
  {
    id: "w1", name: "محمد عادل", location: "مصر", role: "طالب", stars: 5,
    text: "كنت أجد صعوبة في القراءة وفهم التجويد، لكن مع معلمي أصبحت أقرأ بثقة وأجد شغفاً لم أكن أتصوره من قبل.",
    initials: "م ع", accent: "#5e8abf", proof: "/image/MSGC-1.png", proofAlt: "واتساب 1",
  },
  {
    id: "w2", name: "آية خالد", location: "السعودية", role: "طالبة", stars: 5,
    text: "البرنامج غيّر حياتي تماماً، حفظت القرآن وأنا أشعر بالراحة والطمأنينة.",
    initials: "آ خ", accent: "#9a6abf", proof: "/image/MSGC-2.png", proofAlt: "واتساب 2",
  },
  {
    id: "w3", name: "أحمد محمود", location: "الأردن", role: "ولي أمر", stars: 5,
    text: "رأيت فرقاً كبيراً في ابني، ليس فقط في التلاوة والحفظ، بل في أخلاقه وثقته بنفسه.",
    initials: "أ م", accent: "#4a9060", proof: "/image/MSGC-2.png", proofAlt: "واتساب 3",
  },
  {
    id: "w4", name: "نور الدين", location: "تونس", role: "طالب — ٢٠ سنة", stars: 5,
    text: "تعلمت مخارج الحروف بشكل صحيح للمرة الأولى. المعلم صبور جداً ومتخصص.",
    initials: "ن د", accent: "#bf6a5e", proof: "/image/MSGC-4.png", proofAlt: "واتساب 4",
  },
];

const STATS = [
  {
    num: "+٢٥K", label: "طالب حول العالم",
    icon: <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />,
  },
  {
    num: "+٤.٩", label: "متوسط التقييم",
    icon: <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
  },
  {
    num: "+١٢٠", label: "معلم متخصص",
    icon: <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 7h8M8 11h8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />,
  },
  {
    num: "+٣٠", label: "دولة حول العالم",
    icon: <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.4" fill="none" /></>,
  },
];

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" aria-hidden>
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

function Avatar({ image, initials, accent, size = 52 }) {
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: "50%",
      border: `1.5px solid ${G.goldBorder}`,
      boxShadow: `0 0 0 3px rgba(201,149,74,0.07), 0 0 14px ${accent}2a`,
      background: "linear-gradient(135deg, #0f2040, #060d1a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", flexShrink: 0,
    }}>
      {image ? (
        <img src={image} alt={initials} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

/* ═══════════════════════════════════════════════
   WAVEFORM
═══════════════════════════════════════════════ */
const WaveformVisualizer = memo(({ isPlaying, progress, accentColor }) => {
  const heights = [3,5,8,12,9,14,10,7,13,16,11,8,15,12,9,6,13,10,7,14,11,8,12,9,6,10,7,4];
  const bars = 24; // fewer bars for mobile

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 28 }}>
      {heights.slice(0, bars).map((h, i) => {
        const filled = progress > 0 && (i / bars) < (progress / 100);
        return (
          <motion.div
            key={i}
            style={{
              width: 2.5, height: h, borderRadius: 2, flexShrink: 0,
              background: filled ? accentColor : G.goldBorder,
            }}
            animate={isPlaying ? {
              scaleY: [1, 1 + (h / 16) * 0.55, 0.65, 1 + (h / 16) * 0.38, 1],
              opacity: filled ? 1 : 0.45,
            } : { scaleY: 1, opacity: filled ? 1 : 0.32 }}
            transition={isPlaying ? {
              duration: 0.48 + (i % 5) * 0.09,
              repeat: Infinity, delay: (i % 7) * 0.07, ease: "easeInOut",
            } : { duration: 0.28 }}
          />
        );
      })}
    </div>
  );
});

/* ═══════════════════════════════════════════════
   AUDIO HOOK
═══════════════════════════════════════════════ */
function useAudioPlayer(src) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [duration, setDuration]   = useState(0);

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
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setIsPlaying(true); }
  }, [isPlaying]);

  const seek = useCallback((pct) => {
    if (!audioRef.current?.duration) return;
    audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
  }, []);

  return { isPlaying, progress, duration, toggle, seek };
}

/* ═══════════════════════════════════════════════
   VOICE CARD
═══════════════════════════════════════════════ */
const VoiceTestimonialCard = memo(({ t, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const { isPlaying, progress, toggle, seek } = useAudioPlayer(t.audio);

  return (
    <motion.div
      ref={ref}
      dir="rtl"
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.28 } }}
      style={{
        position: "relative", overflow: "hidden",
        borderRadius: 18,
        background: G.surface,
        border: `1px solid ${G.goldBorder}`,
        backdropFilter: "blur(20px)",
        padding: "clamp(18px, 3.5vw, 24px)",
      }}
    >
      <div style={{ position: "absolute", top: 0, inset: "0", height: 1, background: `linear-gradient(90deg,transparent,${G.gold}55,transparent)`, pointerEvents: "none" }} />

      {/* Mic badge */}
      <div style={{
        position: "absolute", top: 12, left: 12,
        fontSize: 10, fontFamily: "'Cairo',sans-serif", fontWeight: 700,
        padding: "3px 9px", borderRadius: 100,
        background: `${t.accent}1e`, border: `1px solid ${t.accent}44`, color: t.accent,
        display: "flex", alignItems: "center", gap: 4,
      }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
          <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
        </svg>
        تسجيل صوتي
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, marginTop: 10 }}>
        <Avatar image={t.image} initials={t.initials} accent={t.accent} size={48} />
        <div>
          <p style={{ color: G.text1, fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: "clamp(13px, 2.5vw, 14px)" }}>{t.name}</p>
          <p style={{ color: G.text3, fontFamily: "'Cairo',sans-serif", fontSize: "clamp(10px, 2vw, 11px)", marginTop: 2 }}>
            {t.role} · {t.location}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p style={{
        color: G.text2, fontFamily: "'Cairo',sans-serif",
        fontSize: "clamp(12px, 2.2vw, 13px)", lineHeight: 1.85, marginBottom: 16,
        borderRight: `2px solid ${G.goldBorder}`, paddingRight: 10,
      }}>
        "{t.quote}"
      </p>

      {/* Player */}
      <div style={{ borderRadius: 14, padding: "clamp(10px, 2.5vw, 12px)", background: "rgba(0,0,0,0.24)", border: `1px solid ${G.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          {/* Play button — 44×44 minimum */}
          <motion.button
            onClick={toggle}
            style={{
              width: 44, height: 44, minWidth: 44, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer",
              background: isPlaying
                ? `linear-gradient(135deg, ${t.accent}, ${t.accent}bb)`
                : `linear-gradient(135deg, ${G.gold}, #7a5c10)`,
              boxShadow: isPlaying ? `0 0 16px ${t.accent}55` : "0 0 12px rgba(201,149,74,0.28)",
            }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.svg key="pause" width="13" height="13" viewBox="0 0 24 24" fill="white"
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
                  <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                </motion.svg>
              ) : (
                <motion.svg key="play" width="13" height="13" viewBox="0 0 24 24" fill="white"
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                  style={{ marginLeft: 2 }}>
                  <path d="M5 3l14 9-14 9V3z"/>
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <WaveformVisualizer isPlaying={isPlaying} progress={progress} accentColor={t.accent} />
          </div>

          <span style={{ color: G.text3, fontFamily: "'Cairo',sans-serif", fontSize: 11, flexShrink: 0 }}>
            {t.duration}
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{ height: "5px", borderRadius: 99, background: "rgba(255,255,255,0.07)", cursor: "pointer", touchAction: "none" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          <motion.div
            style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${t.accent}, ${G.gold})`, width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════
   WHATSAPP CARD — responsive image
═══════════════════════════════════════════════ */
const WhatsAppProofCard = memo(({ t, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.28 } }}
      style={{
        position: "relative", overflow: "hidden",
        borderRadius: 16,
        background: G.surface,
        border: `1px solid ${G.goldBorder}`,
        backdropFilter: "blur(20px)",
        padding: "clamp(14px, 3vw, 20px)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${G.gold}55,transparent)`, pointerEvents: "none" }} />

      {/* WA badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 5, marginBottom: 12, width: "fit-content",
        padding: "3px 10px", borderRadius: 100,
        background: G.greenDim, border: `1px solid rgba(37,211,102,0.28)`,
        fontSize: 10, color: G.green, fontFamily: "'Cairo',sans-serif", fontWeight: 700,
      }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill={G.green}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
        </svg>
        واتساب · إثبات حقيقي
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Avatar image={t.image} initials={t.initials} accent={t.accent} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 4, marginBottom: 2 }}>
            <p style={{ color: G.text1, fontFamily: "'Cairo',sans-serif", fontWeight: 700, fontSize: "clamp(12px, 2.2vw, 13px)" }}>
              {t.name}
            </p>
            <Stars count={t.stars} />
          </div>
          <p style={{ color: G.text3, fontFamily: "'Cairo',sans-serif", fontSize: "clamp(10px, 1.8vw, 11px)" }}>
            {t.role} · {t.location}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p style={{
        color: G.text2, fontFamily: "'Cairo',sans-serif",
        fontSize: "clamp(11px, 2vw, 12.5px)", lineHeight: 1.85,
        borderRight: `2px solid ${G.goldBorder}`, paddingRight: 9, marginBottom: 12,
      }}>
        {t.text}
      </p>

      {/* Verified */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: G.text3, fontSize: 10, fontFamily: "'Cairo',sans-serif", marginBottom: 12 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={G.green} strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        رأي موثق من واتساب
      </div>

      {/* Proof image */}
      {t.proof && (
        <div style={{
          borderRadius: 12, overflow: "hidden",
          border: `1px solid rgba(37,211,102,0.22)`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.28)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", background: "#075e54" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: G.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              </svg>
            </div>
            <span style={{ color: "#fff", fontSize: 10, fontFamily: "'Cairo',sans-serif", fontWeight: 700 }}>
              WhatsApp · {t.name}
            </span>
          </div>
          <img
            src={t.proof}
            alt={t.proofAlt}
            style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "top", background: "#e5ddd5" }}
          />
        </div>
      )}
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */
const StatCard = memo(({ stat, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.26 } }}
      style={{
        padding: "clamp(20px, 4vw, 28px) clamp(12px, 2.5vw, 16px)",
        borderRadius: 16,
        background: G.surface,
        border: `1px solid ${G.goldBorder}`,
        backdropFilter: "blur(16px)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        textAlign: "center", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${G.gold}44,transparent)` }} />
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: G.goldDim, border: `1px solid ${G.goldBorder}`,
        color: G.gold, marginBottom: 3,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>{stat.icon}</svg>
      </div>
      <div style={{
        fontFamily: "'Cairo',sans-serif",
        fontSize: "clamp(22px, 5vw, 36px)", fontWeight: 900, lineHeight: 1,
        background: `linear-gradient(135deg, ${G.gold} 0%, ${G.goldLight} 55%, ${G.goldPale} 100%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{stat.num}</div>
      <div style={{ fontFamily: "'Cairo',sans-serif", fontSize: "clamp(10px, 2vw, 12px)", color: G.text3, lineHeight: 1.4 }}>
        {stat.label}
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════ */
const SectionHeader = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    style={{ textAlign: "center", marginBottom: "clamp(40px, 8vw, 64px)" }}
    dir="rtl"
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
      <div style={{ height: 1, width: 28, background: `linear-gradient(90deg,transparent,${G.gold})` }} />
      <span style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "0.45em", color: G.gold }}>
        آراء طلابنا
      </span>
      <div style={{ height: 1, width: 28, background: `linear-gradient(270deg,transparent,${G.gold})` }} />
    </div>

    <h2 style={{
      fontFamily: "'Cairo',sans-serif",
      fontSize: "clamp(26px, 5.5vw, 56px)",
      fontWeight: 900, lineHeight: 1.22, marginBottom: 10,
    }}>
      <span style={{
        background: `linear-gradient(120deg, ${G.gold} 0%, ${G.goldLight} 45%, ${G.goldPale} 70%, ${G.goldLight} 100%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 0 20px rgba(201,149,74,0.28))",
      }}>قصص تُلهم القلوب</span>
    </h2>

    <p style={{ fontFamily: "'Cairo',sans-serif", fontSize: "clamp(12px, 2.2vw, 14px)", color: G.text3, marginBottom: 14 }}>
      هنا تبدأ رحلة التغيير الحقيقي مع القرآن
    </p>

    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <div style={{ height: 1, width: 36, background: `linear-gradient(90deg,transparent,${G.goldBorder})` }} />
      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z" stroke={G.gold} strokeWidth="0.8" fill="none" opacity="0.7" />
      </svg>
      <div style={{ height: 1, width: 36, background: `linear-gradient(270deg,transparent,${G.goldBorder})` }} />
    </div>
  </motion.div>
));

/* ═══════════════════════════════════════════════
   SUB LABEL
═══════════════════════════════════════════════ */
const SubLabel = memo(({ icon, text, color }) => (
  <motion.div
    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "clamp(16px, 3.5vw, 24px)" }}
    dir="rtl"
    initial={{ opacity: 0, x: 10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55 }}
  >
    <div style={{
      width: 32, height: 32, borderRadius: 10,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: `${color}18`, border: `1px solid ${color}2e`, color,
    }}>
      {icon}
    </div>
    <p style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: "clamp(13px, 2.5vw, 15px)", color: G.text1 }}>
      {text}
    </p>
  </motion.div>
));

/* ═══════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════ */
export default function TestimonialsSection() {
  return (
    <section
      dir="rtl"
      style={{
        position: "relative",
        padding: "clamp(64px, 12vw, 110px) 0 clamp(56px, 10vw, 100px)",
        overflow: "hidden",
        fontFamily: "'Cairo',sans-serif",
        backgroundImage: "url('./image/TestimonialsSection.png')",
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
      }}
    >
    <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

  /* Voice grid: 1 mobile → 2 tablet → 3 desktop */
  .voice-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(14px, 3vw, 20px);
  }

  @media (min-width: 640px) {
    .voice-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 1024px) {
    .voice-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* WA grid: 1 mobile → 2 tablet → 4 desktop */
  .wa-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(12px, 2.5vw, 16px);
  }

  @media (min-width: 768px) {
    .wa-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 1200px) {
    .wa-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Stats grid: 2 → 4 */
  .stats-grid-ts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(10px, 2vw, 14px);
  }

  @media (min-width: 768px) {
    .stats-grid-ts {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`}</style>

      {/* BG */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
        <div style={{ position: "absolute", top: "12%", right: "-5%", width: "min(400px, 55vw)", height: "min(400px, 55vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(17,40,71,0.42) 0%, transparent 70%)", filter: "blur(52px)" }} />
        <div style={{ position: "absolute", bottom: "12%", left: "-5%", width: "min(360px, 50vw)", height: "min(360px, 50vw)", borderRadius: "50%", background: `radial-gradient(circle, ${G.goldDim} 0%, transparent 70%)`, filter: "blur(52px)" }} />
        <div style={{ position: "absolute", top: 0, left: "5%", right: "5%", height: 1, background: `linear-gradient(90deg,transparent,${G.goldBorder},transparent)` }} />
        <div style={{ position: "absolute", bottom: 0, left: "5%", right: "5%", height: 1, background: `linear-gradient(90deg,transparent,${G.goldBorder},transparent)` }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 5vw, 24px)" }}>

        <SectionHeader />

        {/* Voice testimonials */}
        <div style={{ marginBottom: "clamp(40px, 8vw, 64px)" }}>
          <SubLabel
            color={G.gold} text="تسجيلات صوتية حقيقية من طلابنا"
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>}
          />
          <div className="voice-grid">
            {VOICE_TESTIMONIALS.map((t, i) => <VoiceTestimonialCard key={t.id} t={t} delay={i * 0.09} />)}
          </div>
        </div>

        {/* WhatsApp proof */}
        <div style={{ marginBottom: "clamp(40px, 8vw, 80px)" }}>
          <SubLabel
            color={G.green} text="آراء موثقة من واتساب"
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill={G.green}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>}
          />
          <div className="wa-grid">
            {WHATSAPP_TESTIMONIALS.map((t, i) => <WhatsAppProofCard key={t.id} t={t} delay={i * 0.08} />)}
          </div>

          {/* Trust indicators */}
          <motion.div
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "clamp(12px, 4vw, 32px)", marginTop: "clamp(20px, 4vw, 32px)" }}
            dir="rtl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.65 }}
          >
            {["آراء حقيقية غير مدفوعة", "محادثات موثقة بالكامل", "تقييمات من طلاب حقيقيين"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "clamp(11px, 2vw, 12px)", color: G.text3, fontFamily: "'Cairo',sans-serif" }}>
                <span style={{ color: G.green, fontWeight: 700 }}>✓</span>
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <div className="stats-grid-ts">
          {STATS.map((s, i) => <StatCard key={i} stat={s} delay={i * 0.07} />)}
        </div>

      </div>
    </section>
  );
}