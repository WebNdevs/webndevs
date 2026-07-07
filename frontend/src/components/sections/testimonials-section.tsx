import { HeaderSection } from '../cards/header-card';
import { getHome } from '@/data/homedata';
import { ShortCTA } from './cta-section';
import { ReviewCardGrid, ReviewCardProps } from '../cards/review-card';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { PageHero, PageHeroProps } from './pagehero';

type TestimonialSectionProps = {
  variant?: 'preview' | 'full',
}

export function TestimonialsSection({variant = 'full'} : TestimonialSectionProps) {
  const section = getHome('testimonials');
  const items = variant ==="preview" ? section?.items?.slice(0,6) : section?.items;

  if(!section) return null;

  return (
    <section id='testimonials' aria-label="Client Testimonials" className="py-20 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <PageHero variant={variant} {...section.hero as PageHeroProps}/>
        {/* Section Header */}
        <HeaderSection {...section}/>

        {/* Testimonials Grid */}
        <ReviewCardGrid items={items as ReviewCardProps[]}/>


        {/* Trust Badges */}
        <StatsCardGrid items={section?.stats as StatsCardProps[]}/>
          
        {/* CTA */}
        <ShortCTA variant={variant} {...section?.cta}/>
      
      </div>
    </section>
  );
}
