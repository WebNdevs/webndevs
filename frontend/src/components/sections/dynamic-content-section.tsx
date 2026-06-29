import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { CTASection, ShortCTA, ShortCTAProps } from './cta-section';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { PageHero, PageHeroProps } from './pagehero';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { ContentTile, DSTiles } from '../cards/DScomponents';
import { EntityGrid, EntityCardProps } from '../cards/entity-card';
import { FAQCard, FAQItemProps } from '../cards/faq-card';

export type DynamicSectionData = {
  slug: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    image?: string;
    canonical: string;
  }
  hero?: PageHeroProps;
  tag?: string;
  subheading1?: string;
  subheading2?: string;
  subtext?: string;
  overview?: ContentTile[];
  stats?: StatsCardProps[];
  highlights?: {
    tag?: string,
    subheading1?: string,
    subheading2?: string,
    subtext?: string,
    items?: IconCardProps[];
  };
  benefits?: {
    tag?: string,
    subheading1?: string,
    subheading2?: string,
    subtext?: string,
    items?: IconCardProps[];
  };
  related?: {
    tag?: string,
    subheading1?: string,
    subheading2?: string,
    subtext?: string,
    items?: EntityCardProps[];
  };
    faq?: {
    tag?: string;
    subheading1?: string;
    subheading2?: string;
    subtext?: string;
    items: FAQItemProps[];
  };
  cta?: ShortCTAProps;
}

export type DynamicSectionProps = {
  section: DynamicSectionData;
}


export function DynamicSection({section}:DynamicSectionProps) {  
  if(!section) return null;

  return (
    <section id='blogs' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        {section?.hero && (
          <PageHero {...section?.hero as PageHeroProps}/>
        )}
        {section?.overview && (
          <DSTiles items={section?.overview as ContentTile[]}/>
        )}
        {section?.stats && (
          <StatsCardGrid items={section?.stats as StatsCardProps[]}/>
        )}
        {section?.highlights && (
          <>
            <HeaderSection {...section?.highlights as HeaderSectionProps}/>
            <IconCardGrid items={section?.highlights?.items as IconCardProps[]}/>
          </>
        )}
        {section?.benefits && (
          <>
            <HeaderSection {...section?.benefits as HeaderSectionProps}/>
            <IconCardGrid items={section?.benefits?.items as IconCardProps[]}/>
          </>
        )}
        {section?.related && (
          <>
            <HeaderSection {...section?.related as HeaderSectionProps}/>
            <EntityGrid items={section?.related?.items as EntityCardProps[]}/>
          </>
        )}
        {section?.faq && (
          <>
          <HeaderSection {...section?.faq as HeaderSectionProps}/>
          <FAQCard items={section?.faq?.items as FAQItemProps[]}/>
          </>
        )}
        {section?.cta && (
          <>
            <ShortCTA variant="full" {...section?.cta as ShortCTAProps}/>
            <ShortCTA variant="preview" {...section?.cta as ShortCTAProps}/>
          </>
        )}
        <CTASection/>

      </div>
    </section>
  );
}