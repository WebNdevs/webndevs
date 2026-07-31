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
import { getPageSection, NormalizedPage } from '@/data/content';

export type DynamicServiceData = {
  slug: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    path?: string;
  };
  hero?: PageHeroProps;
  tag?: string;
  subheading1?: string;
  subheading2?: string;
  subtext?: string;
  overview?: ContentTile[];
  stats?: StatsCardProps[] | { items?: StatsCardProps[] };
  delivered?: {
    tag?: string;
    subheading1?: string;
    subheading2?: string;
    subtext?: string;
    items?: IconCardProps[];
  };
  benefits?: {
    tag?: string;
    subheading1?: string;
    subheading2?: string;
    subtext?: string;
    items?: IconCardProps[];
  };
  techspec?: TechCardProps;
  process?: {
    tag?: string;
    subheading1?: string;
    subheading2?: string;
    subtext?: string;
    items?: LadderCardProps[];
  };
  results?: {
    tag?: string;
    subheading1?: string;
    subheading2?: string;
    subtext?: string;
    items?: ResultCardProps[];
  };
  usecase?: {
    tag?: string;
    subheading1?: string;
    subheading2?: string;
    subtext?: string;
    items?: EntityCardProps[];
  };
  faq?: {
    tag?: string;
    subheading1?: string;
    subheading2?: string;
    subtext?: string;
    items?: FAQItemProps[];
  };
  cta?: ShortCTAProps;
  [key: string]: any;
};

export type DynamicServiceProps = {
  page: NormalizedPage;
};

export function DynamicService({ page }: DynamicServiceProps) {
  if (!page) return null;

  const hero = getPageSection<PageHeroProps>(page, "hero");
  const stats = getPageSection<StatsCardProps[] | { items?: StatsCardProps[] }>(page, "stats");
  const benefits = getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "benefits");
  const delivered = getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "delivered");
  const techspec = getPageSection<TechCardProps>(page, "techspec");
  const process = getPageSection<HeaderSectionProps & { items?: LadderCardProps[] }>(page, "process");
  const results = getPageSection<HeaderSectionProps & { items?: ResultCardProps[] }>(page, "result");
  const usecase = getPageSection<HeaderSectionProps & { items?: EntityCardProps[] }>(page, "usecase");
  const faq = getPageSection<HeaderSectionProps & { items?: FAQItemProps[] }>(page, "faq");
  const cta = getPageSection<ShortCTAProps>(page, "cta");

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${hero?.title1 || ""} ${hero?.title2 || ""}`.trim() || (page.tag as string) || "Service",
    "description": page.seo_description || hero?.description || "",
    "provider": {
      "@type": "Organization",
      "name": "WebNDevs",
      "url": "https://webndevs.com"
    },
    "serviceType": (page.tag as string) || "Web & Software Services",
    "areaServed": "Worldwide"
  };

  const faqItems = faq?.items || [];
  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question || "",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer || "",
      },
    })),
  } : null;

  const schemas: object[] = [serviceSchema];
  if (faqSchema) {
    schemas.push(faqSchema);
  }

  const statsItems = (Array.isArray(stats) ? stats : stats?.items) as StatsCardProps[];

  return (
    <section id='services' className="py-20 px-6 bg-[#0B0F14]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <div className="max-w-7xl mx-auto">
        {hero && (
          <PageHero {...hero} />
        )}
        
        {stats && (
          <StatsCardGrid items={statsItems as StatsCardProps[]} />
        )}
        {benefits && (
          <>
            <HeaderSection {...benefits} />
            <IconCardGrid items={benefits?.items as IconCardProps[]} />
          </>
        )}
        {delivered && (
          <>
            <HeaderSection {...delivered} />
            <IconCardGrid items={delivered?.items as IconCardProps[]} />
          </>
        )}
        {techspec && (
          <TechCard {...techspec} />
        )}
        {process && (
          <div className='py-20 px-6 mb-16 bg-linear-to-r from-[#22C55E]/1 to-[#06B6D4]/1'>
            <HeaderSection {...process} />
            <LadderSection items={process?.items as LadderCardProps[]} />
          </div>
        )}
        {results && (
          <>
            <HeaderSection {...results} />
            <ResultCardGrid items={results?.items as ResultCardProps[]} />
          </>
        )}
        {usecase && (
          <>
            <HeaderSection {...usecase} />
            <EntityGrid items={usecase?.items as EntityCardProps[]} />
          </>
        )}
        {faq && (
          <>
            <HeaderSection {...faq} />
            <FAQCard items={faq?.items as FAQItemProps[]} />
          </>
        )}
        {cta && (
          <>
            <ShortCTA variant="full" {...cta} />
            <ShortCTA variant="preview" {...cta} />
          </>
        )}
        <CTASection />

      </div>
    </section>
  );
}