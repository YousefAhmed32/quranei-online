import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const WHATSAPP = import.meta.env.VITE_WHATSAPP || '201008148164';

function VideoPlayer({ lesson }) {
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  if (!lesson) return null;

  if (lesson.videoType === 'youtube') {
    const videoId = lesson.videoUrl?.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return (
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          className="absolute inset-0 w-full h-full rounded-xl"
          allowFullScreen title={lesson.title} />
      </div>
    );
  }

  if (lesson.videoType === 'vimeo') {
    const vimeoId = lesson.videoUrl?.match(/vimeo\.com\/(\d+)/)?.[1];
    return (
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe src={`https://player.vimeo.com/video/${vimeoId}`}
          className="absolute inset-0 w-full h-full rounded-xl"
          allowFullScreen title={lesson.title} />
      </div>
    );
  }

  if (lesson.videoType === 'upload' && lesson.mediaId) {
    return (
      <video controls className="w-full rounded-xl bg-black" preload="metadata">
        <source src={`${apiBase}/api/media/stream/${lesson.mediaId}`} />
        متصفحك لا يدعم تشغيل الفيديو
      </video>
    );
  }

  if (lesson.videoType === 'audio') {
    return (
      <div className="bg-[#0d1f38] rounded-xl p-8 flex flex-col items-center gap-6 border border-[#1a2d4a]">
        <div className="w-24 h-24 rounded-full bg-[#dfab70]/10 border-2 border-[#dfab70]/30 flex items-center justify-center">
          <span className="text-5xl">🎵</span>
        </div>
        <h3 className="text-white text-xl font-bold">{lesson.title}</h3>
        <audio controls className="w-full max-w-md">
          <source src={lesson.videoUrl || `${apiBase}/api/media/stream/${lesson.mediaId}`} />
        </audio>
      </div>
    );
  }

  if (lesson.videoType === 'external') {
    return (
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe src={lesson.videoUrl} className="absolute inset-0 w-full h-full rounded-xl"
          allowFullScreen title={lesson.title} />
      </div>
    );
  }

  return (
    <div className="bg-[#0d1f38] rounded-xl p-12 text-center border border-[#1a2d4a]">
      <div className="text-5xl mb-4">📄</div>
      <p className="text-[#5e779a]">لا يوجد وسيط لهذا الدرس</p>
    </div>
  );
}

export default function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, lessonsRes, progressRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/lessons/course/${courseId}`),
          api.get('/progress/my').catch(() => ({ data: { completedLessons: [] } })),
        ]);
        setCourse(courseRes.data.course);
        const ls = lessonsRes.data.lessons || [];
        setLessons(ls);
        if (ls.length > 0) setActiveLesson(ls[0]);
        const comp = new Set(progressRes.data.completedLessons || []);
        setCompleted(comp);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [courseId]);

  const markComplete = async (lessonId) => {
    if (completed.has(lessonId)) return;
    try {
      await api.post('/progress/complete-lesson', { lessonId, courseId });
      setCompleted(prev => new Set([...prev, lessonId]));
    } catch (err) { console.error(err); }
  };

  const goNext = () => {
    const idx = lessons.findIndex(l => l._id === activeLesson?._id);
    if (idx < lessons.length - 1) {
      if (activeLesson) markComplete(activeLesson._id);
      setActiveLesson(lessons[idx + 1]);
    }
  };

  const progressPct = lessons.length > 0 ? Math.round((completed.size / lessons.length) * 100) : 0;

  if (loading) return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#dfab70] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#5e779a]">جاري تحميل الكورس...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col" dir="rtl">
      {/* Top Bar */}
      <header className="bg-[#0d1f38] border-b border-[#1a2d4a] px-4 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-[#5e779a] hover:text-white transition-colors text-sm">← لوحة الطالب</Link>
          <span className="text-[#1a2d4a]">|</span>
          <h1 className="text-white font-semibold text-sm truncate max-w-xs">{course?.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-32 h-1.5 bg-[#1a2d4a] rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#dfab70] rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[#dfab70] text-sm font-bold">{progressPct}%</span>
          </div>
          <button onClick={() => setSidebarOpen(o => !o)}
            className="p-2 rounded-lg bg-[#1a2d4a] text-[#5e779a] hover:text-white transition-colors">
            {sidebarOpen ? '⟩' : '⟨'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Player */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            {activeLesson && (
              <motion.div key={activeLesson._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Video */}
                <div className="mb-6">
                  <VideoPlayer lesson={activeLesson} />
                </div>

                {/* Lesson Info */}
                <div className="bg-[#0d1f38] rounded-2xl border border-[#1a2d4a] p-6 mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-white text-xl font-bold mb-1">{activeLesson.title}</h2>
                      <p className="text-[#5e779a] text-sm">⏱️ {activeLesson.duration || 'غير محدد'}</p>
                    </div>
                    <button onClick={() => markComplete(activeLesson._id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        completed.has(activeLesson._id)
                          ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                          : 'bg-[#dfab70] text-[#0a1628] hover:bg-[#c99658]'
                      }`}>
                      {completed.has(activeLesson._id) ? '✓ مكتمل' : 'تحديد كمكتمل'}
                    </button>
                  </div>
                  {activeLesson.description && (
                    <p className="text-[#5e779a] text-sm leading-relaxed">{activeLesson.description}</p>
                  )}
                </div>

                {/* Attachments */}
                {activeLesson.attachments?.length > 0 && (
                  <div className="bg-[#0d1f38] rounded-xl border border-[#1a2d4a] p-4 mb-4">
                    <h3 className="text-white font-semibold mb-3 text-sm">📎 المرفقات</h3>
                    <div className="space-y-2">
                      {activeLesson.attachments.map((att, i) => (
                        <a key={i} href={att.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 text-[#dfab70] hover:text-white transition-colors text-sm p-2 rounded-lg hover:bg-[#1a2d4a]">
                          <span>📄</span>{att.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3">
                  <button onClick={goNext} disabled={lessons.findIndex(l => l._id === activeLesson._id) === lessons.length - 1}
                    className="flex-1 py-3 rounded-xl bg-[#dfab70] text-[#0a1628] font-bold hover:bg-[#c99658] transition-colors disabled:opacity-40">
                    الدرس التالي →
                  </button>
                  <a href={`https://wa.me/${WHATSAPP}?text=سؤال عن الكورس: ${course?.title}`}
                    target="_blank" rel="noreferrer"
                    className="py-3 px-5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-sm">
                    💬 تواصل
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="border-r border-[#1a2d4a] bg-[#0d1f38] overflow-y-auto flex-shrink-0">
              <div className="p-4 border-b border-[#1a2d4a]">
                <h3 className="text-white font-semibold">محتوى الكورس</h3>
                <p className="text-[#5e779a] text-xs mt-1">{completed.size}/{lessons.length} درس مكتمل</p>
                <div className="mt-2 h-1.5 bg-[#1a2d4a] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#dfab70] rounded-full" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
              <div className="py-2">
                {lessons.map((lesson, i) => {
                  const isActive = activeLesson?._id === lesson._id;
                  const isDone = completed.has(lesson._id);
                  return (
                    <button key={lesson._id} onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-right px-4 py-3 border-b border-[#1a2d4a]/40 transition-all ${isActive ? 'bg-[#dfab70]/10 border-r-2 border-r-[#dfab70]' : 'hover:bg-[#112847]'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                          isDone ? 'bg-emerald-400 text-black' : isActive ? 'bg-[#dfab70] text-black' : 'bg-[#1a2d4a] text-[#5e779a]'
                        }`}>
                          {isDone ? '✓' : i + 1}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? 'text-[#dfab70]' : isDone ? 'text-emerald-400' : 'text-white'}`}>
                            {lesson.title}
                          </p>
                          <p className="text-[#5e779a] text-xs mt-0.5">{lesson.duration || '—'}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
