import { CTASection } from '@/components/sections/cta-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';

export function TestimonialsPage() {
  return (
    <section className="space-y-10">
        <TestimonialsSection/>
        <CTASection/>
    </section>
  );
}