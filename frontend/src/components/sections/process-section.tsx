import { getHome } from '@/data/content';
import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { ShortCTA } from './cta-section';
import { LadderCardProps, LadderSection } from '../cards/ladder-card';


export function ProcessSection() {
  const section = getHome('process');

  if(!section) return null;

  return (
    <section id="process" aria-label="Our Process" className="py-20 px-6 bg-linear-to-r from-[#22C55E]/1 to-[#06B6D4]/1">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <HeaderSection {...section?.header as HeaderSectionProps}/>

        {/* Process Timeline */}
        <LadderSection items={section?.items as LadderCardProps[]}/>

        {/* Bottom CTA */}
        <ShortCTA {...section?.cta}/>
      </div>
    </section>
  );
}
