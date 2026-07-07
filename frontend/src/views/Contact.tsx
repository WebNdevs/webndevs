import { HeaderSection } from '../components/cards/header-card';
import { getHome } from '@/data/homedata';
import { ContentTile, DSTiles } from '../components/cards/DScomponents';
import { CTASection } from '@/components/sections/cta-section';
import { PageHero, PageHeroProps } from '@/components/sections/pagehero';

export function ContactPage() {
  const section = getHome("contact-us");

  if (!section) return null;

  return (
    <div className="bg-[#0B0F14]">
      <section aria-label="Contact Us Page" className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <PageHero {...section.hero as PageHeroProps} />
          {/* Section Header */}
          <HeaderSection {...section} />

          <div className="rounded-xl bg-transparent bg-linear-to-r from-[#22C55E]/1 to-[#06B6D4]/1 border border-white/10 p-4 sm:p-6 prose prose-invert max-w-none text-slate-300 mb-16">
            <DSTiles items={section?.items as ContentTile[]} />
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
