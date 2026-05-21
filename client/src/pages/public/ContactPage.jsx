import { motion } from 'framer-motion';
import PublicLayout from '../../components/layout/PublicLayout';

const WHATSAPP = import.meta.env.VITE_WHATSAPP || '201008148164';

const faqs = [
  { q: 'كيف يتم الدفع؟', a: 'يتم الدفع عبر واتساب. بعد اختيار الباقة، سيتواصل معك فريقنا لإتمام عملية الدفع.' },
  { q: 'هل يمكنني تعلم التجويد إذا لم أكن أحفظ القرآن؟', a: 'نعم، برامجنا مصممة لجميع المستويات بدءاً من الصفر.' },
  { q: 'كم تستغرق المدة لإتقان التجويد؟', a: 'يختلف الأمر حسب الجهد والمستوى، لكن معظم طلابنا يصلون لمستوى جيد خلال 3-6 أشهر.' },
  { q: 'هل الدروس مسجلة أم مباشرة؟', a: 'نوفر كلاهما: دروس مسجلة يمكنك مشاهدتها في أي وقت، ودروس مباشرة مع المعلم.' },
  { q: 'هل هناك إمكانية للاسترداد؟', a: 'نعم، نوفر ضمان 7 أيام. إذا لم تكن راضياً، سنسترد مبلغك كاملاً.' },
];

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="pt-20 min-h-screen" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#dfab70] text-sm tracking-widest uppercase mb-4">تواصل معنا</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4">نحن هنا <span className="text-[#dfab70]">لخدمتك</span></motion.h1>
            <p className="text-[#5e779a] text-lg">لا تتردد في التواصل معنا لأي استفسار</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Cards */}
            <div className="space-y-5">
              {[
                { icon: '💬', title: 'واتساب', desc: 'للتسجيل والاستفسارات السريعة', action: `https://wa.me/${WHATSAPP}`, label: 'تواصل عبر واتساب', color: 'emerald' },
                { icon: '📧', title: 'البريد الإلكتروني', desc: 'qurani.online92@gmail.com', action: 'mailto:info@qurani.online', label: 'أرسل بريداً', color: 'blue' },
                { icon: '📱', title: 'الهاتف', desc: '+201008148164', action: `tel:+${WHATSAPP}`, label: 'اتصل بنا', color: 'yellow' },
              ].map((c, i) => (
                <motion.a key={i} href={c.action} target="_blank" rel="noreferrer"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-5 p-5 bg-[#0d1f38] rounded-2xl border border-[#1a2d4a] hover:border-[#dfab70]/30 transition-all group">
                  <div className="w-14 h-14 rounded-xl bg-[#dfab70]/10 border border-[#dfab70]/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{c.title}</h3>
                    <p className="text-[#5e779a] text-sm">{c.desc}</p>
                  </div>
                  <span className="mr-auto text-[#dfab70] text-sm opacity-0 group-hover:opacity-100 transition-opacity">←</span>
                </motion.a>
              ))}

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="p-5 bg-[#dfab70]/5 rounded-2xl border border-[#dfab70]/20">
                <p className="text-[#dfab70] font-semibold mb-1">أوقات العمل</p>
                <p className="text-[#5e779a] text-sm">الأحد – الخميس: 9ص – 10م</p>
                <p className="text-[#5e779a] text-sm">الجمعة – السبت: 2م – 9م</p>
              </motion.div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-white text-2xl font-bold mb-6">الأسئلة الشائعة</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-[#0d1f38] rounded-xl border border-[#1a2d4a] p-4 hover:border-[#dfab70]/30 transition-all">
                    <p className="text-[#dfab70] font-semibold text-sm mb-2">{faq.q}</p>
                    <p className="text-[#5e779a] text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
