import { CTASection } from "@/components/sections/cta-section";
import { ToolSection } from "@/components/sections/tool-section";

export function ToolsPage() {
  return(
    <section className="space-y-10">
      <ToolSection/>
      <CTASection/>
    </section>
  )
}