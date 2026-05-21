import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

/* ═══════════════════════════════════
   TOKENS
═══════════════════════════════════ */
const GOLD       = '#c9954a'
const GOLD_LIGHT = '#e8c98a'
const GOLD_PALE  = '#f5e6c8'
const NAVY_DEEP  = '#060d1a'

/* ═══════════════════════════════════
   STATS
═══════════════════════════════════ */
const STATS = [
  {
    num: '+٢٥٠٠٠',
    label: 'طالب حول العالم',
    sub: 'في ٣٢ دولة',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    num: '+١٢٠',
    label: 'معلم مُجاز',
    sub: 'بسند متّصل',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
      </svg>
    ),
  },
  {
    num: '+٧',
    label: 'مسارات قرآنية',
    sub: 'من التأسيس للإجازة',
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 7h8M8 11h8M8 15h5"/>
      </svg>
    ),
  },
]

/* ═══════════════════════════════════
   PILLARS
═══════════════════════════════════ */
const PILLARS = [
  {
    num: '٠١',
    title: 'رؤيتنا',
    body: (
      <>
        أن ينشأ جيلٌ أخلاقُه القُرآن، يُدرك أن القُرآن 《 علمٌ وعمل 》
        ويسير على نهج الصحابة رضي الله عنهم في تعلّم كتاب الله وفهمه والعمل به.
      </>
    ),
    image: './image/our-vision.png',
    accentColor: '#5e8abf',
    accentGlow: 'rgba(94,138,191,0.22)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    num: '٠٢',
    title: 'رسالتنا',
    body: 'تحفيظ المسلم القُرآن بأساليب عمليّة تُنشئ بينه وبين كتاب الله علاقةً روحيّةً بمبدأ 《 أدومه وإن قل 》، مع فهم الآيات والعمل بها.',
    image: './image/our-mission.png',
    accentColor: GOLD,
    accentGlow: 'rgba(201,149,74,0.25)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M4 19a2 2 0 002 2h12a2 2 0 002-2M4 19h16M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
  },
  {
    num: '٠٣',
    title: 'قيمنا',
    body: 'الأمانة والمصداقيّة، والصبر والرِّفق، والتحفيز المستمر، والتيسير وسهولة التحصيل، مع منهجٍ تربويٍّ تحفظه العقول والقلوب.',
    image: './image/Islamic-composition.png',
    accentColor: '#4a9060',
    accentGlow: 'rgba(74,144,96,0.22)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
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
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.0, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════
   ISLAMIC ORB
═══════════════════════════════════ */
function IslamicOrb({ size = 320, opacity = 0.05 }) {
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
   STAT CARD — 3-col on sm+, stacked on xs
═══════════════════════════════════ */
function StatCard({ stat, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.28 } }}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(16px, 3vw, 22px) clamp(12px, 2.5vw, 14px)',
        borderRadius: 16,
        background: 'rgba(15,32,64,0.5)',
        border: '0.5px solid rgba(201,149,74,0.2)',
        backdropFilter: 'blur(16px)',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)`,
      }}/>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(201,149,74,0.1)',
        border: '0.5px solid rgba(201,149,74,0.28)',
        color: GOLD_LIGHT, marginBottom: 2,
      }}>
        {stat.icon}
      </div>
      <div style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 'clamp(18px, 3.5vw, 30px)', fontWeight: 800,
        background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 55%, ${GOLD_PALE} 100%)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        lineHeight: 1.1,
      }}>
        {stat.num}
      </div>
      <div style={{ color: GOLD_PALE, fontSize: 'clamp(10px, 2vw, 12px)', fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
        {stat.label}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: 10, fontFamily: "'Cairo', sans-serif" }}>
        {stat.sub}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════
   PILLAR CARD
═══════════════════════════════════ */
function PillarCard({ pillar, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.32 } }}
      dir="rtl"
      className="group"
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 'clamp(280px, 35vw, 360px)',
        cursor: 'default',
        boxShadow: '0 8px 36px rgba(0,0,0,0.38)',
      }}
    >
      {/* Background image */}
      {pillar.image && (
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${pillar.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.55s ease',
          }}
          className="group-hover:scale-105"
        />
      )}

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'linear-gradient(180deg, rgba(6,13,26,0.3) 0%, rgba(6,13,26,0.6) 40%, rgba(6,13,26,0.95) 100%)',
          `radial-gradient(ellipse at 50% 0%, ${pillar.accentGlow}, transparent 65%)`,
        ].join(','),
      }}/>

      {/* Border */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 20,
        border: `0.5px solid ${pillar.accentColor}30`,
      }}/>

      {/* Top shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${pillar.accentColor}88, transparent)`,
      }}/>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(20px, 4vw, 28px)',
      }}>
        {/* Number */}
        <div style={{
          position: 'absolute', top: 18, left: 18,
          fontFamily: "'Cairo', sans-serif",
          fontSize: 11, letterSpacing: '0.35em',
          color: `${pillar.accentColor}80`,
        }}>
          {pillar.num}
        </div>

        {/* Icon */}
        <div style={{
          position: 'absolute', top: 14, right: 18,
          width: 44, height: 44, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `radial-gradient(circle, ${pillar.accentGlow} 0%, rgba(6,13,26,0.6) 100%)`,
          border: `1px solid ${pillar.accentColor}50`,
          color: pillar.accentColor,
        }}>
          {pillar.icon}
        </div>

        {/* Divider */}
        <div style={{ width: 36, height: 1, marginBottom: 12, background: `linear-gradient(90deg, ${pillar.accentColor}88, transparent)` }}/>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 'clamp(18px, 3.5vw, 24px)', fontWeight: 900,
          color: '#fff', marginBottom: 8, lineHeight: 1.2,
          textShadow: '0 2px 14px rgba(0,0,0,0.8)',
        }}>
          {pillar.title}
        </h3>

        {/* Body */}
        <p style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 'clamp(12px, 2.2vw, 13.5px)', lineHeight: 1.9,
          color: 'rgba(255,255,255,0.65)',
          textShadow: '0 1px 8px rgba(0,0,0,0.6)',
        }}>
          {pillar.body}
        </p>

        {/* Bottom accent */}
        <div style={{
          marginTop: 14,
          height: 2, borderRadius: 99,
          background: `linear-gradient(90deg, ${pillar.accentColor}88, transparent)`,
          width: '0%', transition: 'width 0.5s ease',
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 80px)' }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }}/>
        <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, letterSpacing: '0.4em', color: GOLD }}>
          عن الأكاديمية
        </span>
        <div style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})` }}/>
      </div>

      <h2 style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 'clamp(26px, 5.5vw, 56px)',
        fontWeight: 900, lineHeight: 1.22, marginBottom: 16, color: '#fff',
      }}>
        رحلة نور{' '}
        <span style={{
          background: `linear-gradient(120deg, ${GOLD} 0%, ${GOLD_LIGHT} 45%, ${GOLD_PALE} 70%, ${GOLD_LIGHT} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: 'drop-shadow(0 0 20px rgba(201,149,74,0.32))',
        }}>
          تبدأ من هنا
        </span>
      </h2>

      <p style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 'clamp(13px, 2.5vw, 16px)', lineHeight: 2,
        color: 'rgba(255,255,255,0.42)',
        maxWidth: 520, margin: '0 auto 18px',
      }}>
        في قُرآني أونلاين نؤمن أن القرآن ليس مجرد كتاب يُتلى، بل هو حياة تُعاش،
        ونور يُهدي، ورفيق يرافقك في كل خطوة.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,149,74,0.4))' }}/>
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7"/>
        </svg>
        <div style={{ width: 40, height: 1, background: 'linear-gradient(270deg, transparent, rgba(201,149,74,0.4))' }}/>
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
  const orbY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      style={{
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(64px, 12vw, 120px) 0 clamp(56px, 10vw, 110px)',
        fontFamily: "'Cairo', sans-serif",
        background: 'linear-gradient(180deg, transparent 0%, rgba(6,13,26,0.55) 50%, transparent 100%)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Amiri:wght@400;700&display=swap');

        /* Pillar grid: 1 col mobile, 2 col tablet, 3 col desktop */
        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(14px, 3vw, 20px);
        }
        @media (min-width: 640px) {
          .pillars-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .pillars-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Split layout: stacked on mobile, side-by-side on lg */
        .about-split {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(28px, 5vw, 64px);
          margin-bottom: clamp(48px, 8vw, 80px);
          align-items: center;
        }
        @media (min-width: 1024px) {
          .about-split {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Stats: 2-col on mobile (compact), 3-col on sm */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(10px, 2.5vw, 16px);
        }
        @media (max-width: 400px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .group-hover\\:scale-105:hover { transform: scale(1.05); }
        .group-hover\\:\\!w-full:hover { width: 100% !important; }
      `}</style>

      {/* BG decorations */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
        <div style={{
          position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 'min(700px, 90vw)', height: 'min(600px, 80vw)', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(17,40,71,0.28) 0%, transparent 70%)',
          filter: 'blur(45px)',
        }}/>
        <motion.div style={{ position: 'absolute', top: '8%', left: '-6%', y: orbY }}>
          <IslamicOrb size={Math.min(340, typeof window !== 'undefined' ? window.innerWidth * 0.4 : 340)} opacity={0.04} />
        </motion.div>
        <div style={{
          position: 'absolute', top: 0, left: '5%', right: '5%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,149,74,0.13) 50%, transparent)',
        }}/>
        <div style={{
          position: 'absolute', bottom: 0, left: '5%', right: '5%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,149,74,0.13) 50%, transparent)',
        }}/>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px, 5vw, 32px)' }}>

        <SectionHeader />

        {/* Split */}
        <div className="about-split">
          {/* Image */}
          <FadeIn delay={0.1} style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'relative', width: '100%', maxWidth: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <div style={{
                position: 'absolute', width: '110%', height: '110%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,149,74,0.14) 0%, transparent 70%)',
                filter: 'blur(50px)', zIndex: 0,
              }}/>
              <div style={{
                position: 'relative', zIndex: 2, borderRadius: 24, overflow: 'hidden',
                border: '1px solid rgba(201,149,74,0.16)',
                boxShadow: '0 20px 72px rgba(0,0,0,0.42), 0 0 36px rgba(201,149,74,0.07)',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(201,149,74,0.55), transparent)', zIndex: 3,
                }}/>
                <img
                  src="./image/start-from-here-1.png"
                  alt="Luxury Quran Artwork"
                  style={{ width: '100%', maxWidth: 400, display: 'block', objectFit: 'cover', filter: 'contrast(1.04) saturate(1.04) brightness(0.95)' }}
                />
              </div>
              <div style={{
                position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
                width: '60%', height: 55,
                background: 'radial-gradient(ellipse, rgba(201,149,74,0.2) 0%, transparent 75%)',
                filter: 'blur(28px)', zIndex: 1,
              }}/>
            </motion.div>
          </FadeIn>

          {/* Who we are + stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 3vw, 20px)' }}>
            <FadeUp delay={0.14}>
              <div style={{
                position: 'relative', overflow: 'hidden', borderRadius: 24,
                padding: 'clamp(22px, 4vw, 34px)',
                background: 'linear-gradient(180deg, rgba(15,32,64,0.82) 0%, rgba(8,18,35,0.92) 100%)',
                border: '1px solid rgba(201,149,74,0.16)',
                backdropFilter: 'blur(22px)',
                boxShadow: '0 15px 56px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.03)',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(201,149,74,0.62), transparent)',
                }}/>
                <div style={{
                  position: 'absolute', top: -100, right: -60, width: 220, height: 220, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(201,149,74,0.1) 0%, transparent 70%)', filter: 'blur(40px)',
                }}/>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(201,149,74,0.22) 0%, rgba(201,149,74,0.08) 100%)',
                    border: '1px solid rgba(201,149,74,0.28)',
                    fontSize: 22, color: GOLD_LIGHT,
                  }}>✦</div>
                  <div>
                    <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 10, letterSpacing: '0.35em', color: 'rgba(201,149,74,0.52)', marginBottom: 4 }}>
                      Qurani Online
                    </div>
                    <h3 style={{
                      fontFamily: "'Cairo', sans-serif",
                      fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, lineHeight: 1.2, margin: 0,
                      background: `linear-gradient(120deg, ${GOLD} 0%, ${GOLD_LIGHT} 45%, #fff3d6 100%)`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                      من نحن
                    </h3>
                  </div>
                </div>

                <p style={{
                  position: 'relative', zIndex: 2,
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 'clamp(13px, 2.5vw, 15px)', lineHeight: 2.1,
                  color: 'rgba(255,255,255,0.70)', marginBottom: 20,
                }}>
                  قُرآني أونلاين تجربة قرآنية متكاملة تُصاغ بعنايةٍ علمية وروحٍ إيمانية رفيعة؛
                  نأخذ بيد الطالب في رحلةٍ هادئة تبدأ بإتقان الحرف، وتمتدّ نحو التلاوة المتقنة والسند المتصل بإذن الله.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, position: 'relative', zIndex: 2 }}>
                  {['تعليم بإجازة', 'بيئة إيمانية', 'معلمون متخصصون', 'تجربة فاخرة'].map((tag, i) => (
                    <div key={i} style={{
                      padding: 'clamp(7px, 1.5vw, 10px) clamp(12px, 2.5vw, 16px)',
                      borderRadius: 999,
                      background: 'rgba(201,149,74,0.08)',
                      border: '1px solid rgba(201,149,74,0.18)',
                      color: GOLD_LIGHT,
                      fontSize: 'clamp(10px, 2vw, 12px)', fontWeight: 600,
                    }}>
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Stats */}
            <div className="stats-grid">
              {STATS.map((s, i) => <StatCard key={i} stat={s} delay={0.18 + i * 0.09} />)}
            </div>
          </div>
        </div>

        {/* Pillar label */}
        <FadeUp delay={0.04} style={{ marginBottom: 'clamp(16px, 3vw, 24px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 22, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }}/>
            <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, letterSpacing: '0.4em', color: GOLD }}>
              فلسفتنا
            </span>
          </div>
        </FadeUp>

        {/* Pillars */}
        <div className="pillars-grid" style={{ marginBottom: 'clamp(48px, 9vw, 72px)' }}>
          {PILLARS.map((p, i) => <PillarCard key={i} pillar={p} delay={i * 0.1} />)}
        </div>

        {/* Ayah banner */}
        <FadeUp delay={0.06}>
          <div style={{
            textAlign: 'center',
            padding: 'clamp(28px, 6vw, 56px) clamp(20px, 5vw, 64px)',
            borderRadius: 22,
            background: 'rgba(10,22,40,0.58)',
            border: '0.5px solid rgba(201,149,74,0.18)',
            backdropFilter: 'blur(22px)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)` }}/>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}33, transparent)` }}/>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(201,149,74,0.06), transparent 65%)', pointerEvents: 'none' }}/>

            <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 28, color: GOLD, opacity: 0.42, marginBottom: 12 }}>۞</div>
            <p style={{
              fontFamily: "'Amiri', serif",
              fontSize: 'clamp(15px, 3.5vw, 28px)', lineHeight: 2.1,
              color: GOLD_PALE, marginBottom: 12, position: 'relative',
              textShadow: '0 0 28px rgba(201,149,74,0.16)',
            }}>
              إِنَّهُ لَكِتَابٌ كَرِيمٌ ✦ فِي كِتَابٍ مَكْنُونٍ ✦ لَا يَمَسُّهُ إِلَّا الْمُطَهَّرُونَ
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}60)` }}/>
              <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 11, letterSpacing: '0.35em', color: 'rgba(201,149,74,0.45)' }}>
                سورة الواقعة
              </span>
              <div style={{ width: 24, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD}60)` }}/>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}