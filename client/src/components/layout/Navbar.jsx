import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Info, BookOpen, Users, MessageSquare,
  Package, HelpCircle, Phone, X, Menu, LogOut,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/authStore'

const T = {
  gold:      '#c9954a',
  goldLight: '#e8c98a',
  goldPale:  '#f5e6c8',
  navy:      '#060d1a',
  goldGlass: 'rgba(201,149,74,0.08)',
  goldBorder:'rgba(201,149,74,0.22)',
}

const NAV_LINKS = [
  { href: '/',             label: 'الرئيسية',    icon: Home },
  { href: '/about',        label: 'الأكاديمية',  icon: Info },
  { href: '/courses',      label: 'الدورات',     icon: BookOpen },
  { href: '/programs',     label: 'البرامج',     icon: BookOpen },
  { href: '/teachers',     label: 'المعلمون',    icon: Users },
  { href: '/testimonials', label: 'آراء الطلاب', icon: MessageSquare },
  { href: '/pricing',      label: 'الباقات',     icon: Package },
  { href: '/faq',          label: 'الأسئلة',     icon: HelpCircle },
  { href: '/contact',      label: 'تواصل معنا',  icon: Phone },
]

function WAIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.17.578 4.197 1.585 5.945L.057 23.49l5.698-1.494A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.867 0-3.617-.5-5.124-1.375l-.366-.218-3.804.997 1.015-3.697-.238-.378A9.946 9.946 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  )
}

function Logo({ size = 40 }) {
  return (
    <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
      <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.22 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          border: '1px solid rgba(201,149,74,0.42)', boxShadow: '0 0 16px rgba(201,149,74,0.22)',
          background: '#fff',
        }}>
          <img src="/image/logo-png.png" alt="قرآني أونلاين"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="eager" />
        </div>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 800,
            fontSize: size > 36 ? 15 : 13, color: T.goldPale, letterSpacing: '0.05em' }}>
            قُرآني
          </div>
          <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 8,
            letterSpacing: '0.28em', color: 'rgba(232,201,138,0.4)', marginTop: 1 }}>
            ONLINE
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

function Dot() {
  return <span style={{ width: 3, height: 3, borderRadius: '50%',
    background: 'rgba(201,149,74,0.35)', display: 'inline-block', flexShrink: 0 }} />
}

function NavLink({ link, active }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link to={link.href}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', padding: '5px 9px', borderRadius: 7, textDecoration: 'none',
        fontSize: 'clamp(11px, 1.1vw, 13px)', fontFamily: "'Cairo', sans-serif",
        fontWeight: active ? 700 : 500,
        color: active ? T.goldLight : hovered ? T.goldLight : 'rgba(255,255,255,0.62)',
        background: active ? T.goldGlass : hovered ? 'rgba(201,149,74,0.05)' : 'transparent',
        transition: 'all 0.22s ease', whiteSpace: 'nowrap', display: 'block',
        WebkitTapHighlightColor: 'transparent',
      }}>
      {link.label}
      {active && (
        <motion.div layoutId="active-underline" style={{
          position: 'absolute', bottom: 2, left: '18%', right: '18%',
          height: 1.5, borderRadius: 99,
          background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
          boxShadow: `0 0 8px ${T.gold}`,
        }} transition={{ type: 'spring', stiffness: 400, damping: 38 }} />
      )}
    </Link>
  )
}

function GoldCTA({ to, children, sm = false }) {
  return (
    <Link to={to} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: sm ? '7px 16px' : '8px 20px', borderRadius: 10,
      background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 60%, ${T.goldPale} 100%)`,
      color: T.navy, fontSize: sm ? 12 : 12.5, fontFamily: "'Cairo', sans-serif",
      fontWeight: 800, textDecoration: 'none',
      boxShadow: '0 2px 14px rgba(201,149,74,0.28)', transition: 'all 0.22s',
      whiteSpace: 'nowrap', flexShrink: 0, WebkitTapHighlightColor: 'transparent', minHeight: 36,
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 26px rgba(201,149,74,0.52)'; e.currentTarget.style.transform = 'translateY(-1.5px)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 14px rgba(201,149,74,0.28)'; e.currentTarget.style.transform = 'translateY(0)' }}>
      {children}
    </Link>
  )
}

function WACta({ sm = false }) {
  return (
    <a href="https://wa.me/201008148164" target="_blank" rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: sm ? '7px 14px' : '8px 16px',
        border: '0.5px solid rgba(201,149,74,0.3)', borderRadius: 10,
        background: 'transparent', color: T.goldLight,
        fontSize: sm ? 12 : 12.5, fontFamily: "'Cairo', sans-serif",
        textDecoration: 'none', transition: 'all 0.22s', whiteSpace: 'nowrap',
        flexShrink: 0, WebkitTapHighlightColor: 'transparent', minHeight: 36,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,149,74,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,149,74,0.58)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,149,74,0.3)'; e.currentTarget.style.transform = 'translateY(0)' }}>
      <WAIcon size={sm ? 13 : 14} /> واتساب
    </a>
  )
}

// ─── Logout Button ────────────────────────────────────────────────────────────
function LogoutBtn({ sm = false, onLogout }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.button
      onClick={onLogout}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: sm ? '7px 14px' : '8px 16px', borderRadius: 10,
        background: hovered ? 'rgba(239,68,68,0.1)' : 'transparent',
        border: hovered ? '0.5px solid rgba(239,68,68,0.4)' : '0.5px solid rgba(255,255,255,0.1)',
        color: hovered ? '#fca5a5' : 'rgba(255,255,255,0.45)',
        fontSize: sm ? 12 : 12.5, fontFamily: "'Cairo', sans-serif",
        cursor: 'pointer', transition: 'all 0.22s', whiteSpace: 'nowrap',
        flexShrink: 0, minHeight: 36,
      }}>
      <LogOut size={sm ? 13 : 14} />
      تسجيل الخروج
    </motion.button>
  )
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose, location, isAuthenticated, user, onLogout }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }} onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 150,
              background: 'rgba(4,8,20,0.72)', backdropFilter: 'blur(8px)', touchAction: 'none' }} />

          <motion.aside key="drawer" dir="rtl" role="dialog" aria-modal="true"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240, mass: 0.9 }}
            style={{
              position: 'fixed', top: 0, right: 0,
              width: 'min(82vw, 300px)', height: '100dvh', zIndex: 160,
              background: 'rgba(6,13,26,0.97)', backdropFilter: 'blur(36px)',
              borderLeft: `0.5px solid ${T.goldBorder}`,
              display: 'flex', flexDirection: 'column',
              fontFamily: "'Cairo', sans-serif", overflowY: 'auto',
            }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px', borderBottom: '0.5px solid rgba(201,149,74,0.1)', flexShrink: 0 }}>
              <button onClick={onClose} aria-label="إغلاق القائمة" style={{
                background: 'rgba(201,149,74,0.07)', border: '0.5px solid rgba(201,149,74,0.2)',
                borderRadius: 9, padding: '8px 10px', color: T.goldLight, cursor: 'pointer',
                display: 'flex', alignItems: 'center', minWidth: 44, minHeight: 44, justifyContent: 'center' }}>
                <X size={18} />
              </button>
              <Logo size={36} />
            </div>

            {/* Links */}
            <nav style={{ flex: 1, padding: '8px 0' }}>
              {NAV_LINKS.map((link, i) => {
                const Icon = link.icon
                const active = location.pathname === link.href
                return (
                  <motion.div key={link.href}
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                    <Link to={link.href} onClick={onClose} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '13px 22px', textDecoration: 'none',
                      color: active ? T.goldLight : 'rgba(255,255,255,0.52)',
                      background: active ? 'rgba(201,149,74,0.07)' : 'transparent',
                      borderRight: active ? `2.5px solid ${T.gold}` : '2.5px solid transparent',
                      fontSize: 14, fontWeight: active ? 700 : 400, transition: 'all 0.2s', minHeight: 48,
                    }}>
                      <Icon size={16} style={{ color: active ? T.gold : 'rgba(201,149,74,0.32)', flexShrink: 0 }} />
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Footer CTAs */}
            <div style={{ padding: '14px 18px', borderTop: '0.5px solid rgba(201,149,74,0.1)',
              display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
              <WACta sm />
              {isAuthenticated ? (
                <>
                  <GoldCTA to={user?.role === 'admin' ? '/admin' : '/dashboard'} sm>لوحة التحكم</GoldCTA>
                  <LogoutBtn sm onLogout={() => { onLogout(); onClose() }} />
                </>
              ) : (
                <GoldCTA to="/register" sm>ابدأ رحلتك القرآنية</GoldCTA>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [scrollY,    setScrollY]    = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location                    = useLocation()
  const navigate                    = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => setMobileOpen(false), [location])

  useEffect(() => {
    const onScroll = () => { const y = window.scrollY; setScrollY(y); setScrolled(y > 40) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('تم تسجيل الخروج')
    navigate('/')
  }

  const ribbonW = Math.min(100, (scrollY / 600) * 100)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap');
        a, button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/* Scroll ribbon */}
      <div aria-hidden style={{
        position: 'fixed', top: 0, right: 0, height: 2, zIndex: 200,
        width: `${ribbonW}%`,
        background: `linear-gradient(90deg, transparent, ${T.gold}, ${T.goldLight})`,
        opacity: scrolled ? 0.85 : 0, transition: 'width 0.1s linear, opacity 0.4s', pointerEvents: 'none',
      }} />

      <motion.nav dir="rtl" role="navigation" aria-label="التنقل الرئيسي"
        initial={{ y: -72, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          fontFamily: "'Cairo', sans-serif",
          padding: scrolled ? '8px 12px' : '0', transition: 'padding 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}>

        <div style={{
          margin: '0 auto', maxWidth: '100%',
          background: scrolled ? 'rgba(6,13,26,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(26px)' : 'none',
          border: scrolled ? `0.5px solid ${T.goldBorder}` : 'none',
          borderRadius: scrolled ? 16 : 0,
          boxShadow: scrolled ? '0 8px 42px rgba(0,0,0,0.52), inset 0 1px 0 rgba(201,149,74,0.07)' : 'none',
          padding: scrolled ? 'clamp(8px,1.2vw,12px) clamp(16px,3vw,28px)' : 'clamp(14px,2vw,20px) clamp(16px,3vw,32px)',
          transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 'clamp(8px,1.5vw,18px)', minHeight: scrolled ? 48 : 52,
          }}>

            {/* Logo */}
            <Logo size={scrolled ? 36 : 42} />

            {/* Desktop Links */}
            <div className="hidden lg:flex" style={{
              alignItems: 'center', gap: 1, flex: 1,
              justifyContent: 'center', overflow: 'hidden', flexWrap: 'nowrap',
            }}>
              {NAV_LINKS.map((link, i) => (
                <div key={link.href} style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NavLink link={link} active={location.pathname === link.href} />
                  {i < NAV_LINKS.length - 1 && <Dot />}
                </div>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div className="hidden lg:flex"><WACta /></div>

              <div className="hidden lg:flex" style={{ alignItems: 'center', gap: 8 }}>
                {isAuthenticated ? (
                  <>
                    <GoldCTA to={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                      لوحة التحكم
                    </GoldCTA>
                    <LogoutBtn onLogout={handleLogout} />
                  </>
                ) : (
                  <GoldCTA to="/register">ابدأ رحلتك</GoldCTA>
                )}
              </div>

              {/* Burger */}
              <button className="flex lg:hidden" onClick={() => setMobileOpen(true)}
                aria-label="فتح قائمة التنقل" aria-expanded={mobileOpen}
                style={{
                  background: 'rgba(201,149,74,0.07)', border: '0.5px solid rgba(201,149,74,0.28)',
                  borderRadius: 10, padding: '9px 11px', color: T.goldLight, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', minWidth: 44, minHeight: 44,
                  justifyContent: 'center', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,149,74,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,149,74,0.07)'}>
                <Menu size={19} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileDrawer
        open={mobileOpen} onClose={() => setMobileOpen(false)}
        location={location} isAuthenticated={isAuthenticated}
        user={user} onLogout={handleLogout}
      />
    </>
  )
}