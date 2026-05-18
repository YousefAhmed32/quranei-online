import qToast from '../../components/ui/Toast'
import ImageUpload from '../../components/ui/ImageUpload'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, GraduationCap, Users, Settings,
  LogOut, Menu, X, Bell, Search, Plus,
  Eye, EyeOff, Trash2, Edit3, Star, StarOff, Upload,
  Save, Globe, BarChart3, TrendingUp
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { courseService, teacherService, mediaService } from '../../services/api'

// ─── Design Tokens ────────────────────────────────────────────────────────────
const G   = '#dfab70'
const GD  = '#906130'
const NAV = '#040816'

// ─── Micro-components ─────────────────────────────────────────────────────────

/** Gold gradient button */
function GoldBtn({ children, onClick, disabled, sm, danger }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: sm ? '7px 14px' : '10px 20px',
        borderRadius: 11, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Cairo, sans-serif', fontWeight: 800,
        fontSize: sm ? 12 : 13, opacity: disabled ? 0.55 : 1,
        background: danger
          ? 'linear-gradient(135deg,#7f1d1d,#ef4444)'
          : `linear-gradient(135deg,${GD},${G})`,
        color: danger ? '#fff' : NAV,
        boxShadow: disabled ? 'none' : danger
          ? '0 0 18px rgba(239,68,68,0.3)'
          : `0 0 18px rgba(223,171,112,0.28)`,
        transition: 'box-shadow .2s',
      }}
    >
      {children}
    </motion.button>
  )
}

/** Ghost button */
function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '9px 18px', borderRadius: 11, border: '1px solid rgba(223,171,112,0.12)',
      background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)',
      fontFamily: 'Cairo, sans-serif', fontSize: 13, cursor: 'pointer',
      transition: 'all .2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.3)'; e.currentTarget.style.color = G }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
    >
      {children}
    </button>
  )
}

/** Luxury glass card */
function Card({ children, style = {}, p = 22, hover = true }) {
  const [h, setH] = useState(false)
  return (
    <div
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: h ? 'rgba(20,42,74,0.55)' : 'rgba(11,23,46,0.5)',
        backdropFilter: 'blur(22px)',
        border: `1px solid ${h ? 'rgba(223,171,112,0.22)' : 'rgba(223,171,112,0.09)'}`,
        borderRadius: 18,
        padding: p,
        boxShadow: h
          ? '0 20px 55px rgba(0,0,0,0.45), inset 0 1px 0 rgba(223,171,112,0.07)'
          : '0 4px 22px rgba(0,0,0,0.32), inset 0 1px 0 rgba(223,171,112,0.04)',
        transform: h ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all .3s ease',
        position: 'relative', overflow: 'hidden',
        ...style,
      }}
    >
      {/* top shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(223,171,112,0.35),transparent)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  )
}

/** Luxury input */
function LuxInput({ label, value, onChange, placeholder, type = 'text', rows, dir, disabled, style: s }) {
  const [focused, setFocused] = useState(false)
  const Tag = rows ? 'textarea' : 'input'
  return (
    <div>
      {label && (
        <div style={{ color: G, fontSize: 11, fontWeight: 700, marginBottom: 5, letterSpacing: '.4px' }}>
          {label}
        </div>
      )}
      <Tag
        value={value} onChange={onChange} placeholder={placeholder}
        type={type} rows={rows} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '10px 13px',
          background: focused ? 'rgba(8,17,31,0.85)' : 'rgba(7,15,28,0.6)',
          border: `1px solid ${focused ? 'rgba(223,171,112,0.42)' : 'rgba(223,171,112,0.12)'}`,
          borderRadius: 11, color: '#fff', fontSize: 13,
          fontFamily: 'Cairo, sans-serif', outline: 'none',
          resize: rows ? 'vertical' : 'none', direction: dir || 'rtl',
          boxShadow: focused ? '0 0 0 3px rgba(223,171,112,0.07)' : 'none',
          opacity: disabled ? .45 : 1, cursor: disabled ? 'not-allowed' : 'auto',
          transition: 'all .22s ease',
          ...s,
        }}
      />
    </div>
  )
}

/** Select wrapper */
function LuxSelect({ label, value, onChange, children }) {
  return (
    <div>
      {label && <div style={{ color: G, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>{label}</div>}
      <select value={value} onChange={onChange} style={{
        width: '100%', padding: '10px 13px',
        background: 'rgba(7,15,28,0.6)', border: '1px solid rgba(223,171,112,0.12)',
        borderRadius: 11, color: '#fff', fontSize: 13,
        fontFamily: 'Cairo, sans-serif', outline: 'none',
      }}>
        {children}
      </select>
    </div>
  )
}

/** Luxury modal */
function LuxModal({ open, onClose, title, children, wide }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            overflowY: 'auto', padding: '40px 20px',
          }}
        >
          <motion.div
            initial={{ scale: .88, y: 28 }} animate={{ scale: 1, y: 0 }}
            exit={{ scale: .88, y: 28 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: .38 }}
            style={{
              width: '100%', maxWidth: wide ? 720 : 560,
              background: 'rgba(7,15,28,0.98)',
              border: '1px solid rgba(223,171,112,0.22)',
              borderRadius: 22, overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.85)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px',
              background: 'rgba(17,40,71,0.5)',
              borderBottom: '1px solid rgba(223,171,112,0.1)',
            }}>
              <span style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>{title}</span>
              <button onClick={onClose} style={{
                width: 30, height: 30, borderRadius: 8, border: 'none',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
              >
                <X size={14} />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: 24, maxHeight: '74vh', overflowY: 'auto' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Shared form field wrapper (kept for backward compat) ──────────────────────
function FormField({ label, children }) {
  return (
    <div>
      <div style={{ color: G, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const SIDEBAR = [
  { id: 'overview',  label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'courses',   label: 'الدورات',    icon: BookOpen },
  { id: 'teachers',  label: 'المعلمون',   icon: GraduationCap },
  { id: 'students',  label: 'الطلاب',     icon: Users },
  { id: 'settings',  label: 'الإعدادات',  icon: Settings },
]

// ─── Layout shell ─────────────────────────────────────────────────────────────
function AdminShell({ active, setActive, children }) {
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', direction: 'rtl', background: NAV, fontFamily: 'Cairo, sans-serif' }}>

      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse at 15% 20%, rgba(223,171,112,0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 80%, rgba(8,17,31,0.7) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 0%,  rgba(30,60,100,0.1) 0%, transparent 50%)
        `,
      }} />

      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 70 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flexShrink: 0, display: 'flex', flexDirection: 'column', zIndex: 30,
          overflow: 'hidden', position: 'relative',
          background: 'rgba(4,8,22,0.94)',
          backdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(223,171,112,0.09)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Top shimmer */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 100, height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(223,171,112,0.5),transparent)',
        }} />

        {/* Logo row */}
        <div style={{
          height: 76, display: 'flex', alignItems: 'center',
          padding: '0 16px', gap: 12, flexShrink: 0,
          borderBottom: '1px solid rgba(223,171,112,0.08)',
        }}>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ flex: 1 }}
              >
                <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: '#fff',
                    border: '1px solid rgba(223,171,112,0.22)',
                    boxShadow: '0 0 22px rgba(223,171,112,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', transition: 'transform .4s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img src="/image/logo-png.png" alt="Qurani Online"
                      style={{ width: '82%', height: '82%', objectFit: 'contain' }} />
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{
              padding: 7, borderRadius: 9, border: 'none', background: 'transparent',
              color: 'rgba(223,171,112,0.42)', cursor: 'pointer',
              marginRight: sidebarOpen ? 0 : 'auto', marginLeft: sidebarOpen ? 0 : 'auto',
              transition: 'color .2s', display: 'flex',
            }}
            onMouseEnter={e => e.currentTarget.style.color = G}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(223,171,112,0.42)'}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 0', overflowY: 'auto', overflowX: 'hidden' }}>
          {SIDEBAR.map((item, idx) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <motion.button
                key={item.id}
                onClick={() => setActive(item.id)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.055 }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 11, padding: '11px 18px',
                  background: isActive ? 'rgba(223,171,112,0.07)' : 'transparent',
                  border: 'none',
                  borderRight: isActive ? `2px solid ${G}` : '2px solid transparent',
                  color: isActive ? G : 'rgba(255,255,255,0.36)',
                  cursor: 'pointer', transition: 'all .22s ease',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; e.currentTarget.style.background = 'rgba(223,171,112,0.04)' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.36)'; e.currentTarget.style.background = 'transparent' } }}
              >
                {isActive && (
                  <motion.div layoutId="nav-glow" style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg,rgba(223,171,112,0.09) 0%,transparent 100%)',
                  }} transition={{ duration: .28 }} />
                )}
                <div style={{ flexShrink: 0, position: 'relative' }}>
                  {isActive && (
                    <div style={{
                      position: 'absolute', inset: -4, borderRadius: '50%',
                      background: 'rgba(223,171,112,0.11)',
                    }} />
                  )}
                  <Icon size={17} />
                </div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: 14, flexShrink: 0, borderTop: '1px solid rgba(223,171,112,0.08)' }}>
          {sidebarOpen ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 11px', borderRadius: 12,
              background: 'rgba(223,171,112,0.04)',
              border: '1px solid rgba(223,171,112,0.08)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,${GD},${G})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: NAV,
              }}>
                {user?.name?.charAt(0) || 'أ'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </div>
                <div style={{ color: 'rgba(223,171,112,0.45)', fontSize: 11 }}>مدير المنصة</div>
              </div>
              <button onClick={handleLogout} title="تسجيل الخروج"
                style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} style={{
              width: '100%', display: 'flex', justifyContent: 'center', padding: '8px',
              borderRadius: 10, border: 'none', background: 'transparent',
              color: 'rgba(255,255,255,0.28)', cursor: 'pointer',
            }}>
              <LogOut size={15} />
            </button>
          )}
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* Topbar */}
        <div style={{
          height: 66, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px',
          background: 'rgba(4,8,22,0.88)', backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(223,171,112,0.08)',
          boxShadow: '0 4px 28px rgba(0,0,0,0.3)',
        }}>
          <div style={{ flex: 1 }}>
            <motion.h1
              key={active}
              initial={{ opacity: 0, y: -7 }} animate={{ opacity: 1, y: 0 }}
              style={{ color: '#fff', fontSize: 16, fontWeight: 900, lineHeight: 1.2 }}
            >
              {SIDEBAR.find(s => s.id === active)?.label}
            </motion.h1>
            <div style={{ color: 'rgba(223,171,112,0.4)', fontSize: 11, marginTop: 1 }}>لوحة إدارة قرآني أونلاين</div>
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9, maxWidth: 300, flex: 1,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(223,171,112,0.1)',
            borderRadius: 10, padding: '7px 13px',
          }}>
            <Search size={14} style={{ color: 'rgba(223,171,112,0.42)', flexShrink: 0 }} />
            <input placeholder="ابحث في المنصة..." style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: 'rgba(255,255,255,0.7)', fontSize: 13, flex: 1,
              fontFamily: 'Cairo, sans-serif', direction: 'rtl',
            }} />
          </div>

          {/* Bell */}
          <button style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(223,171,112,0.05)', border: '1px solid rgba(223,171,112,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(223,171,112,0.55)', cursor: 'pointer', position: 'relative',
            transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.3)'; e.currentTarget.style.color = G }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.1)'; e.currentTarget.style.color = 'rgba(223,171,112,0.55)' }}
          >
            <Bell size={16} />
            <div style={{
              position: 'absolute', top: 8, right: 8, width: 6, height: 6,
              borderRadius: '50%', background: G, boxShadow: `0 0 6px ${G}`,
            }} />
          </button>

          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 10,
            border: '1px solid rgba(223,171,112,0.14)',
            color: 'rgba(223,171,112,0.65)', fontSize: 12, fontWeight: 600,
            textDecoration: 'none', transition: 'all .2s',
            background: 'rgba(223,171,112,0.03)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.38)'; e.currentTarget.style.color = G }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.14)'; e.currentTarget.style.color = 'rgba(223,171,112,0.65)' }}
          >
            <Globe size={13} /> عرض الموقع
          </Link>
        </div>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 30px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

// ─── Overview Panel ───────────────────────────────────────────────────────────
function OverviewPanel() {
  const [stats, setStats] = useState({ courses: 0, teachers: 0 })

  useEffect(() => {
    Promise.all([
      courseService.adminGetAll().catch(() => ({ data: { courses: [] } })),
      teacherService.adminGetAll().catch(() => ({ data: { teachers: [] } })),
    ]).then(([c, t]) => {
      setStats({ courses: c.data.courses?.length || 0, teachers: t.data.teachers?.length || 0 })
    })
  }, [])

  const STATS = [
    { label: 'إجمالي الدورات',    value: stats.courses,  icon: BookOpen,      color: G },
    { label: 'إجمالي المعلمين',   value: stats.teachers, icon: GraduationCap, color: '#818cf8' },
    { label: 'الطلاب المسجلون',   value: '—',            icon: Users,         color: '#22c55e' },
    { label: 'التقييم العام',      value: '4.9★',         icon: Star,          color: G },
  ]

  const QUICK = [
    { label: 'إضافة دورة جديدة', icon: Plus,         desc: 'أنشئ دورة قرآنية' },
    { label: 'إضافة معلم',        icon: GraduationCap, desc: 'سجّل معلماً جديداً' },
    { label: 'إدارة الوسائط',     icon: Upload,        desc: 'رفع الصور والملفات' },
    { label: 'عرض الموقع',        icon: Globe,         desc: 'صفحة الدورات العامة' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>

      {/* Welcome */}
      <Card hover={false} style={{
        background: 'linear-gradient(135deg,rgba(17,42,78,0.65) 0%,rgba(4,8,22,0.85) 100%)',
        borderColor: 'rgba(223,171,112,0.15)',
      }} p={28}>
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '38%', opacity: .03,
          backgroundImage: 'repeating-linear-gradient(45deg,rgba(223,171,112,1) 0px,rgba(223,171,112,1) 1px,transparent 1px,transparent 18px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: `linear-gradient(180deg,${G},${GD})`,
          borderRadius: '0 0 0 18px',
        }} />
        <div style={{ color: 'rgba(223,171,112,0.48)', fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', marginBottom: 7 }}>
          ﷽
        </div>
        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 900, marginBottom: 5 }}>مرحباً بك في لوحة التحكم</h2>
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13 }}>
          قرآني أونلاين — منصة تعليم القرآن الكريم الاحترافية
        </p>
      </Card>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(175px,1fr))', gap: 14 }}>
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card p={22}>
                {/* Radial glow */}
                <div style={{
                  position: 'absolute', top: -25, right: -25, width: 110, height: 110,
                  borderRadius: '50%',
                  background: `radial-gradient(circle,${s.color}18 0%,transparent 70%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{
                  width: 42, height: 42, borderRadius: 11, marginBottom: 14,
                  background: `linear-gradient(135deg,${s.color}22,${s.color}09)`,
                  border: `1px solid ${s.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 18px ${s.color}1a`,
                }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(223,171,112,0.52)', fontWeight: 600, marginTop: 6 }}>
                  {s.label}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick actions */}
      <Card hover={false} p={24}>
        <h2 style={{ fontWeight: 800, color: '#fff', marginBottom: 16, fontSize: 15 }}>وصول سريع</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
          {QUICK.map((q, i) => {
            const Icon = q.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .28 + i * .07 }}
              >
                <Card p={18} style={{ cursor: 'pointer' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, marginBottom: 11,
                    background: 'rgba(223,171,112,0.08)', border: '1px solid rgba(223,171,112,0.16)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={15} style={{ color: G }} />
                  </div>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{q.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{q.desc}</div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ─── Courses Panel ────────────────────────────────────────────────────────────
const EMPTY_COURSE = {
  title: '', slug: '', shortDescription: '', description: '', thumbnail: '', heroVideo: '',
  category: 'quran', level: 'beginner', language: 'العربية', duration: '', lessonsCount: 0,
  teacherName: '', pricingType: 'contact', price: 0, currency: 'ريال', showPrice: false,
  whatsapp: '', ctaText: 'اشترك الآن', isPublished: false, featured: false, priorityOrder: '',
  learningOutcomes: [], targetStudents: [], highlights: [], tags: [],
  seoTitle: '', seoDescription: '',
}

function CoursesPanel() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_COURSE)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [arrDraft, setArrDraft] = useState({ learningOutcomes: '', targetStudents: '', highlights: '', tags: '' })

  const load = () => {
    setLoading(true)
    courseService.adminGetAll({ search, ...(filter !== '' ? { isPublished: filter } : {}) })
      .then(r => setCourses(r.data.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [search, filter])

  const openCreate = () => {
    setEditing(null); setForm({ ...EMPTY_COURSE })
    setArrDraft({ learningOutcomes: '', targetStudents: '', highlights: '', tags: '' })
    setShowForm(true)
  }
  const openEdit = (c) => {
    setEditing(c); setForm({ ...EMPTY_COURSE, ...c })
    setArrDraft({
      learningOutcomes: c.learningOutcomes?.join('\n') || '',
      targetStudents:   c.targetStudents?.join('\n') || '',
      highlights:       c.highlights?.join('\n') || '',
      tags:             c.tags?.join('، ') || '',
    })
    setShowForm(true)
  }

  const buildPayload = () => ({
    ...form,
    priorityOrder: form.priorityOrder === '' ? 0 : Number(form.priorityOrder),
    lessonsCount:  form.lessonsCount === ''  ? 0 : Number(form.lessonsCount),
    price:         form.price === ''         ? 0 : Number(form.price),
    learningOutcomes: arrDraft.learningOutcomes.split('\n').map(s => s.trim()).filter(Boolean),
    targetStudents:   arrDraft.targetStudents.split('\n').map(s => s.trim()).filter(Boolean),
    highlights:       arrDraft.highlights.split('\n').map(s => s.trim()).filter(Boolean),
    tags:             arrDraft.tags.split(/[،,]/).map(s => s.trim()).filter(Boolean),
  })

  const handleSave = async () => {
    if (!form.title.trim()) return qToast.error('عنوان الدورة مطلوب')
    setSaving(true)
    try {
      const payload = buildPayload()
      if (editing) {
        await courseService.adminUpdate(editing._id, payload)
        qToast.success('تم تحديث الدورة')
      } else {
        await courseService.adminCreate(payload)
        qToast.success('تمت إضافة الدورة')
      }
      setShowForm(false); load()
    } catch (e) { qToast.error(e.response?.data?.message || 'حدث خطأ') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدورة؟')) return
    await courseService.adminDelete(id).then(load).catch(() => qToast.error('خطأ في الحذف'))
    qToast.success('تم الحذف')
  }

  const handleToggle = async (c, field) => {
    await courseService.adminUpdate(c._id, { [field]: !c[field] }).then(load)
  }

  const slugify = (t) => t.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]/g, '').slice(0, 80)
  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const CAT = { tajweed: 'التجويد', quran: 'القرآن', memorization: 'الحفظ', recitation: 'التلاوة', ijazah: 'الإجازة', correction: 'التصحيح', arabic: 'عربية', other: 'أخرى' }
  const LVL = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم', all: 'الجميع' }

  // shared input style for selects / plain inputs inside modal
  const inp = { width: '100%', padding: '10px 13px', background: 'rgba(7,15,28,0.6)', border: '1px solid rgba(223,171,112,0.12)', borderRadius: 11, color: '#fff', fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 19, fontWeight: 900 }}>إدارة الدورات</h2>
          <div style={{ color: 'rgba(223,171,112,0.5)', fontSize: 12, marginTop: 2 }}>{courses.length} دورة</div>
        </div>
        <GoldBtn onClick={openCreate}><Plus size={14} /> إضافة دورة</GoldBtn>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
        <div style={{ position: 'relative', flex: '1 1 190px', maxWidth: 300 }}>
          <Search size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(223,171,112,0.45)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
            style={{ ...inp, paddingRight: 36 }} />
        </div>
        {[{ v: '', l: 'الكل' }, { v: 'true', l: 'منشور' }, { v: 'false', l: 'مسودة' }].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)}
            style={{
              padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
              cursor: 'pointer', border: '1px solid', fontFamily: 'Cairo, sans-serif', transition: 'all .2s',
              ...(filter === f.v
                ? { background: `linear-gradient(135deg,${GD},${G})`, color: NAV, borderColor: 'transparent' }
                : { background: 'rgba(17,40,71,0.4)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(223,171,112,0.1)' }),
            }}>
            {f.l}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card hover={false} p={0} style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(17,40,71,0.55)', borderBottom: '1px solid rgba(223,171,112,0.1)' }}>
                {['الدورة', 'الفئة', 'المستوى', 'السعر', 'الترتيب', 'الحالة', 'مميز', 'إجراءات'].map(h => (
                  <th key={h} style={{ padding: '13px 16px', textAlign: 'right', color: 'rgba(223,171,112,0.7)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(4).fill(0).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(223,171,112,0.05)' }}>
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j} style={{ padding: '13px 16px' }}>
                        <div style={{ height: 12, borderRadius: 6, background: 'rgba(17,40,71,0.5)', animation: 'pulse 1.5s infinite' }} />
                      </td>
                    ))}
                  </tr>
                ))
                : courses.length === 0
                  ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>
                        <BookOpen size={36} style={{ color: 'rgba(223,171,112,0.25)', margin: '0 auto 10px', display: 'block' }} />
                        لا توجد دورات بعد
                      </td>
                    </tr>
                  )
                  : courses.map(c => (
                    <tr key={c._id}
                      style={{ borderBottom: '1px solid rgba(223,171,112,0.05)', transition: 'background .18s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(223,171,112,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                          {c.thumbnail
                            ? <img src={c.thumbnail.startsWith('http') ? c.thumbnail : `/api/media/stream/${c.thumbnail}`}
                              alt="" style={{ width: 42, height: 42, borderRadius: 9, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(223,171,112,0.15)' }} />
                            : <div style={{ width: 42, height: 42, borderRadius: 9, flexShrink: 0, background: 'rgba(17,40,71,0.6)', border: '1px solid rgba(223,171,112,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <BookOpen size={16} style={{ color: 'rgba(223,171,112,0.35)' }} />
                            </div>
                          }
                          <div>
                            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{c.title}</div>
                            <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>{c.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: 'rgba(223,171,112,0.08)', color: G, border: '1px solid rgba(223,171,112,0.15)' }}>
                          {CAT[c.category] || c.category}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{LVL[c.level]}</td>
                      <td style={{ padding: '13px 16px', fontSize: 12 }}>
                        {c.showPrice && c.price > 0
                          ? <span style={{ color: G, fontWeight: 700 }}>{c.price} {c.currency}</span>
                          : c.showPrice && c.pricingType === 'free'
                            ? <span style={{ color: '#22c55e', fontWeight: 700 }}>مجاني</span>
                            : <span style={{ color: 'rgba(255,255,255,0.25)' }}>مخفي</span>
                        }
                      </td>
                      <td style={{ padding: '13px 16px', color: '#fff', fontSize: 12 }}>{c.priorityOrder}</td>
                      <td style={{ padding: '13px 16px' }}>
                        <button onClick={() => handleToggle(c, 'isPublished')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700,
                            border: '1px solid', borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                            fontFamily: 'Cairo, sans-serif', transition: 'all .2s',
                            ...(c.isPublished
                              ? { background: 'rgba(34,197,94,0.08)', color: '#22c55e', borderColor: 'rgba(34,197,94,0.22)' }
                              : { background: 'rgba(239,68,68,0.08)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.22)' }),
                          }}>
                          {c.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                          {c.isPublished ? 'منشور' : 'مسودة'}
                        </button>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <button onClick={() => handleToggle(c, 'featured')}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: c.featured ? G : 'rgba(255,255,255,0.15)', fontSize: 17 }}>
                          {c.featured ? <Star size={16} fill={G} style={{ color: G }} /> : <StarOff size={16} />}
                        </button>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEdit(c)} style={{
                            width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(223,171,112,0.2)',
                            background: 'rgba(223,171,112,0.06)', color: G, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(223,171,112,0.14)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(223,171,112,0.06)'}
                          >
                            <Edit3 size={13} />
                          </button>
                          <button onClick={() => handleDelete(c._id)} style={{
                            width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)',
                            background: 'rgba(239,68,68,0.06)', color: '#ef4444', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Modal */}
      <LuxModal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'تعديل الدورة' : 'إضافة دورة جديدة'} wide>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, direction: 'rtl' }}>
          {/* Title + Slug */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <LuxInput label="عنوان الدورة *" value={form.title}
                onChange={e => { setF('title', e.target.value); if (!editing) setF('slug', slugify(e.target.value)) }}
                placeholder="مثال: أحكام التجويد المتقدمة" />
            </div>
            <LuxInput label="المعرف (slug)" value={form.slug} onChange={e => setF('slug', e.target.value)} dir="ltr" />
            <LuxInput label="اسم المعلم" value={form.teacherName} onChange={e => setF('teacherName', e.target.value)} placeholder="الشيخ أحمد..." />
          </div>

          <LuxInput label="وصف مختصر" value={form.shortDescription} onChange={e => setF('shortDescription', e.target.value)} rows={2} placeholder="جملتان تلخصان الدورة" />
          <LuxInput label="وصف تفصيلي" value={form.description} onChange={e => setF('description', e.target.value)} rows={4} placeholder="كل ما يحتاج الطالب معرفته..." />

          {/* Image upload — original component */}
          <ImageUpload label="صورة الدورة" value={form.thumbnail} onChange={v => setF('thumbnail', v)} hint="ارفع صورة الدورة أو الصق رابطها" />

          <LuxInput label="رابط فيديو يوتيوب (للمعاينة)" value={form.heroVideo} onChange={e => setF('heroVideo', e.target.value)} dir="ltr" placeholder="https://youtube.com/watch?v=..." />

          {/* Category / Level / Duration / Lessons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <LuxSelect label="الفئة" value={form.category} onChange={e => setF('category', e.target.value)}>
              {[['tajweed','التجويد'],['quran','القرآن الكريم'],['memorization','الحفظ'],['recitation','التلاوة'],['ijazah','الإجازة'],['correction','التصحيح'],['arabic','اللغة العربية'],['other','أخرى']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </LuxSelect>
            <LuxSelect label="المستوى" value={form.level} onChange={e => setF('level', e.target.value)}>
              {[['beginner','مبتدئ'],['intermediate','متوسط'],['advanced','متقدم'],['all','الجميع']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </LuxSelect>
            <LuxInput label="المدة" value={form.duration} onChange={e => setF('duration', e.target.value)} placeholder="مثال: 3 أشهر" />
            <LuxInput label="عدد الدروس" value={form.lessonsCount} onChange={e => setF('lessonsCount', +e.target.value)} type="number" />
          </div>

          {/* Pricing section */}
          <div style={{ padding: '16px', borderRadius: 12, background: 'rgba(7,15,28,0.45)', border: '1px solid rgba(223,171,112,0.09)' }}>
            <div style={{ color: G, fontSize: 11, fontWeight: 700, marginBottom: 12, letterSpacing: '.5px' }}>إعدادات السعر</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <LuxSelect label="نوع التسعير" value={form.pricingType} onChange={e => setF('pricingType', e.target.value)}>
                {[['free','مجاني'],['paid','مدفوع'],['contact','تواصل للاستفسار']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </LuxSelect>
              <LuxInput label="السعر" value={form.price} onChange={e => setF('price', +e.target.value)} type="number" disabled={form.pricingType !== 'paid'} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.showPrice} onChange={e => setF('showPrice', e.target.checked)} style={{ accentColor: G }} />
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>إظهار السعر للزوار</span>
            </label>
          </div>

          {/* WhatsApp / CTA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <LuxInput label="رقم واتساب" value={form.whatsapp} onChange={e => setF('whatsapp', e.target.value)} dir="ltr" placeholder="201008148164" />
            <LuxInput label="نص زر الاشتراك" value={form.ctaText} onChange={e => setF('ctaText', e.target.value)} placeholder="اشترك الآن" />
          </div>

          {/* Array fields */}
          <LuxInput label="ماذا ستتعلم؟ (سطر لكل نقطة)" value={arrDraft.learningOutcomes} onChange={e => setArrDraft(d => ({ ...d, learningOutcomes: e.target.value }))} rows={3} placeholder="كل سطر = نقطة تعليمية" />
          <LuxInput label="لمن هذه الدورة؟ (سطر لكل نقطة)" value={arrDraft.targetStudents} onChange={e => setArrDraft(d => ({ ...d, targetStudents: e.target.value }))} rows={2} />
          <LuxInput label="مميزات الدورة (سطر لكل ميزة)" value={arrDraft.highlights} onChange={e => setArrDraft(d => ({ ...d, highlights: e.target.value }))} rows={2} />

          {/* Order + checkboxes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <LuxInput label="ترتيب الأولوية (رقم أصغر = أول)" value={form.priorityOrder} onChange={e => setF('priorityOrder', e.target.value)} type="number" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'flex-end' }}>
              {[['isPublished', 'نشر الدورة'], ['featured', 'دورة مميزة'], ['showPrice', 'إظهار السعر']].map(([k, l]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!form[k]} onChange={e => setF(k, e.target.checked)} style={{ accentColor: G }} />
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{l}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
            <GhostBtn onClick={() => setShowForm(false)}>إلغاء</GhostBtn>
            <GoldBtn onClick={handleSave} disabled={saving}>
              {saving
                ? <div style={{ width: 14, height: 14, border: `2px solid ${NAV}55`, borderTopColor: NAV, borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                : <Save size={14} />}
              {editing ? 'حفظ التعديلات' : 'إضافة الدورة'}
            </GoldBtn>
          </div>
        </div>
      </LuxModal>
    </div>
  )
}

// ─── Teachers Panel ───────────────────────────────────────────────────────────
const EMPTY_TEACHER = {
  fullName: '', title: '', gender: 'male', imageUrl: '', bio: '', shortBio: '',
  specialization: '', experience: '', languages: [], nationality: '', whatsapp: '',
  priorityOrder: '', active: true, featured: false,
  socialLinks: { youtube: '', instagram: '', twitter: '', facebook: '' },
}

function TeachersPanel() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_TEACHER)
  const [saving, setSaving] = useState(false)
  const [langDraft, setLangDraft] = useState('')

  const load = () => {
    setLoading(true)
    teacherService.adminGetAll()
      .then(r => setTeachers(r.data.teachers || []))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY_TEACHER }); setLangDraft(''); setShowForm(true) }
  const openEdit = (t) => {
    setEditing(t)
    setForm({ ...EMPTY_TEACHER, ...t, socialLinks: { ...EMPTY_TEACHER.socialLinks, ...(t.socialLinks || {}) } })
    setLangDraft(t.languages?.join('، ') || '')
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.fullName.trim()) return qToast.error('الاسم مطلوب')
    setSaving(true)
    try {
      const payload = {
        ...form,
        priorityOrder: form.priorityOrder === '' ? 0 : Number(form.priorityOrder),
        languages: langDraft.split(/[،,]/).map(s => s.trim()).filter(Boolean),
      }
      if (editing) { await teacherService.adminUpdate(editing._id, payload); qToast.success('تم التحديث') }
      else { await teacherService.adminCreate(payload); qToast.success('تمت الإضافة') }
      setShowForm(false); load()
    } catch (e) { qToast.error(e.response?.data?.message || 'خطأ') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('حذف المعلم؟')) return
    await teacherService.adminDelete(id).then(load)
    qToast.success('تم الحذف')
  }

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 19, fontWeight: 900 }}>إدارة المعلمين</h2>
          <div style={{ color: 'rgba(223,171,112,0.5)', fontSize: 12, marginTop: 2 }}>{teachers.length} معلم</div>
        </div>
        <GoldBtn onClick={openCreate}><Plus size={14} /> إضافة معلم</GoldBtn>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 14 }}>
          {Array(6).fill(0).map((_, i) => (
            <div key={i} style={{ height: 130, borderRadius: 18, background: 'rgba(17,40,71,0.3)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <Card p={60} style={{ textAlign: 'center' }}>
          <GraduationCap size={44} style={{ color: 'rgba(223,171,112,0.2)', margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: 'rgba(255,255,255,0.28)' }}>لا يوجد معلمون بعد. أضف أول معلم!</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 14 }}>
          {teachers.map((t, i) => (
            <motion.div key={t._id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card p={20}>
                <div style={{ display: 'flex', gap: 13, marginBottom: 14 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 13, flexShrink: 0,
                    border: '1px solid rgba(223,171,112,0.24)', overflow: 'hidden',
                    background: 'rgba(7,15,28,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {t.imageUrl || t.imageId
                      ? <img src={t.imageUrl || `/api/media/stream/${t.imageId}`} alt={t.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ color: G, fontSize: 22, fontWeight: 900 }}>{t.fullName?.charAt(0)}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.fullName}</div>
                    <div style={{ color: G, fontSize: 12, marginBottom: 2 }}>{t.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{t.specialization}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(223,171,112,0.06)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
                      ...(t.active
                        ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.22)' }
                        : { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.22)' }),
                    }}>
                      {t.active ? 'نشط' : 'مخفي'}
                    </span>
                    {t.featured && <Star size={14} fill={G} style={{ color: G }} />}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(t)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(223,171,112,0.2)', background: 'rgba(223,171,112,0.06)', color: G, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => handleDelete(t._id)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Teacher Modal */}
      <LuxModal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'تعديل المعلم' : 'إضافة معلم'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, direction: 'rtl' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <LuxInput label="الاسم الكامل *" value={form.fullName} onChange={e => setF('fullName', e.target.value)} placeholder="الشيخ / الأستاذة..." />
            </div>
            <LuxInput label="اللقب / المسمى الوظيفي" value={form.title} onChange={e => setF('title', e.target.value)} placeholder="مقرئ / معلمة قرآن..." />
            <LuxSelect label="الجنس" value={form.gender} onChange={e => setF('gender', e.target.value)}>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </LuxSelect>
          </div>

          {/* Original ImageUpload component */}
          <ImageUpload
            label="صورة المعلم"
            value={form.imageId || form.imageUrl || ''}
            onChange={v => {
              if (v && v.match(/^[0-9a-fA-F]{24}$/)) {
                setForm(f => ({ ...f, imageId: v, imageUrl: '' }))
              } else {
                setForm(f => ({ ...f, imageUrl: v, imageId: '' }))
              }
            }}
            hint="ارفع صورة المعلم أو الصق رابطها"
          />

          <LuxInput label="التخصص" value={form.specialization} onChange={e => setF('specialization', e.target.value)} placeholder="التجويد والقراءات..." />
          <LuxInput label="النبذة التعريفية القصيرة" value={form.shortBio} onChange={e => setF('shortBio', e.target.value)} />
          <LuxInput label="السيرة الذاتية" value={form.bio} onChange={e => setF('bio', e.target.value)} rows={3} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <LuxInput label="الخبرة" value={form.experience} onChange={e => setF('experience', e.target.value)} placeholder="15 سنة..." />
            <LuxInput label="الجنسية" value={form.nationality} onChange={e => setF('nationality', e.target.value)} placeholder="سعودي..." />
            <LuxInput label="اللغات (مفصولة بفاصلة)" value={langDraft} onChange={e => setLangDraft(e.target.value)} placeholder="العربية، الإنجليزية" />
            <LuxInput label="ترتيب العرض" value={form.priorityOrder} onChange={e => setF('priorityOrder', e.target.value)} type="number" />
          </div>

          <LuxInput label="رقم واتساب" value={form.whatsapp} onChange={e => setF('whatsapp', e.target.value)} dir="ltr" />

          <div style={{ display: 'flex', gap: 18 }}>
            {[['active', 'نشط'], ['featured', 'مميز']].map(([k, l]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={!!form[k]} onChange={e => setF(k, e.target.checked)} style={{ accentColor: G }} />
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{l}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
            <GhostBtn onClick={() => setShowForm(false)}>إلغاء</GhostBtn>
            <GoldBtn onClick={handleSave} disabled={saving}>
              {saving
                ? <div style={{ width: 14, height: 14, border: `2px solid ${NAV}55`, borderTopColor: NAV, borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                : <Save size={14} />}
              حفظ
            </GoldBtn>
          </div>
        </div>
      </LuxModal>
    </div>
  )
}

// ─── Students Placeholder ─────────────────────────────────────────────────────
function StudentsPanel() {
  return (
    <Card p={60} style={{ textAlign: 'center' }}>
      <Users size={48} style={{ color: 'rgba(223,171,112,0.18)', margin: '0 auto 16px', display: 'block' }} />
      <h3 style={{ color: '#fff', fontSize: 19, fontWeight: 900, marginBottom: 8 }}>إدارة الطلاب</h3>
      <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 14 }}>قريباً — نظام متكامل لإدارة بيانات الطلاب والاشتراكات</p>
    </Card>
  )
}

// ─── Settings Placeholder ─────────────────────────────────────────────────────
function SettingsPanel() {
  return (
    <Card p={60} style={{ textAlign: 'center' }}>
      <Settings size={48} style={{ color: 'rgba(223,171,112,0.18)', margin: '0 auto 16px', display: 'block' }} />
      <h3 style={{ color: '#fff', fontSize: 19, fontWeight: 900, marginBottom: 8 }}>إعدادات المنصة</h3>
      <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 14 }}>قريباً — إعدادات عامة للمنصة</p>
    </Card>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState('overview')

  const renderPanel = () => {
    if (active === 'courses')  return <CoursesPanel />
    if (active === 'teachers') return <TeachersPanel />
    if (active === 'students') return <StudentsPanel />
    if (active === 'settings') return <SettingsPanel />
    return <OverviewPanel />
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.7} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #040816; }
        ::-webkit-scrollbar-thumb { background: #906130; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #dfab70; }
        ::selection { background: rgba(223,171,112,0.28); color: #dfab70; }
        option { background: #08111f; color: #fff; }
      `}</style>
      <AdminShell active={active} setActive={setActive}>
        {renderPanel()}
      </AdminShell>
    </>
  )
}