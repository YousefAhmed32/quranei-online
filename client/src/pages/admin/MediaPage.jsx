import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const TYPE_ICON = { video: '🎬', audio: '🎵', pdf: '📄', file: '📁' };
const formatBytes = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

export default function MediaPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState('all');
  const fileRef = useRef();

  const fetchFiles = async () => {
    try {
      const res = await api.get('/media');
      setFiles(res.data.files || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => setProgress(Math.round((p.loaded * 100) / p.total)),
      });
      await fetchFiles();
    } catch (err) { console.error(err); }
    finally { setUploading(false); setProgress(0); if (fileRef.current) fileRef.current.value = ''; }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('حذف هذا الملف نهائياً؟')) return;
    try { await api.delete(`/media/${id}`); setFiles(f => f.filter(x => x._id !== id)); }
    catch (err) { console.error(err); }
  };

  const copyLink = (id) => {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/media/stream/${id}`;
    navigator.clipboard.writeText(url);
  };

  const filtered = filter === 'all' ? files : files.filter(f => f.metadata?.type === filter);

  return (
    <div className="min-h-screen bg-[#0a1628] p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">مكتبة الوسائط</h1>
          <p className="text-[#5e779a] mt-1">{files.length} ملف في المكتبة</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin" className="px-4 py-2 rounded-lg bg-[#1a2d4a] text-[#5e779a] border border-[#1a2d4a] text-sm hover:text-white transition-colors">← لوحة التحكم</Link>
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="px-4 py-2 rounded-lg bg-[#dfab70] text-[#0a1628] font-bold hover:bg-[#c99658] transition-colors text-sm disabled:opacity-50">
            {uploading ? `رفع... ${progress}%` : '+ رفع ملف'}
          </button>
          <input ref={fileRef} type="file" accept="video/*,audio/*,application/pdf,image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="mb-6 bg-[#0d1f38] rounded-xl border border-[#1a2d4a] p-4">
          <div className="flex justify-between text-sm text-[#5e779a] mb-2">
            <span>جاري الرفع...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-[#1a2d4a] rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#dfab70] rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'video', label: '🎬 فيديو' },
          { key: 'audio', label: '🎵 صوت' },
          { key: 'pdf', label: '📄 PDF' },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${filter === t.key ? 'bg-[#dfab70]/10 border border-[#dfab70]/40 text-[#dfab70]' : 'bg-[#0d1f38] border border-[#1a2d4a] text-[#5e779a] hover:border-[#5e779a]/50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="text-center py-20 text-[#5e779a]">
          <div className="w-8 h-8 border-2 border-[#dfab70] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          جاري التحميل...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-[#5e779a]">لا توجد ملفات حتى الآن</p>
          <p className="text-[#5e779a]/60 text-sm mt-1">ارفع أول ملف لبدء مكتبة الوسائط</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((file, i) => {
            const type = file.metadata?.type || 'file';
            return (
              <motion.div key={file._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className="bg-[#0d1f38] rounded-xl border border-[#1a2d4a] p-4 hover:border-[#dfab70]/30 transition-all group">
                <div className="text-4xl mb-3 text-center">{TYPE_ICON[type]}</div>
                <p className="text-white text-sm font-medium mb-1 truncate text-center" title={file.metadata?.originalName || file.filename}>
                  {file.metadata?.originalName || file.filename}
                </p>
                <p className="text-[#5e779a] text-xs text-center mb-3">{formatBytes(file.length)}</p>
                <div className="flex gap-2">
                  <button onClick={() => copyLink(file._id)}
                    className="flex-1 py-1.5 rounded-lg bg-[#1a2d4a] text-[#dfab70] text-xs border border-[#dfab70]/20 hover:bg-[#dfab70]/10 transition-colors">
                    نسخ الرابط
                  </button>
                  <button onClick={() => handleDelete(file._id)}
                    className="py-1.5 px-3 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-colors text-xs">
                    🗑
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
