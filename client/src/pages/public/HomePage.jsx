import PublicLayout from '../../components/layout/PublicLayout'
import HeroSection from '../../components/dashboard/HeroSection'
import AboutSection from '../../components/dashboard/AboutSection'
import ProgramsSection from '../../components/dashboard/ProgramsSection'
import TestimonialsSection from '../../components/dashboard/TestimonialsSection'
import PricingSection from '../../components/dashboard/PricingSection'

export default function HomePage() {
  return (
    <PublicLayout>
      {/* overflow-x guard prevents particle/absolute bleed on all viewports */}
      <div style={{ overflowX: 'hidden', width: '100%' }}>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <TestimonialsSection />
        <PricingSection />
      </div>
    </PublicLayout>
  )
}