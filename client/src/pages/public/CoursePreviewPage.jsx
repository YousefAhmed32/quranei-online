import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Star, Users, CheckCircle2, Play, MessageCircle, ChevronRight, Lock, GraduationCap, Target } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { courseService } from '../../services/api'
import { CAT_AR, getCourseCategories, getPrimaryLabel } from '../../constants/courseCategories'

const G = '#dfab70'
const GD = '#906130'

const LEVEL_AR = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم', all: 'جميع المستويات' }

function YoutubeEmbed({ url }) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/)
  if (!m) return null
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
      style={{ boxShadow: `0 0 40px rgba(223,171,112,0.15)` }}>
      <iframe src={`https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`}
        title="معاينة الدورة" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen className="w-full h-full" />
    </div>
  )
}

// Mock curriculum sections for preview
const MOCK_CURRICULUM = [
  { title: 'مقدمة الدورة', lessons: [
    { title: 'الدرس التمهيدي — ماذا ستتعلم؟', duration: '10 دقائق', free: true },
    { title: 'المواد والأدوات المطلوبة', duration: '8 دقائق', free: true },
  ]},
  { title: 'الوحدة الأولى: الأساسيات', lessons: [
    { title: 'المفاهيم الأساسية', duration: '25 دقائق', free: false },
    { title: 'التطبيق العملي', duration: '30 دقائق', free: false },
    { title: 'مراجعة وتقييم', duration: '15 دقائق', free: false },
  ]},
  { title: 'الوحدة الثانية: التعمق', lessons: [
    { title: 'مستوى متقدم', duration: '35 دقائق', free: false },
    { title: 'حالات تطبيقية', duration: '40 دقائق', free: false },
  ]},
]

export default function CoursePreviewPage() {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [openSection, setOpenSection] = useState(0)

  useEffect(() => {
    courseService.getBySlug(slug)
      .then(r => setCourse(r.data.course))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

 const handleEnroll = () => {

  const wa = (course.whatsapp || '201008148164')
    .replace(/\+/g, '')
    .replace(/\s/g, '')

  const lines = [
    'السلام عليكم ورحمة الله وبركاته',
    '',
    '━━━━━━━━━━━━━━━━━━',
    'طلب اشتراك جديد',
    '━━━━━━━━━━━━━━━━━━',
    '',
    
    'اسم الدورة:',
    `${course.title}`,
    
    '',
    
    course.shortDescription
      ? `نبذة مختصرة:\n${course.shortDescription}`
      : '',
      
    '',
    '━━━━━━━━━━━━━━━━━━',
    '',
    
    'رابط الدورة:',
    `${window.location.origin}/courses/${course.slug}`,
    
    '',
    '━━━━━━━━━━━━━━━━━━',
    '',
    
    'أرغب في معرفة تفاصيل الاشتراك وطريقة البدء بالدورة.',
    
    '',
    'جزاكم الله خيرًا',
  ]

  const text = encodeURIComponent(
    lines
      .filter(Boolean)
      .join('\n')
  )

  window.open(`https://wa.me/${wa}?text=${text}`, '_blank')
}

  if (loading) return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 rounded-full animate-spin" style={{ borderColor: `${G} transparent` }} />
      </div>
    </PublicLayout>
  )

  if (notFound || !course) return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-7xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-white mb-3">الدورة غير موجودة</h2>
          <Link to="/courses" className="btn-gold inline-block mt-2">عرض جميع الدورات</Link>
        </div>
      </div>
    </PublicLayout>
  )

  const imgSrc = course.thumbnail
    ? (course.thumbnail.startsWith('http') ? course.thumbnail : `https://api.quranei.com/api/media/stream/${course.thumbnail}`)
    : null

  return (
    <PublicLayout>
      <div dir="rtl" className="pb-24 lg:pb-0">
        {/* ── HERO ── */}
        <div className="relative min-h-[55vh] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            {imgSrc
              ? <img src={imgSrc} alt={course.title} className="w-full h-full object-cover opacity-15" />
              : <div style={{ background: 'linear-gradient(135deg, #0a1628 0%, #112847 100%)', position: 'absolute', inset: 0 }} />
            }
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #070f1c 25%, rgba(7,15,28,0.8) 60%, rgba(7,15,28,0.4) 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(144,97,48,0.18) 0%, transparent 70%)' }} />
          </div>
          <div className="container mx-auto px-4 pb-12 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs mb-6" style={{ color: '#5e779a' }}>
              <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <ChevronRight className="w-3 h-3 rotate-180" />
              <Link to="/courses" className="hover:text-white transition-colors">الدورات</Link>
              <ChevronRight className="w-3 h-3 rotate-180" />
              <span className="text-white truncate max-w-xs">{course.title}</span>
            </div>

            <div className="max-w-3xl">
              {/* Category badges — backward compatible, shows all categories */}
              {getCourseCategories(course).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {getCourseCategories(course).map(key => (
                    <div key={key} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(223,171,112,0.12)', border: '1px solid rgba(223,171,112,0.3)', color: G }}>
                      {CAT_AR[key] || key}
                    </div>
                  ))}
                </div>
              )}

              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{course.title}</h1>
              {course.shortDescription && (
                <p className="text-lg mb-5" style={{ color: '#8aa0bb' }}>{course.shortDescription}</p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-3">
                {[
                  course.level && { icon: Star, val: LEVEL_AR[course.level], fill: false },
                  course.duration && { icon: Clock, val: course.duration },
                  course.lessonsCount > 0 && { icon: BookOpen, val: `${course.lessonsCount} درس` },
                  course.teacherName && { icon: GraduationCap, val: course.teacherName },
                ].filter(Boolean).map((m, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm"
                    style={{ background: 'rgba(17,40,71,0.7)', border: '1px solid rgba(223,171,112,0.12)', color: G, backdropFilter: 'blur(8px)' }}>
                    <m.icon className={`w-3.5 h-3.5 ${m.fill ? 'fill-current' : ''}`} />{m.val}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ── Left ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video preview */}
              {course.heroVideo && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5" style={{ color: G }} /> معاينة الدورة
                  </h2>
                  <YoutubeEmbed url={course.heroVideo} />
                </div>
              )}

              {/* About */}
              {course.description && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">عن هذه الدورة</h2>
                  <p className="text-sm leading-loose" style={{ color: '#8aa0bb' }}>{course.description}</p>
                </div>
              )}

              {/* What you'll learn */}
              {course.learningOutcomes?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    <Target className="w-5 h-5" style={{ color: G }} /> ماذا ستتعلم؟
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.learningOutcomes.map((o, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                        className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: G }} />
                        <span className="text-sm" style={{ color: '#8aa0bb' }}>{o}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" style={{ color: G }} /> محتوى الدورة
                </h2>
                <p className="text-xs mb-5" style={{ color: '#5e779a' }}>
                  {MOCK_CURRICULUM.reduce((a, s) => a + s.lessons.length, 0)} درس — {course.duration || 'مدة متغيرة'}
                </p>

                <div className="space-y-3">
                  {MOCK_CURRICULUM.map((section, si) => (
                    <div key={si} className="rounded-xl overflow-hidden"
                      style={{ border: '1px solid rgba(223,171,112,0.1)' }}>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 text-right"
                        style={{ background: 'rgba(17,40,71,0.5)' }}
                        onClick={() => setOpenSection(openSection === si ? -1 : si)}
                      >
                        <span className="text-sm font-bold text-white">{section.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: '#5e779a' }}>{section.lessons.length} دروس</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${openSection === si ? 'rotate-90' : 'rotate-270'}`} style={{ color: '#5e779a' }} />
                        </div>
                      </button>

                      {openSection === si && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                          className="overflow-hidden">
                          {section.lessons.map((lesson, li) => (
                            <div key={li} className="flex items-center gap-3 px-4 py-2.5 text-sm"
                              style={{ borderTop: '1px solid rgba(223,171,112,0.05)' }}>
                              {lesson.free
                                ? <Play className="w-3.5 h-3.5 flex-shrink-0" style={{ color: G }} />
                                : <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#5e779a' }} />
                              }
                              <span className="flex-1" style={{ color: lesson.free ? 'white' : '#5e779a' }}>{lesson.title}</span>
                              {lesson.free && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>مجاني</span>}
                              <span className="text-xs" style={{ color: '#5e779a' }}>{lesson.duration}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Target students */}
              {course.targetStudents?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">لمن هذه الدورة؟</h2>
                  <div className="space-y-2">
                    {course.targetStudents.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span style={{ color: G }}>◆</span>
                        <span style={{ color: '#8aa0bb' }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructor */}
              {course.teacherName && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" style={{ color: G }} /> المعلم
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${GD}, ${G})`, color: '#070f1c' }}>
                      {course.teacherName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{course.teacherName}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#5e779a' }}>معلم معتمد — قرآني أونلاين</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right — Sticky enrollment card ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(17,40,71,0.5)', border: `1px solid rgba(223,171,112,0.2)`, boxShadow: `0 0 40px rgba(223,171,112,0.08)` }}>

                  {imgSrc && (
                    <div className="h-44 overflow-hidden">
                      <img src={imgSrc} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-6 space-y-5">
                    {/* Price display */}
                    {course.showPrice ? (
                      <div className="text-center pb-4" style={{ borderBottom: '1px solid rgba(223,171,112,0.1)' }}>
                        {course.pricingType === 'free' ? (
                          <div className="text-2xl font-black" style={{ color: '#22c55e' }}>مجاناً</div>
                        ) : course.price > 0 ? (
                          <div>
                            <span className="text-4xl font-black" style={{ color: G }}>{course.price}</span>
                            <span className="text-sm mr-1" style={{ color: '#5e779a' }}>{course.currency}</span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Enroll CTA */}
                    <motion.button onClick={handleEnroll} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-lg"
                      style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', color: '#fff', boxShadow: '0 6px 24px rgba(37,211,102,0.4)' }}>
                      <MessageCircle className="w-5 h-5" />
                      {course.ctaText || 'اشترك الآن عبر واتساب'}
                    </motion.button>

                    {/* Details */}
                    <div className="space-y-3 pt-1">
                      {[
                        course.language && { i: '🌐', l: 'اللغة', v: course.language },
                        course.level && { i: '📊', l: 'المستوى', v: LEVEL_AR[course.level] },
                        course.duration && { i: '⏱', l: 'المدة', v: course.duration },
                        course.lessonsCount > 0 && { i: '📖', l: 'الدروس', v: `${course.lessonsCount} درس` },
                      ].filter(Boolean).map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span style={{ color: '#5e779a' }}>{item.i} {item.l}</span>
                          <span className="font-semibold text-white">{item.v}</span>
                        </div>
                      ))}
                    </div>

                    {/* Guarantees */}
                    <div className="pt-3 space-y-2" style={{ borderTop: '1px solid rgba(223,171,112,0.08)' }}>
                      {['جلسات فردية مباشرة', 'متابعة شخصية مستمرة', 'شهادة إتمام الدورة'].map((g, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: G }} />
                          <span style={{ color: '#8aa0bb' }}>{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-4"
          style={{ background: 'rgba(7,15,28,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(223,171,112,0.1)' }}>
          <div className="flex gap-3">
            <Link to={`/courses/${slug}`}
              className="flex-1 text-center py-3 rounded-xl font-bold text-sm"
              style={{ background: 'rgba(17,40,71,0.6)', border: '1px solid rgba(223,171,112,0.2)', color: G }}>
              تفاصيل الدورة
            </Link>
            <button onClick={handleEnroll}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{ background: '#25d366', color: '#fff' }}>
              <MessageCircle className="w-4 h-4" /> اشترك الآن
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
