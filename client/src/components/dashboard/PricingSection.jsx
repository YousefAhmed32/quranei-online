import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Shield, Award, Headphones, Calendar } from 'lucide-react'

/* ═══════════════════════════════════
   TOKENS
═══════════════════════════════════ */
const GOLD       = '#c9954a'
const GOLD_LIGHT = '#e8c98a'
const GOLD_PALE  = '#f5e6c8'
const NAVY_DEEP  = '#060d1a'
const NAVY_MID   = '#0f2040'

/* ═══════════════════════════════════
   PLANS DATA
═══════════════════════════════════ */
const PLANS = [
  {
    id: 'basic',
    title: 'الباقة الأساسية',
    subtitle: 'لبداية قوية في رحلتك القرآنية',
    price: 199,
    currency: 'ر.س',
    period: 'شهرياً',
    sessions: 4,
    duration: 30,
    featured: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
      </svg>
    ),
    features: [
      'معلم معتمد بسند',
      'متابعة مستمرة',
      'تقييم شهري',
      'مادة تعليمية مجانية',
    ],
    accentColor: '#5e8abf',
    accentGlow: 'rgba(94,138,191,0.18)',
  },
  {
    id: 'gold',
    title: 'الباقة الذهبية',
    subtitle: 'توازن مثالي بين الجودة والالتزام',
    price: 349,
    currency: 'ر.س',
    period: 'شهرياً',
    sessions: 8,
    duration: 40,
    featured: true,
    tag: 'الأكثر طلباً',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M3 6l4 6 5-8 5 8 4-6v14H3z"/>
      </svg>
    ),
    features: [
      'معلم متخصص مُجاز',
      'متابعة شخصية',
      'تقييم أسبوعي',
      'مادة تعليمية + اختبارات',
      'تسجيل الجلسات',
      'دعم واتساب مباشر',
    ],
    accentColor: GOLD,
    accentGlow: 'rgba(201,149,74,0.22)',
  },
  {
    id: 'vip',
    title: 'الباقة الخاصة',
    subtitle: 'تجربة فريدة بخدمة شخصية كاملة',
    price: 699,
    currency: 'ر.س',
    period: 'شهرياً',
    sessions: 12,
    duration: 60,
    featured: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M6 3l6 4 6-4v6l-6 4-6-4V3z"/><path d="M6 9v8a2 2 0 002 2h8a2 2 0 002-2V9"/>
      </svg>
    ),
    features: [
      'معلم خاص مُجاز',
      'خطة تعليمية مخصصة',
      'متابعة يومية',
      'تقييمات وتقارير تفصيلية',
      'مادة تعليمية + اختبارات',
      'تسجيل الجلسات',
      'دعم خاص على مدار الساعة',
    ],
    accentColor: '#9a7abf',
    accentGlow: 'rgba(154,122,191,0.18)',
  },
]

const GUARANTEES = [
  {
    icon: Shield,
    text: 'خصوصية وأمان',
    sub: 'حماية كاملة لبياناتك',
  },
  {
    icon: Award,
    text: 'معلمون معتمدون',
    sub: 'نخبة من أفضل المعلمين',
  },
  {
    icon: Headphones,
    text: 'دعم مستمر',
    sub: 'نحن معك في كل خطوة',
  },
  {
    icon: Calendar,
    text: 'مرونة في المواعيد',
    sub: 'اختر الوقت المناسب لك',
  },
]

/* ═══════════════════════════════════
   HELPERS
═══════════════════════════════════ */
function CheckIcon({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="7" fill={color} opacity="0.15"/>
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="0.8" opacity="0.5"/>
      <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SessionBadge({ label, value, accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: `0.5px solid rgba(255,255,255,0.08)`,
      flex: 1,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `rgba(${accent === GOLD ? '201,149,74' : '255,255,255'},0.08)`,
        border: `0.5px solid ${accent}33`,
      }}>
        {label === 'عدد الجلسات' ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" aria-hidden>
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" aria-hidden>
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
        )}
      </div>
      <div>
        <div style={{ fontSize: 18,  color: accent, fontFamily: "'Alata', sans-serif",
fontWeight: 700, lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: "'Alata', sans-serif",
fontWeight: 700, }}>
          {label}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════
   PLAN CARD
═══════════════════════════════════ */
function PlanCard({ plan, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        marginTop: plan.featured ? 0 : 20,
        marginBottom: plan.featured ? 0 : 20,
        zIndex: plan.featured ? 2 : 1,
      }}
    >
      {/* Featured outer glow ring */}
      {plan.featured && (
        <motion.div
          style={{
            position: 'absolute', inset: -2, borderRadius: 26,
            background: `linear-gradient(135deg, ${GOLD}44, ${GOLD_LIGHT}22, ${GOLD}44)`,
            zIndex: -1,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Card */}
      <div
        style={{
          position: 'relative',
          borderRadius: plan.featured ? 24 : 20,
          background: plan.featured
            ? `linear-gradient(160deg, rgba(15,28,56,0.95) 0%, rgba(6,13,26,0.98) 100%)`
            : `linear-gradient(160deg, rgba(9,18,36,0.92) 0%, rgba(6,13,26,0.96) 100%)`,
          border: plan.featured
            ? `1px solid rgba(201,149,74,0.5)`
            : `0.5px solid rgba(255,255,255,0.07)`,
          backdropFilter: 'blur(24px)',
          overflow: 'hidden',
          boxShadow: plan.featured
            ? `0 0 60px rgba(201,149,74,0.18), 0 24px 80px rgba(0,0,0,0.6)`
            : hovered
            ? `0 16px 50px rgba(0,0,0,0.5), 0 0 0 0.5px ${plan.accentColor}44`
            : `0 8px 32px rgba(0,0,0,0.4)`,
          transition: 'box-shadow 0.4s, transform 0.4s',
          transform: hovered && !plan.featured ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        {/* ── FEATURED TAG ── */}
        {plan.featured && (
          <div style={{
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`,
            padding: '7px 0',
            textAlign: 'center',
            fontFamily: "'Cairo', sans-serif",
            fontSize: 11, fontWeight: 800,
            color: NAVY_DEEP,
            letterSpacing: '0.2em',
          }}>
            {plan.tag}
          </div>
        )}

        {/* ── TOP SHIMMER ── */}
        <div style={{
          position: 'absolute',
          top: plan.featured ? 33 : 0,
          left: 0, right: 0, height: 1,
          background: plan.featured
            ? `linear-gradient(90deg, transparent, ${GOLD}66, transparent)`
            : `linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)`,
        }}/>

        {/* ── INNER GLOW ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${plan.accentGlow}, transparent 65%)`,
          pointerEvents: 'none',
          opacity: plan.featured ? 1 : hovered ? 0.7 : 0.3,
          transition: 'opacity 0.4s',
        }}/>

        <div style={{ padding: plan.featured ? '28px 28px 28px' : '28px 24px 24px', position: 'relative' }}>

          {/* ── ICON ── */}
          <div style={{
            width: 64, height: 64,
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `radial-gradient(circle, ${plan.accentGlow} 0%, rgba(6,13,26,0.5) 100%)`,
            border: `1px solid ${plan.accentColor}55`,
            color: plan.accentColor,
            boxShadow: `0 0 0 8px ${plan.accentGlow}, 0 0 28px ${plan.accentGlow}`,
          }}>
            {plan.icon}
          </div>

          {/* ── TITLE ── */}
          <h3 style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: plan.featured ? 22 : 19,
            fontWeight: 900,
            textAlign: 'center',
            color: plan.featured ? GOLD_LIGHT : '#fff',
            marginBottom: 6,
          }}>
            {plan.title}
          </h3>
          <p style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 12, color: 'rgba(255,255,255,0.35)',
            textAlign: 'center', marginBottom: 24, lineHeight: 1.6,
          }}>
            {plan.subtitle}
          </p>

          {/* ── PRICE ── */}
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
              <span style={{
                fontFamily: "'Alata', sans-serif",
fontWeight: 700,
                fontSize: plan.featured ? 56 : 48,
                
                lineHeight: 1,
                background: plan.featured
                  ? `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD_PALE} 100%)`
                  : `linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: plan.featured ? `drop-shadow(0 0 16px rgba(201,149,74,0.4))` : 'none',
              }}>
                {plan.price}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                <span style={{ fontSize: 12, color: plan.accentColor, fontFamily: "'Cairo', sans-serif", fontWeight: 700 }}>
                  {plan.currency}
                </span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'Cairo', sans-serif" }}>
                  {plan.period}
                </span>
              </div>
            </div>
          </div>

          {/* ── SESSION BADGES ── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
            <SessionBadge label="عدد الجلسات" value={plan.sessions} accent={plan.accentColor} />
            <SessionBadge label="مدة الجلسة (د)" value={plan.duration} accent={plan.accentColor} />
          </div>

          {/* ── DIVIDER ── */}
          <div style={{
            height: 1, marginBottom: 20,
            background: plan.featured
              ? `linear-gradient(90deg, transparent, ${GOLD}44, transparent)`
              : `linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)`,
          }}/>

          {/* ── FEATURES ── */}
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28 }}>
            {plan.features.map((f, j) => (
              <li key={j} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: "'Cairo', sans-serif",
                fontSize: 13, color: 'rgba(255,255,255,0.65)',
              }}>
                <CheckIcon color={plan.accentColor} />
                {f}
              </li>
            ))}
          </ul>

          {/* ── CTA ── */}
          <Link
            to="/register"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '13px 0',
              borderRadius: 12,
              textDecoration: 'none',
              fontFamily: "'Cairo', sans-serif",
              fontSize: 14, fontWeight: 800,
              transition: 'all 0.28s',
              ...(plan.featured
                ? {
                    background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 60%, ${GOLD_PALE} 100%)`,
                    color: NAVY_DEEP,
                    boxShadow: `0 6px 28px rgba(201,149,74,0.42)`,
                  }
                : {
                    background: 'transparent',
                    color: plan.accentColor,
                    border: `0.5px solid ${plan.accentColor}55`,
                  }),
            }}
            onMouseEnter={e => {
              if (plan.featured) {
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(201,149,74,0.62)`
                e.currentTarget.style.transform = 'translateY(-2px)'
              } else {
                e.currentTarget.style.background = `${plan.accentColor}14`
                e.currentTarget.style.borderColor = `${plan.accentColor}88`
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={e => {
              if (plan.featured) {
                e.currentTarget.style.boxShadow = `0 6px 28px rgba(201,149,74,0.42)`
              } else {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = `${plan.accentColor}55`
              }
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            ابدأ رحلتك الآن
          </Link>

          <p style={{
            textAlign: 'center', marginTop: 10,
            fontFamily: "'Cairo', sans-serif",
            fontSize: 10, color: 'rgba(255,255,255,0.22)',
          }}>
            يمكنك الترقية أو الإلغاء في أي وقت
          </p>

        </div>

        {/* ── BOTTOM ACCENT LINE ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 1,
          background: `linear-gradient(90deg, transparent, ${plan.accentColor}66, transparent)`,
          opacity: hovered || plan.featured ? 1 : 0,
          transition: 'opacity 0.4s',
        }}/>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════
   GUARANTEE CARD
═══════════════════════════════════ */
function GuaranteeCard({ g, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const Icon = g.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '18px 20px',
        borderRadius: 16,
        background: 'rgba(10,20,40,0.6)',
        border: `0.5px solid rgba(201,149,74,0.15)`,
        backdropFilter: 'blur(16px)',
        position: 'relative', overflow: 'hidden',
      }}
      whileHover={{ y: -3, transition: { duration: 0.3 } }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(201,149,74,0.3), transparent)`,
      }}/>

      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(201,149,74,0.08)',
        border: `0.5px solid rgba(201,149,74,0.25)`,
        color: GOLD_LIGHT,
      }}>
        <Icon size={20} strokeWidth={1.4} />
      </div>

      <div>
        <div style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 13, fontWeight: 700, color: GOLD_PALE,
          marginBottom: 2,
        }}>
          {g.text}
        </div>
        <div style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 11, color: 'rgba(255,255,255,0.35)',
        }}>
          {g.sub}
        </div>
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
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: 'center', marginBottom: 64 }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD})` }}/>
        <span style={{ fontFamily: "'Alata', sans-serif",
 fontSize: 12, letterSpacing: '0.45em', color: GOLD }}>
          اختر باقتك
        </span>
        <div style={{ width: 28, height: 1, background: `linear-gradient(270deg, transparent, ${GOLD})` }}/>
      </div>

      <h2 style={{
        fontFamily: "'Alata', sans-serif",

        fontSize: 'clamp(34px, 6vw, 62px)',
        fontWeight: 900, lineHeight: 1.15, marginBottom: 16,
      }}>
        <span style={{
          background: `linear-gradient(120deg, ${GOLD} 0%, ${GOLD_LIGHT} 45%, ${GOLD_PALE} 70%, ${GOLD_LIGHT} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: `drop-shadow(0 0 28px rgba(201,149,74,0.4))`,
        }}>
          باقات تناسب رحلتك
        </span>
      </h2>

      <p style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 15, lineHeight: 1.9,
        color: 'rgba(255,255,255,0.4)',
        maxWidth: 500, margin: '0 auto 20px',
      }}>
        اختر الباقة التي تناسب أهدافك، وابدأ رحلتك القرآنية مع نخبة من المعلمين المتخصصين
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, rgba(201,149,74,0.4))` }}/>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z"
            stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7"/>
        </svg>
        <div style={{ width: 40, height: 1, background: `linear-gradient(270deg, transparent, rgba(201,149,74,0.4))` }}/>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════
   MAIN SECTION
═══════════════════════════════════ */
export default function PricingSection() {
  return (
    <section
      dir="rtl"
      style={{
        position: 'relative',
        padding: '110px 0 100px',
        overflow: 'hidden',
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Amiri:wght@400;700&display=swap');
      `}</style>

      {/* ── BG DECORATIONS ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden>
        <div style={{
          position: 'absolute', top: '15%', left: '50%',
          transform: 'translateX(-50%)',
          width: 700, height: 500,
          background: `radial-gradient(ellipse at 50% 30%, rgba(17,40,71,0.5) 0%, transparent 65%)`,
        }}/>
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translateX(-50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(201,149,74,0.05) 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}/>

        {/* Section lines */}
        <div style={{
          position: 'absolute', top: 0, left: '5%', right: '5%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(201,149,74,0.15) 50%, transparent)`,
        }}/>
        <div style={{
          position: 'absolute', bottom: 0, left: '5%', right: '5%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(201,149,74,0.15) 50%, transparent)`,
        }}/>

        {/* Ambient mosque silhouette */}
        <svg
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 180, opacity: 0.04 }}
          viewBox="0 0 1200 200" preserveAspectRatio="none"
        >
          <path d="M0 200L0 100C200 100,250 30,300 100C350 170,400 60,450 100C500 140,550 30,600 70C650 110,700 150,750 100C800 50,850 170,900 100C950 30,1000 100,1050 100C1100 100,1150 30,1200 70L1200 200Z"
            fill={GOLD}/>
        </svg>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>

        <SectionHeader />

        {/* ── PLANS GRID ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 20, alignItems: 'center', marginBottom: 60 }}
        >
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} delay={i * 0.12} />
          ))}
        </div>

        {/* ── GUARANTEES ── */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 14 }}>
          {GUARANTEES.map((g, i) => (
            <GuaranteeCard key={i} g={g} delay={i * 0.08} />
          ))}
        </div>

      </div>
    </section>
  )
}