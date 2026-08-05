import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { CTASection, ShortCTA, ShortCTAProps } from './cta-section';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { PageHero, PageHeroProps } from './pagehero';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { ContentTile, DSTiles } from '../cards/DScomponents';
import { EntityGrid, EntityCardProps } from '../cards/entity-card';
import { FAQCard, FAQItemProps } from '../cards/faq-card';
import { getPageSection, NormalizedPage } from '@/data/content';

export type DynamicSectionData = {
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
  highlights?: {
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
  related?: {
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
  [key: string]: unknown;
};

export type DynamicSectionProps = {
  page: NormalizedPage;
};

export function DynamicSection({ page }: DynamicSectionProps) {
  if (!page) return null;

  const hero = getPageSection<PageHeroProps>(page, "hero");
  const overview = getPageSection<ContentTile[] | { items?: ContentTile[] }>(page, "overview");
  const stats = getPageSection<StatsCardProps[] | { items?: StatsCardProps[] }>(page, "stats");
  const highlights = getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "highlights");
  const benefits = getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "benefits");
  const related = getPageSection<HeaderSectionProps & { items?: EntityCardProps[] }>(page, "related");
  const faq = getPageSection<HeaderSectionProps & { items?: FAQItemProps[] }>(page, "faq");
  const cta = getPageSection<ShortCTAProps>(page, "cta");

  const overviewItems = (Array.isArray(overview) ? overview : overview?.items) as ContentTile[];
  const statsItems = (Array.isArray(stats) ? stats : stats?.items) as StatsCardProps[];

  return (
    <section id='blogs' className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        {hero && (
          <PageHero {...hero} />
        )}
        {overview && (
          <DSTiles items={overviewItems as ContentTile[]} />
        )}
        {stats && (
          <StatsCardGrid items={statsItems as StatsCardProps[]} />
        )}
        {highlights && (
          <>
            <HeaderSection {...highlights} />
            <IconCardGrid items={highlights?.items as IconCardProps[]} />
          </>
        )}
        {benefits && (
          <>
            <HeaderSection {...benefits} />
            <IconCardGrid items={benefits?.items as IconCardProps[]} />
          </>
        )}
        {related && (
          <>
            <HeaderSection {...related} />
            <EntityGrid items={related?.items as EntityCardProps[]} />
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