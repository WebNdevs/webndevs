import { HeaderSection } from '../components/cards/header-card';
import { getHome } from '@/data/homedata';
import { ContentTile, DSTiles } from '../components/cards/DScomponents';
import { CTASection } from '@/components/sections/cta-section';
import { PageHero, PageHeroProps } from '@/components/sections/pagehero';

export function ContactPage() {
  const section = getHome("contact-us");

  if (!section) return null;

  return (
    <section aria-label="Contact Us Page" className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...section}/>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none text-slate-300 mb-16">
          <DSTiles items={section?.items as ContentTile[]} />
        </div>

        <CTASection/>
      </div>
    </section>
  );
}
