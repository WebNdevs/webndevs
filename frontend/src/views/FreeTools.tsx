import { CTASection } from "@/components/sections/cta-section";
import { FreeToolSection } from "@/components/sections/free-tool-section";
import { FreeCalculators } from "@/components/tools/free-calculators";

export function FreeToolsPage() {
  return (
    <div className="space-y-10">
      <FreeToolSection />
      <div className="px-6">
        <FreeCalculators />
      </div>
      <CTASection />
    </div>
  );
}