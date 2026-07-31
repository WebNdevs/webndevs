import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { ContentCardProps } from '../cards/content-card';
import { ContentViewer } from '../cards/content-view';
import { ShortCTA, ShortCTAProps } from './cta-section';
import { PageHero, PageHeroProps } from './pagehero';
import { getPage, NormalizedPage } from '@/data/content';

export async function BlogSection() {
  const section = await getPage("article", "/blogs");
  const blog = section?.content as NormalizedPage | undefined;
  
  if(!section) return null;

  return (
    <section id='blogs' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <PageHero {...section?.hero as PageHeroProps}/>
        <HeaderSection {...section?.header as HeaderSectionProps}/>

        <ContentViewer items={blog?.items as ContentCardProps[]}/>

        <ShortCTA variant="full" {...section?.cta as ShortCTAProps}/>

      </div>
    </section>
  );
}
