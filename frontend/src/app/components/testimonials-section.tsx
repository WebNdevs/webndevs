import { Link, useLocation} from 'react-router';
import React, { useEffect, useState } from 'react';
import { DSCard } from './ds-card';
import { Star, Quote, Loader2 } from 'lucide-react';
import { LoadingGame } from './loading-game';
import { DSButton } from './ds-button';
import { API_BASE_URL } from '../../config/api';

type Testimonial = {
  id: number;
  author_name: string;
  author_title: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  photo_url: string | null;
  client_name: string | null;
  client_role: string | null;
};

type ContentItem = {
  id: number;
  title: string;
  content: string | null;
  category: string | null;
  url: string | null;
  description: string | null;
  results: string[] | null;
  tags: string[] | null;
  badge: string | null;
  avatar: string | null;
  client_name: string | null;
  client_role: string | null;
  company: string | null;
  rating: number | null;
};

type ContentSection = {
  id: number;
  section_key: string;
  section_type: string;
  title: string;
  content: string | null;
  items: ContentItem[];
};

type ContentPage = {
  id: number;
  title: string;
  slug: string;
  status: string;
  sections: ContentSection[];
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
};

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author_name: 'Sarah Mitchell',
    author_title: 'CEO, TechStart Inc.',
    company: 'TechStart Inc.',
    content: 'WebNDevs transformed our outdated website into a modern, high-converting platform. Within 3 months, we saw a 180% increase in qualified leads. They understood our business and delivered beyond expectations.',
    rating: 5,
    photo_url: null,
    client_name: 'Sarah Mitchell',
    client_role: 'CEO, TechStart Inc.',
  },
  {
    id: 2,
    author_name: 'James Rodriguez',
    author_title: 'Founder, FitLife App',
    company: 'FitLife App',
    content: 'I was juggling 4 different freelancers before finding WebNDevs. Now I have one team handling design, development, and marketing. The relief of having clear communication and consistent quality is priceless.',
    rating: 5,
    photo_url: null,
    client_name: 'James Rodriguez',
    client_role: 'Founder, FitLife App',
  },
  {
    id: 3,
    author_name: 'Emily Chen',
    author_title: 'Marketing Director, RetailPro',
    company: 'RetailPro',
    content: 'The Power BI dashboard they built saves our team 15+ hours every week. We can now make data-driven decisions in real-time instead of waiting days for reports. Best investment we\'ve made this year.',
    rating: 5,
    photo_url: null,
    client_name: 'Emily Chen',
    client_role: 'Marketing Director, RetailPro',
  },
  {
    id: 4,
    author_name: 'Michael Foster',
    author_title: 'Owner, EcoShop',
    company: 'EcoShop',
    content: 'Our e-commerce sales tripled after WebNDevs optimized our store. They didn\'t just make it look good—they focused on conversion rates, page speed, and user experience. The results speak for themselves.',
    rating: 5,
    photo_url: null,
    client_name: 'Michael Foster',
    client_role: 'Owner, EcoShop',
  },
  {
    id: 5,
    author_name: 'Lisa Thompson',
    author_title: 'Operations Manager, AutoCorp',
    company: 'AutoCorp',
    content: 'The automation workflows WebNDevs set up have been game-changing. Tasks that used to take hours now happen automatically. We\'ve reduced errors by 90% and our team can focus on what actually matters.',
    rating: 5,
    photo_url: null,
    client_name: 'Lisa Thompson',
    client_role: 'Operations Manager, AutoCorp',
  },
  {
    id: 6,
    author_name: 'David Park',
    author_title: 'Founder, BrandHub',
    company: 'BrandHub',
    content: 'From logo to website to marketing materials, WebNDevs nailed our brand identity. They took time to understand our vision and created something that truly represents who we are. Couldn\'t be happier.',
    rating: 5,
    photo_url: null,
    client_name: 'David Park',
    client_role: 'Founder, BrandHub',
  }
];

export function TestimonialsSection() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const apiBase = API_BASE_URL;
        
        // First try to get from content pages API
        const homeResponse = await fetch(`${apiBase}/content-pages/home`);
        if (homeResponse.ok) {
          const homeData: ApiResponse<ContentPage> = await homeResponse.json();
          if (homeData.success && homeData.data?.sections) {
            const testimonialsSection = homeData.data.sections.find(
              (s: ContentSection) => s.section_type === 'testimonials'
            );
            
            if (testimonialsSection?.items?.length) {
              const transformed = testimonialsSection.items.map((item: ContentItem) => ({
                id: item.id,
                author_name: item.client_name || item.title,
                author_title: item.client_role || null,
                company: item.company || null,
                content: item.content || item.description || '',
                rating: item.rating || 5,
                photo_url: item.avatar || null,
                client_name: item.client_name || item.title,
                client_role: item.client_role || null,
              }));
              setTestimonials(transformed);
              setLoading(false);
              return;
            }
          }
        }

        // Fallback to testimonials API
        const testimonialsResponse = await fetch(`${apiBase}/testimonials?per_page=6`);
        if (testimonialsResponse.ok) {
          const data = await testimonialsResponse.json();
          if (data?.data?.length) {
            const transformed: Testimonial[] = data.data.map((t: any) => ({
              id: t.id,
              author_name: t.author_name,
              author_title: t.author_title,
              company: t.company,
              content: t.content,
              rating: t.rating,
              photo_url: t.photo_url,
              client_name: t.author_name,
              client_role: t.author_title,
            }));
            setTestimonials(transformed);
          }
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 bg-[#111827]">
        <LoadingGame />
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
            <span className="text-[14px] font-medium text-[#22C55E]">
              Client Success Stories
            </span>
          </div>
          
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            Don't Just Take <span className='bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent'>Our Word for It</span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
            Hear from the founders and business owners who trusted us with their digital growth.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <DSCard key={index} hover className="flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating ?? 0 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-[#22C55E]/20 mb-4" />

              {/* Content */}
              <p className="text-[14px] text-[#9CA3AF] leading-relaxed mb-6 flex-grow">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-[#374151]">
                <p className="font-semibold text-[#F9FAFB] text-[15px] mb-1">
                  {testimonial.author_name}
                </p>
                <p className="text-[13px] text-[#9CA3AF] mb-2">
                  {testimonial.author_title ?? testimonial.company ?? ''}
                </p>
                {testimonial.company && (
                  <p className="text-[12px] text-[#22C55E]">
                    Company: {testimonial.company}
                  </p>
                )}
              </div>
            </DSCard>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <DSCard className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-[24px]">⭐</span>
            </div>
            <p style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB] mb-1">4.9/5</p>
            <p className="text-[14px] text-[#9CA3AF]">Average Rating</p>
          </DSCard>

          <DSCard className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-[24px]">🔄</span>
            </div>
            <p style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB] mb-1">85%</p>
            <p className="text-[14px] text-[#9CA3AF]">Repeat Clients</p>
          </DSCard>

          <DSCard className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-[24px]">🎯</span>
            </div>
            <p style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB] mb-1">100%</p>
            <p className="text-[14px] text-[#9CA3AF]">On-Time Delivery</p>
          </DSCard>
        </div>
          
        <div className="text-center mt-12">
          {isHomePage ? (
            <Link to='/testimonials' className="text-xl font-medium" onClick={() => window.scrollTo({ top:0, behavior: 'smooth'})}>
              <DSButton>
                More Testimonials
              </DSButton>
            </Link >
          ) : null}
          
        </div>
      </div>
    </section>
  );
}
