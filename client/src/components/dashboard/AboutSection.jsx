import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

/* ═══════════════════════════════════
   TOKENS
═══════════════════════════════════ */
const GOLD       = '#c9954a'
const GOLD_LIGHT = '#e8c98a'
const GOLD_PALE  = '#f5e6c8'
const NAVY_DEEP  = '#060d1a'
const NAVY_MID   = '#0f2040'

/* ═══════════════════════════════════
   STATS
═══════════════════════════════════ */
const STATS = [
  {
    num: '+٢٥٠٠٠',
    label: 'طالب حول العالم',
    sub: 'في ٣٢ دولة',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    num: '+١٢٠',
    label: 'معلم مُجاز',
    sub: 'بسند متّصل',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
      </svg>
    ),
  },
  {
    num: '+٧',
    label: 'مسارات قرآنية',
    sub: 'من التأسيس للإجازة',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 7h8M8 11h8M8 15h5"/>
      </svg>
    ),
  },
]

/* ═══════════════════════════════════
   PILLARS — ضع مسار صورة كل بطاقة
═══════════════════════════════════ */
const PILLARS = [
  {
    num: '٠١',
    title: 'رؤيتنا',
    body: (
      <>
        أن ينشأ جيلٌ أخلاقُه القُرآن، يُدرك أن{' '}
        
        <span style={{ whiteSpace: 'nowrap' }}>
          القُرآن 《 علمٌ وعمل 》
        </span>

        {' '}ويسير على نهج الصحابة رضي الله عنهم
        في تعلُّم كتاب الله وفهمه والعمل به.
      </>
    ),

    image: './image/our-vision.png',
    accentColor: '#5e8abf',
    accentGlow: 'rgba(94,138,191,0.25)',

    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },

  {
    num: '٠٢',
    title: 'رسالتنا',

    body:
      'تحفيظ المسلم القُرآن بأساليب عمليّة تُنشئ بينه وبين كتاب الله علاقةً روحيّةً بمبدأ 《 أدومه وإن قل 》، مع فهم الآيات والعمل بها، وربطه بالعلوم العربية والإسلامية التي تخدم كتاب الله.',

    image: './image/our-mission.png',
    accentColor: GOLD,
    accentGlow: 'rgba(201,149,74,0.28)',

    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M4 19a2 2 0 002 2h12a2 2 0 002-2M4 19h16M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
  },

  {
    num: '٠٣',
    title: 'قيمنا',

    body:
      'الأمانة والمصداقيّة، والصبر والرِّفق، والتحفيز المستمر، والتيسير وسهولة التحصيل، مع منهجٍ تربويٍّ تحفظه العقول والقلوب وتحيا به النفوس.',

    image: './image/Islamic-composition.png',
    accentColor: '#4a9060',
    accentGlow: 'rgba(74,144,96,0.25)',

    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
      </svg>
    ),
  },
]

/* ═══════════════════════════════════
   FADE HELPERS
═══════════════════════════════════ */
function FadeUp({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.1, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════
   ISLAMIC GEOMETRY (parallax bg)
═══════════════════════════════════ */
function IslamicOrb({ size = 340, opacity = 0.055 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none" aria-hidden style={{ opacity }}>
      <g transform="translate(250,250)">
        {[200, 160, 120, 80].map((r, i) => (
          <circle key={i} r={r} stroke={GOLD} strokeWidth={0.5 - i * 0.08}/>
        ))}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180
          return <line key={i} x1={Math.cos(a)*200} y1={Math.sin(a)*200} x2={Math.cos(a+Math.PI)*200} y2={Math.sin(a+Math.PI)*200} stroke={GOLD} strokeWidth="0.3"/>
        })}
        <polygon points="0,-190 44,-97 155,-97 68,-34 107,87 0,28 -107,87 -68,-34 -155,-97 -44,-97" fill="none" stroke={GOLD} strokeWidth="0.6"/>
        <circle r="6" fill={GOLD} opacity="0.35"/>
      </g>
    </svg>
  )
}

/* ═══════════════════════════════════
   MOSQUE SVG ILLUSTRATION
═══════════════════════════════════ */
function MosqueIllustration() {
  return (
    <></>
  )
}

/* ═══════════════════════════════════
   STAT CARD
═══════════════════════════════════ */
function StatCard({ stat, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: '22px 14px',
        borderRadius: 16,
        background: 'rgba(15,32,64,0.5)',
        border: `0.5px solid rgba(201,149,74,0.2)`,
        backdropFilter: 'blur(16px)',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)`,
      }}/>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(201,149,74,0.1)',
        border: `0.5px solid rgba(201,149,74,0.28)`,
        color: GOLD_LIGHT, marginBottom: 2,
      }}>
        {stat.icon}
      </div>
      <div style={{
                fontFamily: "'Alata', sans-serif",
        fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700,
        background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 55%, ${GOLD_PALE} 100%)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        lineHeight: 1.1,
      }}>
        {stat.num}
      </div>
      <div style={{ color: GOLD_PALE, fontSize: 12, fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
        {stat.label}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: 10, fontFamily: "'Cairo', sans-serif" }}>
        {stat.sub}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════
   PILLAR CARD — with bg image
═══════════════════════════════════ */
function PillarCard({ pillar, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.38 } }}
      dir="rtl"
      className="group"
      style={{
        position: 'relative',
        borderRadius: 22,
        overflow: 'hidden',
        minHeight: 360,
        cursor: 'default',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.4s',
      }}
    >
      {/* ── BACKGROUND IMAGE ── */}
      {pillar.image ? (
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${pillar.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.6s ease',
          }}
          className="group-hover:scale-105"
        />
      ) : (
        /* Placeholder gradient when no image */
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, ${pillar.accentColor}18 0%, rgba(6,13,26,0.95) 100%)`,
        }}/>
      )}

      {/* ── DARK OVERLAY (gradient from bottom) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          `linear-gradient(180deg, rgba(6,13,26,0.35) 0%, rgba(6,13,26,0.65) 40%, rgba(6,13,26,0.96) 100%)`,
          `radial-gradient(ellipse at 50% 0%, ${pillar.accentGlow}, transparent 65%)`,
        ].join(','),
        transition: 'background 0.5s',
      }}/>

      {/* ── HOVER SIDE GLOW ── */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${pillar.accentGlow}, transparent 60%)` }}
      />

      {/* ── BORDER ── */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 22,
        border: `0.5px solid ${pillar.accentColor}33`,
        transition: 'border-color 0.4s',
        boxShadow: `inset 0 0 0 0.5px ${pillar.accentColor}00`,
      }}
      className="group-hover:!border-[rgba(201,149,74,0.45)]"
      />

      {/* ── TOP SHIMMER ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${pillar.accentColor}88, transparent)`,
      }}/>

      {/* ── CONTENT ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '28px 26px',
      }}>

        {/* Number badge */}
        <div style={{
          position: 'absolute', top: 22, left: 22,
                  fontFamily: "'Alata', sans-serif",
          fontSize: 11, letterSpacing: '0.35em',
          color: `${pillar.accentColor}88`,
        }}>
          {pillar.num}
        </div>

        {/* Icon circle */}
        <div style={{
          position: 'absolute', top: 18, right: 22,
          width: 48, height: 48, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `radial-gradient(circle, ${pillar.accentGlow} 0%, rgba(6,13,26,0.6) 100%)`,
          border: `1px solid ${pillar.accentColor}55`,
          color: pillar.accentColor,
          boxShadow: `0 0 0 6px ${pillar.accentGlow}`,
          transition: 'box-shadow 0.4s, transform 0.4s',
        }}
        className="group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(201,149,74,0.3)]"
        >
          {pillar.icon}
        </div>

        {/* Divider */}
        <div style={{
          width: 40, height: 1, marginBottom: 14,
          background: `linear-gradient(90deg, ${pillar.accentColor}88, transparent)`,
        }}/>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 24, fontWeight: 900,
          color: '#fff',
          marginBottom: 10,
          lineHeight: 1.2,
          textShadow: `0 2px 16px rgba(0,0,0,0.8)`,
        }}>
          {pillar.title}
        </h3>

        {/* Body */}
        <p style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 13.5, lineHeight: 1.95,
          color: 'rgba(255,255,255,0.68)',
          textShadow: '0 1px 8px rgba(0,0,0,0.6)',
        }}>
          {pillar.body}
        </p>

        {/* Bottom accent */}
        <div style={{
          marginTop: 18,
          height: 2, borderRadius: 99,
          background: `linear-gradient(90deg, ${pillar.accentColor}88, transparent)`,
          width: '0%',
          transition: 'width 0.5s ease',
        }}
        className="group-hover:!w-full"
        />
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════
   SECTION HEADER
═══════════════════════════════════ */
function SectionHeader() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: 'center', marginBottom: 80 }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }}/>
        <span style={{         fontFamily: "'Alata', sans-serif", fontSize: 12, letterSpacing: '0.45em', color: GOLD }}>
          عن الأكاديمية
        </span>
        <div style={{ width: 32, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})` }}/>
      </div>

      <h2 style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 'clamp(32px, 5.5vw, 58px)',
        fontWeight: 900, lineHeight: 1.18, marginBottom: 18, color: '#fff',
      }}>
        رحلة نور{' '}
        <span style={{
          background: `linear-gradient(120deg, ${GOLD} 0%, ${GOLD_LIGHT} 45%, ${GOLD_PALE} 70%, ${GOLD_LIGHT} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: `drop-shadow(0 0 22px rgba(201,149,74,0.35))`,
        }}>
          تبدأ من هنا
        </span>
      </h2>

      <p style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 16, lineHeight: 2, color: 'rgba(255,255,255,0.42)',
        maxWidth: 560, margin: '0 auto 22px',
      }}>
        في قُرآني أونلاين نؤمن أن القرآن ليس مجرد كتاب يُتلى، بل هو حياة تُعاش،
        ونور يُهدي، ورفيق يرافقك في كل خطوة.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <div style={{ width: 44, height: 1, background: `linear-gradient(90deg, transparent, rgba(201,149,74,0.4))` }}/>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7"/>
        </svg>
        <div style={{ width: 44, height: 1, background: `linear-gradient(270deg, transparent, rgba(201,149,74,0.4))` }}/>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════
   MAIN SECTION
═══════════════════════════════════ */
export default function AboutSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const orbY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      style={{
        position: 'relative', overflow: 'hidden',
        padding: '120px 0 110px',
        fontFamily: "'Cairo', sans-serif",
        background: 'linear-gradient(180deg, transparent 0%, rgba(6,13,26,0.55) 50%, transparent 100%)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        .group-hover\\:scale-105:hover { transform: scale(1.05); }
        .group-hover\\:scale-110:hover { transform: scale(1.1); }
        .group-hover\\:opacity-100:hover { opacity: 1 !important; }
        .group-hover\\:\\!w-full:hover { width: 100% !important; }
        .group-hover\\:\\!border-\\[rgba\\(201\\,149\\,74\\,0\\.45\\)\\]:hover { border-color: rgba(201,149,74,0.45) !important; }
      `}</style>

      {/* ── BG DECORATIONS ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
        <div style={{
          position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(17,40,71,0.32) 0%, transparent 70%)`,
          filter: 'blur(45px)',
        }}/>
        <div style={{
          position: 'absolute', top: '15%', right: '-6%',
          width: 360, height: 360, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(201,149,74,0.055) 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }}/>
        <motion.div style={{ position: 'absolute', top: '8%', left: '-8%', y: orbY }}>
          <IslamicOrb size={360} opacity={0.042} />
        </motion.div>
        <div style={{
          position: 'absolute', top: 0, left: '5%', right: '5%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(201,149,74,0.14) 50%, transparent)`,
        }}/>
        <div style={{
          position: 'absolute', bottom: 0, left: '5%', right: '5%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(201,149,74,0.14) 50%, transparent)`,
        }}/>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        <SectionHeader />

        {/* ── SPLIT: Illustration + Who We Are ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: 'clamp(28px,5vw,68px)', marginBottom: 80, alignItems: 'center' }}
        >
          {/* Mosque illustration */}
         {/* Luxury Islamic Illustration */}
{/* Luxury Islamic Illustration */}
<FadeIn delay={0.1} style={{ display: 'flex', justifyContent: 'center' }}>
  <motion.div
    animate={{ y: [0, -12, 0] }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
    style={{
      position: 'relative',
      width: '100%',
      maxWidth: 420,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >

    {/* MAIN GOLD GLOW */}
    <div
      style={{
        position: 'absolute',
        width: '120%',
        height: '120%',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(201,149,74,0.16) 0%, transparent 70%)',
        filter: 'blur(55px)',
        zIndex: 0,
      }}
    />

    {/* SECONDARY BLUE GLOW */}
    <div
      style={{
        position: 'absolute',
        width: '90%',
        height: '90%',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(40,90,160,0.10) 0%, transparent 75%)',
        filter: 'blur(40px)',
        zIndex: 0,
      }}
    />

    {/* IMAGE CONTAINER */}
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        borderRadius: '28px',
        overflow: 'hidden',
        border: '1px solid rgba(201,149,74,0.18)',
        background: 'rgba(10,22,40,0.35)',
        backdropFilter: 'blur(18px)',
        boxShadow:
          '0 20px 80px rgba(0,0,0,0.45), 0 0 40px rgba(201,149,74,0.08)',
      }}
    >

      {/* TOP LIGHT */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(201,149,74,0.55), transparent)',
          zIndex: 3,
        }}
      />

      <img
        src="./image/start-from-here-1.png"
        alt="Luxury Quran Artwork"
        style={{
          width: '100%',
          maxWidth: 420,
          display: 'block',
          objectFit: 'cover',
          filter:
            'contrast(1.05) saturate(1.05) brightness(0.95)',
        }}
      />
    </div>

    {/* FLOOR REFLECTION */}
    <div
      style={{
        position: 'absolute',
        bottom: '-35px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '65%',
        height: '65px',
        background:
          'radial-gradient(ellipse, rgba(201,149,74,0.22) 0%, transparent 75%)',
        filter: 'blur(30px)',
        zIndex: 1,
      }}
    />

  </motion.div>
</FadeIn>

       {/* Who we are + Stats */}
<div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

  <FadeUp delay={0.14}>

    {/* WHO WE ARE CARD */}
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 28,
        padding: '34px 34px',
        background:
          'linear-gradient(180deg, rgba(15,32,64,0.82) 0%, rgba(8,18,35,0.92) 100%)',
        border: '1px solid rgba(201,149,74,0.16)',
        backdropFilter: 'blur(22px)',
        boxShadow:
          '0 15px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >

      {/* TOP GOLD LINE */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(201,149,74,0.65), transparent)',
        }}
      />

      {/* AMBIENT GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-80px',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,149,74,0.12) 0%, transparent 70%)',
          filter: 'blur(45px)',
        }}
      />

      {/* SMALL GRID LIGHT */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage:
            'radial-gradient(circle at center, black 30%, transparent 90%)',
        }}
      />

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 24,
          position: 'relative',
          zIndex: 2,
        }}
      >

        {/* ICON */}
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'linear-gradient(135deg, rgba(201,149,74,0.22) 0%, rgba(201,149,74,0.08) 100%)',
            border: '1px solid rgba(201,149,74,0.28)',
            color: GOLD_LIGHT,
            boxShadow:
              '0 0 30px rgba(201,149,74,0.12)',
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          ✦
        </div>

        {/* TITLE */}
        <div>

          <div
            style={{
              fontFamily: "'Alata', sans-serif",
              fontSize: 11,
              letterSpacing: '0.35em',
              color: 'rgba(201,149,74,0.55)',
              marginBottom: 6,
            }}
          >
            QURANI ONLINE
          </div>

          <h3
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 30,
              fontWeight: 900,
              lineHeight: 1.2,
              margin: 0,
              background:
                `linear-gradient(120deg, ${GOLD} 0%, ${GOLD_LIGHT} 45%, #fff3d6 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter:
                'drop-shadow(0 0 12px rgba(201,149,74,0.15))',
            }}
          >
            من نحن
          </h3>

        </div>
      </div>

      {/* BODY */}
      <p
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: "'Cairo', sans-serif",
          fontSize: 15.5,
          lineHeight: 2.15,
          color: 'rgba(255,255,255,0.72)',
          marginBottom: 22,
        }}
      >
        قُرآني أونلاين ليست منصّة تعليمية فحسب،
        بل تجربة قرآنية متكاملة تُصاغ بعنايةٍ علمية
        وروحٍ إيمانية رفيعة؛ حيث نأخذ بيد الطالب
        في رحلةٍ هادئة تبدأ بإتقان الحرف،
        وتمتدّ نحو التلاوة المتقنة،
        والفهم العميق،
        والسند المتصل بإذن الله.
      </p>

      {/* BOTTOM FEATURE TAGS */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          position: 'relative',
          zIndex: 2,
        }}
      >

        {[
          'تعليم بإجازة',
          'بيئة إيمانية',
          'معلمون متخصصون',
          'تجربة فاخرة',
        ].map((tag, i) => (
          <div
            key={i}
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              background:
                'rgba(201,149,74,0.08)',
              border:
                '1px solid rgba(201,149,74,0.18)',
              color: GOLD_LIGHT,
              fontSize: 12,
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}
          >
            {tag}
          </div>
        ))}

      </div>
    </div>
  </FadeUp>

  {/* STATS */}
  <div
    className="grid grid-cols-3"
    style={{
      gap: 16,
    }}
  >
    {STATS.map((s, i) => (
      <StatCard key={i} stat={s} delay={0.2 + i * 0.1} />
    ))}
  </div>

</div>
        </div>

        {/* ── PILLAR CARDS ── */}
        <FadeUp delay={0.05} style={{ marginBottom: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
          }}>
            <div style={{ width: 24, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }}/>
            <span style={{         fontFamily: "'Alata', sans-serif", fontSize: 11, letterSpacing: '0.4em', color: GOLD }}>
              فلسفتنا
            </span>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20, marginBottom: 72 }}>
          {PILLARS.map((p, i) => (
            <PillarCard key={i} pillar={p} delay={i * 0.12} />
          ))}
        </div>

        {/* ── AYAH BANNER ── */}
        <FadeUp delay={0.08}>
          <div style={{
            textAlign: 'center',
            padding: 'clamp(32px,5vw,56px) clamp(24px,5vw,64px)',
            borderRadius: 24,
            background: 'rgba(10,22,40,0.58)',
            border: `0.5px solid rgba(201,149,74,0.18)`,
            backdropFilter: 'blur(22px)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)`,
            }}/>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD}33, transparent)`,
            }}/>
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(ellipse at 50% 0%, rgba(201,149,74,0.07), transparent 65%)`,
            }}/>

            <div style={{
                      fontFamily: "'Alata', sans-serif", fontSize: 30, color: GOLD,
              opacity: 0.45, marginBottom: 14,
              textShadow: `0 0 22px rgba(201,149,74,0.4)`,
            }}>
              ۞
            </div>

            <p style={{
                      fontFamily: "'Alata', sans-serif",
              fontSize: 'clamp(17px,3vw,30px)', lineHeight: 2.1,
              color: GOLD_PALE,
              textShadow: `0 0 30px rgba(201,149,74,0.18)`,
              marginBottom: 12, position: 'relative',
            }}>
              إِنَّهُ لَكِتَابٌ كَرِيمٌ ✦ فِي كِتَابٍ مَكْنُونٍ ✦ لَا يَمَسُّهُ إِلَّا الْمُطَهَّرُونَ
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}66)` }}/>
              <span style={{
                fontFamily: "'Cairo', sans-serif", fontSize: 11, letterSpacing: '0.35em',
                color: 'rgba(201,149,74,0.48)',
              }}>
                سورة الواقعة
              </span>
              <div style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD}66)` }}/>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}