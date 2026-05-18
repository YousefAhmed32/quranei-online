import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'جميع المستويات'];
const CATEGORIES = ['tajweed', 'makhraj', 'memorization', 'recitation', 'ijazah', 'correction', 'foundation'];
const CAT_AR = { tajweed: 'تجويد', makhraj: 'مخارج', memorization: 'حفظ', recitation: 'تلاوة', ijazah: 'إجازة', correction: 'تصحيح', foundation: 'أساسيات' };

const emptyForm = { title: '', description: '', category: 'tajweed', level: 'مبتدئ', price: '', duration: '', isPublished: false };

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/all');
      setCourses(res.data.courses || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setModal(true); };
  const openEdit = (c) => { setForm({ title: c.title, description: c.description, category: c.category, level: c.level, price: c.price, duration: c.duration, isPublished: c.isPublished }); setEditingId(c._id); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, form);
      } else {
        await api.post('/courses', form);
      }
      setModal(false);
      await fetchCourses();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الكورس؟')) return;
    try { await api.delete(`/courses/${id}`); await fetchCourses(); }
    catch (err) { console.error(err); }
  };

  const togglePublish = async (id, current) => {
    try { await api.put(`/courses/${id}`, { isPublished: !current }); await fetchCourses(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">إدارة الكورسات</h1>
          <p className="text-[#5e779a] mt-1">{courses.length} كورس في المنظومة</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin" className="px-4 py-2 rounded-lg bg-[#1a2d4a] text-[#5e779a] border border-[#1a2d4a] hover:text-white transition-colors text-sm">← لوحة التحكم</Link>
          <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-[#dfab70] text-[#0a1628] font-bold hover:bg-[#c99658] transition-colors text-sm">+ إضافة كورس</button>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-20 text-[#5e779a]">
          <div className="w-8 h-8 border-2 border-[#dfab70] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          جاري التحميل...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#0d1f38] rounded-2xl border border-[#1a2d4a] p-5 hover:border-[#dfab70]/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-[#dfab70]/10 text-[#dfab70] border border-[#dfab70]/20">
                  {CAT_AR[course.category] || course.category}
                </span>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${course.isPublished ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                  <span className="text-xs text-[#5e779a]">{course.isPublished ? 'منشور' : 'مسودة'}</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2 leading-tight">{course.title}</h3>
              <p className="text-[#5e779a] text-sm mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-3 text-xs text-[#5e779a] mb-4">
                <span>📚 {course.level}</span>
                <span>⏱️ {course.duration}</span>
                <span>💰 {course.price} ريال</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(course)} className="flex-1 py-2 rounded-lg bg-[#1a2d4a] text-[#dfab70] border border-[#dfab70]/20 hover:bg-[#dfab70]/10 transition-colors text-sm">تعديل</button>
                <button onClick={() => togglePublish(course._id, course.isPublished)} className="flex-1 py-2 rounded-lg bg-[#1a2d4a] text-[#5e779a] border border-[#1a2d4a] hover:text-white transition-colors text-sm">
                  {course.isPublished ? 'إخفاء' : 'نشر'}
                </button>
                <button onClick={() => handleDelete(course._id)} className="py-2 px-3 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-colors text-sm">🗑</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0d1f38] rounded-2xl border border-[#1a2d4a] p-6 w-full max-w-lg" dir="rtl">
              <h2 className="text-xl font-bold text-white mb-5">{editingId ? 'تعديل الكورس' : 'إضافة كورس جديد'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#5e779a] text-sm mb-1">اسم الكورس *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#112847] border border-[#1a2d4a] text-white focus:outline-none focus:border-[#dfab70]/50" placeholder="أساسيات التجويد..." />
                </div>
                <div>
                  <label className="block text-[#5e779a] text-sm mb-1">الوصف</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#112847] border border-[#1a2d4a] text-white focus:outline-none focus:border-[#dfab70]/50 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#5e779a] text-sm mb-1">التصنيف</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#112847] border border-[#1a2d4a] text-white focus:outline-none">
                      {CATEGORIES.map(c => <option key={c} value={c}>{CAT_AR[c]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#5e779a] text-sm mb-1">المستوى</label>
                    <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#112847] border border-[#1a2d4a] text-white focus:outline-none">
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#5e779a] text-sm mb-1">السعر (ريال)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#112847] border border-[#1a2d4a] text-white focus:outline-none" placeholder="199" />
                  </div>
                  <div>
                    <label className="block text-[#5e779a] text-sm mb-1">المدة</label>
                    <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#112847] border border-[#1a2d4a] text-white focus:outline-none" placeholder="40 ساعة" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 accent-yellow-500" />
                  <span className="text-[#5e779a] text-sm">نشر الكورس للطلاب</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving || !form.title} className="flex-1 py-2 rounded-lg bg-[#dfab70] text-[#0a1628] font-bold hover:bg-[#c99658] transition-colors disabled:opacity-50">
                  {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
                <button onClick={() => setModal(false)} className="px-5 py-2 rounded-lg bg-[#1a2d4a] text-[#5e779a] hover:text-white transition-colors">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
