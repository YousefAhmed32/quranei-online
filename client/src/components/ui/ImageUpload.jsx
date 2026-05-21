import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { mediaService } from '../../services/api'
import qToast from './Toast'

const G = '#dfab70'

/**
 * Reusable image upload field
 * Props:
 *   value      – current image ID or URL
 *   onChange   – called with new value (ID from GridFS or raw URL)
 *   label      – field label
 *   hint       – small hint text
 */
export default function ImageUpload({ value = '', onChange, label = 'الصورة', hint = '' }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [dragOver, setDragOver]   = useState(false)

  // Derive preview URL
// const API_BASE = import.meta.env.VITE_API_URL || 'https://api.quranei.com'

const API_BASE = (import.meta.env.VITE_API_URL || 'https://api.quranei.com/api')
  .replace(/\/api$/, '') // يشيل /api من الآخر لو موجود

const preview = value
  ? (value.startsWith('http') ? value : `${API_BASE}/api/media/stream/${value}`)
  : ''

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      qToast.error('يجب أن يكون الملف صورة (JPG, PNG, WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      qToast.error('حجم الصورة يجب أن يكون أقل من 5 ميغابايت')
      return
    }

    setUploading(true)
    setProgress(0)
    const toastId = qToast.loading('جارٍ رفع الصورة...')

    try {
      const { data } = await mediaService.upload(file, setProgress)
      const id = data?.file?.id || data?.fileId || data?._id || ''
      onChange(id || '')
      qToast.dismiss(toastId)
      qToast.success('تم رفع الصورة بنجاح ✓')
    } catch {
      qToast.dismiss(toastId)
      qToast.error('فشل رفع الصورة — يمكنك لصق رابط الصورة يدوياً')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const clearImage = () => onChange('')

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold mb-2" style={{ color: G }}>
          {label}
        </label>
      )}

      {/* Drop zone */}
      <label
        className="relative flex flex-col items-center justify-center rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
        style={{
          border: dragOver
            ? `2px dashed ${G}`
            : '2px dashed rgba(223,171,112,0.2)',
          background: dragOver ? 'rgba(223,171,112,0.05)' : 'rgba(7,15,28,0.4)',
          minHeight: preview ? 'auto' : '120px',
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file" accept="image/*" className="hidden"
          onChange={e => handleFile(e.target.files?.[0])}
        />

        {/* Upload overlay when uploading */}
        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
            style={{ background: 'rgba(7,15,28,0.85)' }}>
            <div className="w-10 h-10 border-2 rounded-full animate-spin mb-2"
              style={{ borderColor: `${G} transparent` }} />
            <span className="text-sm font-bold" style={{ color: G }}>{progress}%</span>
            <div className="w-32 h-1 rounded-full mt-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-200"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, #906130, ${G})` }} />
            </div>
          </div>
        )}

        {/* Preview */}
        {preview && !uploading ? (
          <div className="relative w-full group">
            <img src={preview} alt="preview"
              className="w-full max-h-44 object-cover rounded-xl" />
            {/* Remove button */}
            <button
              type="button" onClick={e => { e.preventDefault(); clearImage() }}
              className="absolute top-2 left-2 p-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}>
              <X className="w-3.5 h-3.5" />
            </button>
            {/* Re-upload hint */}
            <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(7,15,28,0.6)' }}>
              <div className="text-center">
                <Upload className="w-6 h-6 mx-auto mb-1" style={{ color: G }} />
                <span className="text-xs text-white">انقر لتغيير الصورة</span>
              </div>
            </div>
          </div>
        ) : !uploading ? (
          <div className="py-8 flex flex-col items-center gap-2 select-none">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(223,171,112,0.08)' }}>
              <ImageIcon className="w-6 h-6" style={{ color: 'rgba(223,171,112,0.4)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'rgba(223,171,112,0.5)' }}>
              اسحب صورة هنا أو انقر للرفع
            </span>
            <span className="text-xs" style={{ color: '#5e779a' }}>JPG, PNG, WebP — حتى 5MB</span>
          </div>
        ) : null}
      </label>

      {/* URL fallback input */}
      <div className="mt-2">
        <input
          value={value && !value.match(/^[0-9a-fA-F]{24}$/) ? value : ''}
          onChange={e => onChange(e.target.value)}
          placeholder="أو ألصق رابط الصورة مباشرةً..."
          className="w-full px-3 py-2 rounded-xl text-xs text-white outline-none"
          style={{
            background: 'rgba(7,15,28,0.5)',
            border: '1px solid rgba(223,171,112,0.1)',
            fontFamily: 'Cairo, sans-serif',
            direction: 'ltr',
          }}
        />
      </div>
      {hint && <p className="text-xs mt-1" style={{ color: '#5e779a' }}>{hint}</p>}
    </div>
  )
}
