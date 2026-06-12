import React, { useEffect, useState } from 'react';
import { DSCard } from './ds-card';
import { API_BASE_URL } from '../../config/api.config';
import { Link } from 'react-router';
import {
  Code2,
  Globe,
  Palette,
  Smartphone,
  Zap,
  ArrowDown,
  BarChart3,
  TrendingUp,
  Pen
} from 'lucide-react';

interface ServicesSectionProps {
  onServiceSelect?: (serviceTitle: string) => void;
}

const services = [
  {
    icon: Code2,
    title: 'Web Development',
    slug: 'web-development',
    description: 'Custom websites and web applications built with WordPress, React, Next.js, and Laravel. Fast, secure, and scalable solutions that convert visitors into customers.',
    keywords: 'WordPress, React, Laravel, Next.js'
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Beautiful, user-friendly interfaces that keep your customers engaged. We design experiences that look amazing and actually work for your business goals.',
    keywords: 'Figma, Adobe XD, Prototyping'
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    description: 'Native iOS and Android apps that your users will love. From concept to App Store, we handle the entire mobile development process.',
    keywords: 'iOS, Android, React Native'
  },
  {
    icon: Zap,
    title: 'AI & Automation',
    slug: 'automation',
    description: 'Save time and reduce costs with smart automation. We integrate AI tools and build custom workflows that handle repetitive tasks for you.',
    keywords: 'Zapier, Make, Custom APIs'
  },
  {
    icon: BarChart3,
    title: 'Data Analytics & Power BI',
    slug: 'data-analytics',
    description: 'Turn your data into actionable insights with custom Power BI dashboards. See your business metrics in real-time and make smarter decisions.',
    keywords: 'Power BI, Dashboards, Reports'
  },
  {
    icon: TrendingUp,
    title: 'Digital Marketing & SEO',
    slug: 'digital-marketing',
    description: 'Get found online and grow your audience. From SEO to social media management, we help you reach the right people at the right time.',
    keywords: 'SEO, Social Media, Ads'
  },
  {
    icon: Pen,
    title: 'Branding & Graphic Design',
    slug: 'branding',
    description: 'Stand out with a memorable brand identity. We create logos, brand guidelines, and marketing materials that make your business unforgettable.',
    keywords: 'Logo Design, Brand Identity'
  }
];

type ApiService = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  features: string[] | null;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | string[] | [];
};

export function ServicesSection({ onServiceSelect }: ServicesSectionProps) {
  const [serviceItems, setServiceItems] = useState(services);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const payload: ApiResponse<ApiService[]> = await response.json();
        if (!response.ok || !payload.success || !payload.data?.length) {
          return;
        }

        const mapped = payload.data.map((service) => {
          const matchedIcon =
            services.find((item) => item.title === service.category || item.title === service.name)?.icon ?? Globe;
          const keywords = (service.features ?? []).slice(0, 4).join(', ') || service.category;
          return {
            icon: matchedIcon,
            title: service.name,
            slug: service.slug,
            description: service.description || `${service.name} services by WebNDevs.`,
            keywords,
          };
        });

        setServiceItems(mapped);
      } catch {
        setServiceItems(services);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="py-20 px-6 bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
            <span className="text-[14px] font-medium text-[#22C55E]">
              Complete Digital Solutions
            </span>
          </div>
          
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            Everything Your Business <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
              Needs to Grow Online
            </span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
            One team for all your digital needs. No more juggling freelancers or agencies. 
            We handle everything from design to development to marketing.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceItems.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link   key={index} to={`/services/${service.slug}`} className="block">
                <DSCard hover className="group h-full">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-[#22C55E]" />
                  </div>
                  
                  <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB] mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-[14px] text-[#9CA3AF] mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {service.keywords.split(', ').map((keyword, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-[#374151]/50 text-[#9CA3AF] text-[12px] rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </DSCard>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-[16px] text-[#9CA3AF] mb-4">
            Not sure which service you need? We'll help you figure it out.
          </p>
          <button 
            onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[16px] font-medium text-[#22C55E] hover:text-[#16A34A] transition-colors inline-flex items-center gap-2"
          >
            Talk to Our Team
            <ArrowDown />
          </button>
        </div>
      </div>
    </section>
  );
}
