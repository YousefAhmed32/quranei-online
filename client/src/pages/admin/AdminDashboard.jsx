import qToast from '../../components/ui/Toast'
import ImageUpload from '../../components/ui/ImageUpload'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, GraduationCap, Users, Settings,
  LogOut, Menu, X, Bell, Search, Plus,
  Eye, EyeOff, Trash2, Edit3, Star, StarOff, Upload,
  Save, Globe, ChevronRight,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { courseService, teacherService } from '../../services/api'
import CoursesPanel from './CoursesPanel'

/* ═══════════════════════════
   TOKENS
═══════════════════════════ */
const G = '#dfab70'
const GD = '#906130'
const NAV = '#040816'

/* ═══════════════════════════
   MICRO COMPONENTS
═══════════════════════════ */
function GoldBtn({ children, onClick, disabled, sm, danger }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: sm ? '7px 14px' : 'clamp(8px,1.5vw,10px) clamp(14px,2.5vw,20px)',
        minHeight: 40,
        borderRadius: 11, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Cairo, sans-serif', fontWeight: 800,
        fontSize: sm ? 12 : 13, opacity: disabled ? 0.55 : 1,
        background: danger ? 'linear-gradient(135deg,#7f1d1d,#ef4444)' : `linear-gradient(135deg,${GD},${G})`,
        color: danger ? '#fff' : NAV,
        boxShadow: disabled ? 'none' : danger ? '0 0 18px rgba(239,68,68,0.3)' : `0 0 18px rgba(223,171,112,0.28)`,
        transition: 'box-shadow .2s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </motion.button>
  )
}

function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      minHeight: 40,
      padding: '9px 18px', borderRadius: 11,
      border: '1px solid rgba(223,171,112,0.12)',
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
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(223,171,112,0.35),transparent)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  )
}

function LuxInput({ label, value, onChange, placeholder, type = 'text', rows, dir, disabled, style: s }) {
  const [focused, setFocused] = useState(false)
  const Tag = rows ? 'textarea' : 'input'
  return (
    <div>
      {label && <div style={{ color: G, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>{label}</div>}
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

/* ── MODAL — mobile-safe max-height & padding ── */
function LuxModal({ open, onClose, title, children, wide }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            overflowY: 'auto',
            padding: 'clamp(16px, 5vw, 40px) clamp(12px, 4vw, 20px)',
          }}
        >
          <motion.div
            initial={{ scale: .9, y: 24 }} animate={{ scale: 1, y: 0 }}
            exit={{ scale: .9, y: 24 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: .35 }}
            style={{
              width: '100%', maxWidth: wide ? 720 : 560,
              background: 'rgba(7,15,28,0.98)',
              border: '1px solid rgba(223,171,112,0.22)',
              borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 36px 90px rgba(0,0,0,0.85)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'rgba(17,40,71,0.5)',
              borderBottom: '1px solid rgba(223,171,112,0.1)',
            }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>{title}</span>
              <button onClick={onClose} style={{
                width: 32, height: 32, borderRadius: 8, border: 'none',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
              >
                <X size={14} />
              </button>
            </div>
            <div style={{
              padding: 'clamp(16px, 3.5vw, 24px)',
              maxHeight: 'calc(100dvh - 140px)',
              overflowY: 'auto',
            }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════
   SIDEBAR ITEMS
═══════════════════════════ */
const SIDEBAR = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'courses', label: 'الدورات', icon: BookOpen },
  { id: 'teachers', label: 'المعلمون', icon: GraduationCap },
  { id: 'students', label: 'الطلاب', icon: Users },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
]

/* ═══════════════════════════
   ADMIN SHELL
   — Desktop: collapsible sidebar
   — Mobile:  drawer overlay
═══════════════════════════ */
function AdminShell({ active, setActive, children }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  // desktop sidebar open/closed
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false)

  // close drawer on nav
  const handleNav = (id) => { setActive(id); setDrawerOpen(false) }
  const handleLogout = () => { logout(); navigate('/login') }

  // sidebar content (shared between desktop and drawer)
  const SidebarContent = ({ collapsed }) => (
    <>
      <nav style={{ flex: 1, padding: '14px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {SIDEBAR.map((item, idx) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNav(item.id)}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 11, padding: '12px 18px',
                background: isActive ? 'rgba(223,171,112,0.07)' : 'transparent',
                border: 'none',
                borderRight: isActive ? `2.5px solid ${G}` : '2.5px solid transparent',
                color: isActive ? G : 'rgba(255,255,255,0.36)',
                cursor: 'pointer', transition: 'all .22s ease',
                position: 'relative', minHeight: 44,
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; e.currentTarget.style.background = 'rgba(223,171,112,0.04)' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.36)'; e.currentTarget.style.background = 'transparent' } }}
            >
              {isActive && (
                <motion.div layoutId={`nav-glow-${collapsed ? 'd' : 'm'}`} style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg,rgba(223,171,112,0.09) 0%,transparent 100%)',
                }} transition={{ duration: .26 }} />
              )}
              <div style={{ flexShrink: 0, position: 'relative' }}>
                {isActive && <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: 'rgba(223,171,112,0.11)' }} />}
                <Icon size={17} />
              </div>
              {!collapsed && (
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* User row */}
      <div style={{ padding: 14, flexShrink: 0, borderTop: '1px solid rgba(223,171,112,0.08)' }}>
        {!collapsed ? (
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
            <button onClick={handleLogout}
              style={{ padding: 7, borderRadius: 8, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', transition: 'color .2s', minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', justifyContent: 'center',
            padding: '10px', borderRadius: 10, border: 'none',
            background: 'transparent', color: 'rgba(255,255,255,0.28)', cursor: 'pointer',
            minHeight: 44, alignItems: 'center',
          }}>
            <LogOut size={15} />
          </button>
        )}
      </div>
    </>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', direction: 'rtl', background: NAV, fontFamily: 'Cairo, sans-serif' }}>

      <style>{`
        /* ── Admin responsive rules ── */

        /* Mobile drawer */
        .admin-drawer-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.72); backdrop-filter: blur(6px);
        }
        .admin-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 51;
          width: 260px; max-width: 85vw;
          background: rgba(4,8,22,0.97);
          border-left: 1px solid rgba(223,171,112,0.1);
          display: flex; flex-direction: column;
          box-shadow: -8px 0 40px rgba(0,0,0,0.5);
        }

        /* Desktop sidebar — hidden on mobile */
        .admin-sidebar-desktop {
          display: none;
        }
        @media (min-width: 768px) {
          .admin-sidebar-desktop { display: flex; }
        }

        /* Mobile hamburger — hidden on desktop */
        .admin-mobile-menu {
          display: flex;
        }
        @media (min-width: 768px) {
          .admin-mobile-menu { display: none; }
        }

        /* Topbar search — hide on small screens */
        .admin-topbar-search {
          display: none;
        }
        @media (min-width: 640px) {
          .admin-topbar-search { display: flex; }
        }

        /* Stats grid responsive */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(10px, 2.5vw, 14px);
        }
        @media (min-width: 640px) {
          .admin-stats-grid { grid-template-columns: repeat(4, 1fr); }
        }

        /* Quick actions grid */
        .admin-quick-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(10px, 2.5vw, 12px);
        }
        @media (min-width: 640px) {
          .admin-quick-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        }

        /* Teachers cards grid */
        .admin-teachers-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 480px) { .admin-teachers-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 960px) { .admin-teachers-grid { grid-template-columns: repeat(3, 1fr); } }

        /* Courses form grid — responsive */
        .admin-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 480px) {
          .admin-form-grid-2 { grid-template-columns: 1fr 1fr; }
        }

        @keyframes adminPulse { 0%,100%{opacity:.35} 50%{opacity:.62} }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #040816; }
        ::-webkit-scrollbar-thumb { background: #906130; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #dfab70; }
        ::selection { background: rgba(223,171,112,0.28); color: #dfab70; }
        option { background: #08111f; color: #fff; }
      `}</style>

      {/* ── Ambient BG ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse at 15% 20%, rgba(223,171,112,0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 80%, rgba(8,17,31,0.7) 0%, transparent 55%)
        `,
      }} />

      {/* ── Desktop Sidebar ── */}
      <motion.aside
        className="admin-sidebar-desktop"
        animate={{ width: sidebarOpen ? 240 : 70 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flexShrink: 0, flexDirection: 'column', zIndex: 30,
          overflow: 'hidden', position: 'relative',
          background: 'rgba(4,8,22,0.94)',
          backdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(223,171,112,0.09)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 100, height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(223,171,112,0.5),transparent)',
        }} />

        {/* Logo row */}
        <div style={{
          height: 72, display: 'flex', alignItems: 'center',
          padding: '0 14px', gap: 10, flexShrink: 0,
          borderBottom: '1px solid rgba(223,171,112,0.08)',
        }}>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', background: '#fff',
                    border: '1px solid rgba(223,171,112,0.22)',
                    boxShadow: '0 0 20px rgba(223,171,112,0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', transition: 'transform .4s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img src="/image/logo-png.png" alt="Qurani Online" style={{ width: '82%', height: '82%', objectFit: 'contain' }} />
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
              display: 'flex', minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.color = G}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(223,171,112,0.42)'}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <SidebarContent collapsed={!sidebarOpen} />
      </motion.aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="admin-drawer-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="admin-drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 38 }}
            >
              <div style={{
                height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px', borderBottom: '1px solid rgba(223,171,112,0.08)',
              }}>
                <span style={{ color: G, fontWeight: 800, fontSize: 14 }}>القائمة</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{ width: 36, height: 36, borderRadius: 9, border: 'none', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} />
                </button>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <SidebarContent collapsed={false} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* Topbar */}
        <div style={{
          height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 clamp(14px, 3vw, 28px)',
          background: 'rgba(4,8,22,0.88)', backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(223,171,112,0.08)',
          boxShadow: '0 4px 28px rgba(0,0,0,0.3)',
        }}>
          {/* Mobile hamburger */}
          <button
            className="admin-mobile-menu"
            onClick={() => setDrawerOpen(true)}
            style={{
              width: 38, height: 38, borderRadius: 10, border: 'none',
              background: 'rgba(223,171,112,0.06)', color: G, cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Menu size={17} />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <motion.h1
              key={active}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{ color: '#fff', fontSize: 'clamp(13px, 2.5vw, 16px)', fontWeight: 900, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {SIDEBAR.find(s => s.id === active)?.label}
            </motion.h1>
            <div style={{ color: 'rgba(223,171,112,0.38)', fontSize: 10, marginTop: 1 }}>قرآني أونلاين</div>
          </div>

          {/* Search — hidden on xs */}
          <div
            className="admin-topbar-search"
            style={{
              alignItems: 'center', gap: 8,
              maxWidth: 260, flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(223,171,112,0.1)',
              borderRadius: 10, padding: '7px 12px',
            }}
          >
            <Search size={13} style={{ color: 'rgba(223,171,112,0.42)', flexShrink: 0 }} />
            <input placeholder="بحث..." style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: 'rgba(255,255,255,0.7)', fontSize: 12, flex: 1,
              fontFamily: 'Cairo, sans-serif', direction: 'rtl', minWidth: 0,
            }} />
          </div>

          {/* Bell */}
          <button style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'rgba(223,171,112,0.05)', border: '1px solid rgba(223,171,112,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(223,171,112,0.55)', cursor: 'pointer', position: 'relative',
            transition: 'all .2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.3)'; e.currentTarget.style.color = G }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.1)'; e.currentTarget.style.color = 'rgba(223,171,112,0.55)' }}
          >
            <Bell size={15} />
            <div style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: G }} />
          </button>

          {/* View site — icon-only on xs */}
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            padding: '7px 12px', borderRadius: 10,
            border: '1px solid rgba(223,171,112,0.14)',
            color: 'rgba(223,171,112,0.65)', fontSize: 12, fontWeight: 600,
            textDecoration: 'none', transition: 'all .2s',
            background: 'rgba(223,171,112,0.03)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.38)'; e.currentTarget.style.color = G }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.14)'; e.currentTarget.style.color = 'rgba(223,171,112,0.65)' }}
          >
            <Globe size={13} />
            <span style={{ display: 'none' }} className="sm:inline">عرض الموقع</span>
          </Link>
        </div>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px, 4vw, 28px) clamp(12px, 3vw, 30px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: .26, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

/* ═══════════════════════════
   OVERVIEW PANEL
═══════════════════════════ */
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
    { label: 'إجمالي الدورات', value: stats.courses, icon: BookOpen, color: G },
    { label: 'إجمالي المعلمين', value: stats.teachers, icon: GraduationCap, color: '#818cf8' },
    { label: 'الطلاب المسجلون', value: '—', icon: Users, color: '#22c55e' },
    { label: 'التقييم العام', value: '4.9★', icon: Star, color: G },
  ]

  const QUICK = [
    { label: 'إضافة دورة', icon: Plus, desc: 'أنشئ دورة قرآنية' },
    { label: 'إضافة معلم', icon: GraduationCap, desc: 'سجّل معلماً جديداً' },
    { label: 'إدارة الوسائط', icon: Upload, desc: 'رفع الصور والملفات' },
    { label: 'عرض الموقع', icon: Globe, desc: 'صفحة الدورات العامة' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 3.5vw, 26px)' }}>

      {/* Welcome card */}
      <Card hover={false} style={{ background: 'linear-gradient(135deg,rgba(17,42,78,0.65) 0%,rgba(4,8,22,0.85) 100%)', borderColor: 'rgba(223,171,112,0.15)' }} p={24}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg,${G},${GD})`, borderRadius: '0 0 0 18px' }} />
        <div style={{ color: 'rgba(223,171,112,0.48)', fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', marginBottom: 6 }}>﷽</div>
        <h2 style={{ color: '#fff', fontSize: 'clamp(15px, 3vw, 20px)', fontWeight: 900, marginBottom: 4 }}>مرحباً بك في لوحة التحكم</h2>
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 'clamp(11px, 2vw, 13px)' }}>قرآني أونلاين — منصة تعليم القرآن الكريم الاحترافية</p>
      </Card>

      {/* Stats */}
      <div className="admin-stats-grid">
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}>
              <Card p={18}>
                <div style={{ position: 'absolute', top: -22, right: -22, width: 90, height: 90, borderRadius: '50%', background: `radial-gradient(circle,${s.color}18 0%,transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ width: 38, height: 38, borderRadius: 10, marginBottom: 12, background: `linear-gradient(135deg,${s.color}22,${s.color}09)`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} style={{ color: s.color }} />
                </div>
                <div style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(223,171,112,0.52)', fontWeight: 600, marginTop: 5 }}>{s.label}</div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick actions */}
      <Card hover={false} p={20}>
        <h2 style={{ fontWeight: 800, color: '#fff', marginBottom: 14, fontSize: 14 }}>وصول سريع</h2>
        <div className="admin-quick-grid">
          {QUICK.map((q, i) => {
            const Icon = q.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 + i * .07 }}>
                <Card p={16} style={{ cursor: 'pointer' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, marginBottom: 10, background: 'rgba(223,171,112,0.08)', border: '1px solid rgba(223,171,112,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={14} style={{ color: G }} />
                  </div>
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{q.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{q.desc}</div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

/* ═══════════════════════════
   COURSES PANEL
   (form logic identical, layout improved)
═══════════════════════════ */
const EMPTY_COURSE = {
  title: '', slug: '', shortDescription: '', description: '', thumbnail: '', heroVideo: '',
  category: 'quran', level: 'beginner', duration: '', lessonsCount: 0,
  teacherName: '', pricingType: 'contact', price: 0, currency: 'ريال', showPrice: false,
  whatsapp: '', ctaText: 'اشترك الآن', isPublished: false, featured: false, priorityOrder: '',
  learningOutcomes: [], targetStudents: [], highlights: [], tags: [],
}

if (active === 'courses') return <CoursesPanel />


/* ═══════════════════════════
   TEACHERS PANEL
═══════════════════════════ */
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
  const openEdit = t => {
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

  const handleDelete = async id => {
    if (!confirm('حذف المعلم؟')) return
    await teacherService.adminDelete(id).then(load)
    qToast.success('تم الحذف')
  }

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 'clamp(15px, 3vw, 19px)', fontWeight: 900 }}>إدارة المعلمين</h2>
          <div style={{ color: 'rgba(223,171,112,0.5)', fontSize: 12, marginTop: 2 }}>{teachers.length} معلم</div>
        </div>
        <GoldBtn onClick={openCreate}><Plus size={13} /> إضافة معلم</GoldBtn>
      </div>

      {loading ? (
        <div className="admin-teachers-grid">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} style={{ height: 120, borderRadius: 18, background: 'rgba(17,40,71,0.3)', animation: 'adminPulse 1.5s infinite' }} />
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <Card p={48} style={{ textAlign: 'center' }}>
          <GraduationCap size={40} style={{ color: 'rgba(223,171,112,0.2)', margin: '0 auto 10px', display: 'block' }} />
          <p style={{ color: 'rgba(255,255,255,0.28)' }}>لا يوجد معلمون بعد.</p>
        </Card>
      ) : (
        <div className="admin-teachers-grid">
          {teachers.map((t, i) => (
            <motion.div key={t._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card p={18}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, flexShrink: 0, border: '1px solid rgba(223,171,112,0.24)', overflow: 'hidden', background: 'rgba(7,15,28,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.imageUrl || t.imageId
                      ? <img src={t.imageUrl || `https://api.quranei.com/api/media/stream/${t.imageId}`}
 alt={t.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ color: G, fontSize: 20, fontWeight: 900 }}>{t.fullName?.charAt(0)}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 800, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.fullName}</div>
                    <div style={{ color: G, fontSize: 11, marginBottom: 2 }}>{t.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{t.specialization}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(223,171,112,0.06)', paddingTop: 11 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      ...(t.active
                        ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.22)' }
                        : { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.22)' }),
                    }}>
                      {t.active ? 'نشط' : 'مخفي'}
                    </span>
                    {t.featured && <Star size={13} fill={G} style={{ color: G }} />}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[
                      { fn: () => openEdit(t), icon: Edit3, col: 'rgba(223,171,112,0.2)', bg: 'rgba(223,171,112,0.06)', hbg: 'rgba(223,171,112,0.14)', tc: G },
                      { fn: () => handleDelete(t._id), icon: Trash2, col: 'rgba(239,68,68,0.2)', bg: 'rgba(239,68,68,0.06)', hbg: 'rgba(239,68,68,0.14)', tc: '#ef4444' },
                    ].map(({ fn, icon: Icon, col, bg, hbg, tc }, bi) => (
                      <button key={bi} onClick={fn} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${col}`, background: bg, color: tc, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s' }}
                        onMouseEnter={e => e.currentTarget.style.background = hbg}
                        onMouseLeave={e => e.currentTarget.style.background = bg}
                      >
                        <Icon size={12} />
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <LuxModal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'تعديل المعلم' : 'إضافة معلم'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, direction: 'rtl' }}>
          <div className="admin-form-grid-2">
            <div style={{ gridColumn: '1/-1' }}>
              <LuxInput label="الاسم الكامل *" value={form.fullName} onChange={e => setF('fullName', e.target.value)} />
            </div>
            <LuxInput label="اللقب" value={form.title} onChange={e => setF('title', e.target.value)} />
            <LuxSelect label="الجنس" value={form.gender} onChange={e => setF('gender', e.target.value)}>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </LuxSelect>
          </div>
          <ImageUpload label="صورة المعلم" value={form.imageId || form.imageUrl || ''}
            onChange={v => {
              if (v && v.match(/^[0-9a-fA-F]{24}$/)) setForm(f => ({ ...f, imageId: v, imageUrl: '' }))
              else setForm(f => ({ ...f, imageUrl: v, imageId: '' }))
            }}
            hint="ارفع صورة المعلم أو الصق رابطها"
          />
          <LuxInput label="التخصص" value={form.specialization} onChange={e => setF('specialization', e.target.value)} />
          <LuxInput label="النبذة القصيرة" value={form.shortBio} onChange={e => setF('shortBio', e.target.value)} />
          <LuxInput label="السيرة الذاتية" value={form.bio} onChange={e => setF('bio', e.target.value)} rows={3} />
          <div className="admin-form-grid-2">
            <LuxInput label="الخبرة" value={form.experience} onChange={e => setF('experience', e.target.value)} />
            <LuxInput label="الجنسية" value={form.nationality} onChange={e => setF('nationality', e.target.value)} />
            <LuxInput label="اللغات (مفصولة بفاصلة)" value={langDraft} onChange={e => setLangDraft(e.target.value)} />
            <LuxInput label="ترتيب العرض" value={form.priorityOrder} onChange={e => setF('priorityOrder', e.target.value)} type="number" />
          </div>
          <LuxInput label="رقم واتساب" value={form.whatsapp} onChange={e => setF('whatsapp', e.target.value)} dir="ltr" />
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['active', 'نشط'], ['featured', 'مميز']].map(([k, l]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minHeight: 32 }}>
                <input type="checkbox" checked={!!form[k]} onChange={e => setF(k, e.target.checked)} style={{ accentColor: G, width: 15, height: 15 }} />
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{l}</span>
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
            <GhostBtn onClick={() => setShowForm(false)}>إلغاء</GhostBtn>
            <GoldBtn onClick={handleSave} disabled={saving}>
              {saving ? <div style={{ width: 13, height: 13, border: `2px solid ${NAV}55`, borderTopColor: NAV, borderRadius: '50%', animation: 'spin .7s linear infinite' }} /> : <Save size={13} />}
              حفظ
            </GoldBtn>
          </div>
        </div>
      </LuxModal>
    </div>
  )
}

function StudentsPanel() {
  return (
    <Card p={48} style={{ textAlign: 'center' }}>
      <Users size={44} style={{ color: 'rgba(223,171,112,0.18)', margin: '0 auto 14px', display: 'block' }} />
      <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 900, marginBottom: 6 }}>إدارة الطلاب</h3>
      <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13 }}>قريباً — نظام متكامل لإدارة بيانات الطلاب</p>
    </Card>
  )
}

function SettingsPanel() {
  return (
    <Card p={48} style={{ textAlign: 'center' }}>
      <Settings size={44} style={{ color: 'rgba(223,171,112,0.18)', margin: '0 auto 14px', display: 'block' }} />
      <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 900, marginBottom: 6 }}>إعدادات المنصة</h3>
      <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13 }}>قريباً — إعدادات عامة للمنصة</p>
    </Card>
  )
}

/* ═══════════════════════════
   ROOT
═══════════════════════════ */
export default function AdminDashboard() {
  const [active, setActive] = useState('overview')

  const renderPanel = () => {
    if (active === 'courses') return <CoursesPanel />
    if (active === 'teachers') return <TeachersPanel />
    if (active === 'students') return <StudentsPanel />
    if (active === 'settings') return <SettingsPanel />
    return <OverviewPanel />
  }

  return (
    <AdminShell active={active} setActive={setActive}>
      {renderPanel()}
    </AdminShell>
  )
}