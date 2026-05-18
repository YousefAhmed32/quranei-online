import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

const WA_NUMBER = '201008148164'

function WAIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.17.578 4.197 1.585 5.945L.057 23.49l5.698-1.494A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.867 0-3.617-.5-5.124-1.375l-.366-.218-3.804.997 1.015-3.697-.238-.378A9.946 9.946 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  )
}

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  // Show greeting bubble after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 4000)
    return () => clearTimeout(t)
  }, [])

  const handleOpen = () => {
    setOpen(true)
    setShowBubble(false)
  }

  const handleSend = (msg = '') => {
    const text = msg || 'السلام عليكم، أريد الاستفسار عن أكاديمية قرآني أونلاين'
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
    setOpen(false)
  }

  const QUICK = [
    'أريد الاشتراك في دورة قرآنية',
    'أريد معرفة الأسعار والباقات',
    'أريد حجز حصة تجريبية مجانية',
    'أريد الاستفسار عن الجداول المتاحة',
  ]

  return (
    <div className="fixed bottom-24 left-6 z-50 flex flex-col items-end gap-3">
      {/* Chat popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-72 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: '#0f1e35',
              border: '1px solid rgba(223,171,112,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(223,171,112,0.05)',
            }}
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4"
              style={{ background: 'linear-gradient(135deg, #128c7e 0%, #25d366 100%)' }}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <WAIcon size={22} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">قرآني أونلاين</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-xs text-white/80">متصل الآن</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message bubble */}
            <div className="p-4">
              <div className="bg-white/5 rounded-xl rounded-tr-sm p-3 text-sm mb-4" style={{ color: '#c0d0e0' }}>
                السلام عليكم 🌙<br />
                كيف يمكننا مساعدتك في رحلتك القرآنية؟
              </div>

              {/* Quick replies */}
              <div className="space-y-2">
                {QUICK.map((q, i) => (
                  <motion.button key={i} onClick={() => handleSend(q)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full text-right px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                    style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366' }}>
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4">
              <button onClick={() => handleSend()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #128c7e, #25d366)', color: '#fff', boxShadow: '0 4px 15px rgba(37,211,102,0.4)' }}>
                <WAIcon size={16} />
                <span>ابدأ المحادثة</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting bubble */}
      <AnimatePresence>
        {showBubble && !open && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm font-medium max-w-[220px] text-center cursor-pointer"
            style={{ background: '#fff', color: '#1a1a1a', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', direction: 'rtl' }}
            onClick={handleOpen}
          >
            هل تحتاج مساعدة؟ 🕌
            <div className="text-xs mt-0.5" style={{ color: '#128c7e' }}>تحدث معنا الآن</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => open ? setOpen(false) : handleOpen()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #128c7e 0%, #25d366 100%)',
          boxShadow: '0 6px 25px rgba(37,211,102,0.5), 0 0 0 0 rgba(37,211,102,0.4)',
        }}
        animate={{ boxShadow: ['0 6px 25px rgba(37,211,102,0.5), 0 0 0 0 rgba(37,211,102,0)',
          '0 6px 25px rgba(37,211,102,0.5), 0 0 0 12px rgba(37,211,102,0)',
          '0 6px 25px rgba(37,211,102,0.5), 0 0 0 0 rgba(37,211,102,0)'] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="wa" initial={{rotate:90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}}>
              <WAIcon size={26} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Unread dot */}
        {!open && (
          <motion.div initial={{scale:0}} animate={{scale:1}} className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black"
            style={{ background: '#ef4444', border: '2px solid #0f1e35' }}>1</motion.div>
        )}
      </motion.button>
    </div>
  )
}
