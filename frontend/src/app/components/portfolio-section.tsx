import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { DSCard } from './ds-card';
import { DSBadge } from './ds-badge';
import { ArrowDown, ExternalLink, TrendingUp, Loader2 } from 'lucide-react';
import { LoadingGame } from './loading-game';
import { DSButton } from './ds-button';
import { API_BASE_URL } from '../../config/api';

// Fallback data in case API fails
const FALLBACK_PROJECTS = [
  {
    title: 'FinanceFlow SaaS Platform',
    category: 'Web Development',
    url: 'https://financeflow.com',
    description: 'Built a complete financial management platform with real-time analytics and automated reporting.',
    results: [
      '10,000+ active users in 6 months',
      '40% reduction in processing time',
      '98% uptime since launch'
    ],
    tags: ['React', 'Node.js', 'PostgreSQL'],
    badge: 'success'
  },
  {
    title: 'HealthTrack Mobile App',
    category: 'Mobile Development',
    url: 'https://healthtrack.com',
    description: 'Native iOS and Android fitness tracking app with AI-powered workout recommendations.',
    results: [
      '50K+ downloads in first quarter',
      '4.8★ average rating',
      'Featured on App Store'
    ],
    tags: ['React Native', 'Firebase', 'AI/ML'],
    badge: 'info'
  },
  {
    title: 'RetailPro Dashboard',
    category: 'Data Analytics',
    url: 'https://retailpro.com',
    description: 'Custom Power BI dashboard integrating sales data from multiple sources for real-time insights.',
    results: [
      '60% faster reporting',
      'Saved 20 hours/week',
      'Better decision making'
    ],
    tags: ['Power BI', 'SQL', 'Azure'],
    badge: 'warning'
  },
  {
    title: 'EcoShop E-commerce',
    category: 'Web Development',
    url: 'https://ecoshop.com',
    description: 'High-converting online store with custom checkout flow and inventory management system.',
    results: [
      '250% increase in sales',
      '35% cart abandonment reduction',
      '3x faster page loads'
    ],
    tags: ['WordPress', 'WooCommerce', 'Stripe'],
    badge: 'success'
  },
  {
    title: 'AutoFlow Automation Suite',
    category: 'AI & Automation',
    url: 'https://autoflow.com',
    description: 'Custom automation workflows connecting CRM, email, and project management tools.',
    results: [
      '15 hours saved per week',
      '90% fewer manual errors',
      'ROI achieved in 2 months'
    ],
    tags: ['Zapier', 'APIs', 'Python'],
    badge: 'info'
  },
  {
    title: 'BrandHub Identity System',
    category: 'Branding',
    url: 'https://brandhub.com',
    description: 'Complete brand identity including logo, guidelines, website, and marketing materials.',
    results: [
      '3x brand recognition',
      '45% increase in leads',
      'Consistent brand presence'
    ],
    tags: ['Brand Design', 'Marketing', 'UI/UX'],
    badge: 'default'
  }
];

// Fallback stats
const FALLBACK_STATS = [
  { value: '50+', label: 'Projects Completed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '2.5x', label: 'Average ROI Increase' },
  { value: '24/7', label: 'Support Available' }
];

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

export function PortfolioSection() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        const apiBase = API_BASE_URL;
        
        // Try to fetch home page first, then portfolio page
        let page: ContentPage | null = null;
        
        // Try home page first
        const homeResponse = await fetch(`${apiBase}/content-pages/home`);
        if (homeResponse.ok) {
          const homeData: ApiResponse<ContentPage> = await homeResponse.json();
          if (homeData.success && homeData.data) {
            page = homeData.data;
          }
        }
        
        // If home page doesn't have portfolio, try portfolio page
        if (!page) {
          const portfolioResponse = await fetch(`${apiBase}/content-pages/portfolio`);
          if (portfolioResponse.ok) {
            const portfolioData: ApiResponse<ContentPage> = await portfolioResponse.json();
            if (portfolioData.success && portfolioData.data) {
              page = portfolioData.data;
            }
          }
        }

        if (!page || !page.sections) {
          console.log('No content pages found, using fallback data');
          setLoading(false);
          return;
        }

        // Find portfolio items section (contains project items)
        const portfolioItemsSection = page.sections?.find(
          (s: ContentSection) => s.section_type === 'portfolio' || s.section_type === 'items-list'
        );
        
        if (portfolioItemsSection?.items?.length) {
          // Transform items to match project format
          const transformedProjects = portfolioItemsSection.items.map((item: ContentItem) => ({
            title: item.title,
            category: item.category || 'Project',
            url: item.url || '#',
            description: item.description || item.content || '',
            results: item.results || [],
            tags: item.tags || [],
            badge: item.badge || 'default'
          }));
          setProjects(transformedProjects);
        }

        // Find stats section
        const statsSection = page.sections?.find(
          (s: ContentSection) => s.section_type === 'stats' || s.section_key === 'stats'
        );
        
        if (statsSection?.items?.length) {
          // Transform items to stats format
          const transformedStats = statsSection.items.map((item: ContentItem) => ({
            value: item.title, // e.g., "50+", "98%"
            label: item.description || item.content || item.title
          }));
          setStats(transformedStats);
        } else {
          // Use fallback stats if no stats section found
          setStats(FALLBACK_STATS);
        }

      } catch (err) {
        console.error('Failed to fetch portfolio data:', err);
        setError('Failed to load portfolio data');
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioData();
  }, []);
  
  if (loading) {
    return (
      <section id="portfolio" className="py-10 px-6 bg-[#0B0F14]">
        <LoadingGame />
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-10 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
            <span className="text-[14px] font-medium text-[#22C55E]">
              Our Work
            </span>
          </div>
          
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            Real Results for{' '}
            <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
              Real Businesses
            </span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
            We don't just build projects—we build solutions that drive measurable growth. 
            Here's how we've helped our clients succeed.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <DSCard key={index} hover className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <DSBadge variant={project.badge as any}>
                  {project.category}
                </DSBadge>
                <button className="text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
                  <a href={project.url} target='_blank' rel='noopener noreferrer' aria-label={`Open ${project.title}`} >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </button>
              </div>

              <h3 style={{ fontSize: '20px' }} className="font-bold text-[#F9FAFB] mb-3">
                {project.title}
              </h3>

              <p className="text-[14px] text-[#9CA3AF] mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Results */}
              <div className="bg-[#111827] rounded-lg p-4 mb-4 flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-[12px] font-semibold text-[#22C55E] uppercase tracking-wider">
                    Results
                  </span>
                </div>
                <ul className="space-y-2">
                  {project.results.map((result, i) => (
                    <li key={i} className="text-[13px] text-[#9CA3AF] flex items-start gap-2">
                      <span className="text-[#22C55E] flex-shrink-0">✓</span>
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 bg-[#374151]/50 text-[#9CA3AF] text-[11px] rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </DSCard>
          ))}
        </div>

        {/* Stats Section - dynamically rendered from API */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <DSCard key={index} className="text-center">
              <p style={{ fontSize: '36px' }} className="font-bold bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent mb-2">
                {stat.value}
              </p>
              <p className="text-[14px] text-[#9CA3AF]">{stat.label}</p>
            </DSCard>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          {isHomePage ? (
            <DSButton className="text-xl font-medium">
            <Link to='/portfolio' onClick={() => window.scrollTo({ top:0, behavior: 'smooth'})}>
              More Projects
            </Link >
          </DSButton>
          ) : (
          <>
            <p className="text-[16px] text-[#9CA3AF] mb-4">
              Want to see how we can achieve results like this for your business?
            </p>
            <button 
              onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[16px] font-medium text-[#22C55E] hover:text-[#16A34A] transition-colors inline-flex items-center gap-2"
            >
              Talk to Our Team
              <ArrowDown />
            </button> 
          </>
          )}
          
        </div>
      </div>
    </section>
  );
}
