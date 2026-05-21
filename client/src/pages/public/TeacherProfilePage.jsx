import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Users, Clock, MessageCircle, BookOpen, ChevronRight, Youtube, Instagram, Twitter, Facebook, Globe, CheckCircle2, GraduationCap } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { teacherService, courseService } from '../../services/api'

const G = '#dfab70'
const GD = '#906130'

export default function TeacherProfilePage() {
  const { identifier } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    teacherService.getPublic()
      .then(r => {
        const list = r.data.teachers || []
        const found = list.find(t => t._id === identifier || t.slug === identifier)
        if (!found) { setNotFound(true); return }
        setTeacher(found)
        // Try to load this teacher's courses by teacherName
        courseService.getPublic()
          .then(cr => {
            const c = cr.data.courses?.filter(c =>
              c.teacherName === found.fullName || String(c.teacher) === String(found._id)
            ) || []
            setCourses(c)
          }).catch(() => {})
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [identifier])

  if (loading) return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 rounded-full animate-spin" style={{ borderColor: `${G} transparent` }} />
      </div>
    </PublicLayout>
  )

  if (notFound || !teacher) return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">👨‍🏫</div>
          <h2 className="text-2xl font-bold text-white mb-3">المعلم غير موجود</h2>
          <Link to="/teachers" className="btn-gold inline-block mt-2">عرض جميع المعلمين</Link>
        </div>
      </div>
    </PublicLayout>
  )

  const imgSrc = teacher.imageId
    ? `https://api.quranei.com/api/media/stream/${teacher.imageId}`
    : teacher.imageUrl || ''

  const socials = [
    { key: 'youtube', Icon: Youtube, color: '#ff0000', label: 'YouTube' },
    { key: 'instagram', Icon: Instagram, color: '#e1306c', label: 'Instagram' },
    { key: 'twitter', Icon: Twitter, color: '#1da1f2', label: 'Twitter' },
    { key: 'facebook', Icon: Facebook, color: '#1877f2', label: 'Facebook' },
  ].filter(s => teacher.socialLinks?.[s.key])

  return (
    <PublicLayout>
      <div dir="rtl">
       {/* Hero cover */}
<div
 className="relative h-[400px] overflow-hidden bg-cover bg-center"
 style={{
  backgroundImage: "url('/image/back-teacher-3.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}}
>
         
        </div>

        {/* Profile section */}
        <div className="container mx-auto px-4 -mt-16 relative z-10 mb-14">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Avatar */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden flex-shrink-0"
                style={{ border: `3px solid ${G}`, boxShadow: `0 0 30px rgba(223,171,112,0.35)`, background: '#0a1628' }}>
                {imgSrc ? (
                  <img src={imgSrc} alt={teacher.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black" style={{ color: G }}>
                    {teacher.fullName?.charAt(0)}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 mb-2">
              <h1 className="text-2xl md:text-4xl font-black text-white mb-1">{teacher.fullName}</h1>
              {teacher.title && <p className="text-base mb-2 font-semibold" style={{ color: G }}>{teacher.title}</p>}
              {teacher.shortBio && <p className="text-sm" style={{ color: '#8aa0bb' }}>{teacher.shortBio}</p>}

              <div className="flex flex-wrap gap-5 mt-4 text-sm" style={{ color: '#5e779a' }}>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-current" style={{ color: G }} /><strong className="text-white">{teacher.rating?.toFixed(1) ?? '5.0'}</strong> تقييم</span>
                {teacher.studentsCount > 0 && <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /><strong className="text-white">{teacher.studentsCount?.toLocaleString()}</strong> طالب</span>}
                {teacher.experience && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /><strong className="text-white">{teacher.experience}</strong> خبرة</span>}
                {teacher.nationality && <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" />{teacher.nationality}</span>}
              </div>
            </div>

            {/* WhatsApp CTA */}
            {teacher.whatsapp && (
              <a href={`https://wa.me/${teacher.whatsapp}?text=${encodeURIComponent(`السلام عليكم، أريد الاستفسار عن الدروس مع ${teacher.fullName}`)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all flex-shrink-0"
                style={{ background: '#25d366', color: '#fff', boxShadow: '0 6px 20px rgba(37,211,102,0.4)' }}>
                <MessageCircle className="w-5 h-5" /> تواصل الآن
              </a>
            )}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {teacher.bio && (
                <div className="glass-card p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" style={{ color: G }} /> نبذة تعريفية
                  </h2>
                  <p className="text-sm leading-loose" style={{ color: '#8aa0bb' }}>{teacher.bio}</p>
                </div>
              )}

              {/* Specialization */}
              {teacher.specialization && (
                <div className="glass-card p-6">
                  <h2 className="text-lg font-bold text-white mb-4">التخصص</h2>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: G }} />
                    <p className="text-sm leading-relaxed" style={{ color: '#8aa0bb' }}>{teacher.specialization}</p>
                  </div>
                </div>
              )}

              {/* Teacher's courses */}
              {courses.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" style={{ color: G }} /> دورات المعلم
                  </h2>
                  <div className="grid gap-3">
                    {courses.map(c => (
                      <Link key={c._id} to={`/courses/${c.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl transition-all"
                        style={{ background: 'rgba(7,15,28,0.4)', border: '1px solid rgba(223,171,112,0.08)' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(223,171,112,0.25)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(223,171,112,0.08)'}>
                        {c.thumbnail ? (
                          <img src={c.thumbnail.startsWith('http') ? c.thumbnail : `https://api.quranei.com/api/media/stream/${c.thumbnail}`}
                            alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(17,40,71,0.8)' }}>
                            <BookOpen className="w-5 h-5 opacity-40" style={{ color: G }} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-semibold truncate">{c.title}</div>
                          <div className="text-xs" style={{ color: '#5e779a' }}>{c.shortDescription?.slice(0, 60)}...</div>
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0 rotate-180" style={{ color: '#5e779a' }} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">
              {/* Quick info */}
              <div className="glass-card p-5 space-y-4">
                <h3 className="font-bold text-white text-sm">معلومات سريعة</h3>
                {[
                  teacher.nationality && { l: 'الجنسية', v: teacher.nationality },
                  teacher.experience && { l: 'الخبرة', v: teacher.experience },
                  teacher.gender && { l: 'النوع', v: teacher.gender === 'male' ? 'معلم' : 'معلمة' },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span style={{ color: '#5e779a' }}>{item.l}</span>
                    <span className="font-semibold text-white">{item.v}</span>
                  </div>
                ))}
                {teacher.languages?.length > 0 && (
                  <div>
                    <span className="text-sm block mb-2" style={{ color: '#5e779a' }}>اللغات</span>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.languages.map((l, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg text-xs"
                          style={{ background: 'rgba(94,119,154,0.2)', color: '#5e779a' }}>{l}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              {socials.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="font-bold text-white text-sm mb-4">تواصل اجتماعي</h3>
                  <div className="flex gap-3 flex-wrap">
                    {socials.map(({ key, Icon, color, label }) => (
                      <a key={key} href={teacher.socialLinks[key]} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                        style={{ background: `rgba(${key === 'youtube' ? '255,0,0' : key === 'instagram' ? '225,48,108' : key === 'twitter' ? '29,161,242' : '24,119,242'},0.12)`, color }}>
                        <Icon className="w-4 h-4" /> {label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {teacher.whatsapp && (
                <div className="rounded-2xl p-5"
                  style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.1), rgba(18,140,126,0.08))', border: '1px solid rgba(37,211,102,0.2)' }}>
                  <p className="text-sm text-center mb-4" style={{ color: '#8aa0bb' }}>
                    احجز حصتك مع {teacher.fullName} الآن
                  </p>
                  <a href={`https://wa.me/${teacher.whatsapp}?text=${encodeURIComponent(`السلام عليكم، أريد الاشتراك في الدروس مع ${teacher.fullName}`)}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm"
                    style={{ background: '#25d366', color: '#fff', boxShadow: '0 4px 15px rgba(37,211,102,0.4)' }}>
                    <MessageCircle className="w-4 h-4" /> تواصل عبر واتساب
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
