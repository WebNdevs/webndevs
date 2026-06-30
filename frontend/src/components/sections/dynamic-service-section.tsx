import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { CTASection, ShortCTA, ShortCTAProps } from './cta-section';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { PageHero, PageHeroProps } from './pagehero';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { ContentTile } from '../cards/DScomponents';
import { FAQCard, FAQItemProps } from '../cards/faq-card';
import { ResultCardGrid, ResultCardProps } from '../cards/result-card';
import { LadderCardProps, LadderSection } from '../cards/ladder-card';
import { TechCard, TechCardProps } from '../cards/technology-card';
import { EntityCardProps, EntityGrid } from '../cards/entity-card';

export type DynamicServiceData = {
  slug: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    image?: string;
    path: string;
  };
  hero?: PageHeroProps;
  tag?: string;
  subheading1?: string;
  subheading2?: string;
  subtext?: string;
  overview?: ContentTile[];
  stats?: StatsCardProps[];
  delivered?: {
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
  techspec?: TechCardProps;
  process?: {
    tag?: string,
    subheading1?: string,
    subheading2?: string,
    subtext?: string,
    items?: LadderCardProps[];
  };
  results?: {
    tag?: string,
    subheading1?: string,
    subheading2?: string,
    subtext?: string,
    items?: ResultCardProps[];
  };
  usecase?: {
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

export type DynamicServiceProps = {
  section: DynamicServiceData;
}


export function DynamicService({section}:DynamicServiceProps) {  
  if(!section) return null;

  return (
    <section id='blogs' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        {section?.hero && (
          <PageHero {...section?.hero as PageHeroProps}/>
        )}
        {section?.stats && (
          <StatsCardGrid items={section?.stats as StatsCardProps[]}/>
        )}
        {section?.benefits && (
          <>
            <HeaderSection {...section?.benefits as HeaderSectionProps}/>
            <IconCardGrid items={section?.benefits?.items as IconCardProps[]}/>
          </>
        )}
        {section?.delivered && (
          <>
            <HeaderSection {...section?.delivered as HeaderSectionProps}/>
            <IconCardGrid items={section?.delivered?.items as IconCardProps[]}/>
          </>
        )}
        {section?.techspec && (
          <TechCard {...section?.techspec as TechCardProps}/>
        )}
        {section?.process && (
          <div className='py-20 px-6 mb-16 bg-[#111827]'>
            <HeaderSection {...section?.process as HeaderSectionProps}/>
            <LadderSection items={section?.process?.items as LadderCardProps[]}/>
          </div>
        )}
        {section?.results && (
          <>
            <HeaderSection {...section?.results as HeaderSectionProps}/>
            <ResultCardGrid items={section?.results?.items as ResultCardProps[]}/>
          </>
        )}
        {section?.usecase && (
          <>
            <HeaderSection {...section?.usecase as HeaderSectionProps}/>
            <EntityGrid items={section?.usecase?.items as EntityCardProps[]}/>
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