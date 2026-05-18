import { motion } from 'framer-motion'
import PublicLayout from '../../components/layout/PublicLayout'
import { Star } from 'lucide-react'

const G = '#dfab70'

const TESTIMONIALS = [
  { name:'أحمد الرشيد', country:'🇸🇦 السعودية', text:'تجربة تعليمية استثنائية، تعلمت التجويد في أسابيع مع معلم متخصص وصبور.', rating:5 },
  { name:'أم عبدالله', country:'🇲🇦 المغرب', text:'أخيراً وجدت بيئة نسائية آمنة ومتميزة لتعلم القرآن الكريم. بارك الله في هذا الجهد.', rating:5 },
  { name:'محمد الأنصاري', country:'🇯🇴 الأردن', text:'منهج منظم وواضح جعل رحلة الحفظ ممتعة ومثمرة. أنصح به بشدة.', rating:5 },
  { name:'فاطمة الزهراء', country:'🇪🇬 مصر', text:'المعلمات ماشاء الله، صبر وعلم وإتقان. استفدت كثيراً خلال فترة وجيزة.', rating:5 },
  { name:'عبدالرحمن العمري', country:'🇦🇪 الإمارات', text:'المنصة الأفضل لتعلم القرآن عبر الإنترنت، أسلوب حديث وأصيل في آن واحد.', rating:5 },
  { name:'نور الهدى', country:'🇰🇼 الكويت', text:'حصلت على إجازة في القراءة بفضل هذه الأكاديمية المتميزة. شكراً من القلب.', rating:5 },
]

export default function TestimonialsPage() {
  return (
    <PublicLayout>
      <div dir="rtl">
        <section className="py-24 relative">
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(144,97,48,0.15) 0%, transparent 70%)' }} />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-14">
              <h1 className="text-4xl font-black text-white mb-4">آراء <span style={{color:G}}>طلابنا</span></h1>
              <p style={{color:'#5e779a'}}>أكثر من ٢٠٬٠٠٠ طالب وثّقوا تجربتهم مع قرآني أونلاين</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t,i) => (
                <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} transition={{delay:i*.1}} viewport={{once:true}}
                  className="glass-card p-6">
                  <div className="flex mb-3">
                    {Array(t.rating).fill(0).map((_,j) => <Star key={j} className="w-4 h-4 fill-current" style={{color:G}} />)}
                  </div>
                  <p className="text-sm leading-loose mb-4" style={{color:'#8aa0bb'}}>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{background:'rgba(223,171,112,0.15)', color:G}}>{t.name.charAt(0)}</div>
                    <div>
                      <div className="text-white text-sm font-bold">{t.name}</div>
                      <div className="text-xs" style={{color:'#5e779a'}}>{t.country}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
