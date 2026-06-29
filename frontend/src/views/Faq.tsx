import { CTASection } from "@/components/sections/cta-section";
import { FAQSection } from "@/components/sections/faq-section";


export function FAQPage() {
  return (
    <section className="space-y-10">
      <FAQSection/>
      <CTASection/>
    </section>
  );
}