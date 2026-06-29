import { HeaderSection } from '../cards/header-card';
import { ContentCardProps } from '../cards/content-card';
import { ContentViewer } from '../cards/content-view';
import { ShortCTA } from './cta-section';
import { PageHero, PageHeroProps } from './pagehero';
import { getDataHub } from '@/data/datahub';

export function BlogSection() {
  const section = getDataHub('blogs');
  
  if(!section) return null;

  return (
    <section id='blogs' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section?.hero as PageHeroProps}/>
        <HeaderSection {...section}/>

        <ContentViewer items={section?.items as ContentCardProps[]}/>

        <ShortCTA variant="full" {...section?.cta}/>

      </div>
    </section>
  );
}
