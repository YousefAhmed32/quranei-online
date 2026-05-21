import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import ProgramsSection from '../../components/dashboard/ProgramsSection';

const GOLD = '#dfab70';
const NAVY = '#0a1628';

export default function ProgramsPage() {
  return (
    <PublicLayout>
      {/* overflow-x guard prevents section particle bleed */}
      <div style={{ overflowX: 'hidden', width: '100%' }} dir="rtl">

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Amiri:wght@400;700&display=swap');

          /* Hero section responsive padding — accounts for any navbar height */
          .programs-hero {
            padding-top: clamp(80px, 16vw, 140px);
            padding-bottom: clamp(32px, 6vw, 64px);
            padding-left: clamp(16px, 5vw, 32px);
            padding-right: clamp(16px, 5vw, 32px);
            text-align: center;
          }

          /* Bottom CTA section */
          .programs-cta {
            padding: clamp(48px, 10vw, 96px) clamp(16px, 5vw, 32px);
            text-align: center;
          }

          /* CTA link — minimum touch target */
          .programs-cta-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            padding: 12px clamp(24px, 6vw, 36px);
            border-radius: 14px;
            background: linear-gradient(135deg, #906130, #dfab70);
            color: #07101d;
            font-family: 'Cairo', sans-serif;
            font-size: clamp(13px, 2.5vw, 15px);
            font-weight: 800;
            text-decoration: none;
            box-shadow: 0 6px 24px rgba(223,171,112,0.32);
            transition: box-shadow 0.25s, transform 0.25s;
          }
          .programs-cta-link:hover {
            box-shadow: 0 10px 38px rgba(223,171,112,0.52);
            transform: translateY(-2px);
          }

          /* Eyebrow label */
          .programs-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 18px;
            border-radius: 999px;
            background: rgba(223,171,112,0.09);
            border: 1px solid rgba(223,171,112,0.22);
            color: ${GOLD};
            font-family: 'Cairo', sans-serif;
            font-size: clamp(10px, 2vw, 12px);
            font-weight: 700;
            letter-spacing: 0.18em;
            margin-bottom: clamp(14px, 3vw, 22px);
          }
        `}</style>

        {/* ── HERO ── */}
        <section className="programs-hero">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <div className="programs-eyebrow">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path d="M5 0l1.2 3.6H10L7 5.8l1.2 3.6L5 7.2 1.8 9.4 3 5.8 0 3.6h3.8z" fill={GOLD} />
              </svg>
              برامجنا التعليمية
            </div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 'clamp(28px, 6.5vw, 62px)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.35,
                marginBottom: 'clamp(14px, 3vw, 22px)',
                letterSpacing: '-0.01em',
              }}
            >
              اكتشف{' '}
              <span style={{
                background: 'linear-gradient(120deg, #dfab70 0%, #f0c98a 45%, #dfab70 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: '#dfab70', /* fallback */
                filter: 'drop-shadow(0 0 18px rgba(223,171,112,0.3))',
              }}>
                مساركَ
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 'clamp(13px, 2.8vw, 18px)',
                color: '#5e779a',
                maxWidth: 560,
                margin: '0 auto',
                lineHeight: 1.9,
              }}
            >
              برامج متكاملة صُممت لتأخذك من البداية إلى الإتقان في رحلة روحية ممتعة
            </motion.p>

            {/* Ornament divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 'clamp(20px, 4vw, 32px)' }}
            >
              <div style={{ width: 36, height: 1, background: 'linear-gradient(90deg, transparent, rgba(223,171,112,0.4))' }} />
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M10 2l2 5h5l-4 3 1.5 5L10 12l-4.5 3L7 10 3 7h5z" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7" />
              </svg>
              <div style={{ width: 36, height: 1, background: 'linear-gradient(270deg, transparent, rgba(223,171,112,0.4))' }} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── PROGRAMS SECTION ── */}
        <ProgramsSection />

        {/* ── BOTTOM CTA ── */}
        <div className="programs-cta">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 'clamp(13px, 2.5vw, 16px)',
              color: '#5e779a',
              marginBottom: 'clamp(16px, 3.5vw, 24px)',
            }}>
              لا تعرف أيّ برنامج يناسبك؟
            </p>
            <Link to="/register" className="programs-cta-link">
              احجز استشارة مجانية
            </Link>
          </motion.div>
        </div>

      </div>
    </PublicLayout>
  );
}