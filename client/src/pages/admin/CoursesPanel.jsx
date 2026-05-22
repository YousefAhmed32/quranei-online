// src/pages/admin/CoursesPanel.jsx
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit3, Trash2, Star, Eye, EyeOff, Save, X,
  BookOpen, ChevronUp, ChevronDown, Search, Filter,
} from 'lucide-react'
import qToast from '../../components/ui/Toast'
import ImageUpload from '../../components/ui/ImageUpload'
import { courseService, teacherService } from '../../services/api'

/* ── tokens ── */
const G   = '#dfab70'
const GD  = '#906130'
const NAV = '#040816'

/* ════════════════════════════════════════════
   MICRO COMPONENTS (self-contained so panel
   works standalone without AdminDashboard)
════════════════════════════════════════════ */
function GoldBtn({ children, onClick, disabled, sm, danger }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: sm ? '7px 14px' : '9px 18px',
        minHeight: 40, borderRadius: 11, border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: sm ? 12 : 13,
        opacity: disabled ? 0.55 : 1,
        background: danger
          ? 'linear-gradient(135deg,#7f1d1d,#ef4444)'
          : `linear-gradient(135deg,${GD},${G})`,
        color: danger ? '#fff' : NAV,
        boxShadow: disabled ? 'none' : danger
          ? '0 0 18px rgba(239,68,68,0.3)'
          : `0 0 18px rgba(223,171,112,0.28)`,
        whiteSpace: 'nowrap',
      }}
    >{children}</motion.button>
  )
}

function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      minHeight: 40, padding: '9px 18px', borderRadius: 11,
      border: '1px solid rgba(223,171,112,0.12)',
      background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)',
      fontFamily: 'Cairo, sans-serif', fontSize: 13, cursor: 'pointer',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.3)'; e.currentTarget.style.color = G }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
    >{children}</button>
  )
}

function Card({ children, style = {}, p = 18 }) {
  return (
    <div style={{
      background: 'rgba(11,23,46,0.5)', backdropFilter: 'blur(22px)',
      border: '1px solid rgba(223,171,112,0.09)', borderRadius: 18, padding: p,
      boxShadow: '0 4px 22px rgba(0,0,0,0.32)',
      position: 'relative', overflow: 'hidden', ...style,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(223,171,112,0.35),transparent)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  )
}

function LuxInput({ label, value, onChange, placeholder, type = 'text', rows, dir, disabled, hint }) {
  const [focused, setFocused] = useState(false)
  const Tag = rows ? 'textarea' : 'input'
  return (
    <div>
      {label && <div style={{ color: G, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>{label}</div>}
      <Tag
        autoComplete="off"
        value={value ?? ''} onChange={onChange} placeholder={placeholder}
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
          opacity: disabled ? 0.45 : 1, cursor: disabled ? 'not-allowed' : 'auto',
          transition: 'all .22s ease',
          boxSizing: 'border-box',
        }}
      />
      {hint && <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function LuxSelect({ label, value, onChange, children }) {
  return (
    <div>
      {label && <div style={{ color: G, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>{label}</div>}
      <select value={value ?? ''} onChange={onChange} style={{
        width: '100%', padding: '10px 13px',
        background: 'rgba(7,15,28,0.6)', border: '1px solid rgba(223,171,112,0.12)',
        borderRadius: 11, color: '#fff', fontSize: 13,
        fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box',
      }}>
        {children}
      </select>
    </div>
  )
}

function LuxModal({ open, onClose, title, children, wide }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            overflowY: 'auto', padding: 'clamp(16px,5vw,40px) clamp(12px,4vw,20px)',
          }}
        >
        <motion.div
  initial={false}
  animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 24 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
            style={{
              width: '100%', maxWidth: wide ? 760 : 580,
              background: 'rgba(7,15,28,0.98)',
              border: '1px solid rgba(223,171,112,0.22)',
              borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 36px 90px rgba(0,0,0,0.85)',
            }}
          >
            {/* header */}
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
              ><X size={14} /></button>
            </div>

            {/* body */}
            <div style={{
              padding: 'clamp(16px,3.5vw,24px)',
              maxHeight: 'calc(100dvh - 140px)',overflowY: 'scroll',
overscrollBehavior: 'contain',
            }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── multi-value input (outcomes / targets / highlights / tags) ── */
function ChipInput({ label, values = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const v = draft.trim()
    if (!v) return
    onChange([...values, v])
    setDraft('')
  }

  const remove = i => onChange(values.filter((_, idx) => idx !== i))

  return (
    <div>
      {label && <div style={{ color: G, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>{label}</div>}
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        <input
          value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder || 'اكتب ثم Enter'}
          style={{
            flex: 1, padding: '9px 12px',
            background: 'rgba(7,15,28,0.6)', border: '1px solid rgba(223,171,112,0.12)',
            borderRadius: 10, color: '#fff', fontSize: 12,
            fontFamily: 'Cairo, sans-serif', outline: 'none', direction: 'rtl',
          }}
        />
        <button type="button" onClick={add} style={{
          padding: '9px 14px', borderRadius: 10, border: 'none',
          background: `rgba(223,171,112,0.12)`, color: G,
          fontFamily: 'Cairo, sans-serif', fontSize: 12, cursor: 'pointer',
        }}>إضافة</button>
      </div>
      {values.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {values.map((v, i) => (
            <span key={i} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 20,
              background: 'rgba(223,171,112,0.1)', border: '1px solid rgba(223,171,112,0.2)',
              color: G, fontSize: 11,
            }}>
              {v}
             <button type="button" onClick={() => remove(i)} style={{
                background: 'none', border: 'none', color: 'rgba(223,171,112,0.5)',
                cursor: 'pointer', padding: 0, display: 'flex', lineHeight: 1,
              }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════
   DEFAULT EMPTY FORM
   كل حقل له قيمة ابتدائية صريحة — مفيش undefined
════════════════════════════════════════════ */
const EMPTY = {
  title:            '',
  slug:             '',
  shortDescription: '',
  description:      '',
  thumbnail:        '',
  heroVideo:        '',
  category:         'quran',
  level:            'beginner',
  duration:         '',
  lessonsCount:     0,
  studentsCount:    0,
  rating:           0,
  reviewsCount:     0,
  teacherName:      '',
  teacher:          '',
  // ✅ pricingType دايمًا 'contact' كـ default
  pricingType:      'contact',
  price:            0,
  currency:         'ريال',
  showPrice:        false,
  whatsapp:         '',
  ctaText:          'اشترك الآن',
  isPublished:      false,
  featured:         false,
  priorityOrder:    '',
  learningOutcomes: [],
  targetStudents:   [],
  highlights:       [],
  tags:             [],
  seoTitle:         '',
  seoDescription:   '',
}

/* ════════════════════════════════════════════
   COURSES PANEL
════════════════════════════════════════════ */
   const FormSection = ({ title: t, children }) => (
    <div style={{ marginBottom: 4 }}>
      <div style={{
        color: 'rgba(223,171,112,0.6)', fontSize: 10, fontWeight: 800,
        letterSpacing: '1.5px', marginBottom: 10, marginTop: 6,
        textTransform: 'uppercase', borderBottom: '1px solid rgba(223,171,112,0.08)',
        paddingBottom: 6,
      }}>{t}</div>
      {children}
    </div>
  )

  const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }


export default function CoursesPanel() {
  const [courses,  setCourses]  = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [catFilter,setCatFilter]= useState('')

  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState(null)   // null = create, object = edit
  const [form,     setForm]     = useState({ ...EMPTY })
  const [saving,   setSaving]   = useState(false)

  /* ── load ── */
  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      courseService.adminGetAll().catch(() => ({ data: { courses: [] } })),
      teacherService.adminGetAll().catch(() => ({ data: { teachers: [] } })),
    ]).then(([c, t]) => {
      setCourses(c.data.courses || [])
      setTeachers(t.data.teachers || [])
    }).finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  /* ── helper: merge course into EMPTY so no field is undefined ── */
  const mergeWithEmpty = (course) => {
    const merged = { ...EMPTY }
    Object.keys(EMPTY).forEach(k => {
      const v = course[k]
      if (v === undefined || v === null) return   // keep default
      merged[k] = v
    })
    // ✅ تأكد pricingType valid
    if (!['free','paid','contact'].includes(merged.pricingType)) {
      merged.pricingType = 'contact'
    }
    // arrays
    ;['learningOutcomes','targetStudents','highlights','tags'].forEach(f => {
      if (!Array.isArray(merged[f])) merged[f] = []
    })
    // teacher ref
    merged.teacher = course.teacher?._id || course.teacher || ''
    return merged
  }


  

  /* ── open create ── */
  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY })
    setShowForm(true)
  }

  /* ── open edit ── */
  const openEdit = (course) => {
    setEditing(course)
    setForm(mergeWithEmpty(course))
    setShowForm(true)
  }

  /* ── field setter ── */
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  /* ── auto-slug from title ── */
  const handleTitleChange = (e) => {
    const title = e.target.value
    setForm(f => ({
      ...f,
      title,
      // لو بنعمل create وما غيّرناش الـ slug manually، نولّده تلقائيًا
      slug: editing ? f.slug : title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\u0621-\u064Aa-z0-9-]/g, '')
        .replace(/-+/g, '-'),
    }))
  }

  /* ── build payload — نضمن مفيش قيم غلط توصل للـ API ── */
  const buildPayload = () => {
    const f = form
    const pricingType = ['free','paid','contact'].includes(f.pricingType)
      ? f.pricingType
      : 'contact'

    return {
      title:            f.title.trim(),
      slug:             f.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      shortDescription: f.shortDescription || '',
      description:      f.description || '',
      thumbnail:        f.thumbnail || '',
      heroVideo:        f.heroVideo || '',
      category:         f.category || 'quran',
      level:            f.level || 'beginner',
      duration:         f.duration || '',
      lessonsCount:     Number(f.lessonsCount) || 0,
      studentsCount:    Number(f.studentsCount) || 0,
      rating:           Number(f.rating) || 0,
      reviewsCount:     Number(f.reviewsCount) || 0,
      teacherName:      f.teacherName || '',
      teacher:          f.teacher || null,
      pricingType,
      price:            pricingType === 'paid' ? (Number(f.price) || 0) : 0,
      currency:         f.currency || 'ريال',
      showPrice:        !!f.showPrice,
      whatsapp:         f.whatsapp || '',
      ctaText:          f.ctaText || 'اشترك الآن',
      isPublished:      !!f.isPublished,
      featured:         !!f.featured,
      priorityOrder:    f.priorityOrder === '' ? 999 : (Number(f.priorityOrder) || 999),
      learningOutcomes: Array.isArray(f.learningOutcomes) ? f.learningOutcomes : [],
      targetStudents:   Array.isArray(f.targetStudents)   ? f.targetStudents   : [],
      highlights:       Array.isArray(f.highlights)       ? f.highlights       : [],
      tags:             Array.isArray(f.tags)             ? f.tags             : [],
      seoTitle:         f.seoTitle || '',
      seoDescription:   f.seoDescription || '',
    }
  }

  /* ── save ── */
  const handleSave = async () => {
    if (!form.title.trim()) return qToast.error('العنوان مطلوب')
    if (!form.slug.trim())  return qToast.error('الـ Slug مطلوب')
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
      setShowForm(false)
      load()
    } catch (e) {
      qToast.error(e.response?.data?.message || 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  /* ── delete ── */
  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذه الدورة؟')) return
    try {
      await courseService.adminDelete(id)
      qToast.success('تم حذف الدورة')
      load()
    } catch {
      qToast.error('فشل الحذف')
    }
  }

  /* ── toggle publish ── */
  const togglePublish = async (course) => {
    try {
      const payload = buildPayload.call({ form: mergeWithEmpty(course) }) // unused — build manually
      await courseService.adminUpdate(course._id, { isPublished: !course.isPublished })
      load()
    } catch {
      qToast.error('فشل التحديث')
    }
  }

  /* ── toggle featured ── */
  const toggleFeatured = async (course) => {
    try {
      await courseService.adminUpdate(course._id, { featured: !course.featured })
      load()
    } catch {
      qToast.error('فشل التحديث')
    }
  }

  /* ── reorder ── */
  const moveOrder = async (course, dir) => {
    const sorted = [...courses].sort((a, b) => (a.priorityOrder || 999) - (b.priorityOrder || 999))
    const idx    = sorted.findIndex(c => c._id === course._id)
    const swap   = sorted[idx + dir]
    if (!swap) return
    await Promise.all([
      courseService.adminUpdate(course._id, { priorityOrder: swap.priorityOrder ?? 999 }),
      courseService.adminUpdate(swap._id,   { priorityOrder: course.priorityOrder ?? 999 }),
    ])
    load()
  }

  /* ── filtered list ── */
  const filtered = courses.filter(c => {
    const matchSearch = !search   || c.title.toLowerCase().includes(search.toLowerCase())
    const matchCat    = !catFilter || c.category === catFilter
    return matchSearch && matchCat
  })

  /* ════════════════════
     FORM SECTIONS
  ════════════════════ */
 


  /* ════════════════════
     RENDER
  ════════════════════ */
  return (
    <div>
      <style>{`
        @keyframes cpPulse { 0%,100%{opacity:.3} 50%{opacity:.55} }
        @keyframes cpSpin   { to { transform: rotate(360deg); } }
        .cp-courses-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .cp-courses-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1100px) {
          .cp-courses-grid { grid-template-columns: repeat(3,1fr); }
        }
        option { background:#08111f; color:#fff; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 'clamp(15px,3vw,19px)', fontWeight: 900 }}>إدارة الدورات</h2>
          <div style={{ color: 'rgba(223,171,112,0.5)', fontSize: 12, marginTop: 2 }}>
            {filtered.length} دورة
          </div>
        </div>
        <GoldBtn onClick={openCreate}><Plus size={13} /> إضافة دورة</GoldBtn>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 180,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(223,171,112,0.1)',
          borderRadius: 10, padding: '8px 12px',
        }}>
          <Search size={13} style={{ color: 'rgba(223,171,112,0.4)', flexShrink: 0 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="بحث..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 12, flex: 1, fontFamily: 'Cairo,sans-serif', direction: 'rtl' }}
          />
        </div>
        <select
          value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(223,171,112,0.1)',
            background: 'rgba(7,15,28,0.6)', color: 'rgba(255,255,255,0.7)',
            fontSize: 12, fontFamily: 'Cairo,sans-serif', outline: 'none',
          }}
        >
          <option value="">كل التصنيفات</option>
          <option value="quran">القرآن</option>
          <option value="tajweed">التجويد</option>
          <option value="arabic">العربية</option>
          <option value="islamic">الدراسات الإسلامية</option>
        </select>
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="cp-courses-grid">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} style={{ height: 140, borderRadius: 18, background: 'rgba(17,40,71,0.3)', animation: 'cpPulse 1.5s infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card p={48} style={{ textAlign: 'center' }}>
          <BookOpen size={40} style={{ color: 'rgba(223,171,112,0.18)', margin: '0 auto 10px', display: 'block' }} />
          <p style={{ color: 'rgba(255,255,255,0.28)' }}>لا توجد دورات.</p>
        </Card>
      ) : (
        <div className="cp-courses-grid">
          {filtered
            .sort((a, b) => (a.priorityOrder || 999) - (b.priorityOrder || 999))
            .map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card p={16}>
                {/* thumbnail */}
              {(c.thumbnail || c.thumbnailId) && (
  <div style={{
    width: '100%',
    height: 110,
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    background: 'rgba(7,15,28,0.6)',
  }}>
    <img
      src={
        c.thumbnail?.startsWith('http')
          ? c.thumbnail
          : `https://api.quranei.com/api/media/stream/${c.thumbnail || c.thumbnailId}`
      }
      alt={c.title}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  </div>
)}

                {/* title + category */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 800, lineHeight: 1.4, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(223,171,112,0.1)', color: G, border: '1px solid rgba(223,171,112,0.2)' }}>
                      {c.category}
                    </span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(129,140,248,0.1)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.2)' }}>
                      {c.level}
                    </span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                      {c.pricingType === 'free' ? 'مجاني' : c.pricingType === 'paid' ? `${c.price} ${c.currency}` : 'تواصل'}
                    </span>
                  </div>
                </div>

                {/* actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(223,171,112,0.06)', paddingTop: 10 }}>
                  {/* status badges */}
                  <div style={{ display: 'flex', gap: 5 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                      ...(c.isPublished
                        ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
                        : { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' })
                    }}>
                      {c.isPublished ? 'منشور' : 'مخفي'}
                    </span>
                    {c.featured && <Star size={12} fill={G} style={{ color: G }} />}
                  </div>

                  {/* buttons */}
                  <div style={{ display: 'flex', gap: 5 }}>
                    {/* reorder */}
                    <button onClick={() => moveOrder(c, -1)} title="رفع" style={iconBtn('rgba(255,255,255,0.08)', 'rgba(255,255,255,0.5)')}>
                      <ChevronUp size={11} />
                    </button>
                    <button onClick={() => moveOrder(c, 1)} title="خفض" style={iconBtn('rgba(255,255,255,0.08)', 'rgba(255,255,255,0.5)')}>
                      <ChevronDown size={11} />
                    </button>
                    {/* publish toggle */}
                    <button onClick={() => togglePublish(c)} title={c.isPublished ? 'إخفاء' : 'نشر'} style={iconBtn('rgba(34,197,94,0.08)', '#22c55e')}>
                      {c.isPublished ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    {/* featured toggle */}
                    <button onClick={() => toggleFeatured(c)} title={c.featured ? 'إلغاء التمييز' : 'تمييز'} style={iconBtn('rgba(223,171,112,0.08)', G)}>
                      {c.featured ? <Star size={11} fill={G} /> : <Star size={11} />}
                    </button>
                    {/* edit */}
                    <button onClick={() => openEdit(c)} style={iconBtn('rgba(223,171,112,0.08)', G)}>
                      <Edit3 size={11} />
                    </button>
                    {/* delete */}
                    <button onClick={() => handleDelete(c._id)} style={iconBtn('rgba(239,68,68,0.08)', '#ef4444')}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════
          FORM MODAL
      ════════════════════════════════════════ */}
      <LuxModal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? `تعديل: ${editing.title}` : 'إضافة دورة جديدة'}
        wide
      >
<form
  onSubmit={(e) => {
    e.preventDefault()
    handleSave()
  }}
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    direction: 'rtl'
  }}
>
          {/* ── Basic ── */}
          <FormSection title="المعلومات الأساسية">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <LuxInput
                label="عنوان الدورة *"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="مثال: دورة تحفيظ القرآن الكريم"
              />
              <LuxInput
                label="Slug (رابط الدورة) *"
                value={form.slug}
                onChange={e => setF('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\u0621-\u064Aa-z0-9-]/g, ''))}
                placeholder="course-slug"
                dir="ltr"
                hint="يُستخدم في رابط الدورة — بدون مسافات"
              />
              <div style={grid2}>
                <LuxSelect label="التصنيف" value={form.category} onChange={e => setF('category', e.target.value)}>
                  <option value="quran">القرآن الكريم</option>
                  <option value="tajweed">التجويد</option>
                  <option value="arabic">اللغة العربية</option>
                  <option value="islamic">الدراسات الإسلامية</option>
                </LuxSelect>
                <LuxSelect label="المستوى" value={form.level} onChange={e => setF('level', e.target.value)}>
                  <option value="beginner">مبتدئ</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">متقدم</option>
                  <option value="all">للجميع</option>
                </LuxSelect>
              </div>
              <LuxInput label="وصف مختصر" value={form.shortDescription} onChange={e => setF('shortDescription', e.target.value)} rows={2} />
              <LuxInput label="وصف تفصيلي" value={form.description} onChange={e => setF('description', e.target.value)} rows={4} />
            </div>
          </FormSection>

          {/* ── Media ── */}
          <FormSection title="الوسائط">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ImageUpload
  label="صورة الغلاف"
  value={form.thumbnail || form.thumbnailId || ''}
  onChange={v => {
    if (v && v.match(/^[0-9a-fA-F]{24}$/)) {
      setForm(f => ({
        ...f,
        thumbnailId: v,
        thumbnail: '',
      }))
    } else {
      setForm(f => ({
        ...f,
        thumbnail: v || '',
        thumbnailId: '',
      }))
    }
  }}
  hint="ارفع صورة أو الصق رابطاً — اختياري"
/>
              <LuxInput
                label="رابط الفيديو التعريفي"
                value={form.heroVideo}
                onChange={e => setF('heroVideo', e.target.value)}
                placeholder="https://youtube.com/..."
                dir="ltr"
                hint="اختياري"
              />
            </div>
          </FormSection>

          {/* ── Teacher ── */}
          <FormSection title="المعلم">
            <div style={grid2}>
              <LuxSelect label="اختر معلمًا" value={form.teacher} onChange={e => {
                const t = teachers.find(x => x._id === e.target.value)
                setForm(f => ({ ...f, teacher: e.target.value, teacherName: t?.fullName || f.teacherName }))
              }}>
                <option value="">— بدون معلم مرتبط —</option>
                {teachers.map(t => <option key={t._id} value={t._id}>{t.fullName}</option>)}
              </LuxSelect>
              <LuxInput
                label="اسم المعلم (نصي)"
                value={form.teacherName}
                onChange={e => setF('teacherName', e.target.value)}
                placeholder="يُعبأ تلقائيًا أو اكتب يدويًا"
                hint="اختياري"
              />
            </div>
          </FormSection>

          {/* ── Pricing ── */}
          <FormSection title="التسعير">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={grid2}>
                {/* ✅ pricingType select — العنصر الحاسم */}
                <LuxSelect label="نوع التسعير" value={form.pricingType} onChange={e => setF('pricingType', e.target.value)}>
                  <option value="contact">تواصل للاشتراك</option>
                  <option value="free">مجاني</option>
                  <option value="paid">مدفوع</option>
                </LuxSelect>
                {form.pricingType === 'paid' && (
                  <LuxInput
                    label="السعر"
                    value={form.price}
                    onChange={e => setF('price', e.target.value)}
                    type="number"
                  />
                )}
                {form.pricingType === 'paid' && (
                  <LuxInput
                    label="العملة"
                    value={form.currency}
                    onChange={e => setF('currency', e.target.value)}
                  />
                )}
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minHeight: 32 }}>
                  <input type="checkbox" checked={!!form.showPrice} onChange={e => setF('showPrice', e.target.checked)} style={{ accentColor: G, width: 15, height: 15 }} />
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>إظهار السعر</span>
                </label>
              </div>
              <div style={grid2}>
                <LuxInput label="نص الزر (CTA)" value={form.ctaText} onChange={e => setF('ctaText', e.target.value)} />
                <LuxInput label="رقم واتساب" value={form.whatsapp} onChange={e => setF('whatsapp', e.target.value)} dir="ltr" hint="اختياري" />
              </div>
            </div>
          </FormSection>

          {/* ── Stats ── */}
          <FormSection title="إحصائيات (اختيارية)">
            <div style={grid2}>
              <LuxInput label="المدة" value={form.duration} onChange={e => setF('duration', e.target.value)} placeholder="مثال: 30 ساعة" hint="اختياري" />
              <LuxInput label="عدد الدروس" value={form.lessonsCount} onChange={e => setF('lessonsCount', e.target.value)} type="number" hint="اختياري" />
              <LuxInput label="عدد الطلاب" value={form.studentsCount} onChange={e => setF('studentsCount', e.target.value)} type="number" hint="اختياري" />
              <LuxInput label="التقييم (0-5)" value={form.rating} onChange={e => setF('rating', e.target.value)} type="number" hint="اختياري" />
            </div>
          </FormSection>

          {/* ── Learning Content ── */}
          <FormSection title="محتوى التعلم (اختياري)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ChipInput label="ماذا ستتعلم" values={form.learningOutcomes} onChange={v => setF('learningOutcomes', v)} placeholder="أضف نقطة ثم Enter" />
              <ChipInput label="الفئة المستهدفة" values={form.targetStudents} onChange={v => setF('targetStudents', v)} />
              <ChipInput label="مميزات الدورة" values={form.highlights} onChange={v => setF('highlights', v)} />
              <ChipInput label="الوسوم (Tags)" values={form.tags} onChange={v => setF('tags', v)} />
            </div>
          </FormSection>

          {/* ── Visibility ── */}
          <FormSection title="الظهور والترتيب">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  ['isPublished', 'منشور'],
                  ['featured',    'مميز'],
                ].map(([k, l]) => (
                  <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minHeight: 32 }}>
                    <input type="checkbox" checked={!!form[k]} onChange={e => setF(k, e.target.checked)} style={{ accentColor: G, width: 15, height: 15 }} />
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{l}</span>
                  </label>
                ))}
              </div>
              <LuxInput
                label="ترتيب العرض"
                value={form.priorityOrder}
                onChange={e => setF('priorityOrder', e.target.value)}
                type="number"
                hint="رقم أصغر = أول في القائمة — اختياري"
              />
            </div>
          </FormSection>

          {/* ── SEO ── */}
          <FormSection title="SEO (اختياري)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <LuxInput label="عنوان SEO" value={form.seoTitle} onChange={e => setF('seoTitle', e.target.value)} hint="اختياري" />
              <LuxInput label="وصف SEO" value={form.seoDescription} onChange={e => setF('seoDescription', e.target.value)} rows={2} hint="اختياري" />
            </div>
          </FormSection>

          {/* ── Footer ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4, borderTop: '1px solid rgba(223,171,112,0.08)' }}>
            <GhostBtn onClick={() => setShowForm(false)}>إلغاء</GhostBtn>
            <GoldBtn onClick={handleSave} disabled={saving}>
              {saving
                ? <div style={{ width: 13, height: 13, border: `2px solid ${NAV}55`, borderTopColor: NAV, borderRadius: '50%', animation: 'cpSpin .7s linear infinite' }} />
                : <Save size={13} />}
              {saving ? 'جارٍ الحفظ...' : (editing ? 'حفظ التعديلات' : 'إضافة الدورة')}
            </GoldBtn>
          </div>
        </form>


      </LuxModal>
    </div>
  )
}

/* ── small helper for icon buttons ── */
function iconBtn(bg, color) {
  return {
    width: 28, height: 28, borderRadius: 7,
    border: `1px solid ${color}33`,
    background: bg, color,
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    transition: 'all .18s',
    flexShrink: 0,
  }
}