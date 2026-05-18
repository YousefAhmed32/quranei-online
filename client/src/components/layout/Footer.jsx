  import { useEffect, useRef } from 'react'
  import { Link } from 'react-router-dom'
  import { motion, useInView } from 'framer-motion'

  // ─── Data ─────────────────────────────────────────────────────────────────────
  const GOLD = '#D6A55B'

  const footerLinks = [
    { label: 'الرئيسية', href: '#' },
    { label: 'حول الأكاديمية', href: '#' },
    { label: 'الدورات', href: '#' },
    { label: 'المعلمون', href: '#' },
    { label: 'باقات الاشتراك', href: '#' },
    { label: 'الأسئلة الشائعة', href: '#' },
    { label: 'تواصل معنا', href: '#' },
  ]

const socialLinks = [
  {
    label: 'YouTube',
    href: 'https://wa.me/201008148164',
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },

  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61588997977220',
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },

  {
    label: 'Instagram',
    href: 'https://www.instagram.com/qurani.online2/',
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}>
        <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4zm8.75 1.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
      </svg>
    ),
  },

  {
    label: 'TikTok',
    href: 'https://wa.me/201008148164',
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
]

  const contactItems = [
    {
      label: 'واتساب',
      value: '+201008148164',
      href: 'https://wa.me/201008148164',
      icon: <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.17.578 4.197 1.585 5.945L.057 23.49l5.698-1.494A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.867 0-3.617-.5-5.124-1.375l-.366-.218-3.804.997 1.015-3.697-.238-.378A9.946 9.946 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>,
    },
    {
      label: 'البريد الإلكتروني',
      value: 'info@qurani.online',
      href: 'mailto:info@qurani.online',
      icon: <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
    },
    {
      label: 'ساعات العمل',
      value: 'متاح يومياً 24/7',
      dot: true,
      icon: <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M13 7h-2v6l4.243 4.243 1.414-1.414L13 12.586z"/></svg>,
    },
  ]

  // ─── Animated Particles ───────────────────────────────────────────────────────
  function Particles() {
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              borderRadius: '50%',
              background: `rgba(214,165,91,${0.15 + (i % 4) * 0.08})`,
              left: `${8 + i * 7.5}%`,
              bottom: 0,
            }}
            animate={{
              y: [0, -(120 + i * 18)],
              x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 3)],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    )
  }

  // ─── Islamic Geometric SVG ────────────────────────────────────────────────────
  function IslamicGeometry({ size = 120, opacity = 0.04 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ opacity }}>
        <g stroke="#D6A55B" strokeWidth="0.8" fill="none">
          <polygon points="60,5 113,32.5 113,87.5 60,115 7,87.5 7,32.5" />
          <polygon points="60,18 100,40 100,80 60,102 20,80 20,40" />
          <polygon points="60,32 87,48 87,72 60,88 33,72 33,48" />
          <line x1="60" y1="5" x2="60" y2="115" />
          <line x1="7" y1="32.5" x2="113" y2="87.5" />
          <line x1="113" y1="32.5" x2="7" y2="87.5" />
        </g>
      </svg>
    )
  }

  // ─── Section Header ───────────────────────────────────────────────────────────
  function SectionHeader({ label }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <div style={{
          width: 3, height: 16, borderRadius: 2,
          background: `linear-gradient(to bottom, ${GOLD}, rgba(214,165,91,0.2))`,
          flexShrink: 0,
        }} />
        <span style={{
          color: 'rgba(214,165,91,0.8)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>{label}</span>
        <div style={{ flex: 1, height: '0.5px', background: 'rgba(214,165,91,0.15)' }} />
      </div>
    )
  }

  // ─── Footer ───────────────────────────────────────────────────────────────────
  export default function Footer() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })

    const fadeUp = (delay = 0) => ({
      initial: { opacity: 0, y: 24 },
      animate: inView ? { opacity: 1, y: 0 } : {},
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
    })

    return (
      <footer
        ref={ref}
        dir="rtl"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(26,58,92,0.35) 0%, transparent 55%),
            radial-gradient(ellipse at 20% 100%, rgba(144,97,48,0.2) 0%, transparent 45%),
            radial-gradient(ellipse at 80% 80%, rgba(26,58,92,0.2) 0%, transparent 40%),
            linear-gradient(180deg, #050d1f 0%, #030a18 60%, #020810 100%)
          `,
          borderTop: '1px solid rgba(214,165,91,0.12)',
          fontFamily: "'Cairo', 'Tajawal', sans-serif",
        }}
      >
        {/* ── Shimmer top line ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(214,165,91,0.08) 20%, rgba(214,165,91,0.55) 50%, rgba(214,165,91,0.08) 80%, transparent 100%)',
        }} />

        {/* ── Ambient gold glow top center ── */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 200,
          background: 'radial-gradient(ellipse, rgba(214,165,91,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── Islamic geometry decorations ── */}
        <div style={{ position: 'absolute', top: 40, left: 40, opacity: 0.035, pointerEvents: 'none' }}>
          <IslamicGeometry size={160} opacity={1} />
        </div>
        <div style={{ position: 'absolute', bottom: 60, right: 40, opacity: 0.025, pointerEvents: 'none' }}>
          <IslamicGeometry size={120} opacity={1} />
        </div>

        {/* ── Particles ── */}
        <Particles />

        {/* ── CTA BAND ── */}
        <motion.div {...fadeUp(0.05)} style={{ padding: '52px 24px 0' }}>
          <div style={{
            maxWidth: 760, margin: '0 auto',
            padding: '44px 40px',
            borderRadius: 24,
            background: 'rgba(7,17,31,0.5)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(214,165,91,0.2)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* inner glow */}
            <div style={{
              position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
              width: 300, height: 120,
              background: 'radial-gradient(ellipse, rgba(214,165,91,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <p style={{ color: 'rgba(214,165,91,0.65)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              ابدأ الآن
            </p>
            <h2 style={{
              color: '#fff', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800,
              margin: '0 0 10px', lineHeight: 1.35,
            }}>
              ابدأ رحلتك مع القرآن الكريم
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, margin: '0 0 28px', lineHeight: 1.75 }}>
              انضم إلى آلاف الطلاب حول العالم في رحلة تعلم القرآن
              <br />مع نخبة من أفضل المعلمين المتخصصين
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Primary CTA */}
              <Link
                to="/register"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  padding: '13px 28px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #8a5a20 0%, #D6A55B 45%, #c49240 100%)',
                  color: '#07111F', fontWeight: 800, fontSize: 15,
                  textDecoration: 'none',
                  boxShadow: '0 6px 28px rgba(214,165,91,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 36px rgba(214,165,91,0.55), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(214,165,91,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                ابدأ رحلتك الآن
                <svg viewBox="0 0 16 16" style={{ width: 16, height: 16, fill: 'currentColor' }}>
                  <path d="M10.7 7.3L6.4 3 5 4.4 8.6 8 5 11.6 6.4 13l4.3-4.3a1 1 0 0 0 0-1.4z" />
                </svg>
              </Link>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/201008148164"
                target="_blank" rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  padding: '13px 24px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(214,165,91,0.28)',
                  color: 'rgba(214,165,91,0.9)', fontWeight: 600, fontSize: 14,
                  textDecoration: 'none', transition: 'all 0.25s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(214,165,91,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(214,165,91,0.5)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(214,165,91,0.28)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: 'currentColor' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.17.578 4.197 1.585 5.945L.057 23.49l5.698-1.494A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.867 0-3.617-.5-5.124-1.375l-.366-.218-3.804.997 1.015-3.697-.238-.378A9.946 9.946 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 24px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 40,
            alignItems: 'start',
          }}>

            {/* ── BRAND COLUMN ── */}
            <motion.div {...fadeUp(0.1)}>
              {/* Logo */}
              <Link to="/" style={{ display: 'inline-block', marginBottom: 20 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div style={{
                    position: 'absolute', inset: -20,
                    background: 'radial-gradient(ellipse, rgba(214,165,91,0.15) 0%, transparent 65%)',
                    filter: 'blur(12px)', pointerEvents: 'none',
                  }} />
                  <img
                    src="./image/logo-png.png"
                    alt="Qurani Online"
                    style={{
                      height: 110, width: 'auto', objectFit: 'contain',
                      position: 'relative',
                      filter: 'drop-shadow(0 0 20px rgba(214,165,91,0.3))',
                    }}
                  />
                </div>
              </Link>

              <p style={{
                color: 'rgba(255,255,255,0.38)', fontSize: 14, lineHeight: 1.9,
                margin: '0 0 20px', maxWidth: 280,
              }}>
                منصة تعليم قرآن كريم عالمية بإشراف نخبة من المعلمين المتخصصين
                لتعليم القرآن والتجويد بإتقان وإخلاص.
              </p>

              {/* Verse */}
              <div style={{
                padding: '14px 16px', borderRadius: 13,
                background: 'rgba(214,165,91,0.05)',
                border: '1px solid rgba(214,165,91,0.14)',
                marginBottom: 20,
              }}>
                <p style={{ color: 'rgba(214,165,91,0.75)', fontSize: 14, fontStyle: 'italic', margin: '0 0 4px', textAlign: 'center' }}>
                  ﴿وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ﴾
                </p>
                <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, textAlign: 'center', margin: 0 }}>
                  سورة القمر • الآية ١٧
                </p>
              </div>

              {/* Social */}
             <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
  {socialLinks.map(s => (
    <a
      key={s.label}
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={s.label}
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(214,165,91,0.07)',
        border: '1px solid rgba(214,165,91,0.18)',
        color: 'rgba(214,165,91,0.55)',
        transition: 'all 0.22s',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(214,165,91,0.16)'
        e.currentTarget.style.borderColor = 'rgba(214,165,91,0.45)'
        e.currentTarget.style.color = '#D6A55B'
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(214,165,91,0.22)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(214,165,91,0.07)'
        e.currentTarget.style.borderColor = 'rgba(214,165,91,0.18)'
        e.currentTarget.style.color = 'rgba(214,165,91,0.55)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {s.icon}
    </a>
  ))}
</div>
            </motion.div>

            {/* ── QUICK LINKS ── */}
            <motion.div {...fadeUp(0.18)}>
              <SectionHeader label="روابط سريعة" />
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {footerLinks.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: 10, textDecoration: 'none',
                        color: 'rgba(255,255,255,0.45)', fontSize: 14,
                        border: '1px solid transparent',
                        transition: 'all 0.2s',
                        position: 'relative', overflow: 'hidden',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#D6A55B'
                        e.currentTarget.style.background = 'rgba(214,165,91,0.06)'
                        e.currentTarget.style.borderColor = 'rgba(214,165,91,0.18)'
                        e.currentTarget.style.paddingRight = '18px'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.paddingRight = '14px'
                      }}
                    >
                      <span>{link.label}</span>
                      <svg viewBox="0 0 16 16" style={{ width: 12, height: 12, fill: 'currentColor', opacity: 0.5, flexShrink: 0 }}>
                        <path d="M10.7 7.3L6.4 3 5 4.4 8.6 8 5 11.6 6.4 13l4.3-4.3a1 1 0 0 0 0-1.4z" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── CONTACT ── */}
            <motion.div {...fadeUp(0.26)}>
              <SectionHeader label="معلومات التواصل" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {contactItems.map(item => (
                  <a
                    key={item.label}
                    href={item.href || '#'}
                    target={item.href?.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', borderRadius: 14, textDecoration: 'none',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(214,165,91,0.1)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.22s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(214,165,91,0.07)'
                      e.currentTarget.style.borderColor = 'rgba(214,165,91,0.25)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      e.currentTarget.style.borderColor = 'rgba(214,165,91,0.1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: 'rgba(214,165,91,0.09)',
                      border: '1px solid rgba(214,165,91,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: GOLD,
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'rgba(214,165,91,0.6)', fontSize: 11, marginBottom: 3, letterSpacing: '0.03em' }}>
                        {item.label}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 500 }}>
                          {item.value}
                        </span>
                        {item.dot && (
                          <span style={{
                            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                            background: '#4ade80',
                            boxShadow: '0 0 8px rgba(74,222,128,0.7)',
                          }} />
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ maxWidth: 1200, margin: '44px auto 0', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, transparent, rgba(214,165,91,0.2))' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(214,165,91,0.4)' }} />
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'rgba(214,165,91,0.3)' }}>
                <polygon points="12,2 14,9 21,9 15.5,13.5 17.5,20.5 12,16 6.5,20.5 8.5,13.5 3,9 10,9" />
              </svg>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(214,165,91,0.4)' }} />
            </div>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, transparent, rgba(214,165,91,0.2))' }} />
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
     
{/* ── BOTTOM BAR ── */}
<div
  className="footer-bottom"
  style={{
    maxWidth: 1200,
    margin: '10px auto 0',
    padding: '18px 24px 28px',
  }}
>
  <div
    className="footer-bottom-inner"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
    }}
  >
    {/* RIGHT */}
    <p
      className="footer-copy"
      style={{
        color: 'rgba(255,255,255,0.2)',
        fontSize: 12,
        margin: 0,
        whiteSpace: 'nowrap',
      }}
    >
      © 2025 Qurani Online. جميع الحقوق محفوظة.
    </p>

    {/* CENTER */}
    <div
      className="footer-center"
      style={{
        textAlign: 'center',
        flex: 1,
      }}
    >
      <p
        style={{
          color: 'rgba(214,165,91,0.35)',
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontFamily: 'Cinzel, Georgia, serif',
          margin: '0 0 2px',
        }}
      >
        QURANI ONLINE
      </p>

      <p
        style={{
          color: 'rgba(214,165,91,0.22)',
          fontSize: 10,
          letterSpacing: '0.06em',
          margin: '0 0 6px',
        }}
      >
        Premium Quran Learning
      </p>

      <a
        href="https://wa.me/201090385390"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.32)',
          letterSpacing: '0.08em',
          textDecoration: 'none',
          transition: '0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'rgba(214,165,91,0.45)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.32)'
        }}
      >
        Designed & Developed by YANSY TECH
      </a>
    </div>

    {/* LEFT */}
    <p
      className="footer-quote"
      style={{
        color: 'rgba(255,255,255,0.2)',
        fontSize: 12,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        style={{
          width: 12,
          height: 12,
          fill: 'rgba(214,165,91,0.35)',
          flexShrink: 0,
        }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      تعلّم القرآن .. حياة القلب والروح
    </p>
  </div>
</div>

        <style>{`
          * { box-sizing: border-box; }
          @media (max-width: 640px) {
            footer [style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </footer>
    )
  }