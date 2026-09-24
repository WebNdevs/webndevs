import { HeaderSection, HeaderSectionProps } from '../cards/header-card';
import { ShortCTA, ShortCTAProps } from './cta-section';
import { ReviewCardGrid, ReviewCardProps } from '../cards/review-card';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { PageHero, PageHeroProps } from './pagehero';
import { getPage, getPageSection } from '@/data/content';
import { ContentSections } from './content-sections';

type TestimonialSectionProps = {
  variant?: 'preview' | 'full',
}

export async function TestimonialsSection({variant = 'full'} : TestimonialSectionProps) {
  const page = await getPage("content", "/testimonials");
  const review = getPageSection<HeaderSectionProps & { items?: ReviewCardProps[] } & { cta?: ShortCTAProps }>(page, "review");
  const stat = getPageSection<HeaderSectionProps & { items?: StatsCardProps[] } >(page, "stats");
  const items = (review?.items as ReviewCardProps[])?.slice(0,6) || [];
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


  return (
    <section id='testimonials' aria-label="Client Testimonials" className="py-20 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <PageHero variant={variant} {...page.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...page.review as HeaderSectionProps}/>

        {/* Testimonials Grid */}
        <ReviewCardGrid items={items}/>

        {/* Trust Badges */}
        <StatsCardGrid items={stat?.items as StatsCardProps[]}/>

        {/* CTA */}
        <ShortCTA variant={variant} {...page.cta as ShortCTAProps}/>

      </div>
    </section>
  );
}