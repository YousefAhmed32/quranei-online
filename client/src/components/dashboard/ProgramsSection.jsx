import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const GOLD       = '#dfab70'
const GOLD_DARK  = '#906130'
const GOLD_GLOW  = 'rgba(223,171,112,0.18)'

const PROGRAMS = [
  {
    id: 1,
    category: 'memorization',

    number: '٠١',
    icon: '📖',
    title: 'برنامج الحفظ والتأسيس القرآني',
    tagline: 'رحلة التأسيس والحفظ المتدرّج',
    desc: 'برنامج متكامل يُعنى ببناء القراءة الصحيحة وترسيخ الحفظ وفق منهجية تربوية متدرجة تناسب جميع الأعمار والمستويات.',
    level: 'اقرأ • ارتقِ • رتّل',

    accent: '#5e8abf',
    glow: 'rgba(94,138,191,0.2)',
    border: 'rgba(94,138,191,0.25)',
  },

  {
    id: 2,
category: 'recitation',
    number: '٠٢',
    icon: '✦',
    title: 'برنامج التلاوة والإتقان',
    tagline: 'إتقان التلاوة بأداءٍ متقن',
    desc: 'يهدف البرنامج إلى تحسين التلاوة وضبط الأحكام وإخراج الحروف بإتقان من خلال تدريب عملي مباشر مع المعلمين المتخصصين.',
    level: 'السفرة • الكرام • البررة',

    accent: '#dfab70',
    glow: 'rgba(223,171,112,0.2)',
    border: 'rgba(223,171,112,0.3)',
  },

  {
    id: 3,
    category: 'arabic',

    number: '٠٣',
    icon: '🪶',
    title: 'برامج اللغة العربية',
    tagline: 'لغة القرآن بأسلوبٍ عصري',
    desc: 'برامج تعليمية تهدف إلى تنمية المهارات اللغوية وفهم العربية الفصحى بأسلوب مبسط يربط الطالب بلغة القرآن الكريم.',
    level: 'لسان عربيّ • لغة القرآن',

    accent: '#4a9090',
    glow: 'rgba(74,144,144,0.2)',
    border: 'rgba(74,144,144,0.25)',
  },

  {
    id: 4,
    category: 'sharia',

    number: '٠٤',
    icon: '📚',
    title: 'برامج العلوم الشرعية',
    tagline: 'علمٌ يُزكّي القلب والعقل',
    desc: 'مجموعة برامج شرعية وتربوية تهدف إلى بناء المسلم علميًا وإيمانيًا وفق القرآن الكريم والسنّة النبوية بأسلوب سهل وعميق.',
    level: '٥ برامج شرعية متخصصة',

    accent: '#9b7ecb',
    glow: 'rgba(155,126,203,0.2)',
    border: 'rgba(155,126,203,0.25)',
  },
]

// Geometric Islamic ornament SVG
function IslamicOrnament({ size = 80, opacity = 0.06 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none"
      style={{ position: 'absolute', pointerEvents: 'none', opacity }}>
      <polygon points="40,4 52,28 78,28 58,44 66,70 40,54 14,70 22,44 2,28 28,28"
        stroke={GOLD} strokeWidth="1" fill="none" />
      <circle cx="40" cy="40" r="14" stroke={GOLD} strokeWidth="0.75" fill="none" />
      <circle cx="40" cy="40" r="6"  stroke={GOLD} strokeWidth="0.5"  fill="none" />
    </svg>
  )
}

// Card component
function ProgramCard({ p, i, inView }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
    <Link
  to={`/courses?category=${p.category}`}
  style={{ display: 'block', height: '100%', textDecoration: 'none' }}
>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            height: '100%',
            padding: '34px 30px',
           borderRadius: 26,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            background: hovered
              ? 'rgba(20,42,74,0.62)'
              : 'rgba(11,24,48,0.5)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${hovered ? p.border : 'rgba(223,171,112,0.08)'}`,
            boxShadow: hovered
              ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${p.border}, inset 0 1px 0 rgba(255,255,255,0.04)`
              : '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.02)',
            transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
            transition: 'all 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Top shimmer */}
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
            background: `linear-gradient(90deg,transparent,${p.accent}55,transparent)`,
            opacity: hovered ? 1 : 0.4,
            transition: 'opacity 0.35s',
            pointerEvents: 'none',
          }} />

          {/* Radial glow on hover */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 50% 0%, ${p.glow} 0%, transparent 65%)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.45s ease',
            pointerEvents: 'none',
            borderRadius: 20,
          }} />

          {/* Ornament */}
          <div style={{ position: 'absolute', bottom: -16, left: -16 }}>
            <IslamicOrnament size={88} opacity={hovered ? 0.09 : 0.05} />
          </div>

          {/* Number */}
          <div style={{
            position: 'absolute', top: 22, left: 22,
            fontSize: 11, fontWeight: 800, letterSpacing: '1px',
            color: p.accent, opacity: 0.45,
            fontFamily: 'Cairo, sans-serif',
          }}>
            {p.number}
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Icon */}
            <div style={{
              width: 52, height: 52, borderRadius: 14, marginBottom: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 900,
              background: `linear-gradient(135deg, ${p.accent}22, ${p.accent}09)`,
              border: `1px solid ${p.accent}35`,
              boxShadow: hovered ? `0 0 22px ${p.glow}` : 'none',
              transition: 'box-shadow 0.35s',
              color: p.accent,
            }}>
              {p.icon}
            </div>

            {/* Title */}
            <div style={{
              color: '#fff', fontSize: 17, fontWeight: 900, marginBottom: 5,
              fontFamily: 'Cairo, sans-serif',
            }}>
              {p.title}
            </div>

            {/* Tagline */}
            <div style={{
              fontSize: 12, fontWeight: 600, marginBottom: 12,
              color: p.accent, opacity: 0.8, fontStyle: 'italic',
              fontFamily: 'Cairo, sans-serif',
            }}>
              {p.tagline}
            </div>

            {/* Divider */}
            <div style={{
              width: 36, height: 1, marginBottom: 14,
              background: `linear-gradient(90deg, ${p.accent}60, transparent)`,
            }} />

            {/* Desc */}
            <p style={{
              fontSize: 13, lineHeight: 1.95, marginBottom: 22,
              color: 'rgba(180,200,225,0.72)',
              fontFamily: 'Cairo, sans-serif',
            }}>
              {p.desc}
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 7,
                background: `${p.accent}14`,
                border: `1px solid ${p.accent}28`,
                color: p.accent,
                fontFamily: 'Cairo, sans-serif',
              }}>
                {p.level}
              </span>
              <motion.div
                animate={{ x: hovered ? -4 : 0, opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ArrowLeft size={15} style={{ color: GOLD }} />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function ProgramsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <section ref={ref} dir="rtl" style={{
      padding: '100px 0 110px',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'Cairo, sans-serif',
    }}>

      {/* ── Layered background ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 55% at 50% 50%, rgba(223,171,112,0.04) 0%, transparent 68%),
          radial-gradient(ellipse 45% 30% at 15% 85%, rgba(94,138,191,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 35% 25% at 85% 10%, rgba(223,171,112,0.04) 0%, transparent 60%)
        `,
      }} />

      {/* Large corner ornaments */}
      <div style={{ position: 'absolute', top: 20, right: 20, opacity: 0.04 }}>
        <IslamicOrnament size={160} opacity={1} />
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, opacity: 0.04, transform: 'rotate(30deg)' }}>
        <IslamicOrnament size={130} opacity={1} />
      </div>

      {/* Horizontal ambient line */}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0, height: 1, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent 0%, rgba(223,171,112,0.06) 20%, rgba(223,171,112,0.06) 80%, transparent 100%)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 18px', borderRadius: 50, marginBottom: 20,
            background: 'rgba(223,171,112,0.07)',
            border: '1px solid rgba(223,171,112,0.18)',
          }}>
            <div style={{ width: 32, height: 1, background: `linear-gradient(to left, ${GOLD}, transparent)` }} />
            <span style={{ color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: '2.5px' }}>
              مساراتنا التعليمية
            </span>
            <div style={{ width: 32, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(28px, 4.5vw, 46px)',
            fontWeight: 900, color: '#fff', lineHeight: 1.25,
            marginBottom: 16, letterSpacing: '-0.5px',
          }}>
            تعليمٌ يرتقي بك نحو{' '}
            <span style={{
              background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD}, #f0d4a0, ${GOLD})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              إتقان القرآن
            </span>
          </h2>

          {/* Sub */}
          <p style={{
            fontSize: 15, maxWidth: 560, margin: '0 auto',
            color: 'rgba(180,200,225,0.65)', lineHeight: 1.95,
          }}>
            ستّةُ مساراتٍ علميةٍ مصمَّمة باعتناءٍ وفق منهجيةٍ أكاديميةٍ رصينة،
            تأخذ بيدك من البداية حتى الإجازة بإشراف نخبة العلماء المُجازين.
          </p>
        </motion.div>

        {/* ── Cards grid ── */}
     <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 26,
    marginBottom: 56,
    alignItems: 'stretch',
  }}
  className="programs-grid"
>
          {PROGRAMS.map((p, i) => (
            <ProgramCard key={p.id} p={p} i={i} inView={inView} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center' }}
        >
          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            maxWidth: 380, margin: '0 auto 32px',
          }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, rgba(223,171,112,0.3), transparent)' }} />
            <span style={{ color: 'rgba(223,171,112,0.4)', fontSize: 10 }}>◆</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(223,171,112,0.3), transparent)' }} />
          </div>

          {/* Supporting copy */}
          <p style={{
            color: 'rgba(180,200,225,0.5)', fontSize: 13,
            marginBottom: 24, lineHeight: 1.8,
          }}>
            هل أنتَ مستعدٌّ لأن يكون القرآن أنيسَك وشفيعَك؟
          </p>

          <Link to="/courses">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '14px 36px', borderRadius: 16,
                background: `linear-gradient(135deg, ${GOLD_DARK} 0%, ${GOLD} 55%, #f0d4a0 100%)`,
                color: '#070f1c', fontWeight: 800, fontSize: 15,
                boxShadow: '0 0 36px rgba(223,171,112,0.32), 0 8px 32px rgba(0,0,0,0.4)',
                cursor: 'pointer', textDecoration: 'none',
                fontFamily: 'Cairo, sans-serif',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Shimmer sweep */}
              <div style={{
                position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 16,
              }}>
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', top: 0, bottom: 0, width: '40%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
                    transform: 'skewX(-15deg)',
                  }}
                />
              </div>

              <span style={{ position: 'relative', zIndex: 1 }}>
                استعرض جميع المسارات القرآنية
              </span>
              <ArrowLeft size={17} style={{ position: 'relative', zIndex: 1 }} />
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}