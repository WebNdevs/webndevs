import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { getHome } from '@/data/homedata';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { ShortCTA, ShortCTAProps } from './cta-section';
import { PageHero, PageHeroProps } from './pagehero';
import { ResultCardGrid, ResultCardProps } from "../cards/result-card";

export type PortfolioSectionProps = {
  variant?: "preview" | "full";
}

export function PortfolioSection({ variant = 'full' }: PortfolioSectionProps) {
  const section = getHome("portfolio");
  const items = variant === "preview" ? section?.items?.slice(0, 6) : section?.items;

  if (!section) return null;

  return (
    <section id="portfolio" aria-label="Our Portfolio" className="py-20 px-6 bg-[#0B0F14] text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Page Hero */}
        <PageHero variant={variant} {...section.hero as PageHeroProps} />

        <HeaderSection {...section as HeaderSectionProps} />

        {/* Projects Grid */}
        <ResultCardGrid items={items as ResultCardProps[]} />

        {/* Stats Section - dynamically rendered from API if present, otherwise static */}
        <StatsCardGrid items={section.stats as StatsCardProps[]} />

        {/* CTA */}
        <ShortCTA variant={variant} {...section.cta as ShortCTAProps} />
      </div>
    </section>
  );
}
