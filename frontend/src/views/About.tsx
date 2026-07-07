import { AboutSection } from "@/components/sections/about-section";
import { CTASection } from "@/components/sections/cta-section";

export function AboutPage() {
  return (
    <div className="space-y-10">
      <AboutSection />
      <CTASection />
    </div>
  );
}
