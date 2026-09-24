import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { getPage, getPageSection } from '@/data/content';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { ShortCTA, ShortCTAProps } from './cta-section';
import { PageHero, PageHeroProps } from './pagehero';
import { ResultCardGrid, ResultCardProps } from "../cards/result-card";
import { ContentSections } from './content-sections';

export type PortfolioSectionProps = {
  variant?: "preview" | "full";
}

export async function PortfolioSection({ variant = 'full' }: PortfolioSectionProps) {
  const page = await getPage("content", "/portfolio");
  const result = getPageSection<HeaderSectionProps & { items?: ResultCardProps[] } & { cta?: ShortCTAProps }>(page, "result");
  const stat = getPageSection<HeaderSectionProps & { items?: StatsCardProps[] } >(page, "stats");
  const items = (result?.items as ResultCardProps[])?.slice(0,6) || [];
  if (!page) return null;

  if (variant === "full") {
    return (
      <section id="portfolio" aria-label="Our Portfolio" className="py-20 px-6 bg-transparent text-gray-100">
        <div className="max-w-7xl mx-auto">
          <ContentSections page={page} />
        </div>
      </section>
    );
  }

  
  return (
    <section id="portfolio" aria-label="Our Portfolio" className="py-20 px-6 bg-transparent text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Page Hero */}
        <PageHero variant={variant} {...page.hero as PageHeroProps} />

        <HeaderSection {...page.result as HeaderSectionProps} />

        {/* Projects Grid */}
        <ResultCardGrid items={items} />

        {/* Stats Section - dynamically rendered from API if present, otherwise static */}
        <StatsCardGrid items={stat?.items as StatsCardProps[]} />

        {/* CTA */}
        <ShortCTA variant={variant} {...page.cta as ShortCTAProps} />
      </div>
    </section>
  );
}