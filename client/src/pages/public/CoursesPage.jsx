import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, BookOpen, Clock, Star, MessageCircle, Sparkles, Eye, Users, ChevronDown } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { courseService } from '../../services/api'

/* ─── Design tokens ─── */
  
const GOLD = '#D6A85F'
const GOLD_LIGHT = '#F3D29A'

const GOLD_DIM = 'rgba(214,168,95,0.14)'

const GOLD_GLOW = 'rgba(214,168,95,0.22)'

const NAVY_DEEP = '#07111F'

const NAVY_CARD = '#0D1B2D'

const NAVY_SOFT = '#13243A'

const BRONZE = '#9B6B34'

const LUX_SHADOW =
  '0 20px 60px rgba(0,0,0,0.55)'



/* ─── Static data ─── */
const CATS = [
  { key: '', label: 'الكل' },
  { key: 'tajweed', label: 'التجويد' },
  { key: 'memorization', label: 'الحفظ' },
  { key: 'recitation', label: 'التلاوة' },
  { key: 'ijazah', label: 'الإجازة' },
  { key: 'correction', label: 'التصحيح' },
  { key: 'arabic', label: 'العربية' },
]
const LEVELS = [
  { key: '', label: 'جميع المستويات' },
  { key: 'beginner', label: 'مبتدئ' },
  { key: 'intermediate', label: 'متوسط' },
  { key: 'advanced', label: 'متقدم' },
]
const CAT_AR = {
  tajweed: 'التجويد', quran: 'القرآن', memorization: 'الحفظ',
  recitation: 'التلاوة', ijazah: 'الإجازة', correction: 'التصحيح',
  arabic: 'العربية', other: 'أخرى',
}
const LVL_AR = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم', all: 'الجميع' }
const LVL_PILL = {
  beginner: { bg: 'rgba(74,222,128,0.12)', color: '#4ade80' },
  intermediate: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  advanced: { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
  all: { bg: 'rgba(165,180,252,0.12)', color: '#a5b4fc' },
}

/* ─── WhatsApp button ─── */
function WhatsAppBtn({ course }) {
  const click = () => {
    const wa = course.whatsapp || '201008148164'
    const text = encodeURIComponent(
      `السلام عليكم،\nأرغب في الاشتراك في دورة: ${course.title}\n${window.location.origin}/courses/${course.slug}\n${course.shortDescription || ''}`
    )
    window.open(`https://wa.me/${wa}?text=${text}`, '_blank')
  }
  return (
    <button
      onClick={click}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
      style={{
        background: 'linear-gradient(135deg,#22c55e,#16a34a)',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(34,197,94,0.28)',
      }}
    >
      <MessageCircle className="w-4 h-4" />
      <span>{course.ctaText || 'اشترك الآن'}</span>
    </button>
  )
}

/* ─── Course Card ─── */
function CourseCard({ course, index }) {
  const imgSrc = course.thumbnail
    ? (course.thumbnail.startsWith('http') ? course.thumbnail : `/api/media/stream/${course.thumbnail}`)
    : null

  const lvl = LVL_PILL[course.level] || LVL_PILL.all

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: (index % 6) * 0.06,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="group h-full"
    >
      <Link
        to={`/courses/${course.slug}/preview`}
        className="block h-full"
        style={{ textDecoration: 'none' }}
      >
        <div
          className="h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
          style={{
            background:
              'linear-gradient(160deg,#0f1e35 0%,#0a1526 100%)',
            border: '1px solid rgba(201,147,74,0.1)',
            boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.border =
              '1px solid rgba(201,147,74,0.28)'

            e.currentTarget.style.boxShadow =
              '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,147,74,0.06)'

            e.currentTarget.style.transform =
              'translateY(-5px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.border =
              '1px solid rgba(201,147,74,0.1)'

            e.currentTarget.style.boxShadow =
              '0 2px 20px rgba(0,0,0,0.4)'

            e.currentTarget.style.transform =
              'translateY(0)'
          }}
        >
          {/* ── Thumbnail ── */}
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              height: 186,
              background:
                'linear-gradient(135deg,#0d1e34,#091525)'
            }}
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ opacity: 0.88 }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg,#0d1e34,#091525)'
                }}
              >
                {/* decorative Arabic pattern lines */}
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  opacity="0.15"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke={GOLD}
                    strokeWidth="1"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="26"
                    stroke={GOLD}
                    strokeWidth="0.8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="16"
                    stroke={GOLD}
                    strokeWidth="0.6"
                  />
                </svg>

                <BookOpen
                  className="absolute w-10 h-10"
                  style={{
                    color: GOLD,
                    opacity: 0.18
                  }}
                />
              </div>
            )}

            {/* gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top,rgba(9,21,37,0.92) 0%,rgba(9,21,37,0.2) 55%,transparent 100%)'
              }}
            />

            {/* featured badge */}
            {course.featured && (
              <div
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                style={{
                  background: 'rgba(201,147,74,0.2)',
                  border:
                    '1px solid rgba(201,147,74,0.45)',
                  color: GOLD_LIGHT
                }}
              >
                <Star className="w-3 h-3 fill-current" />
                مميز
              </div>
            )}

            {/* category badge */}
            <div
              className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{
                background: 'rgba(9,21,37,0.82)',
                border:
                  '1px solid rgba(201,147,74,0.18)',
                color: GOLD
              }}
            >
              {CAT_AR[course.category] || course.category}
            </div>

            {/* free badge */}
            {course.pricingType === 'free' && (
              <div
                className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold"
                style={{
                  background:
                    'rgba(34,197,94,0.16)',
                  border:
                    '1px solid rgba(34,197,94,0.35)',
                  color: '#4ade80'
                }}
              >
                مجاني
              </div>
            )}
          </div>

          {/* ── Body ── */}
          <div className="p-5 flex flex-col flex-1 gap-3.5">

            {/* title + desc */}
            <div className="space-y-1.5">
              <h3
                className="font-extrabold leading-snug line-clamp-2"
                style={{
                  fontSize: 15,
                  color: '#f0f6ff',
                  letterSpacing: '-0.01em'
                }}
              >
                {course.title}
              </h3>

              {course.shortDescription && (
                <p
                  className="text-xs leading-relaxed line-clamp-2"
                  style={{ color: '#5d7a9a' }}
                >
                  {course.shortDescription}
                </p>
              )}
            </div>
            {/* meta chips */}
            <div className="flex flex-wrap items-center gap-2">
              {course.duration && (
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: '#4e6a87' }}
                >
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </span>
              )}

              {course.lessonsCount > 0 && (
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: '#4e6a87' }}
                >
                  <BookOpen className="w-3 h-3" />
                  {course.lessonsCount} درس
                </span>
              )}

              {course.studentsCount > 0 && (
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: '#4e6a87' }}
                >
                  <Users className="w-3 h-3" />
                  {course.studentsCount}
                </span>
              )}

              {course.level && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={{
                    background: lvl.bg,
                    color: lvl.color
                  }}
                >
                  {LVL_AR[course.level]}
                </span>
              )}
            </div>

            {/* divider */}
            <div
              style={{
                borderTop:
                  '1px solid rgba(201,147,74,0.07)'
              }}
            />

            {/* instructor row */}
            {course.teacherName && (
              <div className="flex items-center gap-2.5">
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                  style={{
                    background:
                      'linear-gradient(135deg,#7a4a1e,#c9934a)',
                    color: '#070f1c'
                  }}
                >
                  {course.teacherName.slice(0, 1)}
                </div>

                <span
                  className="text-xs font-semibold"
                  style={{ color: '#6d8fad' }}
                >
                  {course.teacherName}
                </span>

                <span
                  className="mr-auto text-xs px-2 py-0.5 rounded-md font-bold"
                  style={{
                    background:
                      'rgba(201,147,74,0.08)',
                    color: GOLD,
                    border:
                      '1px solid rgba(201,147,74,0.12)'
                  }}
                >
                  مُجاز
                </span>
              </div>
            )}

            {/* rating */}
            {course.rating > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      className="w-3 h-3"
                      style={{
                        color:
                          s <= Math.round(course.rating)
                            ? GOLD_LIGHT
                            : '#1e3050',

                        fill:
                          s <= Math.round(course.rating)
                            ? GOLD_LIGHT
                            : 'transparent'
                      }}
                    />
                  ))}
                </div>

                <span
                  className="text-xs font-bold"
                  style={{ color: GOLD_LIGHT }}
                >
                  {course.rating}
                </span>

                {course.reviewsCount > 0 && (
                  <span
                    className="text-xs"
                    style={{ color: '#3d5470' }}
                  >
                    ({course.reviewsCount})
                  </span>
                )}
              </div>
            )}

            {/* price */}
            {course.showPrice && (
              <div className="flex items-baseline gap-1.5">
                {course.pricingType === 'free' ? (
                  <span
                    className="text-sm font-black"
                    style={{ color: '#4ade80' }}
                  >
                    مجاني تماماً
                  </span>
                ) : course.price > 0 ? (
                  <>
                    <span
                      className="text-2xl font-black"
                      style={{
                        color: GOLD,
                        lineHeight: 1
                      }}
                    >
                      {course.price}
                    </span>

                    <span
                      className="text-xs"
                      style={{ color: '#4e6a87' }}
                    >
                      {course.currency}
                    </span>
                  </>
                ) : null}
              </div>
            )}

            {/* CTA */}

            <div
              className="flex gap-2 mt-auto pt-3"
              style={{
                borderTop: '1px solid rgba(201,147,74,0.07)'
              }}
            >

              {/* Preview Button */}
              <Link to={`/courses/${course.slug}/preview`}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="group/preview relative overflow-hidden flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-black flex-shrink-0 cursor-pointer transition-all duration-500"
                  style={{
                    background:
                      'linear-gradient(135deg,#1b2d4a 0%,#102033 45%,#0b1727 100%)',

                    border:
                      '1px solid rgba(201,147,74,0.22)',

                    color: '#f6d089',

                    backdropFilter: 'blur(14px)',

                    boxShadow: `
          0 10px 30px rgba(0,0,0,0.38),
          0 0 0 1px rgba(201,147,74,0.05),
          inset 0 1px 0 rgba(255,255,255,0.04)
        `,
                  }}
                >

                  {/* Glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        'radial-gradient(circle at top left, rgba(201,147,74,0.22), transparent 60%)',
                    }}
                  />

                  {/* Shine */}
                  <div
                    className="absolute inset-0 -translate-x-full group-hover/preview:translate-x-full transition-transform duration-1000"
                    style={{
                      background:
                        'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08), transparent 70%)',
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(135deg,#c9934a,#f0c676)',

                      boxShadow:
                        '0 8px 20px rgba(201,147,74,0.32)',
                    }}
                  >
                    <Eye
                      className="w-4 h-4"
                      style={{ color: '#08111d' }}
                    />
                  </div>

                  {/* Text */}
                  <span
                    className="relative z-10 tracking-wide"
                    style={{
                      textShadow:
                        '0 0 12px rgba(201,147,74,0.22)',
                    }}
                  >
                    معاينة
                  </span>

                </motion.div>
              </Link>

              {/* WhatsApp Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const wa = course.whatsapp || '201008148164'

                  const text = encodeURIComponent(
                    `السلام عليكم،\nأرغب في الاشتراك في دورة: ${course.title}`
                  )

                  window.open(
                    `https://wa.me/${wa}?text=${text}`,
                    '_blank'
                  )
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-black transition-all duration-300 border-0"
                style={{
                  background:
                    'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)',

                  color: '#fff',

                  boxShadow: `
        0 8px 24px rgba(34,197,94,0.28),
        inset 0 1px 0 rgba(255,255,255,0.12)
      `,
                }}
              >
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.14)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                </div>

                <span>
                  {course.ctaText || 'اشترك الآن'}
                </span>
              </motion.button>

            </div>




          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#0f1e35 0%,#0a1526 100%)', border: '1px solid rgba(201,147,74,0.07)' }}
    >
      <div className="animate-pulse">
        <div style={{ height: 186, background: '#0d1d32' }} />
        <div className="p-5 space-y-3">
          <div className="h-4 rounded-lg" style={{ background: '#0d1d32', width: '80%' }} />
          <div className="h-3 rounded-lg" style={{ background: '#0a1828', width: '60%' }} />
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full" style={{ background: '#0d1d32' }} />
            <div className="h-5 w-12 rounded-full" style={{ background: '#0d1d32' }} />
          </div>
          <div className="h-10 rounded-xl mt-4" style={{ background: '#0d1d32' }} />
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('')
  const [level, setLevel] = useState('')

  useEffect(() => {
    setLoading(true)

    courseService.getPublic({
      search,
      category: cat,
      level
    })
      .then((r) => {
        console.log("FULL RESPONSE:", r)
        console.log("DATA:", r.data)

        setCourses(
          Array.isArray(r.data)
            ? r.data
            : r.data.courses || []
        )
      })
      .catch((err) => {
        console.log("ERROR:", err)
        setCourses([])
      })
      .finally(() => setLoading(false))

  }, [search, cat, level])

  return (
    <PublicLayout>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative py-28 overflow-hidden" dir="rtl">

        {/* background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/image/back-teacher.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />

        {/* overlays */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(4,10,20,0.5) 0%, rgba(4,10,20,0.78) 50%, rgba(4,10,20,0.97) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 65% 40% at 50% 10%, rgba(201,147,74,0.1) 0%, transparent 70%)',
          }}
        />

        {/* subtle geometric lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.04 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke={GOLD} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* floating dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (

            <motion.div
              key={i}
              animate={{ y: [0, -22, 0], opacity: [0.12, 0.3, 0.12] }}
              transition={{ duration: 5 + i * 0.8, repeat: Infinity, delay: i * 0.35 }}
              className="absolute rounded-full"
              style={{
                width: 3 + (i % 3),
                height: 3 + (i % 3),
                background: GOLD,
                left: `${6 + i * 9}%`,
                top: `${10 + (i % 5) * 16}%`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>

        {/* content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* badge */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-7 text-xs font-bold"
              style={{
                background: 'rgba(201,147,74,0.09)',
                border: '1px solid rgba(201,147,74,0.28)',
                color: GOLD_LIGHT,
                letterSpacing: '0.04em',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              دورات قرآنية احترافية
            </div>

            {/* heading */}
            <h1
              className="font-black text-white mb-5 leading-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 3.6rem)', letterSpacing: '-0.02em' }}
            >
              اكتشف{' '}
              <span style={{ color: GOLD, textShadow: `0 0 40px rgba(201,147,74,0.3)` }}>
                دوراتنا
              </span>
              {' '}القرآنية
            </h1>

            {/* sub */}
            <p
              className="max-w-2xl mx-auto leading-loose mb-10"
              style={{ color: '#7a9bbf', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}
            >
              برامج تعليمية متكاملة بإشراف نخبة من المُجازين لتعليم القرآن الكريم
              والتجويد والتلاوة بأسلوب عصري متميز
            </p>

            {/* stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex justify-center gap-8 flex-wrap"
            >
              {[
                { num: '٤٨+', lbl: 'دورة متاحة' },
                { num: '١٢٠٠+', lbl: 'طالب مسجّل' },
                { num: '٩٨٪', lbl: 'رضا الطلاب' },
                { num: '٢٤', lbl: 'معلم مُجاز' },
              ].map(s => (
                <div key={s.lbl} className="text-center">
                  <div className="text-2xl font-black" style={{ color: GOLD, lineHeight: 1 }}>{s.num}</div>
                  <div className="text-xs mt-1" style={{ color: '#4e6a87' }}>{s.lbl}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* bottom fade */}
        <div
          className="absolute bottom-0 left-0 w-full h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top,#060c18 0%,transparent 100%)' }}
        />
      </section>

      {/* ══════════════ FILTERS ══════════════ */}
      <div
        className="sticky top-0 z-30 py-3.5"
        dir="rtl"
        style={{
          background: 'rgba(5,10,20,0.94)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(201,147,74,0.07)',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-3">

            {/* search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#3d5470' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن دورة..."
                className="w-full pr-10 pl-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={{
                  background: 'rgba(13,28,50,0.8)',
                  border: '1px solid rgba(201,147,74,0.1)',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,147,74,0.35)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,147,74,0.1)'}
              />
            </div>

            {/* category pills */}
            <div className="flex gap-1.5 flex-wrap">
              {CATS.map(c => (
                <button
                  key={c.key}
                  onClick={() => setCat(c.key)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200"
                  style={
                    cat === c.key
                      ? { background: `linear-gradient(135deg,#7a4a1e,${GOLD})`, color: '#060c18', boxShadow: `0 0 14px rgba(201,147,74,0.25)` }
                      : { background: 'rgba(13,28,50,0.8)', color: '#4e6a87', border: '1px solid rgba(201,147,74,0.08)' }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* level select */}
            <div className="relative">
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="appearance-none pl-8 pr-3 py-2.5 rounded-xl text-xs text-white outline-none"
                style={{
                  background: 'rgba(13,28,50,0.8)',
                  border: '1px solid rgba(201,147,74,0.08)',
                  fontFamily: 'Cairo, sans-serif',
                  color: '#4e6a87',
                }}
              >
                {LEVELS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
              </select>
              <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: '#3d5470' }} />
            </div>

            {/* count */}
            <span className="text-xs mr-auto tabular-nums" style={{ color: '#2d4460' }}>
              {courses.length} دورة
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════ GRID ══════════════ */}
      <section className="py-12" dir="rtl">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{ background: GOLD_DIM, border: `1px solid rgba(201,147,74,0.18)` }}
              >
                <BookOpen className="w-9 h-9" style={{ color: GOLD }} />
              </div>
              <p className="text-white text-xl font-bold mb-2">لا توجد دورات حالياً</p>
              <p style={{ color: '#3d5470' }}>سيتم إضافة دورات قريباً، ترقّب!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((c, i) => (
                <CourseCard key={c._id} course={c} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

    </PublicLayout>
  )
}