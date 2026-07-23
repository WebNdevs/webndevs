import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { ShortCTA } from './cta-section';
import { getDataHub } from '@/data/datahub';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { PageHero, PageHeroProps } from './pagehero';
import { GlobalSearch } from '../seo&maintainance/globalsearch';

export function HubSection() {
  const section = getDataHub('hub');
  
  if(!section) return null;

  return (
    <section id='blogs' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section?.hero as PageHeroProps}/>
        <HeaderSection {...section?.header as HeaderSectionProps}/>
        <GlobalSearch/>

        <IconCardGrid items={section?.items as IconCardProps[]}/>

        <ShortCTA variant="full" {...section?.cta}/>
        <ShortCTA variant="preview" {...section?.cta}/>

      </div>
    </section>
  );
}