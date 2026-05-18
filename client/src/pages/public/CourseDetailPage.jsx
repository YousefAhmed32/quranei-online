import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Clock, Users, Star, CheckCircle2, ChevronRight,
  MessageCircle, Play, Share2, Heart, Globe, BarChart2,
  Award, ChevronDown, ChevronUp, User, ArrowRight
} from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import useAuthStore from '../../store/authStore'
import { courseService } from '../../services/api'

// ─── CONSTANTS ───────────────────────────────────────────────────
const G = '#dfab70'
const GD = '#c48b45'
const G_DIM = 'rgba(223,171,112,0.1)'
const G_BORDER = 'rgba(223,171,112,0.18)'
const G_BORDER_HOVER = 'rgba(223,171,112,0.35)'
const BG = '#070f1c'
const BG2 = '#0d1a2e'
const BG3 = '#112040'
const TEXT = '#c8d8ea'
const TEXT_MUTED = '#5e779a'
const TEXT_FAINT = '#3a5070'

const LEVEL_MAP = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
  all: 'جميع المستويات',
}

// ─── UTILS ───────────────────────────────────────────────────────
function getYoutubeEmbed(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&autoplay=1` : url
}

function buildImgSrc(thumb) {
  if (!thumb) return null
  return thumb.startsWith('http') ? thumb : `/api/media/stream/${thumb}`
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────

/** Floating animated background grain */
function GrainOverlay() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '200px',
      }}
    />
  )
}

/** Hero section with parallax-ready structure */
function HeroSection({ course, imgSrc }) {
  return (
    <section style={{ position: 'relative', minHeight: '68vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
      {/* layered background */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #09142a 0%, #112847 100%)` }} />
      {imgSrc && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #070f1c 20%, rgba(7,15,28,0.75) 60%, rgba(7,15,28,0.2) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 45% at 50% 105%, rgba(144,97,48,0.2) 0%, transparent 70%)' }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: TEXT_FAINT, marginBottom: 22, flexWrap: 'wrap' }}>
          {[['/', 'الرئيسية'], ['/courses', 'الدورات']].map(([to, label]) => (
            <span key={to} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link to={to} style={{ color: TEXT_FAINT, textDecoration: 'none', transition: '.2s' }}
                onMouseEnter={e => e.target.style.color = G}
                onMouseLeave={e => e.target.style.color = TEXT_FAINT}>{label}</Link>
              <ChevronRight size={10} style={{ transform: 'rotate(180deg)', opacity: 0.5 }} />
            </span>
          ))}
          <span style={{ color: TEXT, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>
        </nav>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {course.featured && <HeroBadge icon={<Star size={11} fill={G} />} label="دورة مميزة" />}
          {course.pricingType === 'free' && <HeroBadge icon="✓" label="مجانية" color="#22c55e" borderColor="rgba(34,197,94,0.3)" bg="rgba(34,197,94,0.1)" />}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          style={{ fontSize: 'clamp(26px, 4.5vw, 46px)', fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 14 }}>
          {course.title}
        </motion.h1>

        {course.shortDescription && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            style={{ fontSize: 16, color: TEXT_MUTED, lineHeight: 1.85, marginBottom: 24, maxWidth: 640 }}>
            {course.shortDescription}
          </motion.p>
        )}

        {/* Meta pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            course.level && { icon: <BarChart2 size={13} />, label: LEVEL_MAP[course.level], gold: true },
            course.duration && { icon: <Clock size={13} />, label: course.duration },
            course.lessonsCount > 0 && { icon: <BookOpen size={13} />, label: `${course.lessonsCount} درس` },
            course.language && { icon: <Globe size={13} />, label: course.language },
          ].filter(Boolean).map((p, i) => (
            <MetaPill key={i} icon={p.icon} label={p.label} gold={p.gold} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function HeroBadge({ icon, label, color = G, borderColor = G_BORDER, bg = G_DIM }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px',
      borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: bg, border: `1px solid ${borderColor}`, color,
    }}>
      {icon} {label}
    </span>
  )
}

function MetaPill({ icon, label, gold }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px',
      borderRadius: 10, fontSize: 12, fontWeight: 600,
      background: 'rgba(17,40,71,0.65)', border: `1px solid ${G_BORDER}`,
      backdropFilter: 'blur(8px)', color: gold ? G : TEXT_MUTED,
    }}>
      {icon} {label}
    </span>
  )
}

/** Sticky top bar */
function TopBar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(7,15,28,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(223,171,112,0.1)' : '1px solid transparent',
      padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all .3s',
    }}>
      <Link to="/courses" style={{
        display: 'flex', alignItems: 'center', gap: 7, color: TEXT_MUTED,
        textDecoration: 'none', fontSize: 13, transition: '.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = G}
        onMouseLeave={e => e.currentTarget.style.color = TEXT_MUTED}>
        <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} />
        جميع الدورات
      </Link>
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ icon: <Share2 size={14} />, title: 'مشاركة' }, { icon: <Heart size={14} />, title: 'حفظ' }].map((b, i) => (
          <button key={i} title={b.title} style={{
            width: 34, height: 34, borderRadius: 9, background: G_DIM,
            border: `1px solid ${G_BORDER}`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: G, transition: '.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(223,171,112,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = G_DIM}>
            {b.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

/** YouTube embed with poster-first UX */
function VideoPlayer({ url, poster }) {
  const [playing, setPlaying] = useState(false)
  const embed = getYoutubeEmbed(url)
  if (!embed) return null
  return (
    <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', border: `1px solid ${G_BORDER}` }}>
      {playing ? (
        <iframe src={embed} title="Course Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen style={{ width: '100%', height: '100%', display: 'block', border: 'none' }} />
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }} onClick={() => setPlaying(true)}>
          {poster
            ? <img src={poster} alt="Video thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', background: BG3 }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,15,28,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              style={{
                width: 68, height: 68, borderRadius: '50%', background: G,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 0 14px rgba(223,171,112,0.18), 0 8px 30px rgba(223,171,112,0.35)`,
              }}>
              <Play size={24} fill={BG} color={BG} style={{ marginRight: -3 }} />
            </motion.div>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, opacity: 0.9 }}>شاهد نبذة عن الدورة</span>
          </div>
        </div>
      )}
    </div>
  )
}

/** Collapsible section card */
function SectionCard({ icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <motion.div layout
      style={{
        background: 'rgba(17,40,71,0.38)', border: `1px solid ${G_BORDER}`,
        borderRadius: 16, overflow: 'hidden', marginBottom: 18, transition: 'border-color .25s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = G_BORDER_HOVER}
      onMouseLeave={e => e.currentTarget.style.borderColor = G_BORDER}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '18px 22px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: G_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            {icon}
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={16} color={TEXT_MUTED} /> : <ChevronDown size={16} color={TEXT_MUTED} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}
            style={{ overflow: 'hidden', padding: '0 22px 20px' }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/** Learning outcomes 2-col grid */
function OutcomesGrid({ outcomes }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
      {outcomes.map((o, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(7,15,28,0.45)', border: '1px solid rgba(223,171,112,0.07)', transition: '.25s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = G_BORDER_HOVER}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(223,171,112,0.07)'}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: G_DIM, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <CheckCircle2 size={11} color={G} />
          </div>
          <span style={{ fontSize: 13, color: TEXT, lineHeight: 1.65 }}>{o}</span>
        </motion.div>
      ))}
    </div>
  )
}

/** WhatsApp CTA button */
function WhatsAppCTA({ course, user, size = 'md' }) {
  const handleEnroll = () => {
    const wa = course.whatsapp || '201008148164'
const lines = [
  'السلام عليكم ورحمة الله وبركاته',
  '',
  '━━━━━━━━━━━━━━━━━━',
  '✦ طلب تسجيل جديد ✦',
  '━━━━━━━━━━━━━━━━━━',
  '',
  `◆ اسم الدورة:`,
  `${course.title}`,
  '',
  
  course.shortDescription
    ? `◆ نبذة عن الدورة:\n${course.shortDescription}`
    : '',
    
  '',
  '━━━━━━━━━━━━━━━━━━',
  '',
  
  `◆ رابط الدورة:`,
  `${window.location.href}`,
  
  '',
  '━━━━━━━━━━━━━━━━━━',
  '',
  
  user?.name
    ? `◆ اسم الطالب:\n${user.name}`
    : '',
    
  user?.phone
    ? `◆ رقم الهاتف:\n${user.phone}`
    : '',
    
  '',
  '━━━━━━━━━━━━━━━━━━',
  '',
  '➜ أرجو تزويدي بتفاصيل الاشتراك وآلية البدء.',
].filter(Boolean).join('\n')
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(lines)}`, '_blank')
  }
  const isLg = size === 'lg'
  return (
    <motion.button onClick={handleEnroll} whileHover={{ scale: 1.025, y: -1 }} whileTap={{ scale: 0.97 }}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: isLg ? '15px 22px' : '13px 20px',
        borderRadius: 14, fontWeight: 900, fontSize: isLg ? 16 : 15, color: '#fff', border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
        boxShadow: '0 6px 28px rgba(37,211,102,0.35)',
      }}>
      <MessageCircle size={isLg ? 22 : 19} />
      <span>{course.ctaText || 'اشترك الآن عبر واتساب'}</span>
    </motion.button>
  )
}

/** Sticky sidebar card */
function SidebarCard({ course, user, imgSrc }) {
  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      border: `1px solid rgba(223,171,112,0.22)`,
      background: 'rgba(13,24,46,0.9)',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 0 60px rgba(223,171,112,0.06)',
    }}>
      {/* Thumbnail */}
      {imgSrc && (
        <div style={{ height: 170, overflow: 'hidden', position: 'relative' }}>
          <img src={imgSrc} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(13,24,46,0.85))' }} />
        </div>
      )}

      <div style={{ padding: 22 }}>
        {/* Price */}
        {course.showPrice && (
          <div style={{ textAlign: 'center', paddingBottom: 18, marginBottom: 18, borderBottom: `1px solid rgba(223,171,112,0.1)` }}>
            {course.pricingType === 'free' ? (
              <>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#22c55e' }}>مجاني تماماً 🎉</div>
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 4 }}>لا تحتاج بطاقة ائتمان</div>
              </>
            ) : course.price > 0 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: G, lineHeight: 1 }}>{course.price}</span>
                  <span style={{ fontSize: 14, color: TEXT_MUTED }}>{course.currency}</span>
                </div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', fontSize: 11, fontWeight: 700 }}>
                    ✓ ضمان استرداد 7 أيام
                  </span>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginBottom: 20 }}>
          <WhatsAppCTA course={course} user={user} size="lg" />
        </div>

        {/* Details */}
        <div>
          {[
            course.language && { emoji: '🌐', label: 'اللغة', value: course.language },
            course.level && { emoji: '📊', label: 'المستوى', value: LEVEL_MAP[course.level] },
            course.duration && { emoji: '⏱', label: 'المدة', value: course.duration },
            course.lessonsCount > 0 && { emoji: '📖', label: 'عدد الدروس', value: `${course.lessonsCount} درس` },
            course.teacherName && { emoji: '👨‍🏫', label: 'المعلم', value: course.teacherName },
          ].filter(Boolean).map((row, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 0', fontSize: 13,
              borderBottom: i < arr.length - 1 ? `1px solid rgba(223,171,112,0.07)` : 'none',
            }}>
              <span style={{ color: TEXT_MUTED }}><span style={{ marginLeft: 6 }}>{row.emoji}</span>{row.label}</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Instructor mini card */}
        {course.teacherName && (
          <div style={{
            marginTop: 18, display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 12,
            background: 'rgba(7,15,28,0.5)', border: `1px solid ${G_BORDER}`,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${G} 0%, ${GD} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 900, color: BG,
            }}>
              {course.teacherName.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{course.teacherName}</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>مدرب الدورة</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Loading skeleton */
function Skeleton() {
  return (
    <PublicLayout>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${G}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </PublicLayout>
  )
}

/** 404 state */
function NotFoundState() {
  return (
    <PublicLayout>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG, direction: 'rtl' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>📚</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>الدورة غير موجودة</h2>
          <p style={{ color: TEXT_MUTED, marginBottom: 24, fontSize: 14 }}>ربما تم حذف الدورة أو تغيير رابطها</p>
          <Link to="/courses" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12, background: G, color: BG,
            textDecoration: 'none', fontWeight: 700, fontSize: 14,
          }}>
            <BookOpen size={16} /> عرض جميع الدورات
          </Link>
        </div>
      </div>
    </PublicLayout>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function CourseDetailPage() {
  const { slug } = useParams()
  const { user } = useAuthStore()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    courseService.getBySlug(slug)
      .then(r => setCourse(r.data.course))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Skeleton />
  if (notFound || !course) return <NotFoundState />

  const imgSrc = buildImgSrc(course.thumbnail)

  return (
    <PublicLayout>
      <div dir="rtl" style={{ background: BG, minHeight: '100vh', position: 'relative' }}>
        <GrainOverlay />

        <TopBar />
        <HeroSection course={course} imgSrc={imgSrc} />

        {/* ── MAIN CONTENT ── */}
        <section style={{ padding: '36px 0 130px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 36, alignItems: 'start' }}>

            {/* ─ LEFT COLUMN ─ */}
            <div>
              {/* Hero Video */}
              {course.heroVideo && (
                <div style={{ marginBottom: 22 }}>
                  <VideoPlayer url={course.heroVideo} poster={imgSrc} />
                </div>
              )}

              {/* Description */}
              {course.description && (
                <SectionCard icon="📌" title="عن هذه الدورة">
                  <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 2, whiteSpace: 'pre-line' }}>
                    {course.description}
                  </p>
                </SectionCard>
              )}

              {/* Learning Outcomes */}
              {course.learningOutcomes?.length > 0 && (
                <SectionCard icon="🎯" title="ماذا ستتعلم؟">
                  <OutcomesGrid outcomes={course.learningOutcomes} />
                </SectionCard>
              )}

              {/* Target Students */}
              {course.targetStudents?.length > 0 && (
                <SectionCard icon="👥" title="لمن هذه الدورة؟">
                  <div>
                    {course.targetStudents.map((t, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < course.targetStudents.length - 1 ? `1px solid rgba(223,171,112,0.06)` : 'none', fontSize: 13.5, color: TEXT }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: G, flexShrink: 0 }} />
                        {t}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Highlights */}
              {course.highlights?.length > 0 && (
                <SectionCard icon="✨" title="مميزات الدورة">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                    {course.highlights.map((h, i) => (
                      <div key={i} style={{ padding: '13px 15px', borderRadius: 12, background: 'rgba(7,15,28,0.5)', border: `1px solid rgba(223,171,112,0.08)`, display: 'flex', alignItems: 'flex-start', gap: 10, transition: '.25s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = G_BORDER_HOVER}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(223,171,112,0.08)'}>
                        <span style={{ color: G, fontSize: 13, flexShrink: 0, marginTop: 2 }}>✦</span>
                        <span style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.65 }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>

            {/* ─ RIGHT COLUMN ─ */}
            <div style={{ position: 'sticky', top: 72 }}>
              <SidebarCard course={course} user={user} imgSrc={imgSrc} />
            </div>
          </div>
        </section>

        {/* ── MOBILE STICKY CTA ── */}
        <div style={{
          display: 'none', // overridden via CSS below for mobile
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
          padding: '12px 16px 22px',
          background: 'rgba(7,15,28,0.97)', backdropFilter: 'blur(24px)',
          borderTop: `1px solid rgba(223,171,112,0.12)`,
        }} className="mobile-cta">
          <WhatsAppCTA course={course} user={user} />
        </div>

        <style>{`
          @media (max-width: 768px) {
            .mobile-cta { display: block !important; }
            section > div[style*="grid-template-columns: 1fr 340px"] {
              grid-template-columns: 1fr !important;
            }
            section > div > div:last-child {
              display: none;
            }
          }
        `}</style>
      </div>
    </PublicLayout>
  )
}