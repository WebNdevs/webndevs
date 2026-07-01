import { CTASection } from "@/components/sections/cta-section";
import { ToolSection } from "@/components/sections/tool-section";

export function ToolsPage() {
  return(
    <div className="space-y-10">
      <ToolSection/>
      <CTASection/>
    </div>
  )
}