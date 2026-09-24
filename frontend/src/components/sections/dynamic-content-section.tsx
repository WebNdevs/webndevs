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
  const header = getPageSection<HeaderSectionProps>(page, "header");
  const features = getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "features") ||
                   getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "directory");
  const overview = getPageSection<ContentTile[] | { items?: ContentTile[] }>(page, "overview");
  const stats = getPageSection<StatsCardProps[] | { items?: StatsCardProps[] }>(page, "stats");
  const highlights = getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "highlights") ||
                     getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "featured");
  const benefits = getPageSection<HeaderSectionProps & { items?: IconCardProps[] }>(page, "benefits");
  const related = getPageSection<HeaderSectionProps & { items?: EntityCardProps[] }>(page, "related");
  const faq = getPageSection<HeaderSectionProps & { items?: FAQItemProps[] }>(page, "faq");
  const cta = getPageSection<ShortCTAProps>(page, "cta");

  const overviewItems = (Array.isArray(overview) ? overview : overview?.items) as ContentTile[];
  const statsItems = (Array.isArray(stats) ? stats : stats?.items) as StatsCardProps[];

  const sectionId = (page.category_slug || page.slug || "content").replace(/^\/+/, "");
  const firstSectionHasHeader = Boolean(
    (features?.items?.length && (features.tag || features.subheading1)) ||
    (highlights?.items?.length && (highlights.tag || highlights.subheading1)) ||
    (benefits?.items?.length && (benefits.tag || benefits.subheading1))
  );

  return (
    <section id={sectionId} className="py-12 sm:py-16 px-4 sm:px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        {hero && (
          <PageHero {...hero} />
        )}
        {header && !firstSectionHasHeader && (
          <div className="mb-12">
            <HeaderSection {...header} />
          </div>
        )}
        {features && (features.items?.length || 0) > 0 && (
          <div className="mb-14">
            <HeaderSection {...features} />
            <IconCardGrid items={features?.items as IconCardProps[]} />
          </div>
        )}
        {overview && overviewItems?.length > 0 && (
          <div className="mb-14">
            <DSTiles items={overviewItems as ContentTile[]} />
          </div>
        )}
        {stats && statsItems?.length > 0 && (
          <StatsCardGrid items={statsItems as StatsCardProps[]} />
        )}
        {highlights && (highlights.items?.length || 0) > 0 && (
          <div className="mb-14">
            <HeaderSection {...highlights} />
            <IconCardGrid items={highlights?.items as IconCardProps[]} />
          </div>
        )}
        {benefits && (benefits.items?.length || 0) > 0 && (
          <div className="mb-14">
            <HeaderSection {...benefits} />
            <IconCardGrid items={benefits?.items as IconCardProps[]} />
          </div>
        )}
        {related && (related.items?.length || 0) > 0 && (
          <div className="mb-14">
            <HeaderSection {...related} />
            <EntityGrid items={related?.items as EntityCardProps[]} />
          </div>
        )}
        {faq && (faq.items?.length || 0) > 0 && (
          <div className="mb-14">
            <HeaderSection {...faq} />
            <FAQCard items={faq?.items as FAQItemProps[]} />
          </div>
        )}
        {cta ? (
          <ShortCTA variant="full" {...cta} />
        ) : (
          <CTASection />
        )}
      </div>
    </section>
  );
}