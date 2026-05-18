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
   ANIMATION VARIANTS
═══════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.13, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.7, ease: "easeOut" },
  }),
};

/* ═══════════════════════════════════════════════
   SPLASH — FLOATING PARTICLES
═══════════════════════════════════════════════ */
function SplashParticles() {
  const pts = useMemo(() =>
    Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 10 + Math.random() * 9,
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
   SPLASH SCREEN
═══════════════════════════════════════════════ */
function SplashScreen({ audioRef, onEnter }) {
  const [muted, setMuted]   = useState(false);
  const [phase, setPhase]   = useState(0);
  // 0=orb  1=brand  2=calligraphy  3=verse  4=buttons

  /* ── staggered content reveal ── */
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 350),
      setTimeout(() => setPhase(2), 850),
      setTimeout(() => setPhase(3), 1550),
      setTimeout(() => setPhase(4), 2500),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  /* ── AUTOPLAY TRICK:
       Start muted (browsers always allow muted autoplay),
       then unmute immediately — most browsers permit this.
       If still blocked we stay muted but it keeps playing silently.  ── */
 

  /* ── AUTO-DISMISS after 5 seconds ── */
  useEffect(() => {
    const t = setTimeout(() => {
      sessionStorage.setItem("qurani_visited", "1");
      onEnter();
    }, 5000);
    return () => clearTimeout(t);
  }, [onEnter]);

  /* ── toggle mute (audio keeps playing, just muted) ── */
  const toggleAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted((v) => !v);
  };

  /* ── manual early enter ── */
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
        padding: "5vw",
      }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }}
    >
      {/* Pulsing orb */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "72vmin", height: "72vmin",
          background: "radial-gradient(circle, rgba(201,149,74,0.2) 0%, rgba(201,149,74,0.05) 35%, transparent 68%)",
          filter: "blur(22px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <SplashParticles />

      {/* Brand mark */}
     {/* Premium Logo */}
<AnimatePresence>
  {phase >= 1 && (
    <motion.div
      key="logo"
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="relative z-10 mb-8"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

      {/* OUTER GLOW */}
      <div
        style={{
          position: 'absolute',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,149,74,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {/* GLASS RING */}
      <div
        style={{
          position: 'absolute',
          width: 180,
          height: 180,
          borderRadius: '50%',
          border: '1px solid rgba(201,149,74,0.14)',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          backdropFilter: 'blur(12px)',
          zIndex: 1,
        }}
      />

      {/* LOGO */}
      <motion.img
        src="/image/logo-png.png"
        alt="Qurani Online"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: 135,
          height: 135,
          objectFit: 'contain',
          position: 'relative',
          zIndex: 2,
          filter:
            'drop-shadow(0 0 25px rgba(201,149,74,0.28))',
        }}
      />

    </motion.div>
  )}
</AnimatePresence>

      {/* SVG calligraphy line — draws itself */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            key="calli"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 mb-7"
          >
            <svg width="210" height="46" viewBox="0 0 210 46" fill="none">
              <motion.path
                d="M14 34 Q 38 7, 62 24 T 108 24 Q 130 7, 154 30 T 196 24"
                stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: `drop-shadow(0 0 7px rgba(201,149,74,0.55))` }}
              />
              <motion.line
                x1="14" y1="42" x2="196" y2="42"
                stroke={GOLD} strokeWidth="0.7" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.45 }}
                transition={{ duration: 1.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quranic verse */}
      <AnimatePresence>
  {phase >= 3 && (
<motion.h2
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 1 }}
  style={{
    fontFamily: "'Cairo', sans-serif",
    fontSize: "clamp(32px, 5vw, 56px)",
    fontWeight: 900,
    color: "#fff",
    marginBottom: "0.6rem",
    textShadow: "0 0 30px rgba(255,255,255,0.15)",
  }}
>
  قـــــرآني online …
</motion.h2>
  )}
</AnimatePresence>

      {/* Action buttons */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            key="btns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mt-10 flex items-center gap-4 flex-wrap justify-center"
          >
            {/* Audio toggle — mutes/unmutes, audio keeps playing */}
            <button
              onClick={toggleAudio}
              className="flex items-center gap-3 rounded-full transition-all duration-300"
              style={{
                padding: "12px 22px",
                border: `1px solid rgba(201,149,74,${muted ? "0.15" : "0.35"})`,
                background: "transparent",
                color: muted ? "rgba(255,255,255,0.28)" : GOLD_LIGHT,
                fontFamily: "'Cairo', sans-serif",
                fontSize: 13,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,149,74,0.65)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `rgba(201,149,74,${muted ? "0.15" : "0.35"})`; }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                display: "inline-block",
                background: muted ? "rgba(255,255,255,0.18)" : GOLD,
                boxShadow: muted ? "none" : `0 0 8px ${GOLD}`,
                animation: muted ? "none" : "goldPulse 2.5s ease-in-out infinite",
              }} />
              {muted ? "التلاوة مكتومة" : "التلاوة تعمل"}
            </button>

            {/* Enter */}
            <button
              onClick={handleEnter}
              className="flex items-center gap-3 rounded-full font-bold transition-all duration-250"
              style={{
                padding: "13px 30px",
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 60%, ${GOLD_PALE} 100%)`,
                color: NAVY_DEEP,
                fontFamily: "'Cairo', sans-serif",
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                boxShadow: `0 8px 30px rgba(201,149,74,0.42)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 14px 42px rgba(201,149,74,0.62)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 30px rgba(201,149,74,0.42)`;
              }}
            >
              ادخل إلى التجربة
              <svg width="15" height="13" viewBox="0 0 16 14" fill="none" aria-hidden>
                <path d="M11 1L1 7L11 13M1 7H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   HERO BG PARTICLES
═══════════════════════════════════════════════ */
function GoldParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.15,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: GOLD_LIGHT, opacity: p.opacity }}
          animate={{ y: [-12, 12, -12], opacity: [p.opacity, p.opacity * 0.3, p.opacity], scale: [1, 0.6, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ISLAMIC GEOMETRY
═══════════════════════════════════════════════ */
function IslamicGeometry({ className, opacity = 0.07 }) {
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
   VERSE CARD
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
        border: `0.5px solid rgba(201,149,74,0.28)`,
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(201,149,74,0.1)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)` }} />
      <div className="flex items-center gap-4 px-5 py-4">
        <button onClick={handlePlay}
          className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 48, height: 48,
            background: playing ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : "rgba(201,149,74,0.12)",
            border: `1px solid ${playing ? GOLD : "rgba(201,149,74,0.4)"}`,
            boxShadow: playing ? `0 0 20px rgba(201,149,74,0.5)` : "none",
            color: playing ? NAVY_DEEP : GOLD_LIGHT, cursor: "pointer",
          }} aria-label="تشغيل الآية">
          {playing ? <PauseIcon size={16} /> : <PlayTriangle size={16} />}
        </button>
        <div className="flex-1 text-right">
  <div
    className="text-[19px] font-bold leading-snug"
    style={{
      fontFamily: "'Amiri', serif",
      color: GOLD_PALE,
      textShadow: `0 0 20px rgba(201,149,74,0.3)`,
    }}
  >
    إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ
  </div>

  <div
    className="text-[11px] mt-1"
    style={{
      color: "rgba(201,149,74,0.55)",
      fontFamily: "'Cairo', sans-serif",
    }}
  >
    سورة الإسراء — الآية ٩
  </div>
</div>
        <div className="shrink-0 flex items-center justify-center rounded-xl"
          style={{ width: 38, height: 38, background: "rgba(201,149,74,0.07)", border: "0.5px solid rgba(201,149,74,0.25)" }}>
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
   FEATURE CARD
═══════════════════════════════════════════════ */
const FEATURES = [
  { icon: <TeacherIcon />,  title: "معلمون متخصصون", sub: "نخبة من أفضل المعلمين المعتمدين" },
  { icon: <BookOpenIcon />, title: "برامج مرنة",      sub: "تناسب جميع المستويات" },
  { icon: <CertIcon />,     title: "شهادات معتمدة",   sub: "معتمدة دولياً" },
];

function FloatingFeatureCard() {
  return (
   <motion.div
      initial={{ opacity: 0, x: -530, y: 200 }}
      animate={{ opacity: 1, x: -500, y: 200 }}
      transition={{ delay: 0.9, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
     
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(6,13,26,0.82)",
        border: "0.5px solid rgba(201,149,74,0.22)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,149,74,0.1)",
        width: 230,
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
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.12, duration: 0.6 }}
            dir="rtl"
            className="flex items-center gap-3 px-4 py-3.5 transition-colors duration-200 cursor-default"
            style={{ borderBottom: i < FEATURES.length - 1 ? "0.5px solid rgba(201,149,74,0.08)" : "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,149,74,0.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <div className="shrink-0 flex items-center justify-center rounded-lg"
              style={{ width: 36, height: 36, background: "rgba(201,149,74,0.09)", border: "0.5px solid rgba(201,149,74,0.25)", color: GOLD }}>
              {f.icon}
            </div>
            <div>
              <div className="text-[12px] font-bold leading-none"
                style={{ color: GOLD_PALE, fontFamily: "'Cairo', sans-serif" }}>{f.title}</div>
              <div className="text-[10px] mt-1"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Cairo', sans-serif" }}>{f.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   SOCIAL PROOF
═══════════════════════════════════════════════ */
const AVATARS = ["أح", "سم", "فط", "مح", "رم"];
function SocialProof() {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={6}
      className="flex items-center gap-3" dir="rtl">
      <div className="flex">
        {AVATARS.map((av, i) => (
          <div key={i} className="flex items-center justify-center rounded-full text-[9px] font-black"
            style={{
              width: 28, height: 28,
              background: `linear-gradient(135deg, #172d55, #0f2040)`,
              border: `1.5px solid ${NAVY}`, color: GOLD_LIGHT,
              marginLeft: i === 0 ? 0 : -9, zIndex: AVATARS.length - i,
              fontFamily: "'Cairo', sans-serif",
              boxShadow: `0 0 0 1px rgba(201,149,74,0.18)`,
            }}>{av}</div>
        ))}
        <div className="flex items-center justify-center rounded-full text-[8px] font-black"
          style={{
            width: 28, height: 28, background: "rgba(201,149,74,0.15)",
            border: `1.5px solid ${NAVY}`, color: GOLD, marginLeft: -9, zIndex: 0,
            fontFamily: "'Cairo', sans-serif",
          }}>+</div>
      </div>
      <div className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Cairo', sans-serif" }}>
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
      <span className="text-[10px] tracking-[0.14em]"
        style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Cairo', sans-serif" }}>
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

  const alreadyPlayed = sessionStorage.getItem("hero_audio_played");

  if (alreadyPlayed) return;

  const startAudio = async () => {
    try {
      audio.volume = 0.65;

      await audio.play();

      sessionStorage.setItem("hero_audio_played", "true");

      window.removeEventListener("mousemove", startAudio);
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);

    } catch (err) {
      console.log("Audio blocked");
    }
  };
window.addEventListener("pointermove", startAudio, { once: true });
  window.addEventListener("click", startAudio, { once: true });
  window.addEventListener("touchstart", startAudio, { once: true });

  return () => {
    window.removeEventListener("mousemove", startAudio);
    window.removeEventListener("click", startAudio);
    window.removeEventListener("touchstart", startAudio);
  };
}, []);

  const handleSplashDone = () => {
    setShowSplash(false);
    // cinematic delay before hero fades in
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
      `}</style>

      {/* Shared audio element */}
      <audio
  ref={audioRef}
  src="./audio/enhaza-1.mp3"
  preload="auto"
/>

      {/* Splash */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            key="splash"
            audioRef={audioRef}
            onEnter={handleSplashDone}
          />
        )}
      </AnimatePresence>

      {/* ── HERO — فيد إن سينمائي بعد الـ Splash ── */}
      <motion.section
        dir="rtl"
        className="relative flex flex-col overflow-hidden"
        style={{ minHeight: "100svh", fontFamily: "'Cairo', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: heroVisible ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >

        {/* BG */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/*
           * ─────────────────────────────────────
           * BG IMAGE — ضع مسار صورتك هنا
           * مثال:  url('/images/hero-bg.jpg')
           * ─────────────────────────────────────
           */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('./image/heroimage.png')` }}/>
{/* 
          <div className="absolute inset-0" style={{
            background: [
              `radial-gradient(ellipse 65% 70% at 20% 55%, rgba(26,58,110,0.45) 0%, transparent 65%)`,
              `radial-gradient(ellipse 50% 80% at 80% 30%, rgba(139,94,40,0.15) 0%, transparent 60%)`,
              `radial-gradient(ellipse 80% 35% at 50% 100%, rgba(6,13,26,0.98) 0%, transparent 55%)`,
              `linear-gradient(160deg, rgba(14,30,58,0.88) 0%, rgba(10,22,40,0.82) 50%, rgba(6,13,26,0.95) 100%)`,
            ].join(","),
          }} /> */}

          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px", opacity: 0.5,
          }} />

          {[
            { right: "28%", rotate: "-13deg", op: 0.1 },
            { right: "34%", rotate: "-7deg",  op: 0.05 },
            { right: "22%", rotate: "-19deg", op: 0.06 },
          ].map((s, i) => (
            <div key={i} className="absolute top-0 w-px h-[75%] origin-top" style={{
              right: s.right,
              background: `linear-gradient(180deg, transparent 0%, rgba(201,149,74,${s.op}) 25%, rgba(201,149,74,${s.op * 0.4}) 70%, transparent 100%)`,
              transform: `rotate(${s.rotate})`,
            }} />
          ))}

          <div className="absolute" style={{ top: -60, right: -60, width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, rgba(201,149,74,0.07) 0%, transparent 70%)`, filter: "blur(30px)" }} />
          <div className="absolute" style={{ bottom: -80, left: -60, width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, rgba(26,58,110,0.45) 0%, transparent 70%)`, filter: "blur(40px)" }} />
          <div className="absolute bottom-0 inset-x-0 h-48" style={{ background: `linear-gradient(0deg, ${NAVY_DEEP} 0%, transparent 100%)` }} />
        </div>

        {!shouldReduce && <GoldParticles />}

        <motion.div className="absolute pointer-events-none"
          style={{ top: "50%", left: "25%", transform: "translate(-50%,-50%)", width: 420, height: 420 }}
          animate={shouldReduce ? {} : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}>
          <IslamicGeometry className="w-full h-full" opacity={0.055} />
        </motion.div>

        {/* GRID */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 items-center w-full"
          style={{ padding: "6rem 3rem 2rem" }}>

          {/* RIGHT — Content */}
          <div className="flex flex-col justify-center py-16 lg:py-0 order-1"
            style={{ maxWidth: 820, marginRight: "auto" }}>

            {/* <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2.5 mb-6 w-fit rounded-full px-4 py-2"
              style={{ background: "rgba(201,149,74,0.07)", border: "0.5px solid rgba(201,149,74,0.3)", backdropFilter: "blur(8px)" }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", background: GOLD,
                boxShadow: `0 0 10px ${GOLD}`, display: "inline-block", flexShrink: 0,
                animation: "goldPulse 2.5s ease-in-out infinite",
              }} />
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 14, color: GOLD_LIGHT, letterSpacing: "0.05em" }}>
                وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
              </span>
            </motion.div> */}

         <motion.h1
  variants={fadeUp}
  initial="hidden"
  animate="visible"
  custom={1}
className="font-black leading-[1.45] mb-5"
  style={{
    fontSize: "clamp(36px, 5vw, 56px)",
    color: "#fff",
    fontFamily: "'Cairo', sans-serif"
  }}
>
  قــــرآني Online …
  
  <br />

  <span
    style={{
      background: `linear-gradient(120deg, ${GOLD} 0%, ${GOLD_LIGHT} 40%, ${GOLD_PALE} 65%, ${GOLD_LIGHT} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      filter: `drop-shadow(0 0 24px rgba(201,149,74,0.35))`,
    }}
  >
    قـرآنٌ يُتـلىٰ .. أثـرٌ يَبـقىٰ
  </span>
</motion.h1>

            <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={2}
              className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, rgba(201,149,74,0.55), transparent)` }} />
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 12, color: `rgba(201,149,74,0.55)`, whiteSpace: "nowrap" }}>
                نخبة من أفضل المعلمين المعتمدين
              </span>
            </motion.div>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="mb-6 leading-[1.95]"
              style={{ fontSize: 14.5, color: "rgba(255,255,255,0.5)", maxWidth: 420, fontFamily: "'Cairo', sans-serif" }}>
              منصة قرآنية متكاملة تمنحك تعلّمًا عميقًا وتجربةً روحانية فريدة،
              بإشراف مباشر من نخبة المعلمين المتخصصين — في وقتك ومن أي مكان.
            </motion.p>

            <div className="mb-6"><VerseCard audioRef={audioRef} /></div>

           <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
  className="flex flex-wrap gap-3 mb-7">

  {/* زر ابدأ رحلتك */}
  <button
    onClick={() => window.location.href = "/courses"}
    className="inline-flex items-center gap-2 font-extrabold rounded-xl transition-all duration-200"
    style={{
      padding: "14px 28px",
      background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 60%, ${GOLD_PALE} 100%)`,
      color: NAVY_DEEP,
      fontSize: 14,
      fontFamily: "'Cairo', sans-serif",
      boxShadow: `0 4px 20px rgba(201,149,74,0.35)`,
      cursor: "pointer",
      border: "none",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = `0 8px 36px rgba(201,149,74,0.55)`;
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = `0 4px 20px rgba(201,149,74,0.35)`;
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <PlayTriangle size={14} />
    ابدأ رحلتك القرآنية
  </button>

  {/* زر الواتساب */}
 <button
  onClick={() => {

    const wa = '201008148164'

    const lines = [
      'السلام عليكم ورحمة الله وبركاته',
      '',
      '━━━━━━━━━━━━━━━━━━',
      'طلب تواصل جديد',
      '━━━━━━━━━━━━━━━━━━',
      '',
      'أرغب في الاستفسار عن برامج أكاديمية قرآني أونلاين.',
      '',
      'رابط الموقع:',
      window.location.origin,
      '',
      '━━━━━━━━━━━━━━━━━━',
      '',
      'أرجو تزويدي بالتفاصيل المتاحة.',
      '',
      'جزاكم الله خيرًا',
    ]

    const text = encodeURIComponent(
      lines.join('\n')
    )

    window.open(
      `https://wa.me/${wa}?text=${text}`,
      '_blank'
    )
  }}

  className="inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200"

  style={{
    padding: "14px 22px",
    border: `0.5px solid rgba(201,149,74,0.35)`,
    color: GOLD_LIGHT,
    background: "transparent",
    fontSize: 14,
    fontFamily: "'Cairo', sans-serif",
    cursor: "pointer",
  }}

  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(201,149,74,0.08)";
    e.currentTarget.style.borderColor = "rgba(201,149,74,0.6)";
    e.currentTarget.style.transform = "translateY(-1px)";
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.borderColor = "rgba(201,149,74,0.35)";
    e.currentTarget.style.transform = "translateY(0)";
  }}
>
  <WhatsAppIcon size={15} />
  تواصل عبر واتساب
</button>

</motion.div>

            <SocialProof />
          </div>

          {/* LEFT — Feature card */}
          <div className="relative flex items-end justify-start py-12 lg:py-0 order-2 min-h-[380px]">
            <div className="relative z-10 mb-10 ml-8">
              <FloatingFeatureCard />
            </div>
          </div>
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
    <svg width="18" height="18" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 5 L23 14 L32 14 L25 19 L28 28 L20 23 L12 28 L15 19 L8 14 L17 14 Z" fill="none" stroke="#c9954a" strokeWidth="1.2" />
      <circle cx="20" cy="20" r="17" stroke="#c9954a" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}
function TeacherIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></svg>;
}
function BookOpenIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M12 7V21M12 7C12 7 9 5 4 5v14c5 0 8 2 8 2s3-2 8-2V5c-5 0-8 2-8 2z" /></svg>;
}
function CertIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="12" cy="11" r="5" /><path d="M12 2l1.5 4h4l-3.5 2.5 1.5 4L12 10l-3.5 2.5 1.5-4L6.5 6h4z" /><path d="M9 17l-2 5 5-2 5 2-2-5" /></svg>;
}