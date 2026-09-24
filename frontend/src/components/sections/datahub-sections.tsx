import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { CompareTable, CompareTableItem } from '../cards/compare-table';
import { EntityGrid, EntityCardProps } from '../cards/entity-card';
import { FilteredEntityGrid } from '../entity-filtered';
import { FAQCard, FAQItemProps } from '../cards/faq-card';
import { PageHero, PageHeroProps } from './pagehero';
import { ShortCTA, ShortCTAProps } from './cta-section';
import { GlobalSearch } from '../seo&maintainance/globalsearch';
import { NormalizedPage } from '@/data/content';

type WithItems<T> = HeaderSectionProps & { items?: T[] };

// Generic conditional-block renderer for every "datahub" module page
// (tools, industries, solutions, comparisons, free-tools, and the datahub
// hub page itself). Renders whichever of the module's 9 section keys
// actually exist on the page, so admins can add/remove sections in the CMS
// without a frontend code change.
export function DataHubSections({ page }: { page?: NormalizedPage }) {
  if (!page) return null;

  const hero = page.hero as PageHeroProps | undefined;
  const header = page.header as HeaderSectionProps | undefined;
  const stats = page.stats as WithItems<StatsCardProps> | undefined;
  const comparison = page.comparison as WithItems<CompareTableItem> | undefined;
  const featured = page.featured as WithItems<EntityCardProps> | undefined;
  const directory = (page.directory && Array.isArray((page.directory as WithItems<EntityCardProps>).items) && (page.directory as WithItems<EntityCardProps>).items!.length > 0)
    ? (page.directory as WithItems<EntityCardProps>)
    : ((page.tools || page.directory) as WithItems<EntityCardProps> | undefined);
  const benefits = page.benefits as WithItems<IconCardProps> | undefined;
  const faq = page.faq as WithItems<FAQItemProps> | undefined;
  const cta = page.cta as ShortCTAProps | undefined;

  const hasSearchableLists = Boolean(featured || directory || benefits);

  return (
    <>
      {hero && <PageHero {...hero} />}
      {header && <HeaderSection {...header} />}
      {stats && <StatsCardGrid items={stats.items || []} />}
      {hasSearchableLists && <GlobalSearch />}

      {comparison && (
        <>
          <HeaderSection {...comparison} />
          <CompareTable items={comparison.items || []} />
        </>
      )}

      {featured && (
        <>
          <HeaderSection {...featured} />
          <EntityGrid items={featured.items || []} />
        </>
      )}

      {directory && (
        <>
          <HeaderSection {...directory} />
          <FilteredEntityGrid items={directory.items || []} />
        </>
      )}

      {benefits && (
        <>
          <HeaderSection {...benefits} />
          <IconCardGrid items={benefits.items || []} />
        </>
      )}

      {faq && (
        <>
          <HeaderSection {...faq} />
          <FAQCard items={faq.items || []} />
        </>
      )}

      {cta && (
        <ShortCTA variant="full" {...cta} />
      )}
    </>
  );
}
