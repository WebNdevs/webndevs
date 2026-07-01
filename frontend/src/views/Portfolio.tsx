import { CTASection } from '@/components/sections/cta-section';
import { PortfolioSection } from '@/components/sections/portfolio-section';

export function PortfolioPage() {
  return (
    <div className="space-y-10">
        <PortfolioSection/>
        <CTASection/>
    </div>
  );
}