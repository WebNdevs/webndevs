import { Link, useNavigate, useParams, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { LoadingGame } from "../components/loading-game";
import { ServicePageTemplate } from "../components/service-page-template";
import type { ServicePageData } from "../types/service-page";
import { webDevelopmentService } from "../data/web-development-service";
import { mobileAppService } from "../data/mobile-app-service";
import { uiUxDesignService } from "../data/ui-ux-design-service";
import { automationService } from "../data/automation-service";
import { digitalMarketingService } from "../data/digital-marketing-service";
import { dataAnalyticsService } from "../data/data-analytics-service";
import { brandingService } from "../data/branding-service";
import { CTASection } from "../components/cta-section"; 
import { FAQSection } from "../components/faq-section";
import { HeroSection } from "../components/hero-section";
import { PortfolioSection } from "../components/portfolio-section";
import { BlogSection } from "../components/blog-section";
import { ProcessSection } from "../components/process-section";
import { ServicesSection } from "../components/services-section";
import { TestimonialsSection } from "../components/testimonials-section";
import { WhyChooseSection } from "../components/why-choose-section";
import { DSBadge } from "../components/ds-badge";
import { DSCard } from "../components/ds-card";
import { DSButton } from "../components/ds-button";
import {
  BreadcrumbNav,
  CTABanner,
  DefinitionBox,
  EntityHero,
  FAQAccordion,
  FeatureMatrix,
  FilterBar,
  GlobalSearch,
  MegaMenu,
  MetricCards,
  Pagination,
  ProcessSteps,
  RelatedEntitiesGrid,
  SchemaOrg,
  SocialShare,
  StatCallout,
  TableOfContents,
  TechStackDisplay,
  ToolCard,
  IndustryCard,
  SolutionCard,
  TestimonialCard,
} from "./components";
import { useSeo } from "@/hooks/useSeo";
import { useApi } from "@/hooks/useApi";
import { useContentPage, getActiveItems } from "@/hooks/useContentPage";
import { ChevronDown, Quote } from "lucide-react";
import { ExternalLink, Users, MessageCircle, Rocket, Handshake, Clock, Target, Code2, ArrowDown, Star, Code, Palette, Smartphone, Zap, BarChart3, TrendingUp,Paintbrush, Shield, Globe, Search, ShoppingBag, MessageSquare, Cloud, Cpu, Video, FileText, Hammer, HeadphonesIcon  } from "lucide-react";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
};

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
};

type ToolItem = {
  id: number; name: string; slug: string;
  overview: string | null; tagline: string | null;
  logo_url: string | null;
  category: { name: string; slug: string } | null;
  is_featured?: boolean;
};

type ToolDetail = ToolItem & {
  website_url: string | null;
  features?: { name: string; slug: string }[];
  use_cases?: { title: string; description: string }[];
  process_steps?: { step_number: number; title: string; description: string; duration: string | null }[];
  faqs?: { question: string; answer: string }[];
  case_studies?: { title: string; slug: string }[];
  cross_references?: { slug: string; title: string; entity_a: { name: string; slug: string } | null; entity_b: { name: string; slug: string } | null }[];
};

type IndustryItem = { 
  id: number; 
  name: string; 
  slug: string; 
  description: string | null; 
  tagline: string | null;
};

type IndustryDetail = IndustryItem & {
  tools?: ToolItem[];
  solutions?: SolutionItem[];
  faqs?: { question: string; answer: string }[];
  case_studies?: { title: string; slug: string }[];
};

type SolutionItem = { id: number; name: string; slug: string; summary: string | null; problem_statement: string | null };

type SolutionDetail = SolutionItem & {
  tools?: ToolItem[];
  process_steps?: { step_number: number; title: string; description: string; duration: string | null }[];
  use_cases?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
};

type ComparisonDetail = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  subtitle?: string | null;
  quick_verdict?: string | null;
  recommendation?: string | null;
  intro_content?: string | null;
  entities?: { name: string; type: string; description: string | null }[];
  features?: { name: string; values: Record<string, string> }[];
  faqs?: { question: string; answer: string }[];
};

type CrossRefDetail = {
  id: number; title: string; slug: string; quick_answer: string | null; subtitle: string | null;
  entity_a: { name: string; slug: string; type: string } | null;
  entity_b: { name: string; slug: string; type: string } | null;
  sections?: { section_key: string; title: string; content: string }[];
  faqs?: { question: string; answer: string }[];
};

type CaseStudyItem = {
  id: number;
  title: string;
  slug: string;
  client_name: string;

  // Backend fields
  client_industry: string | null;
  results_summary: string | null;
  challenge?: string | null;
  solution?: string | null;
  timeline?: string | null;
  featured_image_url?: string | null;
};

type CaseStudyDetail = CaseStudyItem & {
  metrics?: {
    label: string;
    before_value?: string | null;
    after_value?: string | null;
    before?: string | null;
    after?: string | null;
    unit?: string | null;
    improvement?: string | null;
  }[];

  testimonial?: {
    author_name: string;
    company: string;
    content: string;
    rating: number | null;
  } | null;

  faqs?: {
    question: string;
    answer: string;
  }[];
};

type BlogPostItem = { id: number; title: string; slug: string; excerpt: string | null; published_at: string | null };

type BlogPostDetail = BlogPostItem & {
  body: string | null;
  author: string | null;
  faqs?: { question: string; answer: string }[];
};

type FreeToolDetail = {
  id: number; name: string; slug: string; description: string | null; type: string;
  config: Record<string, unknown>; cta_text: string | null; thank_you_message: string | null;
};

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

function usePaginationHeadLinks(page: number, total: number) {
  useEffect(() => {
    const upsertLink = (rel: string, href: string) => {
      let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };
    const removeLink = (rel: string) => {
      document.head.querySelector(`link[rel="${rel}"]`)?.remove();
    };

    if (page > 1) {
      upsertLink("prev", `${window.location.pathname}?page=${page - 1}`);
    } else {
      removeLink("prev");
    }

    if (page < total) {
      upsertLink("next", `${window.location.pathname}?page=${page + 1}`);
    } else {
      removeLink("next");
    }
  }, [page, total]);
}

function PageLoading() {
  return <LoadingGame />;
}

function PageError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-6 text-red-300">
      Failed to load: {message}
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string | React.ReactNode;
}) {
  return (
    <header className="pt-10 pb-6">
      {eyebrow && (
        <div className="mb-4 inline-flex rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-4 py-2 text-sm font-medium text-[#22C55E]">
          {eyebrow}
        </div>
      )}

      <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#F9FAFB] md:text-6xl">
        {title.split(" ").slice(0, -2).join(" ")}{" "}
        <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
          {title.split(" ").slice(-2).join(" ")}
        </span>
      </h1>

      <div className="mt-5 max-w-3xl text-lg leading-relaxed text-[#9CA3AF]">
        {subtitle}
      </div>
    </header>
  );
}

const Icons = { ExternalLink, Users, MessageCircle, Rocket, Handshake, Clock, Target, ArrowDown, Star, Code, Code2, Palette, Smartphone, Zap, BarChart3, TrendingUp, Paintbrush, Shield, Globe, Search, ShoppingBag, MessageSquare, Cloud, Cpu, Video, FileText, Hammer, HeadphonesIcon };

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export function HomePage() {
  useSeo({ title: "Home | WebNDevs", description: "AI-powered programmatic SEO agency homepage.", canonicalUrl: window.location.href });
  const { data: pageContent, loading, error } = useContentPage("home");
  const chsItems = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.cc_name) ?? [];
  const pcItems = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.pc_name) ?? [];
  const pcHeader = pageContent?.sections?.find(
    (s) => s.section_type === "heading-text" && s.is_visible && s.items?.some((i) => i.pc_name)
  );
  const appHeader = pageContent?.sections?.find(
    (s) => s.section_type === "approach-table" && s.is_visible
  );
  const chsHeader = pageContent?.sections?.find(
    (s) => s.section_type === "heading-text" && s.is_visible
  );
  return (
    <section className="space-y-8">
      <SchemaOrg
        id="organization-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "WND Agency",
          url: window.location.origin,
        }}
      />
      <SchemaOrg
        id="website-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "WND Agency",
          url: window.location.origin,
          potentialAction: {
            "@type": "SearchAction",
            target: `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <HeroSection />
      <>{/*{Why choose us} */}
        <section className="py-20 px-6 bg-[#0B0F14]">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
                {chsHeader?.subheading1} <span className='bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent'>{chsHeader?.subheading2}</span>
              </h2>
              
              <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
                {chsHeader?.subtext}
              </p>
            </div>
    
            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {chsItems.map((us, index) => {
                const Icon = Icons[us.cc_icon as keyof typeof Icons];
                return (
                  <DSCard key={index} hover>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="w-6 h-6 text-[#22C55E]" />}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
                          {us.cc_name}
                        </h3>
                        <p className="text-[14px] text-[#9CA3AF] leading-relaxed">
                          {us.cc_description}
                        </p>
                      </div>
                    </div>
                  </DSCard>
                );
              })}
            </div>

            {/* Comparison Section */}
            <div className="mt-16">
              <DSCard className="overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Traditional Way */}
                  <div className="p-8 border-r border-[#374151]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
                        <span className="text-[#EF4444] text-[20px]">✗</span>
                      </div>
                      <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB]">
                        {appHeader?.left_heading}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {appHeader?.left_points?.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[14px] text-[#9CA3AF]">
                          <span className="text-[#EF4444] flex-shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
    
                  {/* Our Way */}
                  <div className="p-8 bg-gradient-to-br from-[#22C55E]/5 to-[#06B6D4]/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center">
                        <span className="text-[#22C55E] text-[20px]">✓</span>
                      </div>
                      <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB]">
                        {appHeader?.right_heading}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {appHeader?.right_points?.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[14px] text-[#F9FAFB]">
                          <span className="text-[#22C55E] flex-shrink-0">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </DSCard>
            </div>
          </div>
        </section>
      </>
      <>{/*{Our Process} */}
      <section id="process" className="py-20 px-6 bg-[#111827]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
              <span className="text-[14px] font-medium text-[#22C55E]">
                {pcHeader?.tag}
              </span>
            </div>
            
            <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
              {pcHeader?.subheading1} <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
                {pcHeader?.subheading2}
              </span>
            </h2>
            
            <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
              {pcHeader?.subtext}
            </p>
          </div>
  
          {/* Process Timeline */}
          <div className="relative">
            {/* Connecting Line - Desktop */}
            <div className="hidden lg:block absolute left-[50%] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#22C55E] to-[#06B6D4]" />
  
            {/* Steps */}
            <div className="space-y-12">
              {pcItems?.map((step, index) => {
                const Icon = Icons[step.pc_icon];
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className="relative">
                    {/* Desktop Layout */}
                    <div className={`hidden lg:grid grid-cols-2 gap-12 items-center ${isEven ? '' : 'direction-rtl'}`}>
                      {isEven ? (
                        <>
                          {/* Left Content */}
                          <div className="text-right">
                            <DSCard hover>
                              <div className="flex items-start gap-4 flex-row-reverse">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-7 h-7 text-[#22C55E]" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-end gap-3 mb-3">
                                    <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB]">
                                      {step.title}
                                    </h3>
                                    <span className="text-[32px] font-bold text-[#22C55E]/20">
                                      {step.pc_number}
                                    </span>
                                  </div>
                                  <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
                                    {step.pc_description}
                                  </p>
                                  <p className="text-[12px] text-[#22C55E] font-medium">
                                    Timeline: {step.pc_timeline}
                                  </p>
                                </div>
                              </div>
                            </DSCard>
                          </div>
  
                          {/* Center Dot */}
                          <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-[#111827] z-10" />
  
                          {/* Right Empty */}
                          <div />
                        </>
                      ) : (
                        <>
                          {/* Left Empty */}
                          <div />
  
                          {/* Center Dot */}
                          <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#22C55E] border-4 border-[#111827] z-10" />
  
                          {/* Right Content */}
                          <div>
                            <DSCard hover>
                              <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-7 h-7 text-[#22C55E]" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[32px] font-bold text-[#22C55E]/20">
                                      {step.pc_number}
                                    </span>
                                    <h3 style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB]">
                                      {step.pc_name}
                                    </h3>
                                  </div>
                                  <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
                                    {step.pc_description}
                                  </p>
                                  <p className="text-[12px] text-[#22C55E] font-medium">
                                    Timeline: {step.pc_timeline}
                                  </p>
                                </div>
                              </div>
                            </DSCard>
                          </div>
                        </>
                      )}
                    </div>
  
                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                      <DSCard hover>
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-7 h-7 text-[#22C55E]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-[32px] font-bold text-[#22C55E]/20">
                                {step.pc_number}
                              </span>
                              <h3 style={{ fontSize: '20px' }} className="font-bold text-[#F9FAFB]">
                                {step.pc_name}
                              </h3>
                            </div>
                            <p className="text-[14px] text-[#9CA3AF] mb-3 leading-relaxed">
                              {step.pc_description}
                            </p>
                            <p className="text-[12px] text-[#22C55E] font-medium">
                              Timeline: {step.pc_timeline}
                            </p>
                          </div>
                        </div>
                      </DSCard>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      </>
      <PortfolioPage />
      <TestimonialsPage />
      <CTASection />
    </section>
  );
}

const FALLBACK_TOOLS: ToolItem[] = [
  { id: 1, name: "HubSpot", slug: "hubspot", overview: "All-in-one CRM, marketing, and sales platform for growing businesses.", tagline: "Grow better with HubSpot", logo_url: null, category: { name: "CRM", slug: "crm" } },
  { id: 2, name: "Zapier", slug: "zapier", overview: "Automate workflows by connecting your apps without any code.", tagline: "Connect your apps and automate", logo_url: null, category: { name: "Automation", slug: "automation" } },
  { id: 3, name: "Salesforce", slug: "salesforce", overview: "World-leading CRM platform for enterprise sales and service teams.", tagline: "The world's #1 CRM", logo_url: null, category: { name: "CRM", slug: "crm" } },
  { id: 4, name: "Mailchimp", slug: "mailchimp", overview: "Email marketing and automation platform for growing audiences.", tagline: "Send better email", logo_url: null, category: { name: "Email Marketing", slug: "email-marketing" } },
  { id: 5, name: "Notion", slug: "notion", overview: "All-in-one workspace for notes, docs, wikis, and project management.", tagline: "Write, plan, collaborate", logo_url: null, category: { name: "Productivity", slug: "productivity" } },
  { id: 6, name: "Slack", slug: "slack", overview: "Business messaging platform that brings teams together.", tagline: "Where work happens", logo_url: null, category: { name: "Communication", slug: "communication" } },
];

const FALLBACK_INDUSTRIES: IndustryItem[] = [
  { id: 1, name: "SaaS", slug: "saas", description: "Software as a Service companies building cloud-based solutions.", tagline: "Cloud-native software businesses" },
  { id: 2, name: "E-Commerce", slug: "ecommerce", description: "Online retail and marketplace businesses selling products digitally.", tagline: "Digital retail and marketplaces" },
  { id: 3, name: "Healthcare", slug: "healthcare", description: "Healthcare providers, medtech, and digital health platforms.", tagline: "Digital health and medtech" },
  { id: 4, name: "Finance", slug: "finance", description: "Fintech, banking, and financial services organisations.", tagline: "Fintech and financial services" },
  { id: 5, name: "Education", slug: "education", description: "EdTech platforms, online learning, and training providers.", tagline: "Learning and EdTech" },
  { id: 6, name: "Real Estate", slug: "real-estate", description: "Property technology, agencies, and real estate marketplaces.", tagline: "PropTech and real estate" },
];

const FALLBACK_SOLUTIONS: SolutionItem[] = [
  { id: 1, name: "Lead Generation", slug: "lead-generation", summary: "Generate and capture qualified leads at scale using proven digital strategies.", problem_statement: null },
  { id: 2, name: "Marketing Automation", slug: "marketing-automation", summary: "Automate repetitive marketing tasks and nurture leads through personalised funnels.", problem_statement: null },
  { id: 3, name: "CRM Implementation", slug: "crm-implementation", summary: "Set up and customise a CRM that fits your sales process and team workflow.", problem_statement: null },
  { id: 4, name: "SEO & Content Strategy", slug: "seo-content-strategy", summary: "Drive organic traffic with data-driven SEO and programmatic content at scale.", problem_statement: null },
  { id: 5, name: "Analytics & Reporting", slug: "analytics-reporting", summary: "Build dashboards and pipelines that surface actionable business insights.", problem_statement: null },
  { id: 6, name: "E-Commerce Growth", slug: "ecommerce-growth", summary: "Increase conversions, average order value, and retention for online stores.", problem_statement: null },
];

export function CategoryListingPage({ type }: { type: string }) {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const endpoint =
    type === "industries" ? `/industries?per_page=20&page=${page}` :
    type === "solutions"  ? `/solutions?per_page=20&page=${page}` :
    type === "tools"      ? `/tools?per_page=20&page=${page}` : "";

  const { data, loading, error } = useApi<Paginated<ToolItem & IndustryItem & SolutionItem>>(endpoint);

  const fallbackItems: (ToolItem & IndustryItem & SolutionItem)[] =
    type === "industries" ? (FALLBACK_INDUSTRIES as never) :
    type === "solutions"  ? (FALLBACK_SOLUTIONS as never) :
    type === "tools"      ? (FALLBACK_TOOLS as never) :
  [];

  const totalPages = Array.isArray(data) ? 1 : (data as any)?.last_page ?? 1;
  usePaginationHeadLinks(page, totalPages);

  useSeo({
    title: `${type} | WebNDevs`,
    description: `Browse ${type} with filters and pagination.`,
    canonicalUrl: window.location.href,
  });

  const apiItems = Array.isArray(data) ? data : (data as any)?.data ?? [];  
  const items = error ? fallbackItems : apiItems;
  const filtered = filter === "all" ? items : filter === "featured" ? items.filter((i) => Boolean((i as any).is_featured)) : items.filter((i) => (i as ToolItem).category?.slug === filter);

  return (
    <section className="space-y-6">
      <SchemaOrg
        id={`item-list-${type}`}
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${type} listing`,
          itemListElement: items.map((item, idx) => ({
            "@type": "ListItem", position: idx + 1, name: item.name,
            url: `${window.location.origin}/${type}/${item.slug}`,
          })),
        }}
      />
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: type.toUpperCase() }]} />
      <EntityHero
        title={type.toUpperCase()}
        subtitle={error ? `Showing example ${type} — live data unavailable.` : `${Array.isArray(data) ? data.length : (data as any)?.total ?? apiItems.length} ${type} available.`}
      />
      <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
        Quick answer: This page lists the best {type} options with filter and pagination support.
      </p>
      <DefinitionBox term={`${type} ecosystem`} definition={`The set of ${type} and related integrations matched to your business goals.`} />
      <FilterBar value={filter} onChange={setFilter} options={[{ value: "all", label: "All" }, { value: "featured", label: "Featured" }]} />
      {loading && <PageLoading />}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            type === "industries"
              ? <IndustryCard key={item.id} slug={item.slug} name={item.name} description={(item as IndustryItem).description ?? ""} />
              : type === "solutions"
              ? <SolutionCard key={item.id} slug={item.slug} name={item.name} summary={(item as SolutionItem).summary ?? ""} />
              : <ToolCard key={item.id} slug={item.slug} name={item.name} category={(item as ToolItem).category?.name ?? type} description={(item as ToolItem).overview ?? (item as ToolItem).tagline ?? ""} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-slate-400">No {type} found.</p>
          )}
        </div>
      )}
      {!error && <Pagination page={page} total={totalPages} onChange={setPage} />}
    </section>
  );
}

export function EntityDetailPage() {
  const params = useParams();
  const slug = params.slug || "entity";
  const { data: tool, loading, error } = useApi<ToolDetail>(`/tools/${slug}`);

  useSeo({
    title: tool ? `${tool.name} | WebNDevs` : `${slug} | WebNDevs`,
    description: tool?.tagline ?? `Details, FAQ, and use cases for ${slug}.`,
    canonicalUrl: window.location.href,
  });

  if (!loading && (error || !tool)) {
    return <NotFoundPage />;
  }

  const name = tool?.name ?? slug;
  const faqs = tool?.faqs ?? [];
  const steps = (tool?.process_steps ?? []).sort((a, b) => a.step_number - b.step_number);
  const techStack = tool?.features?.map((f) => f.name) ?? [];
  const useCases = tool?.use_cases ?? [];
  const relatedItems = (tool?.cross_references ?? []).map((cr) => ({
  title: cr.title,
  type: "tools",
  entity_a: {
    slug: cr.entity_a?.slug,
  },
  entity_b: {
    slug: cr.entity_b?.slug,
  },
}));

  return (
    <section className="space-y-6">
      <SchemaOrg
        id={`service-schema-${slug}`}
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name,
          provider: { "@type": "Organization", name: "WND Agency" },
          serviceType: "Implementation and integration",
        }}
      />
      <SchemaOrg
        id={`software-schema-${slug}`}
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
        }}
      />
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Tools", to: "/tools" }, { label: name }]} />
      {loading && <PageLoading />}
      {!loading && (
        <>
          <EntityHero title={name} subtitle={tool?.tagline ?? tool?.overview ?? "Detail page with FAQ and process steps."} />
          {tool?.overview && (
            <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
              {tool.overview}
            </p>
          )}
          <DefinitionBox term={`${name} integration`} definition={`${name} integration connects your tools and workflows to deliver measurable results.`} />
          <TableOfContents items={["Overview", ...(useCases.length ? ["Use Cases"] : []), ...(steps.length ? ["Process"] : []), ...(faqs.length ? ["FAQ"] : [])]} />
          {techStack.length > 0 && <TechStackDisplay tools={techStack} />}
          {steps.length > 0 && <ProcessSteps steps={steps.map((s) => ({ title: s.title, description: s.description, duration: s.duration ?? undefined }))} />}
          {useCases.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-white">Use Cases</h2>
              <ul className="list-disc space-y-1 pl-5 text-slate-300">
                {useCases.map((uc, i) => <li key={i}>{uc.title} — {uc.description}</li>)}
              </ul>
            </>
          )}
          {faqs.length > 0 && <FAQAccordion items={faqs} />}
          {relatedItems.length > 0 && <RelatedEntitiesGrid items={relatedItems} />}
          <SocialShare url={window.location.href} />
          <CTABanner title={`Need help implementing ${name}?`} actionLabel="Book Strategy Call" />
        </>
      )}
    </section>
  );
}

export function CrossReferencePage() {
  const params = useParams();
  const left = params.toolSlug || params.slug || "entity-a";
  const right = params.crossrefSlug || params.crossref || "entity-b";

  const { data: crossRef, loading, error } = useApi<CrossRefDetail>(`/cross-reference/${left}/${right}`);

  const title = crossRef?.title ?? `${crossRef?.entity_a?.name || left} × ${crossRef?.entity_b?.name || right}`;
  useSeo({
    title: `${title} | WebNDevs`,
    description: crossRef?.quick_answer ?? `Quick answer and integration guide for ${left} and ${right}.`,
    canonicalUrl: window.location.href,
  });

  if (!loading && (error || !crossRef)) {
    return <NotFoundPage />;
  }

  const sections = crossRef?.sections ?? [];
  const faqs = crossRef?.faqs ?? [];

  return (
    <section className="space-y-6">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: left, to: `/tools/${left}` }, { label: title }]} />
      {loading && <PageLoading />}
      {!loading && (
        <>
          <EntityHero title={title} subtitle={crossRef?.subtitle ?? "Cross-reference guide with quick answer structure."} />
          {crossRef?.quick_answer && (
            <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
              {crossRef.quick_answer}
            </p>
          )}
          <DefinitionBox
            term={`${crossRef?.entity_a?.name || left} + ${crossRef?.entity_b?.name || right}`}
            definition={`A combined stack where ${crossRef?.entity_a?.name || left} and ${crossRef?.entity_b?.name || right} work together to automate operations and improve outcomes.`}
          />
          {sections.length > 0 && (
            <>
              <TableOfContents items={sections.map((s) => s.title)} />
              {sections.map((section) => (
                <div key={section.section_key} className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  <p className="text-slate-300">{section.content}</p>
                </div>
              ))}
            </>
          )}
          {faqs.length > 0 && <FAQAccordion items={faqs} />}
          <CTABanner title={`Integrate ${crossRef?.entity_a?.name || left} and ${crossRef?.entity_b?.name || right} for your team?`} actionLabel="Book Strategy Call" />
        </>
      )}
    </section>
  );
}

export function IndustryPage() {
  const params = useParams();
  const slug = params.slug || "industry";
  const { data: industry, loading, error } = useApi<IndustryDetail>(`/industries/${slug}`);

  useSeo({
    title: industry ? `${industry.name} | WebNDevs` : `${slug} | WebNDevs`,
    description: industry?.tagline ?? industry?.description ?? "Industry-focused pages with matching tools and solutions.",
    canonicalUrl: window.location.href,
  });

  if (!loading && (error || !industry)) {
    return <NotFoundPage />;
  }

  const name = industry?.name ?? slug;
  const tools = industry?.tools ?? [];
  const solutions = industry?.solutions ?? [];
  const faqs = industry?.faqs ?? [];

  return (
    <section className="space-y-6">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Industries", to: "/industries" }, { label: name }]} />
      {loading && <PageLoading />}
      {!loading && (
        <>
          <EntityHero title={name} subtitle={industry?.tagline ?? "Industry-focused with tools, solutions, and case studies."} />
          {industry?.description && (
            <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
              {industry.description}
            </p>
          )}
          <DefinitionBox term="Industry stack" definition="A set of integrated tools and processes tailored to one vertical's compliance, workflows, and buyer journey." />
          {faqs.length > 0 && <FAQAccordion items={faqs} />}
          {(tools.length > 0 || solutions.length > 0) && (
            <RelatedEntitiesGrid items={[
              ...tools.map((t) => ({ title: t.name, slug: t.slug, type: "tools" })),
              ...solutions.map((s) => ({ title: s.name, slug: s.slug, type: "solutions" })),
            ]} />
          )}
          <CTABanner title={`Ready to grow your ${name} business?`} actionLabel="Book Strategy Call" />
        </>
      )}
    </section>
  );
}

export function SolutionPage() {
  const params = useParams();
  const slug = params.slug || "solution";
  const { data: solution, loading, error } = useApi<SolutionDetail>(`/solutions/${slug}`);

  useSeo({
    title: solution ? `${solution.name} | WebNDevs` : `${slug} | WebNDevs`,
    description: solution?.summary ?? solution?.problem_statement ?? "Problem-solution with workflow and tool stack.",
    canonicalUrl: window.location.href,
  });

  if (!loading && (error || !solution)) {
    return <NotFoundPage />;
  }

  const name = solution?.name ?? slug;
  const steps = (solution?.process_steps ?? []).sort((a, b) => a.step_number - b.step_number);
  const tools = solution?.tools ?? [];
  const useCases = solution?.use_cases ?? [];
  const faqs = solution?.faqs ?? [];

  return (
    <section className="space-y-6">
      <SchemaOrg
        id="howto-schema-solution"
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `${name} implementation`,
          step: steps.map((s) => ({ "@type": "HowToStep", name: s.title, text: s.description })),
        }}
      />
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Solutions", to: "/solutions" }, { label: name }]} />
      {loading && <PageLoading />}
      {!loading && (
        <>
          <EntityHero title={name} subtitle={solution?.summary ?? "Problem-solution with workflow and tool stack."} />
          {solution?.problem_statement && (
            <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
              {solution.problem_statement}
            </p>
          )}
          <DefinitionBox term="Solution blueprint" definition="A pre-mapped architecture linking tools, process steps, and KPIs for faster deployment." />
          {tools.length > 0 && <TechStackDisplay tools={tools.map((t) => t.name)} />}
          {steps.length > 0 && <ProcessSteps steps={steps.map((s) => ({ title: s.title, description: s.description, duration: s.duration ?? undefined }))} />}
          {useCases.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-white">Use Cases</h2>
              <ul className="list-disc space-y-1 pl-5 text-slate-300">
                {useCases.map((uc, i) => <li key={i}>{uc.title} — {uc.description}</li>)}
              </ul>
            </>
          )}
          {faqs.length > 0 && <FAQAccordion items={faqs} />}
          <CTABanner title={`Want ${name} built for your team?`} actionLabel="Get Proposal" />
        </>
      )}
    </section>
  );
}

export function ComparisonPage() {
  const params = useParams();
  const slug = params.slug || "comparison";
  const { data: comparison, loading, error } = useApi<ComparisonDetail>(`/compare/${slug}`);

  const title = comparison?.title ?? slug;
  useSeo({
    title: `${title} | WebNDevs`,
    description: comparison?.summary ?? "Feature matrix and recommendation.",
    canonicalUrl: window.location.href,
  });

  if (!loading && (error || !comparison)) {
    return <NotFoundPage />;
  }

  const entities = comparison?.entities ?? [];
  const features = comparison?.features ?? [];
  const faqs = comparison?.faqs ?? [];

  const labels = entities.map((entity) => entity.name);

  const featureRows = features.map((feature) => ({
    feature: feature.name,
    values: labels.map((label) => feature.values[label] ?? "—"),
  }));

  return (
    <section className="space-y-6">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Compare" }, { label: title }]} />
      {loading && <PageLoading />}
      {!loading && (
        <>
          <EntityHero title={title} subtitle={comparison?.summary ?? "Feature matrix with verdict and recommendation."} />
          {comparison?.recommendation && (
            <DefinitionBox term="Recommendation" definition={comparison.recommendation} />
          )}
          {featureRows.length > 0 && <FeatureMatrix rows={featureRows} labels={labels} />}
          {faqs.length > 0 && <FAQAccordion items={faqs} />}
          <CTABanner title="Not sure which tool is right for you?" actionLabel="Talk to Team" />
        </>
      )}
    </section>
  );
}

export function ComparisonListingPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useApi<Paginated<ComparisonDetail>>(`/compare?per_page=12&page=${page}`);

  const items = Array.isArray(data) ? data : data?.data ?? [];
  const totalPages = Array.isArray(data) ? 1 : data?.last_page ?? 1;

  usePaginationHeadLinks(page, totalPages);

  useSeo({
    title: "Comparisons | WebNDevs",
    description: "Compare tools, CRMs, automation platforms, and software options.",
    canonicalUrl: window.location.href,
  });

  return (
    <section className="space-y-6">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Comparisons" }]} />

      <EntityHero
        title="Comparisons"
        subtitle="Compare tools, CRMs, automation platforms, and business software before choosing the right stack."
      />

      {loading && <PageLoading />}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/compare/${item.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
            >
              <h3 className="font-semibold text-white">{item.title}</h3>
              {item.results_summary && (
                <p className="mt-2 text-sm text-slate-300">{item.results_summary}</p>
              )}
            </Link>
          ))}

          {items.length === 0 && (
            <p className="col-span-full text-slate-400">
              No comparisons available yet.
            </p>
          )}
        </div>
      )}

      {!error && <Pagination page={page} total={totalPages} onChange={setPage} />}
    </section>
  );
}

const FALLBACK_CASE_STUDIES: CaseStudyItem[] = [
  { id: 1, title: "3× Lead Volume for a SaaS Startup", slug: "saas-lead-volume", client_name: "GrowthLab", client_industry: "SaaS", results_summary: "Implemented a multi-channel lead gen stack that tripled qualified pipeline in 90 days." },
  { id: 2, title: "E-Commerce Revenue Up 68% With Personalisation", slug: "ecommerce-personalisation", client_name: "ModaMart", client_industry: "E-Commerce", results_summary: "Dynamic product recommendations and email automation drove a 68% lift in 12 months." },
  { id: 3, title: "Healthcare Onboarding Time Cut by 40%", slug: "healthcare-onboarding", client_name: "CareStack", client_industry: "Healthcare", results_summary: "Workflow automation reduced patient onboarding time from 25 minutes to under 15." },
  { id: 4, title: "CRM Migration Completed in 6 Weeks", slug: "crm-migration", client_name: "FinServe Group", client_industry: "Finance", results_summary: "Full Salesforce → HubSpot migration with zero data loss and same-day go-live." },
];

const FALLBACK_FREE_TOOLS: FreeToolDetail[] = [
  { id: 1, name: "ROI Calculator", slug: "roi-calculator", description: "Estimate your return on investment for any digital project in under 2 minutes.", type: "calculator", config: {}, cta_text: "Get a free implementation quote", thank_you_message: null },
  { id: 2, name: "SEO Audit Checker", slug: "seo-audit", description: "Get an instant overview of your site's SEO health — no login required.", type: "audit", config: {}, cta_text: "Book a full SEO strategy session", thank_you_message: null },
  { id: 3, name: "Automation Readiness Quiz", slug: "automation-readiness", description: "Find out which workflows in your business are ready to automate right now.", type: "quiz", config: {}, cta_text: "See your automation roadmap", thank_you_message: null },
];

const FALLBACK_BLOG_POSTS: BlogPostItem[] = [
  { id: 1, title: "How AI Is Transforming Web Development in 2025", slug: "ai-transforming-web-development-2025", excerpt: "From copilots to full-stack generation — how AI is reshaping modern websites.", published_at: "2025-03-10T00:00:00Z" },
  { id: 2, title: "Programmatic SEO: Scale Content Without Sacrificing Quality", slug: "programmatic-seo-scale-content", excerpt: "Build thousands of high-quality interlinked pages from structured data.", published_at: "2025-02-20T00:00:00Z" },
  { id: 3, title: "Why Laravel Is Still the Best API Backend for Startups", slug: "laravel-best-api-backend-startups", excerpt: "Speed, structure, and developer happiness — Laravel's edge in 2025.", published_at: "2025-01-15T00:00:00Z" },
  { id: 4, title: "HubSpot vs Salesforce: Which CRM Is Right for Your Team?", slug: "hubspot-vs-salesforce", excerpt: "A practical comparison for teams with under 100 seats and real growth goals.", published_at: "2025-01-05T00:00:00Z" },
];

export function CaseStudyListingPage() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, loading, error } = useApi<Paginated<CaseStudyItem>>(`/case-studies?per_page=12&page=${page}`);

  const apiItems = data?.data ?? [];
  const totalPages = data?.last_page ?? 1;
  const totalItems = data?.total ?? 0;

  usePaginationHeadLinks(page, totalPages);

  useSeo({
    title: "Case Studies | WebNDevs",
    description: "Filterable case study listing.",
    canonicalUrl: window.location.href,
  });

  const items = error ? FALLBACK_CASE_STUDIES : apiItems;

  const industries = [
    ...new Set(items.map((i) => i.client_industry).filter(Boolean)),
  ] as string[];

  const filtered =
    filter === "all"
      ? items
      : items.filter((i) => i.client_industry === filter);

  return (
    <section className="space-y-6">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Case Studies" }]} />

      <EntityHero
        title="Case Studies"
        subtitle={error ? "Showing example case studies — live data unavailable." : `${totalItems} case studies.`}
      />

      <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
        Quick answer: Explore measurable outcomes from real delivery engagements across industries.
      </p>

      <FilterBar
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All Industries" },
          ...industries.map((ind) => ({ value: ind, label: ind })),
        ]}
      />

      {loading && <PageLoading />}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((cs) => (
            <Link
              key={cs.id}
              to={`/case-studies/${cs.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
            >
              <p className="font-semibold text-white">{cs.title}</p>

              <p className="text-sm text-slate-300 mt-1">
                {cs.client_name}
                {cs.client_industry ? ` · ${cs.client_industry}` : ""}
              </p>

              {cs.results_summary && (
                <p className="text-sm text-slate-400 mt-2">
                  {cs.results_summary}
                </p>
              )}
            </Link>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full text-slate-400">
              No case studies found.
            </p>
          )}
        </div>
      )}

      {!error && <Pagination page={page} total={totalPages} onChange={setPage} />}
    </section>
  );
}

export function CaseStudySinglePage() {
  const params = useParams();
  const slug = params.slug || "case-study";
  const { data: cs, loading, error } = useApi<CaseStudyDetail>(`/case-studies/${slug}`);

  useSeo({
    title: cs ? `${cs.title} | WebNDevs` : `${slug} | WebNDevs`,
    description: cs?.results_summary ?? "Case study detail with metrics and testimonial.",
    canonicalUrl: window.location.href,
  });

  if (!loading && (error || !cs)) {
    return <NotFoundPage />;
  }

  const title = cs?.title ?? slug;
  const metrics = (cs?.metrics ?? [])
  .filter((m) => m.before_value && m.after_value)
  .map((m) => ({
    label: m.label,
    before: `${m.before_value}${m.unit ?? ""}`,
    after: `${m.after_value}${m.unit ?? ""}`,
  }));
  const faqs = cs?.faqs ?? [];

  return (
    <section className="space-y-6">
      <SchemaOrg
        id="review-schema-case-study"
        data={{
          "@context": "https://schema.org",
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: cs?.testimonial?.rating?.toString() ?? "5",
            bestRating: "5",
          },
          author: cs?.testimonial ? { "@type": "Person", name: cs.testimonial.author_name } : { "@type": "Organization", name: "WND Agency" },
          itemReviewed: { "@type": "Service", name: title },
        }}
      />
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Case Studies", to: "/case-studies" }, { label: title }]} />
      {loading && <PageLoading />}
      {!loading && (
        <>
          <EntityHero title={title} subtitle={cs ? `${cs.client_name}${cs.client_industry ? ` · ${cs.client_industry}` : ""}` : ""} />
          {cs?.results_summary && (
            <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">{cs.results_summary}</p>
          )}
          {(cs?.challenge || cs?.solution) && (
            <div className="grid gap-4 md:grid-cols-2">
              {cs.challenge && (
                <section className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h2 className="text-lg font-semibold text-white">Challenge</h2>
                  <p className="mt-2 text-slate-300">{cs.challenge}</p>
                </section>
              )}

              {cs.solution && (
                <section className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h2 className="text-lg font-semibold text-white">Solution</h2>
                  <p className="mt-2 text-slate-300">{cs.solution}</p>
                </section>
              )}
            </div>
          )}
          {metrics.length > 0 && <MetricCards items={metrics} />}
          {faqs.length > 0 && <FAQAccordion items={faqs} />}
          {cs?.testimonial && (
            <TestimonialCard item={{
              name: cs.testimonial.author_name,
              company: cs.testimonial.company,
              content: cs.testimonial.content,
              rating: cs.testimonial.rating ?? undefined,
            }} />
          )}
          <CTABanner title="Want results like this for your business?" actionLabel="Get Proposal" />
        </>
      )}
    </section>
  );
}

export function FreeToolPage() {
  const params = useParams();
  const slug = params.slug || "free-tool";
  const { data: tool, loading, error } = useApi<FreeToolDetail>(`/free-tools/${slug}`);

  useSeo({
    title: tool ? `${tool.name} | WebNDevs` : `${slug} | WebNDevs`,
    description: tool?.description ?? "ROI calculator and interactive free tools.",
    canonicalUrl: window.location.href,
  });

  if (!loading && (error || !tool)) {
    return <NotFoundPage />;
  }

  const name = tool?.name ?? slug;

  return (
    <section className="space-y-6">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Free Tools", to: "/free-tools" }, { label: name }]} />
      {loading && <PageLoading />}
      {!loading && (
        <>
          <EntityHero title={name} subtitle={tool?.type ? `Type: ${tool.type}` : "Interactive free tool."} />
          {tool?.description && (
            <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">{tool.description}</p>
          )}
          <DefinitionBox term={name} definition={tool?.description ?? "An interactive tool to help estimate ROI and capture qualification signals."} />
          <div className="rounded-xl border border-white/10 p-6 text-slate-300">Interactive {tool?.type ?? "tool"} widget.</div>
          <CTABanner title={tool?.cta_text ?? `Want help with ${name}?`} actionLabel="Talk to Team" />
        </>
      )}
    </section>
  );
}

export function FreeToolListingPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useApi<Paginated<FreeToolDetail>>(`/free-tools?per_page=12&page=${page}`);

  const totalPages = data?.last_page ?? 1;
  usePaginationHeadLinks(page, totalPages);
  useSeo({ title: "Free Tools | WebNDevs", description: "ROI calculators, audits, and interactive tools.", canonicalUrl: window.location.href });

  const apiItems = data?.data ?? [];
  const items = error ? FALLBACK_FREE_TOOLS : apiItems;

  return (
    <section className="space-y-6">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Free Tools" }]} />
      <EntityHero title="Free Tools" subtitle={error ? "Showing example tools — live data unavailable." : `${data?.total ?? 0} interactive tools available.`} />
      <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
        Quick answer: Use our free calculators and audits to estimate ROI before committing to a full implementation.
      </p>
      {loading && <PageLoading />}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((tool) => (
            <Link key={tool.id} to={`/free-tools/${tool.slug}`} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
              <p className="text-xs uppercase text-slate-400">{tool.type}</p>
              <h3 className="font-semibold text-white mt-1">{tool.name}</h3>
              {tool.description && <p className="text-sm text-slate-300 mt-2">{tool.description}</p>}
            </Link>
          ))}
          {items.length === 0 && <p className="col-span-full text-slate-400">No tools available yet.</p>}
        </div>
      )}
      {!error && <Pagination page={page} total={totalPages} onChange={setPage} />}
    </section>
  );
}

export function BlogListingPage() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const { data, loading, error } = useApi<Paginated<BlogPostItem>>(`/blog-posts?per_page=12&page=${page}`);

  const totalPages = data?.last_page ?? 1;
  usePaginationHeadLinks(page, totalPages);
  useSeo({ title: "Blog | WebNDevs", description: "Blog listing with filters by tool/industry/category.", canonicalUrl: window.location.href });

  const apiItems = data?.data ?? [];
  const items = error ? FALLBACK_BLOG_POSTS : apiItems;

  return (
    <section className="space-y-6">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Blog" }]} />
      <PageHeader title="Our Blogs" subtitle={error ? "Showing example posts — live data unavailable." : <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
        Read implementation playbooks, comparisons, and strategy guides for integrations and SEO growth.
      </p>}/>
      
      <FilterBar
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All Posts" },
          { value: "tools", label: "By Tool" },
          { value: "industry", label: "By Industry" },
        ]}
      />
      {loading && <PageLoading />}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((post) => (
            <Link key={post.id} to={`/blogs/${post.slug}`} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
              <p className="font-semibold text-white">{post.title}</p>
              {post.excerpt && <p className="text-sm text-slate-300 mt-2">{post.excerpt}</p>}
              {post.published_at && <p className="text-xs text-slate-500 mt-2">{new Date(post.published_at).toLocaleDateString()}</p>}
            </Link>
          ))}
          {items.length === 0 && <p className="col-span-full text-slate-400">No posts yet.</p>}
        </div>
      )}
      {!error && <Pagination page={page} total={totalPages} onChange={setPage} />}
    </section>
  );
}

export function BlogSinglePage() {
  const params = useParams();
  const slug = params.slug || "blog-post";
  const { data: post, loading, error } = useApi<BlogPostDetail>(`/blog-posts/${slug}`);

  useSeo({
    title: post ? `${post.title} | WebNDevs` : `${slug} | WebNDevs`,
    description: post?.excerpt ?? "Blog detail with related entities and internal links.",
    canonicalUrl: window.location.href,
  });

  if (!loading && (error || !post)) {
    return <NotFoundPage />;
  }

  const title = post?.title ?? slug;

  return (
    <section className="space-y-6">
      <SchemaOrg
        id="article-schema-blog"
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          author: post?.author
            ? { "@type": "Person", name: post.author }
            : { "@type": "Organization", name: "WND Agency" },
          datePublished: post?.published_at ?? undefined,
          mainEntityOfPage: window.location.href,
        }}
      />
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Blog", to: "/blogs" }, { label: title }]} />
      {loading && <PageLoading />}
      {!loading && (
        <>
          <EntityHero title={title} subtitle={post?.excerpt ?? "Blog detail with related entities and internal links."} />
          {post?.published_at && (
            <p className="text-sm text-slate-400">Published {new Date(post.published_at).toLocaleDateString()}</p>
          )}
          {post?.body && (
            <div className="prose prose-invert max-w-none text-slate-300">
              {post.body.split("\n\n").map((para, i) => (
                <p key={i} className="mb-4 text-slate-300">{para}</p>
              ))}
            </div>
          )}
          {(post?.faqs ?? []).length > 0 && <FAQAccordion items={post!.faqs!} />}
          <SocialShare url={window.location.href} />
          <CTABanner title="Want us to implement this for your team?" actionLabel="Get Proposal" />
        </>
      )}
    </section>
  );
}

export function ServiceDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const slug = params.slug || "web-development";

  // Static service data for built-in services
  const serviceDataMap: Record<string, ServicePageData> = {
    'web-development': webDevelopmentService,
    'mobile-app-development': mobileAppService,
    'ui-ux-design': uiUxDesignService,
    'automation': automationService,
    'digital-marketing': digitalMarketingService,
    'data-analytics': dataAnalyticsService,
    'branding': brandingService,
  };

  // Use static data if available, otherwise fetch from API
  const staticData = serviceDataMap[slug];

  // Fetch service content from Content Module for dynamic services
  const contentPageKey = `service-${slug}`;
  const { data: pageContent, loading: contentLoading, error } = useContentPage(contentPageKey);

  // If we have static data, use it
  if (staticData) {
    return (
      <ServicePageTemplate
        data={staticData}
        serviceSlug={slug}
        onBackHome={() => navigate("/")}
      />
    );
  }

  if (!contentLoading && (error || !pageContent)) {
    return <NotFoundPage />;
  }

  // For dynamically created services, use Content Module data
  if (contentLoading) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9CA3AF]">Loading service...</p>
        </div>
      </div>
    );
  }

  // Build service page data from content module
  const sections = pageContent?.sections ?? [];
  
  // Find heading-text section for hero content (using correct field names)
  const headingSection = sections.find((s) => s.section_type === "heading-text");
  
  // Get service cards for features/breakdown
  const serviceCardItems = sections
    .flatMap((s) => s.items)
    .filter((item) => item.ser_name);
  
  // Get Q&A items for FAQ
  const qaItems = sections
    .flatMap((s) => s.items)
    .filter((item) => item.question || item.answer);

  // Convert to ServicePageData format using correct field names from useContentPage.ts
  const dynamicData: ServicePageData = {
    seo: {
      metaTitle: pageContent?.seo_title ?? `Service | ${slug}`,
      metaDescription: pageContent?.seo_description ?? `Learn about our ${slug} service.`,
      urlSlug: slug,
      keywords: [],
      internalLinks: [],
      blogSuggestions: [],
    },
    hero: {
      serviceName: headingSection?.subheading1 ?? headingSection?.title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      valueProposition: headingSection?.subtext ?? headingSection?.description ?? "Professional service delivery",
      ctaText: "Get Started",
    },
    introduction: {
      paragraph: headingSection?.subtext ?? headingSection?.description ?? "Professional service delivery for your business needs.",
      benefits: [],
    },
    keyBenefits: [],
    servicesBreakdown: {
      heading: "What's Included",
      items: serviceCardItems.map((item) => ({
        title: item.ser_name ?? "Feature",
        description: item.ser_description ?? "",
      })),
    },
    process: [],
    useCases: {
      heading: "Who This Service Is For",
      audiences: [],
    },
    results: {
      heading: "Our Results",
      projects: [],
    },
    faqSection: {
      heading: "Frequently Asked Questions",
      subheading: "",
    },
    faq: qaItems.map((item) => ({
      question: item.question ?? "",
      answer: item.answer ?? "",
    })),
    finalCTA: {
      headline: "Ready to Get Started?",
      subtext: "Contact us today to discuss your project.",
      buttonText: "Contact Us",
    },
  };

  return (
    <ServicePageTemplate
      data={dynamicData}
      serviceSlug={slug}
      onBackHome={() => navigate("/")}
    />
  );
}

export function NotFoundPage() {
  return (
    <section className="space-y-6 text-center">
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="text-slate-200">Page not found. Try one of these suggested routes.</p>
      <div className="flex flex-wrap justify-center gap-2">
        {["/tools", "/industries", "/solutions", "/case-studies"].map((path) => (
          <Link key={path} to={path} className="rounded border border-white/20 px-3 py-1 text-sm text-white hover:bg-white/10">
            {path.replace("/", "").replace(/-/g, " ") || "home"}
          </Link>
        ))}
      </div>
      <GlobalSearch />
      <Link to="/" className="inline-block rounded bg-white px-4 py-2 text-slate-900">
        Back Home
      </Link>
    </section>
  );
}

export function ServerErrorPage() {
  return (
    <section className="space-y-6 text-center">
      <h1 className="text-4xl font-bold text-white">500</h1>
      <p className="text-slate-200">Something failed on our side. We are on it.</p>
      <a href="mailto:hello@wnd.agency" className="inline-block rounded border border-white/20 px-4 py-2 text-white hover:bg-white/10">
        Contact support
      </a>
      <Link to="/" className="inline-block rounded bg-white px-4 py-2 text-slate-900">
        Back Home
      </Link>
    </section>
  );
}

export function ServicesPage() {
  useSeo({
    title: "Services | WebNDevs",
    description: "Explore WebNDevs services including web development, mobile apps, UI/UX, automation, analytics, marketing, and branding.",
    canonicalUrl: window.location.href,
  });
    const { data: pageContent, loading, error } = useContentPage("services");
  const serItems = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.ser_name) ?? [];
  const headerSection = pageContent?.sections?.find(
    (s) => s.section_type === "heading-text" && s.is_visible
  );
  return (
    <section className="space-y-10">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Services" }]} />
      <PageHeader
        title="Our Services"
        subtitle={headerSection?.description}>
      </PageHeader>
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
        </div>
      )}
      <section id="services" className="py-20 px-6 bg-[#111827]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
              <span className="text-[14px] font-medium text-[#22C55E]">
                {headerSection?.tag}
              </span>
            </div>
            
            <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
              {headerSection?.subheading1} <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
                {headerSection?.subheading2}
              </span>
            </h2>
            
            <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
              {headerSection?.subtext}
            </p>
          </div>
  
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serItems.map((service, index) => {
              const IconComponent = Icons[service.ser_icon as keyof typeof Icons];
              return (
                <Link   key={index} to={`/services/${service.ser_url}`} className="block">
                  <DSCard hover className="group h-full">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#06B6D4]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {IconComponent && <IconComponent className="w-7 h-7 text-[#22C55E]" />}
                    </div>
                    
                    <h3 style={{ fontSize: '20px' }} className="font-semibold text-[#F9FAFB] mb-3">
                      {service.ser_name}
                    </h3>
                    
                    <p className="text-[14px] text-[#9CA3AF] mb-4 leading-relaxed">
                      {service.ser_description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {service.ser_tag.split(', ').map((keyword, i) => (
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
      {/* Fallback content when no items available */}
      {!loading && !error && serItems.length === 0 && (
        <ServicesSection />
      )}
      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-6 text-red-300">
          Failed to load Services content: {error}
        </div>
      )}
      <CTASection />
    </section>
  );
}

export function PortfolioPage() {
  useSeo({
    title: "Portfolio | WebNDevs",
    description: "Explore WebNDevs projects, results, case studies, and client work.",
    canonicalUrl: window.location.href,
  });
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { data: pageContent, loading, error } = useContentPage("portfolio");
  const proItems = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.pro_name) ?? [];
  const featPro = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.is_featured && item.pro_name) ?? [];
  const allPro = isHomePage ? featPro : proItems;
  const stats = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.question && item.answer) ?? [];
  const headerSection = pageContent?.sections?.find(
    (s) => s.section_type === "heading-text" && s.is_visible
  );
  return (
    <section className="space-y-10">
      {isHomePage ? (null) :  (
        <>
        <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Portfolio" }]} />
        <PageHeader
          title="Portfolio"
          subtitle={<p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
            {headerSection?.description}
        </p>}
        />
        </>
      )}
      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
        </div>
      )}

      <section id="portfolio" className="py-10 px-6 bg-[#0B0F14]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
            <span className="text-[14px] font-medium text-[#22C55E]">
              {headerSection?.tag}
            </span>
          </div>
          
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            {headerSection?.subheading1} <span className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
              {headerSection?.subheading2}
            </span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
            {headerSection?.subtext}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPro.map((project, index) => (
            <DSCard key={index} hover className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <DSBadge variant={(project.pro_badge ?? project.badge) as any}>
                  {project.pro_category}
                </DSBadge>
                <button className="text-[#9CA3AF] hover:text-[#22C55E] transition-colors">
                  <a href={project.pro_url ?? '#'} target='_blank' rel='noopener noreferrer' aria-label={`Open ${project.pro_name}`} >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </button>
              </div>

              <h3 style={{ fontSize: '20px' }} className="font-bold text-[#F9FAFB] mb-3">
                {project.pro_name}
              </h3>

              <p className="text-[14px] text-[#9CA3AF] mb-4 leading-relaxed">
                {project.pro_description}
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
                  {project.pro_results.map((result, i) => (
                    <li key={i} className="text-[13px] text-[#9CA3AF] flex items-start gap-2">
                      <span className="text-[#22C55E] flex-shrink-0">✓</span>
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.pro_tag.map((tag, i) => (
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
                {stat.answer}
              </p>
              <p className="text-[14px] text-[#9CA3AF]">{stat.question}</p>
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
      {/* Fallback content when no items available */}
      {!loading && !error && allPro.length === 0 && (
        <PortfolioSection />
      )}
      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-6 text-red-300">
          Failed to load Portfolio content: {error}
        </div>
      )}
    </section>
      {isHomePage ? (null) :<CTASection />}
    </section>
  );
}

export function TestimonialsPage() {
  useSeo({
    title: "Testimonials | WebNDevs",
    description: "Read what our clients say about working with us.",
    canonicalUrl: window.location.href,
  });
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { data: pageContent, loading, error } = useContentPage("testimonials");
  const testItems = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.test_name) ?? [];
  const featTest = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.is_featured && item.test_name) ?? [];
  const testimonials = isHomePage ? featTest : testItems;
  const stats = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.cc_name) ?? [];
  const headerSection = pageContent?.sections?.find(
    (s) => s.section_type === "heading-text" && s.is_visible
  );
  return (
    <section className="space-y-10">
      {isHomePage ? (null) :  (
        <>
        <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Testimonials" }]} />
        <PageHeader
          title="Testimonials"
          subtitle={<p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
            {headerSection?.description}
        </p>}
        />
        </>
      )}
      {/* Loading State */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-live="polite">
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
        </div>
      )}
      <section className="py-20 px-6 bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
            <span className="text-[14px] font-medium text-[#22C55E]">
              {headerSection?.tag}
            </span>
          </div>
          
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            {headerSection?.subheading1} <span className='bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent'>{headerSection?.subheading2}</span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-3xl mx-auto">
            {headerSection?.subtext}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((test, index) => (
            <DSCard key={index} hover className="flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: test.test_rate ?? 0 }, (_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>

              {/* Quote Icon */}
              {test.test_url !== null ? (
                <img src={test.test_url} alt="Testimonial" className="w-15 h-15 rounded mb-4 object-contain object-center" />
              ) : <Quote className="w-10 h-10 text-[#22C55E]/20 mb-4" />}

              {/* Content */}
              <p className="text-[14px] text-[#9CA3AF] leading-relaxed mb-6 flex-grow">
                "{test.test_description}"
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-[#374151]">
                <p className="font-semibold text-[#F9FAFB] text-[15px] mb-1">
                  {test.test_name}
                </p>
                <p className="text-[13px] text-[#9CA3AF] mb-2">
                  {test.test_role ?? test.test_company ?? ''}
                </p>
                {test.test_company && (
                  <p className="text-[12px] text-[#22C55E]">
                    Company: {test.test_company}
                  </p>
                )}
              </div>
            </DSCard>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <>
              <DSCard key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-[24px]">{stat.cc_icon}</span>
                </div>
                <p style={{ fontSize: '24px' }} className="font-bold text-[#F9FAFB] mb-1">{stat.cc_name}</p>
                <p className="text-[14px] text-[#9CA3AF]">{stat.cc_description}</p>
              </DSCard>
            </>
          ))}
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
      {/* Fallback content when no items available */}
      {!loading && !error && testimonials.length === 0 && (
        <TestimonialsSection />
      )}
      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-6 text-red-300">
          Failed to load Testimonials content: {error}
        </div>
      )}
    </section>
      {isHomePage ? (null) : <CTASection />}
    </section>
  );
}

export function DataHubPage() {
  useSeo({
    title: "Data Hub | WebNDevs",
    description: "Browse tools, industries, solutions, comparisons, case studies, and free resources.",
    canonicalUrl: window.location.href,
  });

  // Fetch Data content - slug matches URL, so /data fetches /api/v1/content-pages/data
  const { data: pageContent, loading, error } = useContentPage("data");


  // Get all data items - use title (mapped to tile_name) and description (mapped to tile_description) for any section items
  const dataItems = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.title !== undefined || item.tile_name !== undefined) ?? [];

  // Get page header section (heading-text type)
  const headerSection = pageContent?.sections?.find(
    (s) => s.section_type === "heading-text" && s.is_visible
  );

  const hubs = [
    { title: "Tools", to: "/tools", desc: "Explore software, platforms, and business tools." },
    { title: "Industries", to: "/industries", desc: "Find solutions by business vertical." },
    { title: "Solutions", to: "/solutions", desc: "Browse problem-solution implementation pages." },
    { title: "Comparisons", to: "/compare", desc: "Compare tools, CRMs, and platforms." },
    { title: "Case Studies", to: "/case-studies", desc: "See measurable project outcomes." },
    { title: "Free Tools", to: "/free-tools", desc: "Use calculators, audits, and interactive tools." },
  ];

  return (
    <section className="space-y-8">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Data" }]} />
      <PageHeader
        title="Data Hub"
        subtitle={<p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
          {headerSection?.description}
      </p>}
      />
      <GlobalSearch />

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-live="polite">
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
          <div className="h-8 w-4/5 rounded-md bg-white/10 animate-pulse" />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dataItems.map((dh) => (
          <Link
            key={dh.tile_url}
            to={dh.tile_url}
            className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
          >
            <h2 className="text-xl font-semibold text-white">{dh.tile_name}</h2>
            <p className="mt-2 text-sm text-slate-300">{dh.tile_description}</p>
          </Link>
        ))}
      </div>

      {/* Fallback content when no items available */}
      {!loading && !error && dataItems.length === 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hubs.map((hub) => (
          <Link
            key={hub.to}
            to={hub.to}
            className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
          >
            <h2 className="text-xl font-semibold text-white">{hub.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{hub.desc}</p>
          </Link>
        ))}
      </div>
      )}
      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-6 text-red-300">
          Failed to load Data-hub content: {error}
        </div>
      )}
    </section>
  );
}

export function ContactPage() {
  useSeo({
    title: "Contact | WebNDevs",
    description: "Start your project with WebNDevs.",
    canonicalUrl: window.location.href,
  });

  return (
    <section className="space-y-8">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
      <PageHeader
        title="Start Your Project"
        subtitle={<p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
          Ready to build something great together? Contact us to discuss your project, get a quote, or just say hello.
        </p>}
      />
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Don't Hesitate To Reach Out to Us</h2>  
        <p>Thank you for expressing your interest in webndevs.com. Whether you’re looking for web development projects, graphic design, digital marketing, or other technology solutions, we’re here to assist you. Our team is eager to share its expertise and help bring your ideas to life. Let’s collaborate and create something amazing together.</p>
      </div>
      <CTASection />
    </section>
  );
}

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  useSeo({
    title: "FAQ | WebNDevs",
    description: "Answers to common questions about WebNDevs services, pricing, process, support, and project timelines.",
    canonicalUrl: window.location.href,
  });

  // Fetch FAQ content - slug matches URL, so /faq fetches /api/v1/content-pages/faq
  const { data: pageContent, loading, error } = useContentPage("faq");


  // Get all Q&A items - use title (mapped to question) and question field
  const faqItems = pageContent?.sections
    ?.flatMap((section) => section.items || [])
    ?.filter((item) => item.title !== undefined || item.question !== undefined) ?? [];

  // Get page header section (heading-text type)
  const headerSection = pageContent?.sections?.find(
    (s) => s.section_type === "heading-text" && s.is_visible
  );

  return (
    <section className="space-y-10">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />
      
      {/* Page Header - from content module or fallback */}
      <PageHeader
        title="FAQ"
        subtitle={
          <p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
            {headerSection?.description}
          </p>
        }
      />

      {/* Loading State */}
      {loading && (
        <div className="grid gap-3 py-6" aria-busy="true" aria-live="polite">
          <div className="h-8 w-2/5 rounded-md bg-white/10 animate-pulse" />
          <div className="h-4 w-full rounded-md bg-white/10 animate-pulse" />
          <div className="h-4 w-4/5 rounded-md bg-white/10 animate-pulse" />
        </div>
      )}

      {<section id="faq" className="py-20 px-6 bg-[#0B0F14]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full mb-6">
            <span className="text-[14px] font-medium text-[#22C55E]">
              {headerSection?.tag}
            </span>
          </div>
          
          <h2 style={{ fontSize: '42px' }} className="font-bold text-[#F9FAFB] mb-4">
            {headerSection?.subheading1} <span className='bg-gradient-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent'>{headerSection?.subheading2}</span>
          </h2>
          
          <p style={{ fontSize: '18px' }} className="text-[#9CA3AF] max-w-2xl mx-auto">
            {headerSection?.subtext || `Everything you need to know about working with WebNDevs. 
            Can't find your answer? Just reach out.`}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <DSCard 
              key={index} 
              className="cursor-pointer transition-all"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 
                    style={{ fontSize: '18px' }} 
                    className="font-semibold text-[#F9FAFB] mb-2"
                  >
                    {faq.question}
                  </h3>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-[14px] text-[#9CA3AF] leading-relaxed pt-2">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                <button className="flex-shrink-0 text-[#22C55E]">
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </DSCard>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center">
          <DSCard className="bg-gradient-to-br from-[#22C55E]/5 to-[#06B6D4]/5 border border-[#22C55E]/20">
            <p style={{ fontSize: '18px' }} className="font-semibold text-[#F9FAFB] mb-2">
              Still have questions?
            </p>
            <p className="text-[14px] text-[#9CA3AF] mb-4">
              Book a free consultation and let's chat about your project.
            </p>
            <button 
              onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[16px] font-medium text-[#22C55E] hover:text-[#16A34A] transition-colors"
            >
              Schedule a Call →
            </button>
          </DSCard>
        </div>
      </div>
    </section>}

      {/* Fallback content when no items available */}
      {!loading && !error && faqItems.length === 0 && (
        <FAQSection />
      )}
      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-6 text-red-300">
          Failed to load FAQ content: {error}
        </div>
      )}
      <CTASection />
    </section>
  );
}

export function PrivacyPolicyPage() {
  useSeo({
    title: "Privacy Policy | WebNDevs",
    description: "Read our privacy policy to understand how we collect, use, and protect your personal data.",
    canonicalUrl: window.location.href,
  });

  return (
    <section className="space-y-8">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]} />
      <PageHeader
        title="Privacy Policy"
        subtitle={<p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
          Your privacy is important to us. This policy explains how we handle your data.
        </p>}
      />
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none text-slate-300">
        <h2>Introduction</h2>
        <p>
          This Privacy Policy describes how WebNDevs ("we," "us," or "our") collects, uses, and discloses your personal information when you visit our website webndevs.com (the "Site") and use our services.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as your name, email address, phone number, and project details when you fill out our contact forms or subscribe to our newsletter. We also collect usage data automatically as you interact with our Site.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, to communicate with you, to process your inquiries, and for marketing purposes.
        </p>
        <h2>Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
        </p>
      </div>
      <CTASection />
    </section>
  );
}

export function TermsOfServicePage() {
  useSeo({
    title: "Terms of Service | WebNDevs",
    description: "Read our terms of service to understand the rules and guidelines for using our website and services.",
    canonicalUrl: window.location.href,
  });

  return (
    <section className="space-y-8">
      <BreadcrumbNav items={[{ label: "Home", to: "/" }, { label: "Terms of Service" }]} />
      <PageHeader
        title="Terms of Service"
        subtitle={<p className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-4 text-slate-100">
          These terms govern your use of our website and services.
        </p>}
      />
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 prose prose-invert max-w-none text-slate-300">
        <h2>Agreement to Terms</h2>
        <p>
          By accessing or using our website and services, you agree to be bound by these Terms of Service and all terms incorporated by reference. If you do not agree to these terms, you may not access or use our services.
        </p>
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify or update these Terms at any time. We will notify you of any changes by posting the new Terms on the Site. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms.
        </p>
        <h2>User Conduct</h2>
        <p>
          You agree not to use the Site for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Site.
        </p>
        <h2>Intellectual Property</h2>
        <p>
          All content on the Site, including text, graphics, logos, and images, is our property or the property of our licensors and is protected by copyright and other intellectual property laws.
        </p>
      </div>
      <CTASection />
    </section>
  );
}
