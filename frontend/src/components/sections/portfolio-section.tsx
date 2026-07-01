import { HeaderSection } from '../cards/header-card';
import { getHome } from '@/data/homedata';
import { ResultCardGrid, ResultCardProps } from '../cards/result-card';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { ShortCTA } from './cta-section';
import { PageHero, PageHeroProps } from './pagehero';

export type PortfolioSectionProps = {
  variant?: "preview" | "full",
}



export function PortfolioSection({variant = 'full'} : PortfolioSectionProps) {
  const section = getHome("portfolio");
  const items = variant ==="preview" ? section?.items?.slice(0,6) : section?.items;

  if(!section) return null;

  return (
    <section id="portfolio" aria-label="Our Portfolio" className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        <PageHero variant={variant} {...section.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...section}/>

        {/* Projects Grid */}
        <ResultCardGrid items={items as ResultCardProps[]}/>

        {/* Stats Section - dynamically rendered from API */}
        <StatsCardGrid items={section?.stats as StatsCardProps[]}/>

        {/* CTA */}
        <ShortCTA variant={variant} {...section?.cta}/>
      </div>
    </section>
  );
}
