import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, BookOpen, Eye, EyeOff, Trash2, Edit3,
  Star, StarOff, Save, ChevronDown, Image, DollarSign,
  Globe, Users, CheckCircle, AlertCircle, Clock, X,
  FileText, BarChart2, Zap, Sparkles,
} from 'lucide-react'
import qToast from '../../components/ui/Toast'
import ImageUpload from '../../components/ui/ImageUpload'
import { courseService } from '../../services/api'

// ── Design tokens ─────────────────────────────────────────────────────────────
const G   = '#dfab70'
const GD  = '#906130'
const NAV = '#040816'

// ─────────────────────────────────────────────────────────────────────────────
// QUICK FILL PRESETS
// ─────────────────────────────────────────────────────────────────────────────
const PRESETS = [
  {
    label: 'تجويد مبتدئ',
    emoji: '📖',
    form: {
      title: 'دورة التجويد الشاملة للمبتدئين',
      shortDescription: 'تعلم أحكام التجويد من الصفر حتى الاحتراف مع متابعة فردية',
      description: 'دورة متكاملة تأخذك خطوة بخطوة في رحلة تعلم علم التجويد، من أحكام النون الساكنة والتنوين وصولاً إلى المدود والوقف والابتداء.',
      category: 'tajweed', level: 'beginner',
      teacherName: 'الشيخ أحمد محمد',
      duration: '3 أشهر', lessonsCount: '24',
      pricingType: 'contact', whatsapp: '966500000000',
      ctaText: 'اشترك الآن', isPublished: true, featured: true, priorityOrder: '1',
    },
    arr: {
      learningOutcomes: 'تعلم أحكام النون الساكنة والتنوين\nتعلم أحكام الميم الساكنة\nإتقان المدود وأنواعها\nتعلم أحكام الوقف والابتداء',
      targetStudents: 'المبتدئون في تعلم القرآن الكريم\nمن يريد تحسين تلاوته\nالأطفال من سن 8 سنوات',
      highlights: 'شهادة معتمدة عند الانتهاء\nمتابعة فردية مع الشيخ\nجلسات أونلاين مرنة\nتسجيلات للمراجعة',
      tags: 'تجويد، قرآن، مبتدئ، أونلاين',
    },
  },
  {
    label: 'حفظ القرآن',
    emoji: '🌙',
    form: {
      title: 'برنامج حفظ القرآن الكريم كاملاً',
      shortDescription: 'منهج متكامل لحفظ القرآن الكريم كاملاً بأسلوب علمي مضمون',
      description: 'برنامج منهجي لحفظ القرآن الكريم كاملاً بأسلوب السلف الصالح، مع المراجعة المستمرة والتثبيت.',
      category: 'memorization', level: 'intermediate',
      teacherName: 'الشيخة فاطمة علي',
      duration: '24 شهراً', lessonsCount: '96',
      pricingType: 'contact', whatsapp: '966500000001',
      ctaText: 'ابدأ رحلة الحفظ', isPublished: true, featured: false, priorityOrder: '2',
    },
    arr: {
      learningOutcomes: 'حفظ القرآن الكريم كاملاً 30 جزءاً\nإتقان التجويد أثناء الحفظ\nمراجعة يومية منظمة\nاجتياز اختبار الحفظ',
      targetStudents: 'من أتم تعلم القراءة الصحيحة\nالراغبون في حفظ القرآن\nمن لديهم وقت يومي للالتزام',
      highlights: 'إجازة في الحفظ عند الإتمام\nمنهج يومي مدروس\nمجموعات متابعة\nمكافآت عند إتمام كل جزء',
      tags: 'حفظ، قرآن، إجازة، منهج',
    },
  },
  {
    label: 'إجازة التلاوة',
    emoji: '⭐',
    form: {
      title: 'دورة الإجازة في رواية حفص عن عاصم',
      shortDescription: 'احصل على إجازة متصلة السند في رواية حفص عن عاصم بالطريق الشاطبية',
      description: 'دورة متخصصة للحصول على إجازة مجازة في رواية حفص عن عاصم من طريق الشاطبية، مع سند متصل بالنبي ﷺ.',
      category: 'ijazah', level: 'advanced',
      teacherName: 'الشيخ محمد الحسن',
      duration: '6 أشهر', lessonsCount: '48',
      pricingType: 'contact', whatsapp: '966500000002',
      ctaText: 'تقدم للإجازة', isPublished: false, featured: true, priorityOrder: '3',
    },
    arr: {
      learningOutcomes: 'الحصول على إجازة متصلة السند\nإتقان رواية حفص عن عاصم\nاجتياز اختبار شامل',
      targetStudents: 'من أتم حفظ القرآن الكريم\nمن أتم دراسة التجويد\nالراغبون في التحقق الرسمي',
      highlights: 'سند متصل بالنبي ﷺ\nشهادة موثقة ومعتمدة\nمتابعة مباشرة مع الشيخ',
      tags: 'إجازة، حفص، عاصم، سند',
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETION CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const FIELD_WEIGHTS = {
  title:            { weight: 20, label: 'عنوان الدورة'  },
  thumbnail:        { weight: 15, label: 'صورة الدورة'   },
  shortDescription: { weight: 10, label: 'وصف مختصر'     },
  category:         { weight: 10, label: 'الفئة'         },
  level:            { weight: 5,  label: 'المستوى'       },
  teacherName:      { weight: 10, label: 'اسم المعلم'    },
  description:      { weight: 10, label: 'وصف تفصيلي'   },
  whatsapp:         { weight: 5,  label: 'رقم واتساب'   },
  heroVideo:        { weight: 5,  label: 'فيديو تعريفي' },
  learningOutcomes: { weight: 5,  label: 'ماذا ستتعلم؟' },
  tags:             { weight: 5,  label: 'الوسوم'        },
}

function calcCompletion(form, arrDraft) {
  let score = 0
  const missing = []
  for (const [key, cfg] of Object.entries(FIELD_WEIGHTS)) {
    let filled = false
    if (key === 'learningOutcomes') filled = arrDraft.learningOutcomes?.trim().length > 0
    else if (key === 'tags')        filled = arrDraft.tags?.trim().length > 0
    else filled = !!(form[key] && String(form[key]).trim())
    if (filled) score += cfg.weight
    else missing.push(cfg.label)
  }
  return { pct: Math.min(score, 100), missing }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD
// ─────────────────────────────────────────────────────────────────────────────
function cleanPayload(raw) {
  const out = {}
  for (const [k, v] of Object.entries(raw)) {
    if (v === undefined || v === null) continue
    if (typeof v === 'string' && v.trim() === '') continue
    if (Array.isArray(v) && v.length === 0) continue
    out[k] = v
  }
  return out
}

function buildPayload(form, arrDraft) {
  const raw = {
    ...form,
    level:         form.level        || 'beginner',
    category:      form.category     || 'quran',
    priorityOrder: form.priorityOrder === '' ? 0 : Number(form.priorityOrder || 0),
    lessonsCount:  form.lessonsCount  === '' ? 0 : Number(form.lessonsCount  || 0),
    price:         form.pricingType === 'paid' ? Number(form.price || 0) : 0,
    learningOutcomes: (arrDraft.learningOutcomes || '').split('\n').map(s => s.trim()).filter(Boolean),
    targetStudents:   (arrDraft.targetStudents   || '').split('\n').map(s => s.trim()).filter(Boolean),
    highlights:       (arrDraft.highlights        || '').split('\n').map(s => s.trim()).filter(Boolean),
    tags:             (arrDraft.tags              || '').split(/[،,]/).map(s => s.trim()).filter(Boolean),
  }
  return cleanPayload(raw)
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTOSAVE
// ─────────────────────────────────────────────────────────────────────────────
const DRAFT_KEY = 'admin_course_draft_v3'
function saveDraft(form, arrDraft) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, arrDraft, ts: Date.now() })) } catch {}
}
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const d = JSON.parse(raw)
    if (Date.now() - d.ts > 86_400_000) { localStorage.removeItem(DRAFT_KEY); return null }
    return d
  } catch { return null }
}
function clearDraft() { try { localStorage.removeItem(DRAFT_KEY) } catch {} }

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_COURSE = {
  title: '', slug: '', shortDescription: '', description: '', thumbnail: '', heroVideo: '',
  category: 'quran', level: 'beginner', duration: '', lessonsCount: '',
  teacherName: '', pricingType: 'contact', price: '', currency: 'ريال', showPrice: false,
  whatsapp: '', ctaText: 'اشترك الآن', isPublished: false, featured: false, priorityOrder: '',
}
const EMPTY_ARR = { learningOutcomes: '', targetStudents: '', highlights: '', tags: '' }

// ─────────────────────────────────────────────────────────────────────────────
// QUICK FILL PICKER
// ─────────────────────────────────────────────────────────────────────────────
function QuickFillBar({ onApply, onClear, hasData }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginBottom: 16, position: 'relative' }}>
      <div style={{
        display: 'flex', gap: 8, alignItems: 'center',
        padding: '10px 14px', borderRadius: 12,
        background: 'linear-gradient(135deg, rgba(223,171,112,0.07), rgba(144,97,48,0.04))',
        border: '1px solid rgba(223,171,112,0.14)',
      }}>
        <Zap size={13} style={{ color: G, flexShrink: 0 }} />
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, flex: 1 }}>
          ملء تجريبي سريع للاختبار
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {hasData && (
            <button onClick={onClear} style={{
              padding: '5px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700,
              border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.07)',
              color: '#ef4444', cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
            }}>
              مسح الكل
            </button>
          )}
          <button onClick={() => setOpen(v => !v)} style={{
            padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800,
            border: `1px solid rgba(223,171,112,0.3)`,
            background: open ? `linear-gradient(135deg,${GD},${G})` : 'rgba(223,171,112,0.09)',
            color: open ? NAV : G, cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
            display: 'flex', alignItems: 'center', gap: 5, transition: 'all .2s',
          }}>
            <Sparkles size={11} />
            اختر نموذج
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: .18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: '100%', right: 0, left: 0, zIndex: 50,
              marginTop: 6, borderRadius: 14,
              background: 'rgba(7,15,28,0.98)',
              border: '1px solid rgba(223,171,112,0.18)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(223,171,112,0.07)' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}>اختر نموذج للملء التلقائي</span>
            </div>
            {PRESETS.map((p, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { onApply(p); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'right', transition: 'background .15s',
                  borderBottom: i < PRESETS.length - 1 ? '1px solid rgba(223,171,112,0.05)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(223,171,112,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(223,171,112,0.08)', border: '1px solid rgba(223,171,112,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  {p.emoji}
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 800, marginBottom: 2 }}>{p.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10 }}>{p.form.title}</div>
                </div>
                <div style={{ color: 'rgba(223,171,112,0.4)', fontSize: 10 }}>←</div>
              </motion.button>
            ))}

            {/* Custom random fill */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                const ts = Date.now().toString().slice(-4)
                onApply({
                  form: {
                    title: `دورة تجريبية ${ts}`,
                    shortDescription: 'وصف مختصر تجريبي للدورة',
                    description: 'وصف تفصيلي تجريبي — هذا النص للاختبار فقط',
                    category: 'quran', level: 'beginner',
                    teacherName: 'معلم تجريبي',
                    duration: 'شهران', lessonsCount: '12',
                    pricingType: 'contact', whatsapp: '966500000000',
                    ctaText: 'تواصل الآن', isPublished: false, featured: false, priorityOrder: ts,
                  },
                  arr: {
                    learningOutcomes: 'هدف تعليمي أول\nهدف تعليمي ثاني',
                    targetStudents: 'المبتدئون\nالمتوسطون',
                    highlights: 'ميزة أولى\nميزة ثانية',
                    tags: `تجريبي، اختبار، ${ts}`,
                  },
                })
                setOpen(false)
              }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 16px',
                background: 'rgba(223,171,112,0.04)', border: 'none',
                borderTop: '1px solid rgba(223,171,112,0.07)',
                cursor: 'pointer', textAlign: 'right',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(223,171,112,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(223,171,112,0.04)'}
            >
              <Zap size={13} style={{ color: G }} />
              <span style={{ color: G, fontSize: 11, fontWeight: 800, fontFamily: 'Cairo, sans-serif' }}>ملء عشوائي سريع (timestamp)</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETION BAR
// ─────────────────────────────────────────────────────────────────────────────
function CompletionBar({ pct, missing }) {
  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? G : '#f59e0b'
  const [showMissing, setShowMissing] = useState(false)

  const rings = [25, 50, 75, 100]

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700 }}>اكتمال الدورة</span>
        <button onClick={() => setShowMissing(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 12, fontWeight: 900, color,
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
          padding: '2px 8px', borderRadius: 20,
          background: `${color}14`,
        }}>
          <span>{pct}%</span>
          {missing.length > 0 && <AlertCircle size={11} />}
        </button>
      </div>

      {/* Segmented bar */}
      <div style={{ display: 'flex', gap: 3, height: 6 }}>
        {rings.map((r, i) => {
          const segFilled = pct >= r
          const segPartial = !segFilled && pct > (rings[i - 1] || 0)
          const segPct = segPartial ? ((pct - (rings[i - 1] || 0)) / 25) * 100 : 0
          return (
            <div key={r} style={{ flex: 1, borderRadius: 10, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
              <motion.div
                animate={{ width: segFilled ? '100%' : segPartial ? `${segPct}%` : '0%' }}
                transition={{ duration: .5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', background: `linear-gradient(90deg,${GD},${color})`, borderRadius: 10 }}
              />
            </div>
          )
        })}
      </div>

      {/* Segment labels */}
      <div style={{ display: 'flex', marginTop: 3 }}>
        {['أساسي', 'جيد', 'ممتاز', 'مكتمل'].map((l, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: pct >= rings[i] ? 'rgba(223,171,112,0.5)' : 'rgba(255,255,255,0.15)', fontWeight: 600, transition: 'color .3s' }}>
            {l}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showMissing && missing.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }}
            style={{ overflow: 'hidden', marginTop: 10 }}>
            <div style={{ padding: '10px 13px', borderRadius: 10, background: 'rgba(7,15,28,0.7)', border: '1px solid rgba(223,171,112,0.1)' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, marginBottom: 7 }}>الحقول الموصى بإكمالها:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {missing.map(m => (
                  <span key={m} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: 'rgba(223,171,112,0.07)', color: 'rgba(223,171,112,0.55)', border: '1px solid rgba(223,171,112,0.12)' }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM SECTION
// ─────────────────────────────────────────────────────────────────────────────
function FormSection({ id, label, icon: Icon, desc, open, onToggle, children, filled, badge }) {
  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${open ? 'rgba(223,171,112,0.2)' : 'rgba(223,171,112,0.07)'}`,
      background: open ? 'rgba(11,23,46,0.6)' : 'rgba(7,15,28,0.3)',
      overflow: 'hidden', transition: 'all .2s ease',
      boxShadow: open ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
    }}>
      <button onClick={() => onToggle(id)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 11,
        padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
      }}>
        {/* Icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: open ? `linear-gradient(135deg,${GD}28,${G}14)` : 'rgba(255,255,255,0.03)',
          border: `1px solid ${open ? 'rgba(223,171,112,0.25)' : 'rgba(255,255,255,0.05)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s',
        }}>
          <Icon size={13} style={{ color: open ? G : 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Labels */}
        <div style={{ flex: 1, textAlign: 'right', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: open ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 800, transition: 'color .2s' }}>{label}</span>
            {badge && (
              <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 10, background: 'rgba(223,171,112,0.12)', color: 'rgba(223,171,112,0.6)', border: '1px solid rgba(223,171,112,0.15)' }}>{badge}</span>
            )}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 1 }}>{desc}</div>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {filled && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
              <CheckCircle size={13} style={{ color: '#22c55e' }} />
            </motion.div>
          )}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: .2 }}>
            <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.18)' }} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: .25, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '2px 16px 16px', borderTop: '1px solid rgba(223,171,112,0.06)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function _GoldBtn({ children, onClick, disabled, sm }) {
  return (
    <motion.button whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick} disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: sm ? '6px 13px' : '9px 18px',
        minHeight: sm ? 34 : 40, borderRadius: 10, border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: sm ? 11 : 13,
        opacity: disabled ? 0.55 : 1,
        background: `linear-gradient(135deg,${GD},${G})`, color: NAV,
        boxShadow: disabled ? 'none' : `0 0 20px rgba(223,171,112,0.25)`,
        whiteSpace: 'nowrap',
      }}>
      {children}
    </motion.button>
  )
}

function _GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      minHeight: 40, padding: '9px 16px', borderRadius: 10,
      border: '1px solid rgba(223,171,112,0.12)',
      background: 'transparent', color: 'rgba(255,255,255,0.35)',
      fontFamily: 'Cairo, sans-serif', fontSize: 13, cursor: 'pointer', transition: 'all .18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.28)'; e.currentTarget.style.color = G }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(223,171,112,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
    >{children}</button>
  )
}

function _LuxInput({ label, value, onChange, placeholder, type = 'text', rows, dir, disabled, hint }) {
  const [focused, setFocused] = useState(false)
  const Tag = rows ? 'textarea' : 'input'
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
          <span style={{ color: G, fontSize: 11, fontWeight: 700 }}>{label}</span>
          {hint && <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10 }}>{hint}</span>}
        </div>
      )}
      <Tag value={value} onChange={onChange} placeholder={placeholder}
        type={type} rows={rows} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '9px 12px', boxSizing: 'border-box',
          background: focused ? 'rgba(8,17,31,0.9)' : 'rgba(7,15,28,0.55)',
          border: `1px solid ${focused ? 'rgba(223,171,112,0.4)' : 'rgba(223,171,112,0.1)'}`,
          borderRadius: 10, color: '#fff', fontSize: 12,
          fontFamily: 'Cairo, sans-serif', outline: 'none',
          resize: rows ? 'vertical' : 'none', direction: dir || 'rtl',
          boxShadow: focused ? '0 0 0 3px rgba(223,171,112,0.06)' : 'none',
          opacity: disabled ? .4 : 1, cursor: disabled ? 'not-allowed' : 'auto',
          transition: 'all .2s ease',
        }}
      />
    </div>
  )
}

function _LuxSelect({ label, value, onChange, children }) {
  return (
    <div>
      {label && <div style={{ color: G, fontSize: 11, fontWeight: 700, marginBottom: 5 }}>{label}</div>}
      <select value={value} onChange={onChange} style={{
        width: '100%', padding: '9px 12px', boxSizing: 'border-box',
        background: 'rgba(7,15,28,0.55)', border: '1px solid rgba(223,171,112,0.1)',
        borderRadius: 10, color: '#fff', fontSize: 12,
        fontFamily: 'Cairo, sans-serif', outline: 'none',
      }}>{children}</select>
    </div>
  )
}

function LuxToggle({ checked, onChange, label, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700 }}>{label}</div>
        {desc && <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 1 }}>{desc}</div>}
      </div>
      <div onClick={() => onChange(!checked)} style={{
        width: 42, height: 23, borderRadius: 12, position: 'relative', flexShrink: 0,
        background: checked ? `linear-gradient(135deg,${GD},${G})` : 'rgba(255,255,255,0.07)',
        border: `1px solid ${checked ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
        cursor: 'pointer', transition: 'all .22s ease',
      }}>
        <motion.div animate={{ x: checked ? 21 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          style={{ position: 'absolute', top: 2.5, width: 16, height: 16, borderRadius: '50%', background: checked ? NAV : 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  )
}

function TagPillInput({ value, onChange, placeholder }) {
  const [input, setInput] = useState('')
  const tags = value ? value.split(/[،,]/).map(s => s.trim()).filter(Boolean) : []
  const addTag = (t) => {
    const trimmed = t.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed].join('، '))
    setInput('')
  }
  const removeTag = (tag) => onChange(tags.filter(t => t !== tag).join('، '))
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === '،' || e.key === ',') { e.preventDefault(); addTag(input) }
    if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1])
  }
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center',
      minHeight: 40, padding: '5px 10px', borderRadius: 10,
      background: 'rgba(7,15,28,0.55)', border: '1px solid rgba(223,171,112,0.1)',
      boxSizing: 'border-box', cursor: 'text',
    }} onClick={e => e.currentTarget.querySelector('input')?.focus()}>
      <AnimatePresence>
        {tags.map(t => (
          <motion.span key={t}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
              background: 'rgba(223,171,112,0.1)', color: G, border: '1px solid rgba(223,171,112,0.18)',
            }}>
            {t}
            <button onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(223,171,112,0.5)', display: 'flex', padding: 0 }}>
              <X size={8} />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
        onBlur={() => input && addTag(input)} placeholder={tags.length ? '' : placeholder}
        style={{ flex: 1, minWidth: 70, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 11, fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE FORM
// ─────────────────────────────────────────────────────────────────────────────
function CourseForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_COURSE, ...(editing || {}) })
  const [arrDraft, setArrDraft] = useState({
    learningOutcomes: editing?.learningOutcomes?.join('\n') || '',
    targetStudents:   editing?.targetStudents?.join('\n')   || '',
    highlights:       editing?.highlights?.join('\n')        || '',
    tags:             editing?.tags?.join('، ')             || '',
  })
  const [openSections, setOpenSections] = useState({
    basic: true, media: false, details: false, pricing: false, content: false, publish: false,
  })
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState(null)
  const autoSaveTimer = useRef(null)

  // Load draft for new courses
  useEffect(() => {
    if (!editing) {
      const draft = loadDraft()
      if (draft) { setForm(p => ({ ...p, ...draft.form })); setArrDraft(p => ({ ...p, ...draft.arrDraft })) }
    }
  }, [])

  // Autosave
  useEffect(() => {
    if (!editing) {
      clearTimeout(autoSaveTimer.current)
      autoSaveTimer.current = setTimeout(() => {
        saveDraft(form, arrDraft)
        setAutoSaveStatus('saved')
        setTimeout(() => setAutoSaveStatus(null), 2200)
      }, 1500)
    }
    setIsDirty(true)
    return () => clearTimeout(autoSaveTimer.current)
  }, [form, arrDraft])

  // Ctrl+S
  useEffect(() => {
    const h = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave() } }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [form, arrDraft])

  const { pct, missing } = useMemo(() => calcCompletion(form, arrDraft), [form, arrDraft])
  const hasData = !!(form.title || form.shortDescription || arrDraft.tags)

  const setF   = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setArr = (k, v) => setArrDraft(p => ({ ...p, [k]: v }))
  const slugify = t => t.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]/g, '').slice(0, 80)
  const toggle  = (id) => setOpenSections(p => ({ ...p, [id]: !p[id] }))

  const isFilled = (sid) => {
    if (sid === 'basic')   return !!(form.title || form.shortDescription)
    if (sid === 'media')   return !!(form.thumbnail || form.heroVideo)
    if (sid === 'details') return !!(form.level || form.duration)
    if (sid === 'pricing') return !!(form.pricingType)
    if (sid === 'content') return !!(arrDraft.learningOutcomes || arrDraft.tags)
    if (sid === 'publish') return form.isPublished
    return false
  }

  const applyPreset = (p) => {
    setForm({ ...EMPTY_COURSE, ...p.form, slug: slugify(p.form.title) })
    setArrDraft({ ...EMPTY_ARR, ...p.arr })
    setOpenSections({ basic: true, media: false, details: true, pricing: true, content: true, publish: true })
    qToast.success?.('تم تطبيق النموذج ✓') || console.log('preset applied')
  }

  const clearAll = () => {
    setForm({ ...EMPTY_COURSE })
    setArrDraft({ ...EMPTY_ARR })
    clearDraft()
  }

  const handleSave = async () => {
    if (!form.title?.trim()) {
      setOpenSections(p => ({ ...p, basic: true }))
      qToast.error('عنوان الدورة مطلوب')
      return
    }
    setSaving(true)
    try {
      const payload = buildPayload(form, arrDraft)
      if (editing) {
        await courseService.adminUpdate(editing._id, payload)
        qToast.success('تم التحديث ✓')
      } else {
        await courseService.adminCreate(payload)
        qToast.success('تمت إضافة الدورة ✓')
        clearDraft()
      }
      setIsDirty(false)
      onSave?.()
    } catch (e) {
      qToast.error(e.response?.data?.message || 'حدث خطأ')
    } finally {
      setSaving(false)
    }
  }

  const CAT = [['tajweed','التجويد'],['quran','القرآن الكريم'],['memorization','الحفظ'],['recitation','التلاوة'],['ijazah','الإجازة'],['correction','التصحيح'],['arabic','العربية'],['foundation','التأسيس'],['other','أخرى']]
  const LVL = [['beginner','مبتدئ'],['intermediate','متوسط'],['advanced','متقدم'],['all','الجميع']]
  const Grid2 = ({ children, cols }) => (
    <div style={{ display: 'grid', gridTemplateColumns: cols || 'repeat(auto-fit, minmax(185px, 1fr))', gap: 10 }}>
      {children}
    </div>
  )

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif', paddingBottom: 100 }}>

      {/* Quick Fill — only for new courses */}
      {!editing && <QuickFillBar onApply={applyPreset} onClear={clearAll} hasData={hasData} />}

      {/* Completion */}
      <CompletionBar pct={pct} missing={missing} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* ── 1: Basic ── */}
        <FormSection id="basic" label="المعلومات الأساسية" icon={FileText}
          desc="العنوان والوصف والمعلم" open={openSections.basic} onToggle={toggle} filled={isFilled('basic')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            <_LuxInput label="عنوان الدورة *" value={form.title}
              onChange={e => { setF('title', e.target.value); if (!editing) setF('slug', slugify(e.target.value)) }}
              placeholder="مثال: دورة التجويد الشاملة للمبتدئين" />
            <Grid2>
              <_LuxInput label="الـ Slug" value={form.slug} onChange={e => setF('slug', e.target.value)} dir="ltr" hint="تلقائي" />
              <_LuxInput label="اسم المعلم" value={form.teacherName} onChange={e => setF('teacherName', e.target.value)} placeholder="الشيخ محمد..." />
            </Grid2>
            <_LuxInput label="وصف مختصر" value={form.shortDescription} onChange={e => setF('shortDescription', e.target.value)} rows={2} placeholder="جملة أو جملتان..." />
            <_LuxInput label="وصف تفصيلي" value={form.description} onChange={e => setF('description', e.target.value)} rows={3} placeholder="اشرح الدورة بالتفصيل..." />
          </div>
        </FormSection>

        {/* ── 2: Media ── */}
        <FormSection id="media" label="الوسائط" icon={Image}
          desc="الصورة والفيديو" open={openSections.media} onToggle={toggle} filled={isFilled('media')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            <ImageUpload label="صورة الدورة" value={form.thumbnail} onChange={v => setF('thumbnail', v)} hint="رفع أو رابط" />
            <_LuxInput label="فيديو يوتيوب" value={form.heroVideo} onChange={e => setF('heroVideo', e.target.value)}
              dir="ltr" placeholder="https://youtube.com/..." hint="اختياري" />
          </div>
        </FormSection>

        {/* ── 3: Details ── */}
        <FormSection id="details" label="تفاصيل الدورة" icon={BarChart2}
          desc="الفئة والمستوى والمدة" open={openSections.details} onToggle={toggle} filled={isFilled('details')}>
          <div style={{ marginTop: 12 }}>
            <Grid2>
              <_LuxSelect label="الفئة" value={form.category} onChange={e => setF('category', e.target.value)}>
                {CAT.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </_LuxSelect>
              <_LuxSelect label="المستوى" value={form.level} onChange={e => setF('level', e.target.value)}>
                {LVL.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </_LuxSelect>
              <_LuxInput label="المدة" value={form.duration} onChange={e => setF('duration', e.target.value)} placeholder="3 أشهر" />
              <_LuxInput label="عدد الدروس" value={form.lessonsCount} onChange={e => setF('lessonsCount', e.target.value)} type="number" placeholder="0" />
            </Grid2>
          </div>
        </FormSection>

        {/* ── 4: Pricing ── */}
        <FormSection id="pricing" label="التسعير والتواصل" icon={DollarSign}
          desc="السعر وزر الاشتراك" open={openSections.pricing} onToggle={toggle} filled={isFilled('pricing')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            <Grid2>
              <_LuxSelect label="نوع التسعير" value={form.pricingType} onChange={e => setF('pricingType', e.target.value)}>
                <option value="free">🎁 مجاني</option>
                <option value="paid">💳 مدفوع</option>
                <option value="contact">📱 تواصل</option>
              </_LuxSelect>
              {form.pricingType === 'paid' && (
                <_LuxInput label="السعر" value={form.price} onChange={e => setF('price', e.target.value)} type="number" placeholder="0" />
              )}
            </Grid2>
            <Grid2>
              <_LuxInput label="رقم واتساب" value={form.whatsapp} onChange={e => setF('whatsapp', e.target.value)} dir="ltr" placeholder="966500000000" />
              <_LuxInput label="نص زر الاشتراك" value={form.ctaText} onChange={e => setF('ctaText', e.target.value)} placeholder="اشترك الآن" />
            </Grid2>
            <LuxToggle checked={!!form.showPrice} onChange={v => setF('showPrice', v)} label="إظهار السعر" desc="يظهر السعر للزوار في صفحة الدورة" />
          </div>
        </FormSection>

        {/* ── 5: Content ── */}
        <FormSection id="content" label="محتوى التعلم" icon={Users}
          desc="الأهداف والمستهدفون والوسوم" open={openSections.content} onToggle={toggle} filled={isFilled('content')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            <_LuxInput label="ماذا ستتعلم؟" value={arrDraft.learningOutcomes}
              onChange={e => setArr('learningOutcomes', e.target.value)}
              rows={3} placeholder={"سطر لكل نقطة:\nتعلم أحكام التجويد\nتحسين التلاوة"} hint="سطر = نقطة" />
            <_LuxInput label="لمن هذه الدورة؟" value={arrDraft.targetStudents}
              onChange={e => setArr('targetStudents', e.target.value)} rows={2} placeholder="المبتدئون..." />
            <_LuxInput label="المميزات" value={arrDraft.highlights}
              onChange={e => setArr('highlights', e.target.value)} rows={2} placeholder="شهادة معتمدة..." />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                <span style={{ color: G, fontSize: 11, fontWeight: 700 }}>الوسوم</span>
                <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10 }}>Enter أو فاصلة للإضافة</span>
              </div>
              <TagPillInput value={arrDraft.tags} onChange={v => setArr('tags', v)} placeholder="تجويد، قرآن..." />
            </div>
          </div>
        </FormSection>

        {/* ── 6: Publish ── */}
        <FormSection id="publish" label="النشر والظهور" icon={Globe}
          desc="الترتيب وحالة النشر" open={openSections.publish} onToggle={toggle} filled={isFilled('publish')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <_LuxInput label="ترتيب الأولوية" value={form.priorityOrder}
              onChange={e => setF('priorityOrder', e.target.value)} type="number" hint="رقم أصغر = أعلى" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px', borderRadius: 10, background: 'rgba(7,15,28,0.4)', border: '1px solid rgba(223,171,112,0.07)' }}>
              <LuxToggle checked={!!form.isPublished} onChange={v => setF('isPublished', v)}
                label="نشر الدورة" desc="تصبح مرئية للزوار فور النشر" />
              <div style={{ height: 1, background: 'rgba(223,171,112,0.06)' }} />
              <LuxToggle checked={!!form.featured} onChange={v => setF('featured', v)}
                label="دورة مميزة ⭐" desc="تظهر في الصدارة وأعلى القوائم" />
            </div>
          </div>
        </FormSection>

      </div>

      {/* ── Sticky Footer ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 680,
        zIndex: 90, padding: '10px 16px 14px',
        background: 'linear-gradient(0deg, rgba(4,8,22,1) 70%, transparent)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', borderRadius: 12,
          background: 'rgba(7,15,28,0.95)',
          border: '1px solid rgba(223,171,112,0.12)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.5)',
          flexWrap: 'wrap', gap: 8,
        }}>
          {/* Status pill */}
          <div style={{ minWidth: 100 }}>
            <AnimatePresence mode="wait">
              {autoSaveStatus === 'saved' ? (
                <motion.div key="saved" initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#22c55e', fontSize: 10, fontWeight: 700 }}>
                  <CheckCircle size={11} /> حُفظت المسودة
                </motion.div>
              ) : isDirty ? (
                <motion.div key="dirty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>
                  <Clock size={11} /> غير محفوظ
                </motion.div>
              ) : (
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>Ctrl+S للحفظ</div>
              )}
            </AnimatePresence>
          </div>

          {/* Completion mini */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}>
            <div style={{ height: 3, flex: 1, maxWidth: 80, borderRadius: 6, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${pct}%` }} transition={{ duration: .4 }}
                style={{ height: '100%', background: pct >= 80 ? '#22c55e' : G, borderRadius: 6 }} />
            </div>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>{pct}%</span>
          </div>

          <div style={{ display: 'flex', gap: 7 }}>
            <_GhostBtn onClick={onCancel}>إلغاء</_GhostBtn>
            <_GoldBtn onClick={handleSave} disabled={saving}>
              {saving
                ? <div style={{ width: 12, height: 12, border: `2px solid ${NAV}55`, borderTopColor: NAV, borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                : <Save size={12} />}
              {editing ? 'حفظ التعديلات' : 'إضافة الدورة'}
            </_GoldBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE ROW
// ─────────────────────────────────────────────────────────────────────────────
function CourseRow({ c, onEdit, onDelete, onToggle, CAT }) {
  return (
    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ borderBottom: '1px solid rgba(223,171,112,0.05)', transition: 'background .15s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(223,171,112,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <td style={{ padding: '11px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {c.thumbnail
            ? <img src={c.thumbnail.startsWith('http') ? c.thumbnail : `https://api.quranei.com/api/media/stream/${c.thumbnail}`}
                alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(223,171,112,0.12)' }} />
            : <div style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0, background: 'rgba(17,40,71,0.6)', border: '1px solid rgba(223,171,112,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={13} style={{ color: 'rgba(223,171,112,0.3)' }} />
              </div>}
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{c.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: 10, marginTop: 1 }}>{c.slug}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '11px 14px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: 'rgba(223,171,112,0.07)', color: G, border: '1px solid rgba(223,171,112,0.12)', whiteSpace: 'nowrap' }}>
          {CAT[c.category] || c.category}
        </span>
      </td>
      <td style={{ padding: '11px 14px' }}>
        <button onClick={() => onToggle(c, 'isPublished')} style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700,
          border: '1px solid', borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
          fontFamily: 'Cairo, sans-serif', minHeight: 28, whiteSpace: 'nowrap', transition: 'all .15s',
          ...(c.isPublished
            ? { background: 'rgba(34,197,94,0.07)', color: '#22c55e', borderColor: 'rgba(34,197,94,0.2)' }
            : { background: 'rgba(239,68,68,0.07)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }),
        }}>
          {c.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
          {c.isPublished ? 'منشور' : 'مسودة'}
        </button>
      </td>
      <td style={{ padding: '11px 14px' }}>
        <button onClick={() => onToggle(c, 'featured')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: c.featured ? G : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, transition: 'color .15s' }}>
          {c.featured ? <Star size={14} fill={G} style={{ color: G }} /> : <StarOff size={14} />}
        </button>
      </td>
      <td style={{ padding: '11px 14px' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {[
            { fn: () => onEdit(c),       icon: Edit3,  col: 'rgba(223,171,112,0.18)', bg: 'rgba(223,171,112,0.05)', hbg: 'rgba(223,171,112,0.12)', tc: G },
            { fn: () => onDelete(c._id), icon: Trash2, col: 'rgba(239,68,68,0.18)',   bg: 'rgba(239,68,68,0.05)',   hbg: 'rgba(239,68,68,0.12)',   tc: '#ef4444' },
          ].map(({ fn, icon: Icon, col, bg, hbg, tc }, bi) => (
            <button key={bi} onClick={fn} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${col}`, background: bg, color: tc, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = hbg}
              onMouseLeave={e => e.currentTarget.style.background = bg}>
              <Icon size={11} />
            </button>
          ))}
        </div>
      </td>
    </motion.tr>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE PANEL
// ─────────────────────────────────────────────────────────────────────────────
function SlidePanel({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 81,
              width: '100%', maxWidth: 680,
              background: 'rgba(4,8,22,0.99)',
              borderRight: '1px solid rgba(223,171,112,0.12)',
              display: 'flex', flexDirection: 'column',
              boxShadow: '12px 0 70px rgba(0,0,0,0.8)',
            }}>

            {/* Header */}
            <div style={{
              padding: '0 18px', height: 58, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid rgba(223,171,112,0.07)',
              background: 'rgba(11,23,46,0.6)',
            }}>
              <div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>{title}</div>
                {subtitle && <div style={{ color: 'rgba(223,171,112,0.4)', fontSize: 10, marginTop: 1 }}>{subtitle}</div>}
              </div>
              <button onClick={onClose} style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#ef4444' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
              >
                <X size={13} />
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 0', direction: 'rtl' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function CoursesPanel() {
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('')

  const CAT = { tajweed: 'التجويد', quran: 'القرآن', memorization: 'الحفظ', recitation: 'التلاوة', ijazah: 'الإجازة', correction: 'التصحيح', arabic: 'عربية', foundation: 'تأسيس', other: 'أخرى' }

  const load = useCallback(() => {
    setLoading(true)
    courseService.adminGetAll({ search, ...(filter !== '' ? { isPublished: filter } : {}) })
      .then(r => setCourses(r.data.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [search, filter])

  useEffect(load, [load])

  const openCreate  = () => { setEditing(null); setShowForm(true) }
  const openEdit    = c  => { setEditing(c);    setShowForm(true) }
  const handleSaved = () => { setShowForm(false); load() }

  const handleDelete = async id => {
    if (!window.confirm('حذف الدورة؟')) return
    await courseService.adminDelete(id).then(load).catch(() => qToast.error('خطأ'))
    qToast.success('تم الحذف')
  }

  const handleToggle = async (c, field) => {
    await courseService.adminUpdate(c._id, { [field]: !c[field] }).then(load)
  }

  const inp = {
    width: '100%', padding: '9px 12px', background: 'rgba(7,15,28,0.6)',
    border: '1px solid rgba(223,171,112,0.1)', borderRadius: 10, color: '#fff',
    fontSize: 12, fontFamily: 'Cairo, sans-serif', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes adminPulse { 0%,100%{opacity:.35} 50%{opacity:.62} }
        option { background: #08111f; color: #fff; }
      `}</style>

      <div style={{ direction: 'rtl' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(15px,3vw,18px)', fontWeight: 900, margin: 0, lineHeight: 1.2 }}>إدارة الدورات</h2>
            <div style={{ color: 'rgba(223,171,112,0.4)', fontSize: 11, marginTop: 3 }}>
              {loading ? '...' : `${courses.length} دورة`}
            </div>
          </div>
          <_GoldBtn onClick={openCreate}><Plus size={13} /> إضافة دورة</_GoldBtn>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: '1 1 150px', maxWidth: 260 }}>
            <Search size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(223,171,112,0.4)', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." style={{ ...inp, paddingRight: 32 }} />
          </div>
          {[{ v: '', l: 'الكل' }, { v: 'true', l: 'منشورة' }, { v: 'false', l: 'مسودات' }].map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)} style={{
              minHeight: 38, padding: '7px 14px', borderRadius: 9, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', border: '1px solid', fontFamily: 'Cairo, sans-serif', transition: 'all .18s', whiteSpace: 'nowrap',
              ...(filter === f.v
                ? { background: `linear-gradient(135deg,${GD},${G})`, color: NAV, borderColor: 'transparent' }
                : { background: 'rgba(17,40,71,0.35)', color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(223,171,112,0.08)' }),
            }}>{f.l}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'rgba(11,23,46,0.45)', backdropFilter: 'blur(22px)', border: '1px solid rgba(223,171,112,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ background: 'rgba(17,40,71,0.5)', borderBottom: '1px solid rgba(223,171,112,0.08)' }}>
                  {['الدورة', 'الفئة', 'الحالة', 'مميز', 'إجراءات'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'right', color: 'rgba(223,171,112,0.6)', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(4).fill(0).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(223,171,112,0.04)' }}>
                      {Array(5).fill(0).map((_, j) => (
                        <td key={j} style={{ padding: '12px 14px' }}>
                          <div style={{ height: 11, borderRadius: 6, background: 'rgba(17,40,71,0.5)', animation: 'adminPulse 1.5s infinite', animationDelay: `${j * 0.1}s` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                  : courses.length === 0
                    ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '52px 16px', textAlign: 'center' }}>
                          <BookOpen size={34} style={{ color: 'rgba(223,171,112,0.15)', margin: '0 auto 10px', display: 'block' }} />
                          <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: 13, marginBottom: 14 }}>لا توجد دورات بعد</div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <_GoldBtn onClick={openCreate} sm><Plus size={12} /> أضف أول دورة</_GoldBtn>
                          </div>
                        </td>
                      </tr>
                    )
                    : courses.map(c => (
                      <CourseRow key={c._id} c={c} CAT={CAT}
                        onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} />
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SlidePanel
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
        subtitle={editing ? editing.title : 'اختر نموذجاً أو ابدأ من الصفر'}
      >
        <CourseForm editing={editing} onSave={handleSaved} onCancel={() => setShowForm(false)} />
      </SlidePanel>
    </>
  )
}