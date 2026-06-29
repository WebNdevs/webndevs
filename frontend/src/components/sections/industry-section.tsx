import { GlobalSearch } from '../seo&maintainance/globalsearch';
import { ShortCTA } from './cta-section';
import { EntityGrid, EntityCardProps } from '../cards/entity-card';
import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { PageHero, PageHeroProps } from './pagehero';
import { getDataHub } from '@/data/datahub';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { FAQCard, FAQItemProps } from '../cards/faq-card';
import { FilterBar, FilterBarProps } from '../filter-bar';
import { FilteredEntityGrid } from '../entity-filtered';

export function IndustrySection() {
  const section = getDataHub('industries');
  
  if(!section) return null;

  return (
    <section id='industries' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section.hero as PageHeroProps} />

        <StatsCardGrid items={section.stats as StatsCardProps[]} />
        <GlobalSearch />

        {section.featured && (
          <>
            <HeaderSection {...section.featured as HeaderSectionProps} />
            <EntityGrid items={section.featured.items as EntityCardProps[]} />
          </>
        )}

        {section.directory && (
          <>
            <HeaderSection {...section.directory as HeaderSectionProps} />
            <FilteredEntityGrid items={section.directory.items as EntityCardProps[]} />
          </>
        )}

        {section.benefits && (
          <>
            <HeaderSection {...section.benefits as HeaderSectionProps} />
            <IconCardGrid items={section.benefits.items as IconCardProps[]} />
          </>
        )}
        <HeaderSection {...section.faq as HeaderSectionProps} />
        <FAQCard items={section.faq?.items as FAQItemProps[]} />

        <ShortCTA {...section.cta} />

      </div>
    </section>
  );
}