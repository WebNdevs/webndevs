import { CTASection } from "@/components/sections/cta-section";
import { ComparisonSection } from "@/components/sections/comparison-section";

export function ComparisonPage() {
  return(
    <section className="space-y-10">
      <ComparisonSection/>
      <CTASection/>
    </section>
  )
}