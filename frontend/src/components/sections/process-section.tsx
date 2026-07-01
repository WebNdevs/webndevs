import { getHome } from '@/data/homedata';
import { HeaderSection } from '../cards/header-card';
import { ShortCTA } from './cta-section';
import { LadderCardProps, LadderSection } from '../cards/ladder-card';


export function ProcessSection() {
  const section = getHome('process');

  if(!section) return null;

  return (
    <section id="process" aria-label="Our Process" className="py-20 px-6 bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <HeaderSection {...section}/>

        {/* Process Timeline */}
        <LadderSection items={section?.items as LadderCardProps[]}/>

        {/* Bottom CTA */}
        <ShortCTA {...section?.cta}/>
      </div>
    </section>
  );
}
