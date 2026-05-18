import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader, CheckCircle, Search, ChevronDown, User, Mail, Lock, Phone } from 'lucide-react'
import { toast } from 'react-hot-toast'
import useAuthStore from '../../store/authStore'

const GOLD = '#D6A55B'
const DARK = '#07111F'

// ─── Countries Data ───────────────────────────────────────────────────────────
const COUNTRIES = [
  { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'OM', name: 'عُمان', flag: '🇴🇲' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
  { code: 'SY', name: 'سوريا', flag: '🇸🇾' },
  { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
  { code: 'YE', name: 'اليمن', flag: '🇾🇪' },
  { code: 'LY', name: 'ليبيا', flag: '🇱🇾' },
  { code: 'TN', name: 'تونس', flag: '🇹🇳' },
  { code: 'DZ', name: 'الجزائر', flag: '🇩🇿' },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
  { code: 'SD', name: 'السودان', flag: '🇸🇩' },
  { code: 'TR', name: 'تركيا', flag: '🇹🇷' },
  { code: 'PK', name: 'باكستان', flag: '🇵🇰' },
  { code: 'ID', name: 'إندونيسيا', flag: '🇮🇩' },
  { code: 'MY', name: 'ماليزيا', flag: '🇲🇾' },
  { code: 'GB', name: 'المملكة المتحدة', flag: '🇬🇧' },
  { code: 'US', name: 'الولايات المتحدة', flag: '🇺🇸' },
  { code: 'DE', name: 'ألمانيا', flag: '🇩🇪' },
  { code: 'FR', name: 'فرنسا', flag: '🇫🇷' },
  { code: 'CA', name: 'كندا', flag: '🇨🇦' },
  { code: 'AU', name: 'أستراليا', flag: '🇦🇺' },
  { code: 'OTHER', name: 'دولة أخرى', flag: '🌍' },
]

function getPasswordStrength(pw) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

function PasswordStrengthBar({ password }) {
  const strength = getPasswordStrength(password)
  const labels = ['', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية']
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']
  if (!password) return null
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>قوة كلمة المرور</span>
        <span style={{ fontSize: 11, color: colors[strength], fontWeight: 600 }}>{labels[strength]}</span>
      </div>
    </div>
  )
}

function GoldInput({ label, icon, type, value, onChange, placeholder, dir = 'rtl', error, extra, children }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      {label && (
        <label style={{
          display: 'block',
          color: focused ? 'rgba(214,165,91,0.85)' : 'rgba(255,255,255,0.5)',
          fontSize: 12, marginBottom: 7, fontWeight: 500,
          letterSpacing: '0.02em', transition: 'color 0.2s',
        }}>{label}</label>
      )}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
          color: focused ? GOLD : 'rgba(255,255,255,0.25)',
          transition: 'color 0.25s', pointerEvents: 'none', zIndex: 1,
        }}>{icon}</div>
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder} dir={dir}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '12px 42px 12px 40px', borderRadius: 12, fontSize: 13,
            background: focused ? 'rgba(214,165,91,0.06)' : 'rgba(255,255,255,0.05)',
            border: error
              ? '1px solid rgba(239,68,68,0.5)'
              : focused
                ? '1px solid rgba(214,165,91,0.55)'
                : '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.92)', outline: 'none', boxSizing: 'border-box',
            fontFamily: 'inherit', transition: 'all 0.25s',
            backdropFilter: 'blur(4px)',
            boxShadow: focused
              ? '0 0 0 3px rgba(214,165,91,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
              : 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        />
        {extra && <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>{extra}</div>}
      </div>
      {children}
      {error && <p style={{ color: '#ef4444', fontSize: 11, margin: '4px 0 0' }}>{error}</p>}
    </div>
  )
}

function CountrySelector({ value, onChange, error }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const searchRef = useRef(null)
  const selected = COUNTRIES.find(c => c.name === value)
  const filtered = COUNTRIES.filter(c => c.name.includes(search) || c.code.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 80)
    else setSearch('')
  }, [open])

  return (
    <div>
      <label style={{
        display: 'block',
        color: open ? 'rgba(214,165,91,0.85)' : 'rgba(255,255,255,0.5)',
        fontSize: 12, marginBottom: 7, fontWeight: 500,
        letterSpacing: '0.02em', transition: 'color 0.2s',
      }}>الدولة</label>
      <div ref={ref} style={{ position: 'relative' }}>
        <button type="button" onClick={() => setOpen(!open)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px', borderRadius: 12, fontFamily: 'inherit',
          background: open ? 'rgba(214,165,91,0.06)' : 'rgba(255,255,255,0.05)',
          border: error
            ? '1px solid rgba(239,68,68,0.5)'
            : open
              ? '1px solid rgba(214,165,91,0.55)'
              : '1px solid rgba(255,255,255,0.1)',
          color: selected ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.3)',
          cursor: 'pointer', transition: 'all 0.2s', fontSize: 13,
          backdropFilter: 'blur(4px)',
          boxShadow: open ? '0 0 0 3px rgba(214,165,91,0.08)' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {selected
              ? <><span style={{ fontSize: 16 }}>{selected.flag}</span><span>{selected.name}</span></>
              : <span>اختر دولتك</span>
            }
          </div>
          <ChevronDown size={14} style={{
            color: 'rgba(214,165,91,0.6)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, zIndex: 300,
                borderRadius: 13, background: 'rgba(4,10,22,0.97)',
                border: '1px solid rgba(214,165,91,0.2)',
                backdropFilter: 'blur(30px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)', overflow: 'hidden',
              }}
            >
              <div style={{ padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '7px 10px' }}>
                  <Search size={12} style={{ color: 'rgba(214,165,91,0.5)', flexShrink: 0 }} />
                  <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن دولتك..."
                    style={{ background: 'none', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.9)', fontSize: 12, fontFamily: 'inherit', width: '100%', direction: 'rtl' }} />
                </div>
              </div>
              <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                {filtered.map(country => (
                  <button key={country.code} type="button" onClick={() => { onChange(country.name); setOpen(false) }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                      background: value === country.name ? 'rgba(214,165,91,0.1)' : 'transparent',
                      border: 'none', cursor: 'pointer',
                      color: value === country.name ? GOLD : 'rgba(255,255,255,0.75)',
                      fontSize: 12, fontFamily: 'inherit', textAlign: 'right', transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (value !== country.name) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (value !== country.name) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontSize: 16 }}>{country.flag}</span>
                    <span>{country.name}</span>
                    {value === country.name && <span style={{ marginRight: 'auto', color: GOLD, fontSize: 10 }}>✓</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: 11, margin: '4px 0 0' }}>{error}</p>}
    </div>
  )
}

function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url('./image/register.png')`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(3,7,18,0.78)', zIndex: 1 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)', zIndex: 2 }} />

      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: 420, width: '100%', padding: '44px 36px', borderRadius: 24, textAlign: 'center',
        background: 'rgba(7,17,31,0.55)',
        backdropFilter: 'blur(28px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
        border: '1px solid rgba(214,165,91,0.22)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
      }}>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 180 }}
          style={{ width: 76, height: 76, borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(214,165,91,0.1)', border: '1px solid rgba(214,165,91,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={38} style={{ color: GOLD }} />
        </motion.div>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 10px' }}>تم التسجيل بنجاح!</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.8, margin: '0 0 24px' }}>
          تم إرسال طلبك للمراجعة. سيتواصل معك فريقنا عبر واتساب لتأكيد الاشتراك وفتح الوصول.
        </p>
        <div style={{ background: 'rgba(214,165,91,0.07)', borderRadius: 12, border: '1px solid rgba(214,165,91,0.15)', padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ color: GOLD, fontSize: 13, margin: '0 0 4px', fontWeight: 700 }}>الخطوة التالية</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>تواصل معنا عبر واتساب لتأكيد الدفع وتفعيل حسابك</p>
        </div>
        <a href="https://wa.me/201008148164" target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', width: '100%', padding: '13px', borderRadius: 12, textDecoration: 'none', background: `linear-gradient(135deg, #9a6b2a, ${GOLD})`, color: DARK, fontWeight: 800, fontSize: 14, marginBottom: 12, boxSizing: 'border-box' }}>
          التواصل عبر واتساب
        </a>
        <Link to="/login" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textDecoration: 'none' }}>تسجيل الدخول</Link>
      </div>
    </motion.div>
  )
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', country: '', phone: '', password: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agree, setAgree] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState({})
  const { register, isLoading } = useAuthStore()

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'الاسم مطلوب'
    if (!form.email.trim()) e.email = 'البريد الإلكتروني مطلوب'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'بريد إلكتروني غير صحيح'
    if (!form.country) e.country = 'الدولة مطلوبة'
    if (!form.password) e.password = 'كلمة المرور مطلوبة'
    else if (form.password.length < 6) e.password = 'كلمة المرور 6 أحرف على الأقل'
    if (form.confirmPassword && form.confirmPassword !== form.password) e.confirmPassword = 'كلمتا المرور غير متطابقتين'
    if (!agree) e.agree = 'يجب الموافقة على الشروط'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const result = await register({ name: form.name, email: form.email, country: form.country, phone: form.phone, password: form.password, selectedPackage: 'gold' })
    if (result.success) setDone(true)
    else toast.error(result.message)
  }

  if (done) return <SuccessScreen />

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
      padding: '24px 16px',
    }}>

  
     {/* ── FULL SCREEN BACKGROUND ── */}
<div
  style={{
    position: 'fixed',
    inset: 0,
  backgroundImage: `
  linear-gradient(
    135deg,
    rgba(3,7,18,0.38) 0%,
    rgba(7,17,31,0.22) 45%,
    rgba(3,7,18,0.42) 100%
  ),

      url('/image/login-2.png')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: 'scale(1.02)',
    filter: 'saturate(1.05) contrast(1.05)',
    zIndex: 0,
  }}
/>

  

      {/* ── VIGNETTE ── */}
      <div style={{
        position: 'fixed', inset: 0,
        background: `radial-gradient(
  ellipse at center,
  transparent 48%,
  rgba(0,0,0,0.28) 100%
)`,
        zIndex: 2,
      }} />

      {/* ── GOLD ATMOSPHERIC GLOW ── */}
      <div style={{
        position: 'fixed', inset: 0,
        background: `
          radial-gradient(ellipse at 20% 60%, rgba(214,165,91,0.1) 0%, transparent 45%),
          radial-gradient(ellipse at 80% 15%, rgba(214,165,91,0.06) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 95%, rgba(26,58,92,0.3) 0%, transparent 50%)
        `,
        zIndex: 3, pointerEvents: 'none',
      }} />

      {/* ── FLOATING GLASS CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 480,
        }}
      >
        {/* Outer glow ring */}
        <div style={{
          position: 'absolute', inset: -1, borderRadius: 28,
          background: 'linear-gradient(135deg, rgba(214,165,91,0.28), transparent 50%, rgba(214,165,91,0.1))',
          filter: 'blur(1px)', zIndex: -1,
        }} />

        {/* Logo + Header — outside card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: -6, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(214,165,91,0.18) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }} />
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                border: '1.5px solid rgba(214,165,91,0.45)',
                overflow: 'hidden', position: 'relative',
                boxShadow: '0 0 0 4px rgba(214,165,91,0.08), 0 8px 24px rgba(0,0,0,0.4)',
              }}>
                <img src="/image/logo-white.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
          <h1 style={{
            color: '#fff', fontSize: 22, fontWeight: 800,
            margin: '0 0 4px', letterSpacing: '-0.01em',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>إنشاء حساب جديد</h1>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, margin: 0 }}>انضم إلى مجتمعنا القرآني</p>

          {/* Decorative gold line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <div style={{ width: 24, height: '0.5px', background: 'rgba(214,165,91,0.35)' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(214,165,91,0.5)' }} />
            <div style={{ width: 24, height: '0.5px', background: 'rgba(214,165,91,0.35)' }} />
          </div>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            padding: '28px 28px 24px',
            borderRadius: 24,
            background: 'rgba(7,17,31,0.55)',
            backdropFilter: 'blur(28px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
            border: '1px solid rgba(214,165,91,0.2)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.55),
              0 32px 80px rgba(0,0,0,0.45),
              0 0 0 0.5px rgba(255,255,255,0.04),
              inset 0 1px 0 rgba(255,255,255,0.07),
              inset 0 -1px 0 rgba(0,0,0,0.2)
            `,
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <GoldInput label="الاسم الكامل" icon={<User size={15} />} type="text" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} placeholder="أدخل اسمك الكامل" error={errors.name} />

            <GoldInput label="البريد الإلكتروني" icon={<Mail size={15} />} type="email" value={form.email} dir="ltr"
              onChange={e => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" error={errors.email} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <CountrySelector value={form.country} onChange={v => setForm({ ...form, country: v })} error={errors.country} />
              <GoldInput label="رقم الجوال" icon={<Phone size={15} />} type="tel" value={form.phone} dir="ltr"
                onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+966 5x xxx xxxx" error={errors.phone} />
            </div>

            <GoldInput label="كلمة المرور" icon={<Lock size={15} />} type={showPw ? 'text' : 'password'} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" error={errors.password}
              extra={
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }>
              <PasswordStrengthBar password={form.password} />
            </GoldInput>

            <GoldInput label="تأكيد كلمة المرور" icon={<Lock size={15} />} type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" error={errors.confirmPassword}
              extra={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              } />

            {/* Agree */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                  style={{ width: 15, height: 15, accentColor: GOLD, flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.5 }}>
                  أوافق على{' '}
                  <span style={{ color: GOLD, cursor: 'pointer' }}>الشروط والأحكام</span>
                  {' '}و{' '}
                  <span style={{ color: GOLD, cursor: 'pointer' }}>سياسة الخصوصية</span>
                </span>
              </label>
              {errors.agree && <p style={{ color: '#ef4444', fontSize: 11, margin: '4px 0 0' }}>{errors.agree}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit" disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.018, y: isLoading ? 0 : -1 }}
              whileTap={{ scale: 0.985 }}
              style={{
                width: '100%', padding: '13px', borderRadius: 13, border: 'none',
                background: isLoading
                  ? 'rgba(214,165,91,0.4)'
                  : 'linear-gradient(135deg, #8a5a20 0%, #D6A55B 45%, #c49240 100%)',
                color: '#07111F', fontWeight: 800, fontSize: 15, fontFamily: 'inherit',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 2,
                boxShadow: isLoading
                  ? 'none'
                  : '0 4px 20px rgba(214,165,91,0.35), 0 1px 0 rgba(255,255,255,0.15) inset',
                transition: 'all 0.25s', letterSpacing: '0.01em',
              }}>
              {isLoading && <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {isLoading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 14px' }}>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(214,165,91,0.5)', fontSize: 11, letterSpacing: '0.05em' }}>❖ أو سجّل باستخدام ❖</span>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Social */}
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

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>
            لديك حساب بالفعل؟{' '}
            <Link to="/login" style={{ color: GOLD, textDecoration: 'none', fontWeight: 700 }}>تسجيل الدخول</Link>
          </p>
        </motion.div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 11, marginTop: 14 }}>
          بالتسجيل، أنت توافق على سياسة الخصوصية وشروط الاستخدام
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}