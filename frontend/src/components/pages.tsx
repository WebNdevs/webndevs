"use client";
import { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { LoadingGame } from "./seo&maintainance/loading-game";
import { ServicePageTemplate } from "./service-page-template";
import type { ServicePageData } from "../types/service-page";
import { webDevelopmentService } from "../data/services";
import { mobileAppService } from "../data/mobile-app-service";
import { uiUxDesignService } from "../data/ui-ux-design-service";
import { automationService } from "../data/automation-service";
import { digitalMarketingService } from "../data/digital-marketing-service";
import { dataAnalyticsService } from "../data/data-analytics-service";
import { brandingService } from "../data/branding-service";
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
} from "./contents";
import { useSeo } from "@/hooks/useSeo";
import { useApi } from "@/hooks/useApi";
import { useContentPage, getActiveItems } from "@/hooks/useContentPage";
import { ExternalLink, Users, MessageCircle, Rocket, Handshake, Clock, Target, Code2, ArrowDown, Star, Code, Palette, Smartphone, Zap, BarChart3, TrendingUp,Paintbrush, Shield, Globe, Search, ShoppingBag, MessageSquare, Cloud, Cpu, Video, FileText, Hammer, HeadphonesIcon, ChevronDown, Quote } from "lucide-react";

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
        <span className="bg-linear-to-r from-[#22C55E] to-[#06B6D4] bg-clip-text text-transparent">
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
  const navigate = useRouter();
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