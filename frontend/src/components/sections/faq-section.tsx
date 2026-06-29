import { getHome } from '@/data/homedata';
import { HeaderSection } from '../cards/header-card';
import { ShortCTA } from './cta-section';
import { FAQCard, FAQItemProps } from '../cards/faq-card';
import { PageHero, PageHeroProps } from './pagehero';


export function FAQSection() {
  const section = getHome('faq')

  if(!section) return null;

  return (
    <section id="faq" className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-4xl mx-auto">
        <PageHero {...section.hero as PageHeroProps} />
        {/* Section Header */}
        <HeaderSection {...section} />

        {/* FAQ Accordion */}
        <FAQCard items={section?.items as FAQItemProps[]} />

        {/* Still Have Questions */}
        <ShortCTA {...section?.cta} />
        
      </div>
    </section>
  )
}
