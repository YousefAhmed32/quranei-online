import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PublicLayout from '../../components/layout/PublicLayout'
import { ChevronDown } from 'lucide-react'

const G = '#dfab70'

const FAQS = [
  { q:'كيف أبدأ رحلتي مع قرآني أونلاين؟', a:'ابدأ بالتواصل معنا عبر واتساب أو ملء نموذج التسجيل. سيتم التواصل معك لتحديد مستواك واختيار البرنامج المناسب.' },
  { q:'هل يوجد دروس للمبتدئين الذين لا يعرفون القراءة؟', a:'نعم، لدينا برنامج التأسيس القرآني المخصص للمبتدئين تماماً من الصفر حتى الإتقان.' },
  { q:'هل يوجد فصول خاصة للنساء؟', a:'بالتأكيد. لدينا معلمات متخصصات وبيئة تعليمية نسائية منفصلة وآمنة.' },
  { q:'كم عدد الحصص في الأسبوع؟', a:'يتراوح بين حصة إلى ثلاث حصص أسبوعياً حسب الباقة المختارة وجدولك الزمني.' },
  { q:'هل يمكنني الحصول على إجازة قرآنية؟', a:'نعم، لدينا برنامج الإجازة القرآنية بسند متصل للمستويات المتقدمة.' },
  { q:'ما هي طريقة الدفع؟', a:'نوفر عدة طرق للدفع. تواصل معنا عبر واتساب للاطلاع على التفاصيل والعروض المتاحة.' },
  { q:'هل يمكنني تجربة حصة مجانية؟', a:'نعم، نتيح حصة تجريبية مجانية لجميع المتقدمين الجدد قبل الاشتراك في أي برنامج.' },
  { q:'هل الدروس مسجلة يمكن مشاهدتها لاحقاً؟', a:'بعض البرامج تتضمن تسجيلات للدروس. يختلف الأمر حسب الباقة المختارة.' },
]

function FaqItem({ q, a, open, toggle }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border:'1px solid rgba(223,171,112,0.1)', background:'rgba(17,40,71,0.35)' }}>
      <button onClick={toggle} className="w-full flex items-center justify-between p-5 text-right gap-4">
        <span className="font-semibold text-white text-sm">{q}</span>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${open?'rotate-180':''}`} style={{color:G}} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
            className="overflow-hidden">
            <p className="px-5 pb-5 text-sm leading-loose" style={{color:'#8aa0bb'}}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqPage() {
  const [open, setOpen] = useState(0)
  return (
    <PublicLayout>
      <section className="py-24 relative" dir="rtl">
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(26,58,92,0.4) 0%, transparent 70%)'}} />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="text-center mb-14">
            <h1 className="text-4xl font-black text-white mb-4">الأسئلة <span style={{color:G}}>الشائعة</span></h1>
            <p style={{color:'#5e779a'}}>كل ما تحتاج معرفته قبل البدء في رحلتك القرآنية</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f,i) => <FaqItem key={i} q={f.q} a={f.a} open={open===i} toggle={() => setOpen(open===i?-1:i)} />)}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
