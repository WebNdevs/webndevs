import { ServicesSection } from "@/components/sections/services-section";
import { CTASection } from "@/components/sections/cta-section";

export function ServicesPage() {
  return (
    <section className="space-y-10">
      <ServicesSection/>
      <CTASection />
    </section>
  );
}