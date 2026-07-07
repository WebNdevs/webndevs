import { AboutSection } from "@/components/sections/about-section";
import dynamic from "next/dynamic";

const CTASection = dynamic(() => import("@/components/sections/cta-section").then(mod => mod.CTASection));

export function AboutPage() {
  return (
    <div className="space-y-10">
      <AboutSection />
      <CTASection />
    </div>
  );
}
