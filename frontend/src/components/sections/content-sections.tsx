import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { IconCardGrid, IconCardProps } from '../cards/icon-card';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { CompareTable, CompareTableItem } from '../cards/compare-table';
import { LadderSection, LadderCardProps } from '../cards/ladder-card';
import { ResultCardGrid, ResultCardProps } from '../cards/result-card';
import { ReviewCardGrid, ReviewCardProps } from '../cards/review-card';
import { FAQCard, FAQItemProps } from '../cards/faq-card';
import { DSTiles, ContentTile } from '../cards/DScomponents';
import { TechCard, TechCardProps } from '../cards/technology-card';
import { PageHero, PageHeroProps } from './pagehero';
import { ShortCTA, ShortCTAProps } from './cta-section';
import { NormalizedPage } from '@/data/content';

type WithItems<T> = HeaderSectionProps & { items?: T[] };
type WithItemsAndCta<T> = WithItems<T> & { cta?: ShortCTAProps };

// Generic conditional-block renderer for every "content" module page other
// than Home (which keeps its own fixed, curated section layout). Renders
// whichever of the module's 12 section keys actually exist on the page, so
// admins can add/remove sections in the CMS without a frontend code change.
export function ContentSections({ page }: { page?: NormalizedPage }) {
  if (!page) return null;

  const hero = page.hero as PageHeroProps | undefined;
  const header = page.header as HeaderSectionProps | undefined;
  const whyus = page.whyus as WithItems<IconCardProps> | undefined;
  const comparison = page.comparison as WithItems<CompareTableItem> | undefined;
  const process = page.process as WithItemsAndCta<LadderCardProps> | undefined;
  const stats = page.stats as WithItems<StatsCardProps> | undefined;
  const result = page.result as WithItemsAndCta<ResultCardProps> | undefined;
  const review = page.review as WithItemsAndCta<ReviewCardProps> | undefined;
  const techspec = page.techspec as TechCardProps | undefined;
  const faq = page.faq as WithItems<FAQItemProps> | undefined;
  const data = page.data as WithItems<ContentTile> | undefined;
  const cta = page.cta as ShortCTAProps | undefined;

  return (
    <>
      {hero && <PageHero {...hero} />}
      {header && <HeaderSection {...header} />}

      {whyus && (
        <>
          <HeaderSection {...whyus} />
          <IconCardGrid items={whyus.items || []} />
        </>
      )}

      {comparison && (
        <>
          <HeaderSection {...comparison} />
          <CompareTable items={comparison.items || []} />
        </>
      )}

      {process && (
        <>
          <HeaderSection {...process} />
          <LadderSection items={process.items || []} />
          <ShortCTA {...process.cta} />
        </>
      )}

      {stats && <StatsCardGrid items={stats.items || []} />}

      {result && (
        <>
          <HeaderSection {...result} />
          <ResultCardGrid items={result.items || []} />
          <ShortCTA {...result.cta} />
        </>
      )}

      {review && (
        <>
          <HeaderSection {...review} />
          <ReviewCardGrid items={review.items || []} />
          <ShortCTA {...review.cta} />
        </>
      )}

      {techspec && <TechCard {...techspec} />}

      {faq && (
        <>
          <HeaderSection {...faq} />
          <FAQCard items={faq.items || []} />
        </>
      )}

      {data && (
        <>
          <HeaderSection {...data} />
          <DSTiles items={data.items || []} />
        </>
      )}

      {cta && (
        <>
          <ShortCTA variant="full" {...cta} />
          <ShortCTA variant="preview" {...cta} />
        </>
      )}
    </>
  );
}
