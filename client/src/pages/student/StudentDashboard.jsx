import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, MessageCircle, Edit3, Mail, Phone, Globe,
  Calendar, Package, Shield, ChevronDown, X, Check,
  User, Sparkles,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'
import { toast } from 'react-hot-toast'

// ─── Constants ────────────────────────────────────────────────────────────────
const GOLD = '#D6A55B'
const DARK = '#07111F'

const STATUS_MAP = {
  active:   { label: 'مفعّل',         color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
  pending:  { label: 'قيد المراجعة',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  inactive: { label: 'غير مفعّل',     color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.25)' },
  expired:  { label: 'منتهي',         color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
}

const PACKAGE_MAP = {
  gold:    { label: 'الباقة الذهبية', icon: '👑' },
  silver:  { label: 'الباقة الفضية',  icon: '⭐' },
  basic:   { label: 'الباقة الأساسية', icon: '📖' },
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom'

function Logo() {
  return (
    <Link
      to="/"
      style={{
        position: 'relative',
        display: 'inline-block',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -5,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(214,165,91,0.2) 0%, transparent 70%)',
          filter: 'blur(7px)',
        }}
      />

      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          border: '1.5px solid rgba(214,165,91,0.45)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 0 3px rgba(214,165,91,0.08)',
          transition: 'all .25s ease',
        }}
      >
        <img
          src="/image/logo-white.jpeg"
          alt="Qurani"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    </Link>
  )
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, delay = 0 }) {
  if (!value) return null
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px', borderRadius: 14,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(214,165,91,0.05)'
        e.currentTarget.style.borderColor = 'rgba(214,165,91,0.18)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'rgba(214,165,91,0.08)',
        border: '1px solid rgba(214,165,91,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: GOLD,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 11, marginBottom: 2, letterSpacing: '0.04em' }}>
          {label}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, fontWeight: 500, wordBreak: 'break-word' }}>
          {value}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/auth/profile', form)
      onSave(form)
      toast.success('تم تحديث البيانات بنجاح')
      onClose()
    } catch {
      toast.error('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: 420, borderRadius: 24,
          background: 'rgba(7,17,31,0.92)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(214,165,91,0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
          padding: '32px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: 0 }}>تعديل البيانات</h3>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)',
          }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'الاسم الكامل', key: 'name', placeholder: 'أدخل اسمك الكامل' },
            { label: 'رقم الهاتف', key: 'phone', placeholder: '+966 5x xxx xxxx', dir: 'ltr' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 12, marginBottom: 7, letterSpacing: '0.03em' }}>
                {field.label}
              </label>
              <input
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                dir={field.dir || 'rtl'}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)', outline: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(214,165,91,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1, padding: '12px', borderRadius: 12, border: 'none',
              background: `linear-gradient(135deg, #8a5a20, ${GOLD}, #c49240)`,
              color: DARK, fontWeight: 800, fontSize: 14, fontFamily: 'inherit',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              boxShadow: '0 4px 16px rgba(214,165,91,0.3)',
            }}
          >
            {saving ? '...' : <><Check size={15} /> حفظ التغييرات</>}
          </button>
          <button onClick={onClose} style={{
            padding: '12px 18px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', fontSize: 14,
          }}>إلغاء</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Logout Confirm ───────────────────────────────────────────────────────────
function LogoutConfirm({ onClose, onConfirm }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        style={{
          width: '100%', maxWidth: 360, borderRadius: 22,
          background: 'rgba(7,17,31,0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(239,68,68,0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          padding: '32px 28px', textAlign: 'center',
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LogOut size={22} style={{ color: '#ef4444' }} />
        </div>
        <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>تسجيل الخروج</h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '0 0 24px', lineHeight: 1.6 }}>
          هل أنت متأكد من تسجيل الخروج من حسابك؟
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '11px', borderRadius: 11, cursor: 'pointer',
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
          }}>نعم، خروج</button>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: 11, cursor: 'pointer', fontFamily: 'inherit',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', fontSize: 14,
          }}>إلغاء</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user, logout, updateUser } = useAuthStore()
  const [showEdit, setShowEdit] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  const status = STATUS_MAP[user?.subscriptionStatus] || STATUS_MAP.pending
  const pkg = PACKAGE_MAP[user?.selectedPackage] || PACKAGE_MAP.basic

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const handleSave = (data) => updateUser(data)

  const initials = user?.name
    ? user.name.trim().split(' ').slice(0, 2).map(n => n[0]).join('')
    : 'ط'

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at 20% 0%, rgba(26,58,92,0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(144,97,48,0.15) 0%, transparent 50%),
        #07111F
      `,
      fontFamily: "'Cairo', 'Tajawal', sans-serif",
      direction: 'rtl',
    }}>

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(7,17,31,0.75)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(214,165,91,0.1)',
        }}
      >
   <Link
  to="/"
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all .25s ease',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-1px)'
    e.currentTarget.style.opacity = '0.92'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.opacity = '1'
  }}
>
  <Logo />

  <div>
    <div
      style={{
        color: GOLD,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      Qurani
    </div>

    <div
      style={{
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
      }}
    >
      Online
    </div>
  </div>
</Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="https://wa.me/201008148164"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 10,
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              color: '#22c55e', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.1)'}
          >
            <MessageCircle size={15} />
            واتساب
          </a>

          <button
            onClick={() => setShowLogout(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.18)',
              color: 'rgba(239,68,68,0.7)', fontSize: 13, fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.14)'
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.07)'
              e.currentTarget.style.color = 'rgba(239,68,68,0.7)'
            }}
          >
            <LogOut size={14} />
            خروج
          </button>
        </div>
      </motion.nav>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 60px' }}>

        {/* ── PENDING BANNER ── */}
        <AnimatePresence>
          {user?.subscriptionStatus === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: 24, padding: '14px 18px',
                borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
              }}
            >
              <div style={{ fontSize: 20, flexShrink: 0 }}>⏳</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>حسابك قيد المراجعة</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 2 }}>
                  سيتواصل معك فريقنا عبر واتساب لتفعيل الوصول الكامل
                </div>
              </div>
              <a
                href="https://wa.me/201008148164"
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '7px 14px', borderRadius: 9, textDecoration: 'none',
                  background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                  color: '#f59e0b', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                }}
              >
                تواصل معنا
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PROFILE HERO CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: 24, marginBottom: 20, overflow: 'hidden',
            background: 'rgba(7,17,31,0.6)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(214,165,91,0.18)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Hero top strip */}
          <div style={{
            height: 90,
            background: `
              linear-gradient(135deg, rgba(26,58,92,0.8) 0%, rgba(144,97,48,0.4) 100%)
            `,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative pattern */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(214,165,91,0.12) 0%, transparent 40%),
                                radial-gradient(circle at 80% 50%, rgba(214,165,91,0.06) 0%, transparent 40%)`,
            }} />
            {/* Subtle Islamic geometric hint */}
            <svg style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', opacity: 0.08 }}
              width="80" height="80" viewBox="0 0 80 80">
              <polygon points="40,5 75,27.5 75,52.5 40,75 5,52.5 5,27.5" fill="none" stroke="#D6A55B" strokeWidth="1.5" />
              <polygon points="40,15 65,30 65,50 40,65 15,50 15,30" fill="none" stroke="#D6A55B" strokeWidth="1" />
            </svg>
          </div>

          {/* Avatar + Info */}
          <div style={{ padding: '0 28px 28px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{ marginTop: -44, marginBottom: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: -4, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(214,165,91,0.25) 0%, transparent 70%)',
                  filter: 'blur(6px)',
                }} />
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  border: '3px solid rgba(214,165,91,0.5)',
                  background: 'rgba(214,165,91,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', position: 'relative',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}>
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: GOLD, fontSize: 28, fontWeight: 800 }}>{initials}</span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setShowEdit(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 11, cursor: 'pointer',
                  background: 'rgba(214,165,91,0.08)',
                  border: '1px solid rgba(214,165,91,0.25)',
                  color: GOLD, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  marginTop: 48,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(214,165,91,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(214,165,91,0.08)'}
              >
                <Edit3 size={14} />
                تعديل
              </button>
            </div>

            {/* Name + subtitle */}
            <div style={{ marginBottom: 16 }}>
              <h1 style={{
                color: '#fff', fontSize: 22, fontWeight: 800,
                margin: '0 0 4px', letterSpacing: '-0.01em',
              }}>
                {user?.name || 'الطالب'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} style={{ color: GOLD, opacity: 0.7 }} />
                طالب في رحلة القرآن الكريم
              </p>

              {/* Badges row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {/* Status badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 20,
                  background: status.bg, border: `1px solid ${status.border}`,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: status.color }} />
                  <span style={{ color: status.color, fontSize: 12, fontWeight: 600 }}>{status.label}</span>
                </div>

                {/* Package badge */}
                {user?.selectedPackage && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 20,
                    background: 'rgba(214,165,91,0.1)',
                    border: '1px solid rgba(214,165,91,0.25)',
                  }}>
                    <span style={{ fontSize: 13 }}>{pkg.icon}</span>
                    <span style={{ color: GOLD, fontSize: 12, fontWeight: 600 }}>{pkg.label}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── INFO CARDS GRID ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            borderRadius: 22, padding: '24px',
            background: 'rgba(7,17,31,0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(214,165,91,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
            <h2 style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', margin: 0 }}>
              المعلومات الشخصية
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <InfoRow icon={<Mail size={16} />} label="البريد الإلكتروني" value={user?.email} delay={0.25} />
            <InfoRow icon={<Phone size={16} />} label="رقم الهاتف" value={user?.phone || '—'} delay={0.3} />
            <InfoRow icon={<Globe size={16} />} label="الدولة" value={user?.country} delay={0.35} />
            <InfoRow icon={<Calendar size={16} />} label="تاريخ الانضمام" value={formatDate(user?.createdAt)} delay={0.4} />
            <InfoRow icon={<Package size={16} />} label="الباقة" value={pkg.label} delay={0.45} />
            <InfoRow icon={<Shield size={16} />} label="حالة الاشتراك" value={status.label} delay={0.5} />
          </div>
        </motion.div>

        {/* ── ACTIONS CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          style={{
            borderRadius: 22, padding: '24px',
            background: 'rgba(7,17,31,0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(214,165,91,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
            <h2 style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', margin: 0 }}>
              الإجراءات
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* WhatsApp */}
            <a
              href="https://wa.me/201008148164"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '15px 18px', borderRadius: 14,
                background: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.2)',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.13)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.07)'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MessageCircle size={17} style={{ color: '#22c55e' }} />
              </div>
              <div>
                <div style={{ color: '#22c55e', fontSize: 14, fontWeight: 600 }}>التواصل عبر واتساب</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 1 }}>للدعم وتفعيل الاشتراك</div>
              </div>
            </a>

            {/* Edit Profile */}
            <button
              onClick={() => setShowEdit(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '15px 18px', borderRadius: 14, cursor: 'pointer',
                background: 'rgba(214,165,91,0.06)',
                border: '1px solid rgba(214,165,91,0.18)',
                transition: 'all 0.2s', fontFamily: 'inherit', width: '100%', textAlign: 'right',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(214,165,91,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(214,165,91,0.06)'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(214,165,91,0.1)', border: '1px solid rgba(214,165,91,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Edit3 size={16} style={{ color: GOLD }} />
              </div>
              <div>
                <div style={{ color: GOLD, fontSize: 14, fontWeight: 600 }}>تعديل البيانات</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 1 }}>تحديث الاسم ورقم الهاتف</div>
              </div>
            </button>

            {/* Logout */}
            <button
              onClick={() => setShowLogout(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '15px 18px', borderRadius: 14, cursor: 'pointer',
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.15)',
                transition: 'all 0.2s', fontFamily: 'inherit', width: '100%', textAlign: 'right',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LogOut size={16} style={{ color: '#ef4444' }} />
              </div>
              <div>
                <div style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>تسجيل الخروج</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 1 }}>الخروج من الحساب الحالي</div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* ── FOOTER VERSE ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ textAlign: 'center', marginTop: 32, padding: '0 20px' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12,
          }}>
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to right, transparent, rgba(214,165,91,0.25))' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(214,165,91,0.4)' }} />
            <div style={{ flex: 1, height: '0.5px', background: 'linear-gradient(to left, transparent, rgba(214,165,91,0.25))' }} />
          </div>
          <p style={{ color: 'rgba(214,165,91,0.5)', fontSize: 14, fontStyle: 'italic', margin: '0 0 4px' }}>
            ﴿وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ﴾
          </p>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, margin: 0 }}>سورة القمر • الآية ١٧</p>
        </motion.div>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showEdit && (
          <EditModal user={user} onClose={() => setShowEdit(false)} onSave={handleSave} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showLogout && (
          <LogoutConfirm onClose={() => setShowLogout(false)} onConfirm={handleLogout} />
        )}
      </AnimatePresence>

      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 480px) {
          h1 { font-size: 19px !important; }
        }
      `}</style>
    </div>
  )
}