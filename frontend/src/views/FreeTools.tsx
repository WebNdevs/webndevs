import { CTASection } from "@/components/sections/cta-section";
import { FreeToolSection } from "@/components/sections/free-tool-section";

export function FreeToolsPage() {
  return(
    <section className="space-y-10">
      <FreeToolSection/>
      <CTASection/>
    </section>
  )
}