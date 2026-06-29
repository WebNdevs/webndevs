import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { PageHero, PageHeroProps } from './pagehero';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { ShortCTA } from './cta-section';
import { TechCard, TechCardProps } from '../cards/technology-card';
import { getHome } from '@/data/homedata';

export function ServicesSection() {
  const section = getHome('services');
  
  if(!section) return null;

  return (
    <section id="services" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...section as HeaderSectionProps}/>

        {/* Services Grid */}
        <IconCardGrid items={section?.items as IconCardProps[]}/>
        <TechCard {...section?.techspec as TechCardProps}/>

        {/* CTA */}
        <ShortCTA variant="full" {...section?.cta}/>
        <ShortCTA variant="preview" {...section?.cta}/>
      </div>
    </section>
  );
}
