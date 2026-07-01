import { HeroSection } from '../components/sections/hero-section';
import { CTASection } from '@/components/sections/cta-section';
import { WhyChooseSection } from '@/components/sections/why-choose-section';
import { PortfolioSection } from '@/components/sections/portfolio-section';
import { ProcessSection } from '@/components/sections/process-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';

export function HomePage() {
  return (
    <div className="space-y-10">
      <HeroSection/>
      <WhyChooseSection/>
      <ProcessSection/>
      <PortfolioSection variant='preview'/>
      <TestimonialsSection variant='preview'/>
      <CTASection/>
    </div>
  );
}