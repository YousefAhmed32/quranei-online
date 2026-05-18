import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader, Mail, Lock, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/authStore'

const GOLD = '#D6A55B'
const DARK = '#07111F'

function GoldInput({ label, icon, type, value, onChange, placeholder, dir = 'ltr', extra }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{
        display: 'block',
        color: focused ? 'rgba(214,165,91,0.85)' : 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginBottom: 7,
        fontWeight: 500,
        letterSpacing: '0.02em',
        transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
          color: focused ? GOLD : 'rgba(255,255,255,0.25)',
          transition: 'color 0.25s', pointerEvents: 'none', zIndex: 1,
        }}>
          {icon}
        </div>
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder} dir={dir}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '13px 44px 13px 44px',
            borderRadius: 14,
            fontSize: 14,
            background: focused
              ? 'rgba(214,165,91,0.06)'
              : 'rgba(255,255,255,0.05)',
            border: focused
              ? '1px solid rgba(214,165,91,0.55)'
              : '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.92)',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            transition: 'all 0.25s',
            backdropFilter: 'blur(4px)',
            boxShadow: focused
              ? '0 0 0 3px rgba(214,165,91,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
              : 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        />
        {extra && (
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
            {extra}
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const { login, quickLogin, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form.email, form.password)
    if (result.success) {
      toast.success('مرحباً بعودتك!')
      const user = useAuthStore.getState().user
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard')
    } else {
      toast.error(result.message)
    }
  }

  const handleQuickLogin = async (role) => {
    const result = await quickLogin(role)
    if (result.success) {
      toast.success('تم تسجيل الدخول بنجاح')
      navigate(role === 'admin' ? '/admin' : '/dashboard')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      direction: 'rtl',
      fontFamily: "'Tajawal', 'Segoe UI', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>

      {/* ── FULL SCREEN BACKGROUND ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url('./image/login-2.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
      }} />

      {/* ── CINEMATIC DARK OVERLAY ── */}
      {/* <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          linear-gradient(
            135deg,
            rgba(3,7,18,0.82) 0%,
            rgba(7,17,31,0.70) 40%,
            rgba(3,7,18,0.78) 100%
          )
        `,
        zIndex: 1,
      }} /> */}

      {/* ── VIGNETTE ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(
            ellipse at center,
            transparent 30%,
            rgba(0,0,0,0.65) 100%
          )
        `,
        zIndex: 2,
      }} />

      {/* ── GOLD ATMOSPHERIC GLOW ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse at 15% 50%, rgba(214,165,91,0.12) 0%, transparent 45%),
          radial-gradient(ellipse at 85% 20%, rgba(214,165,91,0.07) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 90%, rgba(26,58,92,0.35) 0%, transparent 50%)
        `,
        zIndex: 3,
        pointerEvents: 'none',
      }} />

      {/* ── FLOATING GLASS CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 460,
          margin: '0 auto',
          padding: '0 16px',
        }}
      >
        {/* Card outer glow */}
        <div style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 28,
          background: 'linear-gradient(135deg, rgba(214,165,91,0.3), transparent 50%, rgba(214,165,91,0.1))',
          filter: 'blur(1px)',
          zIndex: -1,
        }} />

        <div style={{
          padding: '44px 40px 36px',
          borderRadius: 26,
          background: 'rgba(7,17,31,0.55)',
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          border: '1px solid rgba(214,165,91,0.22)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.55),
            0 32px 80px rgba(0,0,0,0.45),
            0 0 0 0.5px rgba(255,255,255,0.04),
            inset 0 1px 0 rgba(255,255,255,0.07),
            inset 0 -1px 0 rgba(0,0,0,0.2)
          `,
        }}>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              {/* Logo glow ring */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(214,165,91,0.2) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }} />
                <div style={{
                  width: 82, height: 82, borderRadius: '50%',
                  border: '1.5px solid rgba(214,165,91,0.45)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 0 0 4px rgba(214,165,91,0.08), 0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  <img
                    src="/image/logo-white.jpeg"
                    alt="Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>

            <h1 style={{
              color: '#fff',
              fontSize: 24,
              fontWeight: 800,
              margin: '0 0 6px',
              letterSpacing: '-0.01em',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}>
              مرحباً بعودتك
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.42)',
              fontSize: 13,
              margin: 0,
              letterSpacing: '0.01em',
            }}>
              سجّل دخولك لمتابعة رحلتك القرآنية
            </p>

            {/* Decorative gold line */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, marginTop: 14,
            }}>
              <div style={{ width: 28, height: '0.5px', background: 'rgba(214,165,91,0.35)' }} />
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(214,165,91,0.5)' }} />
              <div style={{ width: 28, height: '0.5px', background: 'rgba(214,165,91,0.35)' }} />
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <GoldInput
              label="البريد الإلكتروني"
              icon={<Mail size={16} />}
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
            />
            <GoldInput
              label="كلمة المرور"
              icon={<Lock size={16} />}
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              extra={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                <input
                  type="checkbox" checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ width: 14, height: 14, accentColor: GOLD }}
                />
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>تذكّرني</span>
              </label>
              <button type="button" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(214,165,91,0.75)', fontSize: 12,
                fontFamily: 'inherit', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(214,165,91,0.75)'}
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.018, y: isLoading ? 0 : -1 }}
              whileTap={{ scale: 0.985 }}
              style={{
                width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                background: isLoading
                  ? 'rgba(214,165,91,0.4)'
                  : 'linear-gradient(135deg, #8a5a20 0%, #D6A55B 45%, #c49240 100%)',
                color: '#07111F', fontWeight: 800, fontSize: 15,
                fontFamily: 'inherit',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 4,
                boxShadow: isLoading
                  ? 'none'
                  : '0 4px 20px rgba(214,165,91,0.35), 0 1px 0 rgba(255,255,255,0.15) inset',
                transition: 'all 0.25s',
                letterSpacing: '0.01em',
              }}
            >
              {isLoading
                ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                : <ArrowLeft size={16} />
              }
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 16px' }}>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(214,165,91,0.5)', fontSize: 11, letterSpacing: '0.05em' }}>
              ❖ أو تابع باستخدام ❖
            </span>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Social buttons */}
         <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {['Google', 'Apple'].map(name => (
              <button key={name} style={{
                flex: 1, padding: '10px', borderRadius: 12, fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.65)', cursor: 'pointer', transition: 'all 0.2s',
                backdropFilter: 'blur(8px)',
              }}
onClick={() => {
  toast.custom((t) => (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        minWidth: '320px',
        maxWidth: '420px',
        padding: '16px 18px',
        borderRadius: '22px',
        background: `
          linear-gradient(
            135deg,
            rgba(7,17,31,0.96) 0%,
            rgba(11,23,48,0.94) 100%
          )
        `,
        backdropFilter: 'blur(30px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
        border: '1px solid rgba(214,165,91,0.22)',
        boxShadow: `
          0 10px 40px rgba(0,0,0,0.45),
          0 0 30px rgba(214,165,91,0.08),
          inset 0 1px 0 rgba(255,255,255,0.06)
        `,
        direction: 'rtl',
        transform: t.visible
          ? 'translateY(0) scale(1)'
          : 'translateY(-12px) scale(0.96)',
        opacity: t.visible ? 1 : 0,
        transition: 'all .35s cubic-bezier(.22,1,.36,1)',
      }}
    >
      {/* Gold Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(
              circle at top right,
              rgba(214,165,91,0.12),
              transparent 35%
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            flexShrink: 0,
            background: 'rgba(214,165,91,0.1)',
            border: '1px solid rgba(214,165,91,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(214,165,91,0.12)',
          }}
        >
          <span style={{ fontSize: '20px' }}>✨</span>
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <h4
            style={{
              margin: '0 0 6px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '-0.01em',
            }}
          >
            قريبًا جدًا
          </h4>

          <p
            style={{
              margin: 0,
              color: 'rgba(255,255,255,0.68)',
              fontSize: '13px',
              lineHeight: 1.8,
            }}
          >
            سيتم دعم تسجيل الدخول عبر{' '}
            <span
              style={{
                color: '#D6A55B',
                fontWeight: 700,
              }}
            >
              {name}
            </span>{' '}
            في تحديث قادم بإذن الله
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.28)',
            cursor: 'pointer',
            fontSize: '16px',
            transition: '0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.28)'
          }}
        >
          ✕
        </button>
      </div>

      {/* Bottom Glow Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          width: '100%',
          background: `
            linear-gradient(
              90deg,
              transparent,
              rgba(214,165,91,0.7),
              transparent
            )
          `,
        }}
      />
    </div>
  ), {
    duration: 4000,
    position: 'top-center',
  })
}}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(214,165,91,0.35)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                }}
              >
                {name === 'Google' ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Apple
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Register link */}
          <p style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.35)',
            fontSize: 13, marginTop: 20, marginBottom: 0,
          }}>
            ليس لديك حساب؟{' '}
            <Link to="/register" style={{
              color: GOLD, textDecoration: 'none', fontWeight: 700,
              transition: 'opacity 0.2s',
            }}>
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Dev Quick Login */}
        {import.meta.env.DEV && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              marginTop: 12, padding: '12px 16px', borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 11, marginBottom: 9 }}>
              ⚡ وضع التطوير — دخول سريع
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => handleQuickLogin('admin')} style={{
                padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                background: 'rgba(214,165,91,0.08)', border: '1px solid rgba(214,165,91,0.22)',
                color: GOLD, cursor: 'pointer', transition: 'all 0.2s',
              }}>دخول كمسؤول</button>
              <button onClick={() => handleQuickLogin('student')} style={{
                padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                background: 'rgba(94,119,154,0.08)', border: '1px solid rgba(94,119,154,0.22)',
                color: '#5e779a', cursor: 'pointer', transition: 'all 0.2s',
              }}>دخول كطالب</button>
            </div>
          </motion.div>
        )}

        <p style={{
          textAlign: 'center', color: 'rgba(255,255,255,0.15)',
          fontSize: 11, marginTop: 14,
        }}>
          بتسجيل الدخول، أنت توافق على سياسة الخصوصية وشروط الاستخدام
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        @media (max-width: 480px) {
          .login-card-inner { padding: 32px 24px 28px !important; }
        }
      `}</style>
    </div>
  )
}