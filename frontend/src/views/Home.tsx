import dynamic from 'next/dynamic';
import { HeroSection } from '../components/sections/hero-section';

const WhyChooseSection = dynamic(() => import('@/components/sections/why-choose-section').then(mod => mod.WhyChooseSection));
const ProcessSection = dynamic(() => import('@/components/sections/process-section').then(mod => mod.ProcessSection));
const PortfolioSection = dynamic(() => import('@/components/sections/portfolio-section').then(mod => mod.PortfolioSection));
const TestimonialsSection = dynamic(() => import('@/components/sections/testimonials-section').then(mod => mod.TestimonialsSection));
const CTASection = dynamic(() => import('@/components/sections/cta-section').then(mod => mod.CTASection));

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