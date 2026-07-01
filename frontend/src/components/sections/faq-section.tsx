import { getHome } from '@/data/homedata';
import { HeaderSection } from '../cards/header-card';
import { ShortCTA } from './cta-section';
import { FAQCard, FAQItemProps } from '../cards/faq-card';
import { PageHero, PageHeroProps } from './pagehero';


export function FAQSection() {
  const section = getHome('faq')

  if(!section) return null;

  const faqItems = (section.items || []) as FAQItemProps[];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question || "",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer || "",
      },
    })),
  };

  return (
    <section id="faq" className="py-20 px-6 bg-[#0B0F14]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <PageHero {...section.hero as PageHeroProps} />
        {/* Section Header */}
        <HeaderSection {...section} />

        {/* FAQ Accordion */}
        <FAQCard items={faqItems} />

        {/* Still Have Questions */}
        <ShortCTA {...section?.cta} />
        
      </div>
    </section>
  )
}
