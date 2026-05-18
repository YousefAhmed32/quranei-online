import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Users, Clock, MessageCircle, Search, BookOpen, GraduationCap } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { teacherService } from '../../services/api'

const G = '#dfab70'
const GD = '#906130'

function TeacherCard({ teacher, index }) {
  const imgSrc = teacher.imageId
    ? `/api/media/stream/${teacher.imageId}`
    : teacher.imageUrl || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      viewport={{ once: true }}
      whileHover={{
        y: -10,
        scale: 1.015,
      }}
      className="group"
    >
      <Link
        to={`/teachers/${teacher.slug || teacher._id}`}
        className="block h-full"
      >
        <div
          className="h-full rounded-[28px] overflow-hidden flex flex-col transition-all duration-500 relative"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,22,40,0.92) 0%, rgba(7,15,28,0.98) 100%)',
            backdropFilter: 'blur(26px)',
            border: '1px solid rgba(223,171,112,0.14)',
            boxShadow: `
              0 12px 45px rgba(0,0,0,0.55),
              inset 0 1px 0 rgba(255,255,255,0.03),
              0 0 25px rgba(223,171,112,0.06)
            `,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor =
              'rgba(223,171,112,0.35)'

            e.currentTarget.style.boxShadow = `
              0 20px 60px rgba(0,0,0,0.65),
              0 0 40px rgba(223,171,112,0.10),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              'rgba(223,171,112,0.14)'

            e.currentTarget.style.boxShadow = `
              0 12px 45px rgba(0,0,0,0.55),
              inset 0 1px 0 rgba(255,255,255,0.03),
              0 0 25px rgba(223,171,112,0.06)
            `
          }}
        >
          {/* Luxury Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              background:
                'radial-gradient(circle at top, rgba(223,171,112,0.12), transparent 60%)',
            }}
          />

          {/* Cover */}
          <div
            className="relative h-44 flex-shrink-0 flex items-end justify-center"
            style={{
              backgroundImage: "url('/image/back-teacher-5.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(
                    to bottom,
                    rgba(5,10,20,0.12) 0%,
                    rgba(5,10,20,0.68) 100%
                  )
                `,
              }}
            />

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #dfab70 0, #dfab70 1px, transparent 0, transparent 50%)',
                backgroundSize: '14px 14px',
              }}
            />

            {/* Featured Badge */}
            {teacher.featured && (
              <div
                className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md"
                style={{
                  background: 'rgba(223,171,112,0.18)',
                  border: '1px solid rgba(223,171,112,0.35)',
                  color: '#f6d3a7',
                }}
              >
                <Star className="w-3 h-3 fill-current" />
                معلم مميز
              </div>
            )}

            {/* Avatar */}
            <div className="relative z-10 mb-[-42px]">
              <div
                className="w-[84px] h-[84px] rounded-[24px] overflow-hidden mx-auto"
                style={{
                  border: '3px solid rgba(223,171,112,0.95)',
                  boxShadow: `
                    0 0 0 4px rgba(223,171,112,0.08),
                    0 12px 30px rgba(0,0,0,0.55),
                    0 0 25px rgba(223,171,112,0.22)
                  `,
                  background: '#0a1628',
                }}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={teacher.fullName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-black"
                    style={{ color: '#dfab70' }}
                  >
                    {teacher.fullName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 pt-14 px-5 pb-5 text-center">
            <h3 className="font-extrabold text-white text-lg tracking-wide mb-1 leading-tight">
              {teacher.fullName}
            </h3>

            {teacher.title && (
              <p
                className="text-sm mb-2 font-semibold"
                style={{ color: '#dfab70' }}
              >
                {teacher.title}
              </p>
            )}

            {teacher.specialization && (
              <p
                className="text-xs mb-4 line-clamp-1"
                style={{ color: '#7f97b5' }}
              >
                {teacher.specialization}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                {
                  icon: Star,
                  val: teacher.rating?.toFixed(1) ?? '5.0',
                  sub: 'تقييم',
                  fill: true,
                },
                {
                  icon: Users,
                  val:
                    teacher.studentsCount >= 1000
                      ? `${(teacher.studentsCount / 1000).toFixed(1)}k`
                      : teacher.studentsCount || '—',
                  sub: 'طالب',
                },
                {
                  icon: Clock,
                  val: teacher.experience || '—',
                  sub: 'خبرة',
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl py-3 px-2"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(10,22,40,0.92), rgba(7,15,28,0.98))',
                    border: '1px solid rgba(223,171,112,0.10)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.03)',
                  }}
                >
                  <s.icon
                    className={`w-4 h-4 mx-auto mb-1 ${
                      s.fill ? 'fill-current' : ''
                    }`}
                    style={{ color: '#dfab70' }}
                  />

                  <div className="text-sm font-black text-white">
                    {s.val}
                  </div>

                  <div
                    className="text-[11px] mt-1"
                    style={{ color: '#6f86a3' }}
                  >
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            {teacher.languages?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                {teacher.languages.slice(0, 3).map((l, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-[10px] font-medium"
                    style={{
                      background: 'rgba(94,119,154,0.16)',
                      border: '1px solid rgba(94,119,154,0.18)',
                      color: '#8aa0bb',
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div
              className="mt-auto pt-4"
              style={{
                borderTop: '1px solid rgba(223,171,112,0.08)',
              }}
            >
              <div
                className="py-3 rounded-2xl text-sm font-bold transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: `
                    linear-gradient(
                      135deg,
                      #b88447 0%,
                      #dfab70 50%,
                      #f0c48a 100%
                    )
                  `,
                  color: '#07101d',
                  boxShadow: `
                    0 8px 25px rgba(223,171,112,0.22),
                    inset 0 1px 0 rgba(255,255,255,0.22)
                  `,
                }}
              >
                عرض الملف الشخصي
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [gender, setGender]   = useState('')

  useEffect(() => {
    teacherService.getPublic()
      .then(r => setTeachers(r.data.teachers || []))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = teachers.filter(t => {
    if (gender && t.gender !== gender) return false
    if (search && !t.fullName?.toLowerCase().includes(search.toLowerCase()) &&
        !t.specialization?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <PublicLayout>
      <div dir="rtl">
        {/* Hero */}
       {/* Hero */}
<section className="relative py-24 overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <img
      src="./image/back-teacher.png"
      alt="Teachers Banner"
      className="w-full h-full object-cover"
    />

    {/* Dark Overlay */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(to bottom, rgba(7,15,28,0.65), rgba(7,15,28,0.92))',
      }}
    />
  </div>

  {/* Glow Effect */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(26,58,92,0.45) 0%, transparent 70%)',
    }}
  />

  <div className="container mx-auto px-4 text-center relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold"
        style={{
          background: 'rgba(223,171,112,0.1)',
          border: '1px solid rgba(223,171,112,0.2)',
          color: G,
        }}
      >
        <GraduationCap className="w-4 h-4" />
        نخبة المعلمين المُجازين
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
        معلمونا <span style={{ color: G }}>المتميزون</span>
      </h1>

      <p
        className="text-lg max-w-2xl mx-auto"
        style={{ color: '#d5e3f3' }}
      >
        تعلّم على يد نخبة من أفضل معلمي القرآن الكريم المُجازين بسند متصل
      </p>
    </motion.div>
  </div>
</section>

        {/* Filters */}
        <div className="sticky top-16 z-30 py-4"
          style={{ background: 'rgba(7,15,28,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(223,171,112,0.08)' }}>
          <div className="container mx-auto px-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5e779a' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن معلم..."
                className="w-full pr-10 pl-3 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none"
                style={{ background: 'rgba(17,40,71,0.5)', border: '1px solid rgba(223,171,112,0.12)', fontFamily: 'Cairo' }} />
            </div>
            {[{ v: '', l: 'الكل' }, { v: 'male', l: 'معلمون' }, { v: 'female', l: 'معلمات' }].map(f => (
              <button key={f.v} onClick={() => setGender(f.v)}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={gender === f.v
                  ? { background: `linear-gradient(135deg,${GD},${G})`, color: '#070f1c' }
                  : { background: 'rgba(17,40,71,0.5)', color: '#5e779a', border: '1px solid rgba(223,171,112,0.1)' }
                }>{f.l}</button>
            ))}
            <span className="text-xs mr-auto" style={{ color: '#5e779a' }}>{filtered.length} معلم</span>
          </div>
        </div>

        {/* Grid */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="rounded-2xl h-72 animate-pulse" style={{ background: 'rgba(17,40,71,0.3)' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: G }} />
                <p className="text-xl font-bold text-white mb-2">لا يوجد معلمون</p>
                <p style={{ color: '#5e779a' }}>جرّب تغيير معايير البحث</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((t, i) => <TeacherCard key={t._id} teacher={t} index={i} />)}
              </div>
            )}
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
