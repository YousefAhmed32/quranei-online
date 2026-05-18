import PublicLayout from '../../components/layout/PublicLayout';
import PricingSection from '../../components/dashboard/PricingSection';
import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <PublicLayout>
      <div className="pt-20" dir="rtl">
        {/* <div className="text-center py-16 px-4">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-[#dfab70] text-sm tracking-widest uppercase mb-4">الأسعار والباقات</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6">
            استثمر في <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dfab70] to-[#906130]">علمك</span>
          </motion.h1>
        </div> */}
        <PricingSection />
      </div>
    </PublicLayout>
  );
}
