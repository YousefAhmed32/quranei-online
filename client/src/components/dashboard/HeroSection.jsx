import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const GOLD       = "#c9954a";
const GOLD_LIGHT = "#e8c98a";
const GOLD_PALE  = "#f5e6c8";
const NAVY       = "#0a1628";
const NAVY_DEEP  = "#060d1a";

/* ═══════════════════════════════════════════════
   ANIMATION VARIANTS  — lighter on mobile
═══════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.11, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.09, duration: 0.6, ease: "easeOut" },
  }),
};

/* ═══════════════════════════════════════════════
   SPLASH — FLOATING PARTICLES (fewer on mobile)
═══════════════════════════════════════════════ */
function SplashParticles() {
  const pts = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 8,
      size: Math.random() * 2 + 1,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: -8,
            width: p.size,
            height: p.size,
            background: GOLD,
            boxShadow: `0 0 6px ${GOLD}`,
          }}
          animate={{ y: [0, -1100], opacity: [0, 0.7, 0.5, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SPLASH SCREEN — mobile-safe timings + layout
═══════════════════════════════════════════════ */
function SplashScreen({ audioRef, onEnter }) {
  const [muted, setMuted]   = useState(false);
  const [phase, setPhase]   = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 750),
      setTimeout(() => setPhase(3), 1350),
      setTimeout(() => setPhase(4), 2100),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      sessionStorage.setItem("qurani_visited", "1");
      onEnter();
    }, 5000);
    return () => clearTimeout(t);
  }, [onEnter]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted((v) => !v);
  };

  const handleEnter = () => {
    sessionStorage.setItem("qurani_visited", "1");
    onEnter();
  };

  return (
    <motion.div
      key="splash"
      className="fixed inset-0 flex flex-col items-center justify-center z-[200] overflow-hidden"
      style={{
        background: "radial-gradient(40% 40% at 50% 45%, #1c1a24 0%, #0a0a0e 55%, #050507 100%)",
        fontFamily: "'Cairo', sans-serif",
        textAlign: "center",
        padding: "clamp(24px, 6vw, 48px)",
      }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
    >
      {/* Pulsing orb */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(72vmin, 480px)",
          height: "min(72vmin, 480px)",
          background: "radial-gradient(circle, rgba(201,149,74,0.2) 0%, rgba(201,149,74,0.05) 35%, transparent 68%)",
          filter: "blur(22px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <SplashParticles />

      {/* Logo */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mb-6"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <div style={{
              position: "absolute",
              width: "min(220px, 55vw)", height: "min(220px, 55vw)",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201,149,74,0.18) 0%, transparent 70%)",
              filter: "blur(36px)", zIndex: 0,
            }} />
            <div style={{
              position: "absolute",
              width: "min(170px, 44vw)", height: "min(170px, 44vw)",
              borderRadius: "50%",
              border: "1px solid rgba(201,149,74,0.14)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
              backdropFilter: "blur(12px)", zIndex: 1,
            }} />
            <motion.img
              src="/image/logo-png.png"
              alt="Qurani Online"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "min(120px, 30vw)", height: "min(120px, 30vw)",
                objectFit: "contain", position: "relative", zIndex: 2,
                filter: "drop-shadow(0 0 22px rgba(201,149,74,0.28))",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG calligraphy */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            key="calli"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-5"
          >
            <svg width="min(210px, 70vw)" height="46" viewBox="0 0 210 46" fill="none">
              <motion.path
                d="M14 34 Q 38 7, 62 24 T 108 24 Q 130 7, 154 30 T 196 24"
                stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: "drop-shadow(0 0 7px rgba(201,149,74,0.55))" }}
              />
              <motion.line
                x1="14" y1="42" x2="196" y2="42"
                stroke={GOLD} strokeWidth="0.7" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.45 }}
                transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heading */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9 }}
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: "clamp(26px, 6vw, 52px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "0.5rem",
              textShadow: "0 0 30px rgba(255,255,255,0.12)",
              lineHeight: 1.3,
            }}
          >
            قـرآني Online …
          </motion.h2>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            key="btns"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mt-8 flex items-center gap-3 flex-wrap justify-center"
            style={{ width: "100%", maxWidth: 360 }}
          >
         

            {/* Enter */}
            {/* Enter */}
<button
  onClick={handleEnter}
  className="flex items-center justify-center gap-3 rounded-full font-bold transition-all duration-200"
  style={{
    minHeight: 60,
    width: "min(92vw, 520px)",
    padding: "16px 40px",
    background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 60%, ${GOLD_PALE} 100%)`,
    color: NAVY_DEEP,
    fontFamily: "'Cairo', sans-serif",
    fontSize: "clamp(15px, 3vw, 18px)",
    border: "none",
    cursor: "pointer",
    boxShadow: `0 10px 34px rgba(201,149,74,0.42)`,
    whiteSpace: "nowrap",
    borderRadius: "999px",
    fontWeight: 800,
    letterSpacing: "0.3px",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-3px) scale(1.01)";
    e.currentTarget.style.boxShadow = `0 16px 44px rgba(201,149,74,0.58)`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)";
    e.currentTarget.style.boxShadow = `0 10px 34px rgba(201,149,74,0.42)`;
  }}
>
  ابدأ رحلتك للارتباط بالقرآن

  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden>
    <path
      d="M11 1L1 7L11 13M1 7H15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   HERO BG PARTICLES — fewer on mobile
═══════════════════════════════════════════════ */
function GoldParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.8,
      duration: Math.random() * 7 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: GOLD_LIGHT, opacity: p.opacity }}
          animate={{ y: [-10, 10, -10], opacity: [p.opacity, p.opacity * 0.3, p.opacity], scale: [1, 0.6, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ISLAMIC GEOMETRY — contained, no overflow
═══════════════════════════════════════════════ */
function IslamicGeometry({ className, opacity = 0.06 }) {
  return (
    <svg className={className} viewBox="0 0 500 500" fill="none" aria-hidden style={{ opacity }}>
      <g transform="translate(250,250)">
        {[200, 165, 130, 95].map((r, i) => (
          <circle key={i} r={r} stroke={GOLD} strokeWidth={0.4 - i * 0.05} />
        ))}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <line key={i} x1={Math.cos(a)*200} y1={Math.sin(a)*200} x2={Math.cos(a+Math.PI)*200} y2={Math.sin(a+Math.PI)*200} stroke={GOLD} strokeWidth="0.3" />;
        })}
        <polygon points="0,-195 45,-100 160,-100 70,-35 110,90 0,30 -110,90 -70,-35 -160,-100 -45,-100" fill="none" stroke={GOLD} strokeWidth="0.7" />
        <polygon points="0,-155 36,-80 128,-80 56,-28 88,72 0,22 -88,72 -56,-28 -128,-80 -36,-80" fill="none" stroke={GOLD} strokeWidth="0.4" />
        <circle r="8" fill={GOLD} opacity="0.3" />
        <circle r="4" fill={GOLD} opacity="0.5" />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   VERSE CARD — improved touch target
═══════════════════════════════════════════════ */
function VerseCard({ audioRef }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [audioRef]);

  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="visible" custom={3}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15,32,64,0.55)",
        border: "0.5px solid rgba(201,149,74,0.28)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(201,149,74,0.1)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)` }} />
      <div className="flex items-center gap-3 px-4 py-4" style={{ flexWrap: "nowrap" }}>
        {/* Play button — min 48×48 touch target */}
        <button
          onClick={handlePlay}
          className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 48, height: 48, minWidth: 48,
            background: playing ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : "rgba(201,149,74,0.12)",
            border: `1px solid ${playing ? GOLD : "rgba(201,149,74,0.4)"}`,
            boxShadow: playing ? `0 0 20px rgba(201,149,74,0.5)` : "none",
            color: playing ? NAVY_DEEP : GOLD_LIGHT, cursor: "pointer",
          }}
          aria-label="تشغيل الآية"
        >
          {playing ? <PauseIcon size={15} /> : <PlayTriangle size={15} />}
        </button>

        <div className="flex-1 text-right min-w-0">
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: "clamp(14px, 3.5vw, 19px)",
              fontWeight: 700,
              color: GOLD_PALE,
              textShadow: "0 0 20px rgba(201,149,74,0.3)",
              lineHeight: 1.5,
              whiteSpace: "normal",
            }}
          >
            إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ
          </div>
          <div
            style={{
              fontSize: "clamp(10px, 2vw, 11px)",
              marginTop: 4,
              color: "rgba(201,149,74,0.55)",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            سورة الإسراء — الآية ٩
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center rounded-xl"
          style={{ width: 36, height: 36, background: "rgba(201,149,74,0.07)", border: "0.5px solid rgba(201,149,74,0.25)" }}>
          <MosqueStarIcon />
        </div>
      </div>
      <AnimatePresence>
        {playing && (
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
            transition={{ duration: 30, ease: "linear" }}
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left"
            style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   FEATURE CARD — fully responsive, no fixed px
═══════════════════════════════════════════════ */
const FEATURES = [
  { icon: <TeacherIcon />,  title: "معلمون متخصصون", sub: "نخبة من أفضل المعلمين المعتمدين" },
  { icon: <BookOpenIcon />, title: "برامج مرنة",      sub: "تناسب جميع المستويات" },
  { icon: <CertIcon />,     title: "شهادات معتمدة",   sub: "معتمدة دولياً" },
];

function FeatureCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{
        background: "rgba(6,13,26,0.82)",
        border: "0.5px solid rgba(201,149,74,0.22)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(201,149,74,0.1)",
        maxWidth: 240,
      transform: "translate(-210px, 70px)",
      }}
    >
      <div className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: "0.5px solid rgba(201,149,74,0.12)" }}>
        <div className="w-2 h-2 rounded-full"
          style={{ background: GOLD, boxShadow: `0 0 8px ${GOLD}`, animation: "goldPulse 2.5s ease-in-out infinite" }} />
        <span className="text-[11px] tracking-widest"
          style={{ color: "rgba(232,201,138,0.5)", fontFamily: "'Cairo', sans-serif" }}>
          مميزاتنا
        </span>
      </div>
      <div className="flex flex-col">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            dir="rtl"
            className="flex items-center gap-3 px-4 py-3.5 transition-colors duration-200 cursor-default"
            style={{ borderBottom: i < FEATURES.length - 1 ? "0.5px solid rgba(201,149,74,0.08)" : "none" }}
          >
            <div className="shrink-0 flex items-center justify-center rounded-lg"
              style={{ width: 34, height: 34, background: "rgba(201,149,74,0.09)", border: "0.5px solid rgba(201,149,74,0.25)", color: GOLD }}>
              {f.icon}
            </div>
            <div>
              <div className="text-[12px] font-bold leading-none"
                style={{ color: GOLD_PALE, fontFamily: "'Cairo', sans-serif" }}>{f.title}</div>
              <div className="text-[10px] mt-1"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Cairo', sans-serif" }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SOCIAL PROOF
═══════════════════════════════════════════════ */
const AVATARS = ["أح", "سم", "فط", "مح", "رم"];
function SocialProof() {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={6}
      className="flex items-center gap-3 flex-wrap" dir="rtl">
      <div className="flex">
        {AVATARS.map((av, i) => (
          <div key={i} className="flex items-center justify-center rounded-full text-[9px] font-black"
            style={{
              width: 28, height: 28,
              background: "linear-gradient(135deg, #172d55, #0f2040)",
              border: `1.5px solid ${NAVY}`, color: GOLD_LIGHT,
              marginLeft: i === 0 ? 0 : -9, zIndex: AVATARS.length - i,
              fontFamily: "'Cairo', sans-serif",
              boxShadow: "0 0 0 1px rgba(201,149,74,0.18)",
            }}>{av}</div>
        ))}
        <div className="flex items-center justify-center rounded-full text-[8px] font-black"
          style={{
            width: 28, height: 28, background: "rgba(201,149,74,0.15)",
            border: `1.5px solid ${NAVY}`, color: GOLD, marginLeft: -9, zIndex: 0,
            fontFamily: "'Cairo', sans-serif",
          }}>+</div>
      </div>
      <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(11px, 2.5vw, 12px)", color: "rgba(255,255,255,0.3)" }}>
        انضم{" "}<strong style={{ color: GOLD_LIGHT, fontWeight: 800 }}>+٤٨٠٠</strong>{" "}
        طالب من{" "}<strong style={{ color: "rgba(255,255,255,0.5)" }}>٣٢ دولة</strong>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   SCROLL INDICATOR
═══════════════════════════════════════════════ */
function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", fontFamily: "'Cairo', sans-serif" }}>
        اكتشف المزيد
      </span>
      <div className="flex items-start justify-center pt-1.5 rounded-full"
        style={{ width: 20, height: 32, border: "0.5px solid rgba(255,255,255,0.14)" }}>
        <motion.div
          animate={{ y: [0, 14, 0], opacity: [1, 0, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD, boxShadow: `0 0 6px ${GOLD}` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export default function HeroSection() {
  const shouldReduce  = useReducedMotion();
  const audioRef      = useRef(null);
  const [showSplash, setShowSplash] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // const alreadyPlayed = sessionStorage.getItem("hero_audio_played");
    // if (alreadyPlayed) return;
    const startAudio = async () => {
      try {
        audio.volume = 0.65;
        await audio.play();
        // sessionStorage.setItem("hero_audio_played", "true");
      } catch {}
    };
    window.addEventListener("pointermove", startAudio, { once: true });
    window.addEventListener("click", startAudio, { once: true });
    window.addEventListener("touchstart", startAudio, { once: true });
    return () => {
      window.removeEventListener("pointermove", startAudio);
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
    };
  }, []);

  const handleSplashDone = () => {
    setShowSplash(false);
    setTimeout(() => setHeroVisible(true), 80);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes goldPulse {
          0%,100% { opacity:1; transform:scale(1); box-shadow:0 0 8px #c9954a; }
          50%      { opacity:0.4; transform:scale(0.65); box-shadow:0 0 4px #c9954a; }
        }

        /* ── Responsive hero grid ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: clamp(24px, 4vw, 48px);
          }
        }

        /* ── Feature card: hidden on mobile, visible tablet+ ── */
        .hero-feature-col {
          display: none;
        }
        @media (min-width: 768px) {
          .hero-feature-col {
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: clamp(24px, 4vh, 48px);
          }
        }

        /* ── Hero content padding ── */
        .hero-content {
          padding: clamp(80px, 14vw, 120px) clamp(20px, 5vw, 48px) clamp(32px, 6vw, 48px);
        }
        @media (min-width: 1024px) {
          .hero-content {
            padding: clamp(100px, 12vh, 140px) clamp(32px, 5vw, 64px) clamp(48px, 6vh, 80px);
          }
        }

        /* ── Hero section min-height ── */
        .hero-section {
          min-height: 100svh;
          min-height: 100vh;
        }

        /* ── Button row wrapping ── */
        .hero-btn-row {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(10px, 2.5vw, 12px);
        }
        @media (max-width: 400px) {
          .hero-btn-row {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-btn-row button {
            justify-content: center;
          }
        }
      `}</style>

      <audio ref={audioRef} src="./audio/enhaza-1.mp3" preload="auto" />

      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" audioRef={audioRef} onEnter={handleSplashDone} />
        )}
      </AnimatePresence>

      <motion.section
        dir="rtl"
        className="relative flex flex-col overflow-hidden hero-section"
        style={{ fontFamily: "'Cairo', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: heroVisible ? 1 : 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* BG */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('./image/heroimage.png')" }} />
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px", opacity: 0.5,
          }} />

          {[
            { right: "28%", rotate: "-13deg", op: 0.1 },
            { right: "34%", rotate: "-7deg",  op: 0.05 },
          ].map((s, i) => (
            <div key={i} className="absolute top-0 w-px h-[70%] origin-top" style={{
              right: s.right,
              background: `linear-gradient(180deg, transparent 0%, rgba(201,149,74,${s.op}) 25%, rgba(201,149,74,${s.op * 0.4}) 70%, transparent 100%)`,
              transform: `rotate(${s.rotate})`,
            }} />
          ))}

          <div className="absolute" style={{ top: -40, right: -40, width: "min(380px, 60vw)", height: "min(380px, 60vw)", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,149,74,0.07) 0%, transparent 70%)", filter: "blur(28px)" }} />
          <div className="absolute bottom-0 inset-x-0 h-48" style={{ background: `linear-gradient(0deg, ${NAVY_DEEP} 0%, transparent 100%)` }} />
        </div>

        {!shouldReduce && <GoldParticles />}

        {/* Islamic geometry — clipped, won't overflow */}
        <div className="absolute pointer-events-none overflow-hidden"
          style={{ top: "50%", right: "-10%", transform: "translateY(-50%)", width: "min(380px, 50vw)", height: "min(380px, 50vw)", opacity: 0.04 }}>
          <motion.div
            className="w-full h-full"
            animate={shouldReduce ? {} : { rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}>
            <IslamicGeometry className="w-full h-full" opacity={1} />
          </motion.div>
        </div>

        {/* HERO GRID */}
        <div className="relative z-10 flex-1 hero-grid w-full">

          {/* RIGHT — Content */}
          <div className="hero-content flex flex-col justify-center" style={{ maxWidth: 700, width: "100%" }}>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "clamp(28px, 6vw, 54px)",
                fontWeight: 900,
                lineHeight: 1.45,
                marginBottom: "clamp(12px, 3vw, 20px)",
                color: "#fff",
              }}
            >
              قــــرآني Online …
              <br />
              <span style={{
                background: `linear-gradient(120deg, ${GOLD} 0%, ${GOLD_LIGHT} 40%, ${GOLD_PALE} 65%, ${GOLD_LIGHT} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 22px rgba(201,149,74,0.32))",
                fontSize: "clamp(24px, 5vw, 48px)",
              }}>
<>
  <span className="hero-line-1">
    قرآنٌ يُتلىٰ ..
  </span>

  <br className="hero-mobile-break" />

  <span className="hero-line-2">
    أثرٌ يبقىٰ
  </span>
</>
              </span>
            </motion.h1>

            <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={2}
              className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, rgba(201,149,74,0.55), transparent)" }} />
              <span style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(10px, 2vw, 12px)", color: "rgba(201,149,74,0.55)", whiteSpace: "nowrap" }}>
                نخبة من أفضل المعلمين المعتمدين
              </span>
            </motion.div>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "clamp(13px, 2.5vw, 14.5px)",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.95,
                marginBottom: "clamp(16px, 4vw, 24px)",
                maxWidth: 440,
              }}>
              منصة قرآنية متكاملة تمنحك تعلّمًا عميقًا وتجربةً روحانية فريدة،
              بإشراف مباشر من نخبة المعلمين المتخصصين — في وقتك ومن أي مكان.
            </motion.p>

            <div style={{ marginBottom: "clamp(16px, 4vw, 24px)" }}>
              <VerseCard audioRef={audioRef} />
            </div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="hero-btn-row" style={{ marginBottom: "clamp(16px, 4vw, 28px)" }}>

              <button
                onClick={() => window.location.href = "/courses"}
                className="inline-flex items-center gap-2 font-extrabold rounded-xl transition-all duration-200"
                style={{
                  minHeight: 48,
                  padding: "13px clamp(20px, 4vw, 28px)",
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 60%, ${GOLD_PALE} 100%)`,
                  color: NAVY_DEEP,
                  fontSize: "clamp(13px, 2.5vw, 14px)",
                  fontFamily: "'Cairo', sans-serif",
                  boxShadow: "0 4px 20px rgba(201,149,74,0.35)",
                  cursor: "pointer",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,149,74,0.52)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,149,74,0.35)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <PlayTriangle size={13} />
                ابدأ رحلتك القرآنية
              </button>

              <button
                onClick={() => {
                  const wa = "201008148164";
                  const lines = [
                    "السلام عليكم ورحمة الله وبركاته","",
                    "━━━━━━━━━━━━━━━━━━","طلب تواصل جديد","━━━━━━━━━━━━━━━━━━","",
                    "أرغب في الاستفسار عن برامج أكاديمية قرآني أونلاين.","",
                    "رابط الموقع:", window.location.origin,"",
                    "━━━━━━━━━━━━━━━━━━","","أرجو تزويدي بالتفاصيل المتاحة.","","جزاكم الله خيرًا",
                  ];
                  window.open(`https://wa.me/${wa}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
                }}
                className="inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200"
                style={{
                  minHeight: 48,
                  padding: "13px clamp(16px, 3.5vw, 22px)",
                  border: "0.5px solid rgba(201,149,74,0.35)",
                  color: GOLD_LIGHT,
                  background: "transparent",
                  fontSize: "clamp(13px, 2.5vw, 14px)",
                  fontFamily: "'Cairo', sans-serif",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(201,149,74,0.08)";
                  e.currentTarget.style.borderColor = "rgba(201,149,74,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(201,149,74,0.35)";
                }}
              >
                <WhatsAppIcon size={15} />
                تواصل عبر واتساب
              </button>
            </motion.div>

            <SocialProof />
          </div>

          {/* LEFT — Feature card: tablet+ only */}
          <motion.div
            className="hero-feature-col"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 24 }}
            transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <FeatureCard />
          </motion.div>
        </div>

        <div className="relative z-10 flex justify-center pb-6">
          <ScrollIndicator />
        </div>
      </motion.section>
    </>
  );
}

/* ═══════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════ */
function PlayTriangle({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M3 2.5l10 5.5-10 5.5V2.5z" /></svg>;
}
function PauseIcon({ size = 16 }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>;
}
function WhatsAppIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12 0C5.37 0 0 5.37 0 12c0 2.17.58 4.2 1.59 5.95L.06 23.49l5.7-1.49C7.41 23.01 9.64 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0zm0 22c-1.87 0-3.62-.5-5.12-1.38l-.37-.22-3.8 1 1.01-3.7-.24-.38A9.95 9.95 0 012 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
    </svg>
  );
}
function MosqueStarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 5 L23 14 L32 14 L25 19 L28 28 L20 23 L12 28 L15 19 L8 14 L17 14 Z" fill="none" stroke="#c9954a" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="17" stroke="#c9954a" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}
function TeacherIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>;
}
function BookOpenIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M12 7V21M12 7C12 7 9 5 4 5v14c5 0 8 2 8 2s3-2 8-2V5c-5 0-8 2-8 2z" /></svg>;
}
function CertIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="12" cy="11" r="5" /><path d="M12 2l1.5 4h4l-3.5 2.5 1.5 4L12 10l-3.5 2.5 1.5-4L6.5 6h4z" /><path d="M9 17l-2 5 5-2 5 2-2-5" /></svg>;
}