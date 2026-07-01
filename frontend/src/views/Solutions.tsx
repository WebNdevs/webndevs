import { CTASection } from "@/components/sections/cta-section";
import { SolutionSection } from "@/components/sections/solution-section";

export function SolutionsPage() {
  return(
    <div className="space-y-10">
      <SolutionSection/>
      <CTASection/>
    </div>
  )
}