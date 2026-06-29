import { CTASection } from "@/components/sections/cta-section";
import { IndustrySection } from "@/components/sections/industry-section";

export function IndustriesPage() {
  return(
    <section className="space-y-10">
      <IndustrySection/>
      <CTASection/>
    </section>
  )
}