import PublicLayout from '../../components/layout/PublicLayout'
import HeroSection from '../../components/dashboard/HeroSection'
import AboutSection from '../../components/dashboard/AboutSection'
import ProgramsSection from '../../components/dashboard/ProgramsSection'
import TestimonialsSection from '../../components/dashboard/TestimonialsSection'
import PricingSection from '../../components/dashboard/PricingSection'

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <TestimonialsSection />
      <PricingSection />
    </PublicLayout>
  )
}
