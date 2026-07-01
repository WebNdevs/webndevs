import { CTASection } from "@/components/sections/cta-section";
import { ComparisonSection } from "@/components/sections/comparison-section";

export function ComparisonPage() {
  return(
    <div className="space-y-10">
      <ComparisonSection/>
      <CTASection/>
    </div>
  )
}