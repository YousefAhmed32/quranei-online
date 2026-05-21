import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Users, Clock, Search, GraduationCap } from 'lucide-react'
import PublicLayout from '../../components/layout/PublicLayout'
import { teacherService } from '../../services/api'

const G  = '#dfab70'
const GD = '#906130'

/* ═══════════════════════════
   TEACHER CARD
═══════════════════════════ */
function TeacherCard({ teacher, index }) {
  const imgSrc = teacher.imageId
    ? `https://api.quranei.com/api/media/stream/${teacher.imageId}`
    : teacher.imageUrl || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: (index % 6) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <Link to={`/teachers/${teacher.slug || teacher._id}`} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
        <div
          style={{
            height: '100%', borderRadius: 24, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(180deg, rgba(10,22,40,0.92) 0%, rgba(7,15,28,0.98) 100%)',
            backdropFilter: 'blur(26px)',
            border: '1px solid rgba(223,171,112,0.14)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
            transition: 'border-color 0.35s, box-shadow 0.35s',
            position: 'relative',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(223,171,112,0.35)';
            e.currentTarget.style.boxShadow = '0 18px 56px rgba(0,0,0,0.62), 0 0 36px rgba(223,171,112,0.09), inset 0 1px 0 rgba(255,255,255,0.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(223,171,112,0.14)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)';
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(circle at top, rgba(223,171,112,0.1), transparent 60%)',
            opacity: 0.5,
          }} />

          {/* Cover */}
          <div style={{
            position: 'relative',
            height: 'clamp(140px, 18vw, 176px)',
            flexShrink: 0,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            backgroundImage: "url('/image/back-teacher-5.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(5,10,20,0.12) 0%, rgba(5,10,20,0.7) 100%)',
            }} />
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.06,
              backgroundImage: 'repeating-linear-gradient(45deg, #dfab70 0, #dfab70 1px, transparent 0, transparent 50%)',
              backgroundSize: '14px 14px',
            }} />

            {/* Featured badge */}
            {teacher.featured && (
              <div style={{
                position: 'absolute', top: 10, right: 10,
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 10px', borderRadius: 999,
                background: 'rgba(223,171,112,0.18)',
                border: '1px solid rgba(223,171,112,0.35)',
                color: '#f6d3a7',
                fontSize: 10, fontWeight: 700,
                fontFamily: "'Cairo', sans-serif",
                backdropFilter: 'blur(8px)',
              }}>
                <Star style={{ width: 11, height: 11 }} className="fill-current" />
                معلم مميز
              </div>
            )}

            {/* Avatar */}
            <div style={{ position: 'relative', zIndex: 10, marginBottom: -40 }}>
              <div style={{
                width: 'clamp(72px, 10vw, 84px)',
                height: 'clamp(72px, 10vw, 84px)',
                borderRadius: 22, overflow: 'hidden', margin: '0 auto',
                border: '2.5px solid rgba(223,171,112,0.95)',
                boxShadow: '0 0 0 4px rgba(223,171,112,0.08), 0 10px 28px rgba(0,0,0,0.5), 0 0 22px rgba(223,171,112,0.2)',
                background: '#0a1628',
              }}>
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={teacher.fullName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s', display: 'block' }}
                    className="group-hover:scale-110"
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 900, color: G,
                  }}>
                    {teacher.fullName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{
            display: 'flex', flexDirection: 'column', flex: 1,
            paddingTop: 'clamp(44px, 8vw, 56px)',
            padding: `clamp(44px, 8vw, 56px) clamp(14px, 3vw, 20px) clamp(14px, 3vw, 20px)`,
            textAlign: 'center',
          }}>
            <h3 style={{
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 800, color: '#fff',
              fontSize: 'clamp(14px, 2.8vw, 18px)',
              letterSpacing: '0.02em',
              marginBottom: 4, lineHeight: 1.3,
            }}>
              {teacher.fullName}
            </h3>

            {teacher.title && (
              <p style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 'clamp(11px, 2vw, 13px)',
                color: G, marginBottom: 5, fontWeight: 600,
              }}>
                {teacher.title}
              </p>
            )}

            {teacher.specialization && (
              <p style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 'clamp(10px, 1.8vw, 12px)',
                color: '#7f97b5', marginBottom: 'clamp(12px, 3vw, 16px)',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}>
                {teacher.specialization}
              </p>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 'clamp(10px, 2.5vw, 16px)' }}>
              {[
                { icon: Star, val: teacher.rating?.toFixed(1) ?? '5.0', sub: 'تقييم', fill: true },
                {
                  icon: Users,
                  val: teacher.studentsCount >= 1000
                    ? `${(teacher.studentsCount / 1000).toFixed(1)}k`
                    : teacher.studentsCount || '—',
                  sub: 'طالب',
                },
                { icon: Clock, val: teacher.experience || '—', sub: 'خبرة' },
              ].map((s, i) => (
                <div key={i} style={{
                  borderRadius: 14,
                  padding: 'clamp(8px, 2vw, 12px) 6px',
                  background: 'linear-gradient(180deg, rgba(10,22,40,0.92), rgba(7,15,28,0.98))',
                  border: '1px solid rgba(223,171,112,0.1)',
                }}>
                  <s.icon
                    style={{
                      width: 'clamp(13px, 2.5vw, 16px)', height: 'clamp(13px, 2.5vw, 16px)',
                      margin: '0 auto 4px', display: 'block', color: G,
                    }}
                    className={s.fill ? 'fill-current' : ''}
                  />
                  <div style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 'clamp(12px, 2.5vw, 14px)', fontWeight: 900, color: '#fff',
                  }}>
                    {s.val}
                  </div>
                  <div style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 'clamp(9px, 1.6vw, 11px)', color: '#6f86a3', marginTop: 2,
                  }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            {teacher.languages?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 'clamp(10px, 2.5vw, 14px)' }}>
                {teacher.languages.slice(0, 3).map((l, i) => (
                  <span key={i} style={{
                    padding: '3px 10px', borderRadius: 999,
                    fontSize: 'clamp(9px, 1.6vw, 10px)', fontWeight: 600,
                    fontFamily: "'Cairo', sans-serif",
                    background: 'rgba(94,119,154,0.16)',
                    border: '1px solid rgba(94,119,154,0.18)',
                    color: '#8aa0bb',
                  }}>
                    {l}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div style={{ marginTop: 'auto', paddingTop: 'clamp(10px, 2.5vw, 14px)', borderTop: '1px solid rgba(223,171,112,0.08)' }}>
              <div style={{
                minHeight: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #b88447 0%, #dfab70 50%, #f0c48a 100%)',
                color: '#07101d',
                fontFamily: "'Cairo', sans-serif",
                fontSize: 'clamp(12px, 2.2vw, 13px)', fontWeight: 700,
                boxShadow: '0 6px 22px rgba(223,171,112,0.2), inset 0 1px 0 rgba(255,255,255,0.22)',
                transition: 'transform 0.25s',
              }}
                className="group-hover:scale-[1.02]"
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

/* ═══════════════════════════
   MAIN PAGE
═══════════════════════════ */
export default function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [gender, setGender]     = useState('')

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
      <div dir="rtl" style={{ overflowX: 'hidden' }}>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

          /* Teacher grid: 1 → 2 → 3 → 4 */
          .teachers-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: clamp(14px, 3vw, 24px);
          }
          @media (min-width: 480px) { .teachers-grid { grid-template-columns: 1fr 1fr; } }
          @media (min-width: 1024px) { .teachers-grid { grid-template-columns: repeat(3, 1fr); } }
          @media (min-width: 1280px) { .teachers-grid { grid-template-columns: repeat(4, 1fr); } }

          /* Filter bar — sticky with correct offset via CSS var or safe fallback */
          .teachers-filter-bar {
            position: sticky;
            top: 64px; /* safe navbar fallback */
            z-index: 30;
            padding: clamp(10px, 2.5vw, 16px) 0;
            background: rgba(7,15,28,0.92);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(223,171,112,0.08);
          }

          /* Filter bar inner row — wraps on small screens */
          .teachers-filter-inner {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 clamp(16px, 5vw, 32px);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: clamp(8px, 2vw, 12px);
          }

          /* Search input wrapper */
          .teachers-search {
            position: relative;
            flex: 1 1 clamp(140px, 30vw, 280px);
            max-width: 320px;
          }

          /* Filter pill buttons */
          .teachers-filter-btn {
            min-height: 40px;
            padding: 8px clamp(12px, 2.5vw, 16px);
            border-radius: 10px;
            font-family: 'Cairo', sans-serif;
            font-size: clamp(11px, 2vw, 12px);
            font-weight: 700;
            cursor: pointer;
            border: 1px solid;
            transition: all 0.2s;
            white-space: nowrap;
          }

          .group-hover\\:scale-\\[1\\.02\\]:hover { transform: scale(1.02); }
          .group-hover\\:scale-110:hover { transform: scale(1.1); }
        `}</style>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              src="./image/back-teacher.png"
              alt="Teachers Banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,15,28,0.62), rgba(7,15,28,0.92))' }} />
          </div>

          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(26,58,92,0.42) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{
            maxWidth: 1200, margin: '0 auto',
            padding: 'clamp(80px, 14vw, 120px) clamp(16px, 5vw, 32px) clamp(40px, 8vw, 64px)',
            textAlign: 'center', position: 'relative', zIndex: 10,
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 18px', borderRadius: 999,
                background: 'rgba(223,171,112,0.1)',
                border: '1px solid rgba(223,171,112,0.22)',
                color: G,
                fontFamily: "'Cairo', sans-serif",
                fontSize: 'clamp(10px, 2vw, 12px)', fontWeight: 700,
                marginBottom: 'clamp(14px, 3vw, 22px)',
              }}>
                <GraduationCap style={{ width: 'clamp(13px, 2.5vw, 16px)', height: 'clamp(13px, 2.5vw, 16px)' }} />
                نخبة المعلمين المُجازين
              </div>

              <h1 style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 'clamp(26px, 6vw, 52px)',
                fontWeight: 900, color: '#fff',
                marginBottom: 'clamp(10px, 2.5vw, 16px)',
                lineHeight: 1.3,
              }}>
                معلمونا{' '}
                <span style={{ color: G }}>المتميزون</span>
              </h1>

              <p style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 'clamp(13px, 2.8vw, 17px)',
                color: '#d5e3f3',
                maxWidth: 540, margin: '0 auto',
                lineHeight: 1.85,
              }}>
                تعلّم على يد نخبة من أفضل معلمي القرآن الكريم المُجازين بسند متصل
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        <div className="teachers-filter-bar">
          <div className="teachers-filter-inner">
            {/* Search */}
            <div className="teachers-search">
              <Search style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 15, height: 15, color: '#5e779a', pointerEvents: 'none',
              }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن معلم..."
                style={{
                  width: '100%',
                  paddingRight: 36, paddingLeft: 12,
                  paddingTop: 10, paddingBottom: 10,
                  borderRadius: 12,
                  background: 'rgba(17,40,71,0.5)',
                  border: '1px solid rgba(223,171,112,0.12)',
                  color: '#fff',
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 'clamp(12px, 2.2vw, 13px)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Gender filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[{ v: '', l: 'الكل' }, { v: 'male', l: 'معلمون' }, { v: 'female', l: 'معلمات' }].map(f => (
                <button
                  key={f.v}
                  onClick={() => setGender(f.v)}
                  className="teachers-filter-btn"
                  style={gender === f.v
                    ? { background: `linear-gradient(135deg, ${GD}, ${G})`, color: '#070f1c', borderColor: 'transparent' }
                    : { background: 'rgba(17,40,71,0.5)', color: '#5e779a', borderColor: 'rgba(223,171,112,0.1)' }
                  }
                >
                  {f.l}
                </button>
              ))}
            </div>

            {/* Count */}
            <span style={{
              marginRight: 'auto',
              fontFamily: "'Cairo', sans-serif",
              fontSize: 'clamp(10px, 2vw, 12px)',
              color: '#5e779a',
              whiteSpace: 'nowrap',
            }}>
              {filtered.length} معلم
            </span>
          </div>
        </div>

        {/* ── GRID ── */}
        <section style={{ padding: 'clamp(32px, 7vw, 56px) 0 clamp(48px, 10vw, 80px)' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(16px, 5vw, 32px)' }}>
            {loading ? (
              <div className="teachers-grid">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} style={{
                    borderRadius: 20, height: 'clamp(280px, 35vw, 340px)',
                    background: 'rgba(17,40,71,0.3)',
                    animation: 'teacherPulse 1.5s infinite',
                  }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'clamp(48px, 10vw, 96px) 16px' }}>
                <GraduationCap style={{ width: 56, height: 56, margin: '0 auto 16px', display: 'block', color: 'rgba(223,171,112,0.22)' }} />
                <p style={{ fontFamily: "'Cairo', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>لا يوجد معلمون</p>
                <p style={{ fontFamily: "'Cairo', sans-serif", color: '#5e779a' }}>جرّب تغيير معايير البحث</p>
              </div>
            ) : (
              <div className="teachers-grid">
                {filtered.map((t, i) => <TeacherCard key={t._id} teacher={t} index={i} />)}
              </div>
            )}
          </div>
        </section>

        <style>{`
          @keyframes teacherPulse { 0%,100%{opacity:.35} 50%{opacity:.6} }
        `}</style>

      </div>
    </PublicLayout>
  )
}