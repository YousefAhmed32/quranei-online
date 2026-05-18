import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import ProgramsSection from '../../components/dashboard/ProgramsSection';

export default function ProgramsPage() {
  return (
    <PublicLayout>
      <div className="pt-20" dir="rtl">
        <div className="text-center py-16 px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-[#dfab70] text-sm tracking-widest uppercase mb-4">برامجنا التعليمية</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6">
            اكتشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dfab70] to-[#906130]">مساركَ</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[#5e779a] text-lg max-w-2xl mx-auto">
            برامج متكاملة صُممت لتأخذك من البداية إلى الإتقان في رحلة روحية ممتعة
          </motion.p>
        </div>
        <ProgramsSection />
        <div className="text-center py-16">
          <p className="text-[#5e779a] mb-6">لا تعرف أيّ برنامج يناسبك؟</p>
          <Link to="/register" className="px-8 py-3 rounded-xl bg-[#dfab70] text-[#0a1628] font-bold hover:bg-[#c99658] transition-colors">
            احجز استشارة مجانية
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
