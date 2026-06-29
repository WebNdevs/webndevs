import { CTASection } from '@/components/sections/cta-section';
import { CaseStudySection } from '@/components/sections/case-study-section';

export function CaseStudyPage() {
  return (
    <section className="space-y-10">
      <CaseStudySection/>
      <CTASection/>
    </section>
  );
}