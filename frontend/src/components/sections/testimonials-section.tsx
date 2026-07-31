import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { ShortCTA, ShortCTAProps } from './cta-section';
import { ReviewCardGrid, ReviewCardProps } from '../cards/review-card';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { PageHero, PageHeroProps } from './pagehero';
import { getPage, NormalizedPage } from '@/data/content';
import { ContentSections } from './content-sections';

type TestimonialSectionProps = {
  variant?: 'preview' | 'full',
}

export async function TestimonialsSection({variant = 'full'} : TestimonialSectionProps) {
  const page = await getPage("content", "/testimonials");
  if (!page) return null;

  if (variant === "full") {
    return (
      <section id='testimonials' aria-label="Client Testimonials" className="py-20 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <ContentSections page={page} />
        </div>
      </section>
    );
  }

  const stat = page.stats as NormalizedPage | undefined;
  const rev = page.review as NormalizedPage | undefined;
  const items = (rev?.items as NormalizedPage[] | undefined)?.slice(0, 6);

  return (
    <section id='testimonials' aria-label="Client Testimonials" className="py-20 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <PageHero variant={variant} {...page.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...page.review as HeaderSectionProps}/>

        {/* Testimonials Grid */}
        <ReviewCardGrid items={items as ReviewCardProps[]}/>

        {/* Trust Badges */}
        <StatsCardGrid items={stat?.items as StatsCardProps[]}/>

        {/* CTA */}
        <ShortCTA variant={variant} {...page.cta as ShortCTAProps}/>

      </div>
    </section>
  );
}