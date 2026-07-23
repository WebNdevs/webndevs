import { API_BASE_URL } from "@/config/api";
import { getDataHub as getStaticDataHub } from "@/data/datahub";
import { solutionPages as staticSolutionPages } from "@/data/solution";
import { IndustryPages as staticIndustryPages } from "@/data/industry";
import { ServicePages as staticServicePages } from "@/data/services";
import { homeData as staticHomeData } from "@/data/homedata";

// Clean empty values helper
function cleanEmpty(obj: any): any {
  if (Array.isArray(obj)) {
    const items = obj.map(cleanEmpty).filter((v) => v !== null && v !== undefined);
    return items.length > 0 ? items : null;
  }
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      const value = cleanEmpty(obj[key]);
      if (value !== null && value !== undefined && value !== "") {
        result[key] = value;
      }
    });
    return Object.keys(result).length > 0 ? result : null;
  }
  return obj;
}

// Fetch sections helper
async function fetchServiceSections(serviceSlug: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/services/${serviceSlug}/sections?locale=en&stage=published`);
    if (!res.ok) return [];
    const payload = await res.json();
    return payload.data?.sections ?? [];
  } catch {
    return [];
  }
}

// Card lists element mappers
function mapBlogPost(post: any) {
  return {
    title: post.title,
    excerpt: post.excerpt ?? "",
    content: post.content,
    image: post.featured_image ?? "",
    featured: post.status === "published",
    slug: post.slug,
    date: post.published_at ? post.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
    tags: post.tags ?? [],
  };
}

function mapTool(t: any) {
  const tagsArray: string[] = [];
  if (t.pricing_model) tagsArray.push(`${t.pricing_model} price`);
  if (t.docs_url) tagsArray.push(`Rating of ${t.docs_url}`);
  return {
    title: t.name,
    description: t.tagline || t.overview || "",
    icon: t.logo_url || "",
    badge: t.category?.name || "Software",
    tags: tagsArray.length > 0 ? tagsArray : null,
    href: t.website_url || "",
    is_featured: t.is_featured,
    status: t.status,
  };
}

function mapSolution(s: any) {
  return {
    title: s.name,
    description: s.tagline || s.problem_statement || s.solution_summary || "",
    icon: s.workflow_description || "BriefcaseBusiness",
    badge: s.industry?.name || "Business",
    tags: s.key_benefits ?? [],
    href: `/solutions/${s.slug}`,
    is_featured: s.technical_requirements === "featured",
    status: s.status,
  };
}

// Service page helper mapper (same as solution card)
function mapService(s: any) {
  return {
    title: s.name,
    description: s.tagline || s.problem_statement || s.solution_summary || "",
    icon: s.workflow_description || "BriefcaseBusiness",
    badge: s.industry?.name || "Business",
    tags: s.key_benefits ?? [],
    href: `/services/${s.slug}`,
    is_featured: s.technical_requirements === "featured",
    status: s.status,
  };
}

function mapIndustry(ind: any) {
  return {
    title: ind.name,
    description: ind.description || "",
    icon: ind.icon || "Building",
    badge: ind.name,
    tags: ind.pain_points ?? [],
    href: `/industries/${ind.slug}`,
    is_featured: ind.is_featured,
    status: ind.status,
  };
}

function mapComparison(c: any) {
  const leftPoints = c.quick_verdict
    ? c.quick_verdict.split("\n").map((p: any) => p.trim()).filter(Boolean)
    : [];
  const rightPoints = c.recommendation
    ? c.recommendation.split("\n").map((p: any) => p.trim()).filter(Boolean)
    : [];
  return {
    tag: c.intro_content?.replace(/^\*featured\*\s*/, "").trim() || "General",
    title: c.title,
    description: c.subtitle || "",
    comparison: {
      leftHeading: c.entities?.[0]?.tag || "Left Option",
      rightHeading: c.entities?.[1]?.tag || "Right Option",
      leftPoints: leftPoints.length > 0 ? leftPoints : null,
      rightPoints: rightPoints.length > 0 ? rightPoints : null,
    },
    href: `/solutions/${c.slug}`,
    is_featured: (c.intro_content ?? "").startsWith("*featured*"),
    status: c.status,
  };
}

function mapCaseStudy(s: any) {
  const tagsArray = s.results_summary
    ? s.results_summary.split("\n").map((t: any) => t.trim()).filter(Boolean)
    : [];
  return {
    title: s.title,
    excerpt: s.challenge || "",
    content: s.solution || "",
    image: s.featured_image_url || "",
    featured: !!s.is_featured,
    slug: s.slug,
    date: s.timeline || "2026-06-15",
    tags: tagsArray.length > 0 ? tagsArray : [s.client_industry ?? "General"],
    status: s.status,
  };
}

function mapFreeTool(t: any) {
  const config = t.config ?? {};
  return {
    title: t.name,
    description: t.description || "",
    icon: config.icon || "Wrench",
    badge: config.badge || "Utility",
    href: config.href || `https://google.com`,
    is_featured: config.is_featured || false,
    status: t.is_active ? "published" : "draft",
  };
}

// Fetch Dynamic Directory Page Settings (replaces getDataHub keys)
export async function fetchDataHubSection(key: string): Promise<any> {
  const sections = await fetchServiceSections(key);
  if (sections.length === 0) return null;

  const rootSec = sections.find((s) => s.section_key === key);
  const heroSec = sections.find((s) => s.section_key === "hero");
  const statsSec = sections.find((s) => s.section_key === "stats");
  const featuredSec = sections.find((s) => s.section_key === "highlights" || s.section_key === "featured");
  const directorySec = sections.find((s) => s.section_key === "overview" || s.section_key === "directory");
  const benefitsSec = sections.find((s) => s.section_key === "benefits");
  const faqSec = sections.find((s) => s.section_key === "faq");
  const ctaSec = sections.find((s) => s.section_key === "cta");
  const blogsSec = sections.find((s) => s.section_key === "blogs");
  const itemsSec = sections.find((s) => s.section_key === "items");

  const ctaItem = ctaSec?.items?.[0] ?? {};

  // Fetch list entities based on directory key
  let mappedItems: any[] = [];
  if (key === "solutions") {
    try {
      const res = await fetch(`${API_BASE_URL}/solutions?per_page=100`);
      if (res.ok) {
        const payload = await res.json();
        const rawSolutions = payload.data?.data ?? [];
        mappedItems = rawSolutions.map(mapSolution);
      }
    } catch {}
  } else if (key === "industries") {
    try {
      const res = await fetch(`${API_BASE_URL}/industries?per_page=100`);
      if (res.ok) {
        const payload = await res.json();
        mappedItems = (payload.data ?? []).map(mapIndustry);
      }
    } catch {}
  } else if (key === "tools") {
    try {
      const res = await fetch(`${API_BASE_URL}/tools?per_page=100`);
      if (res.ok) {
        const payload = await res.json();
        mappedItems = (payload.data?.data ?? []).map(mapTool);
      }
    } catch {}
  } else if (key === "blogs") {
    try {
      const res = await fetch(`${API_BASE_URL}/blog-posts?per_page=100`);
      if (res.ok) {
        const payload = await res.json();
        mappedItems = (payload.data?.data ?? []).map(mapBlogPost);
      }
    } catch {}
  } else if (key === "case-studies") {
    try {
      const res = await fetch(`${API_BASE_URL}/case-studies?per_page=100`);
      if (res.ok) {
        const payload = await res.json();
        mappedItems = (payload.data?.data ?? []).map(mapCaseStudy);
      }
    } catch {}
  } else if (key === "free-tools") {
    try {
      const res = await fetch(`${API_BASE_URL}/free-tools?per_page=100`);
      if (res.ok) {
        const payload = await res.json();
        mappedItems = (payload.data?.data ?? []).map(mapFreeTool);
      }
    } catch {}
  } else if (key === "comparisons") {
    try {
      const res = await fetch(`${API_BASE_URL}/compare?per_page=100`);
      if (res.ok) {
        const payload = await res.json();
        mappedItems = (payload.data?.data ?? []).map(mapComparison);
      }
    } catch {}
  }

  // Filter list by status / featured if needed (directory maps to all active, featured maps to featured)
  const activeItems = mappedItems.filter((i: any) => i.status === "published" || i.status === undefined);
  const featuredItems = mappedItems.filter((i: any) => (i.is_featured || i.featured) && (i.status === "published" || i.status === undefined));

  // Strip database internal attributes
  const cleanActiveItems = activeItems.map(({ is_featured, status, featured, ...rest }: any) => rest);
  const cleanFeaturedItems = featuredItems.map(({ is_featured, status, featured, ...rest }: any) => rest);

  return cleanEmpty({
    section_key: key,
    tag: rootSec?.is_active ? rootSec.tag : null,
    subheading1: rootSec?.is_active ? rootSec.heading : null,
    subheading2: rootSec?.is_active ? rootSec.subheading : null,
    subtext: rootSec?.is_active ? rootSec.subtext : null,
    hero: heroSec?.is_active ? {
      tag: heroSec.tag?.trim() || null,
      title1: heroSec.heading?.trim() || null,
      title2: heroSec.subheading?.trim() || null,
      description: heroSec.subtext?.trim() || null,
    } : null,
    stats: statsSec?.is_active ? statsSec.items : null,
    featured: featuredSec?.is_active ? {
      tag: featuredSec.tag?.trim() || null,
      subheading1: featuredSec.heading?.trim() || null,
      subheading2: featuredSec.subheading?.trim() || null,
      subtext: featuredSec.subtext?.trim() || null,
      items: cleanFeaturedItems.length > 0 ? cleanFeaturedItems : null,
    } : null,
    directory: directorySec?.is_active ? {
      tag: directorySec.tag?.trim() || null,
      subheading1: directorySec.heading?.trim() || null,
      subheading2: directorySec.subheading?.trim() || null,
      subtext: directorySec.subtext?.trim() || null,
      items: cleanActiveItems.length > 0 ? cleanActiveItems : null,
    } : null,
    benefits: benefitsSec?.is_active ? {
      tag: benefitsSec.tag?.trim() || null,
      subheading1: benefitsSec.heading?.trim() || null,
      subheading2: benefitsSec.subheading?.trim() || null,
      subtext: benefitsSec.subtext?.trim() || null,
      items: benefitsSec.items,
    } : null,
    faq: faqSec?.is_active ? {
      tag: faqSec.tag?.trim() || null,
      subheading1: faqSec.heading?.trim() || null,
      subheading2: faqSec.subheading?.trim() || null,
      subtext: faqSec.subtext?.trim() || null,
      items: faqSec.items.map((q: any) => ({ question: q.question, answer: q.answer })),
    } : null,
    items: (blogsSec?.is_active || itemsSec?.is_active) && cleanActiveItems.length > 0 ? cleanActiveItems : null,
    cta: ctaSec?.is_active ? {
      preview: {
        text: ctaItem.cta_preview_text?.trim() || null,
        url: ctaItem.cta_preview_url?.trim() || null,
      },
      full: {
        description: ctaItem.cta_full_description?.trim() || null,
        text: ctaItem.cta_full_text?.trim() || null,
        url: ctaItem.cta_full_url?.trim() || null,
      },
    } : null,
  });
}

// Fetch Dynamic Solution Single Page (replaces solutionPages array values)
export async function fetchSolutionPage(slug: string): Promise<any> {
  const sections = await fetchServiceSections(slug);
  if (sections.length === 0) return null;

  const rootSec = sections.find((s) => s.section_key === "solutions");
  const seoSec = sections.find((s) => s.section_key === "seo");
  const heroSec = sections.find((s) => s.section_key === "hero");
  const overviewSec = sections.find((s) => s.section_key === "overview");
  const statsSec = sections.find((s) => s.section_key === "stats");
  const highlightsSec = sections.find((s) => s.section_key === "highlights");
  const benefitsSec = sections.find((s) => s.section_key === "benefits");
  const relatedSec = sections.find((s) => s.section_key === "related");
  const faqSec = sections.find((s) => s.section_key === "faq");
  const ctaSec = sections.find((s) => s.section_key === "cta");

  const ctaItem = ctaSec?.items?.[0] ?? {};
  const seoItem = seoSec?.items?.[0] ?? {};

  return cleanEmpty({
    slug: slug,
    seo: seoSec?.is_active ? {
      title: seoItem.title?.trim() || null,
      description: seoItem.description?.trim() || null,
      keywords: typeof seoItem.keywords === "string"
        ? seoItem.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
        : (Array.isArray(seoItem.keywords) ? seoItem.keywords : []),
      image: seoItem.image?.trim() || null,
      path: seoItem.path?.trim() || null,
    } : null,
    hero: heroSec?.is_active ? {
      tag: heroSec.tag?.trim() || null,
      title1: heroSec.heading?.trim() || null,
      title2: heroSec.subheading?.trim() || null,
      description: heroSec.subtext?.trim() || null,
    } : null,
    tag: rootSec?.is_active ? rootSec.tag : null,
    subheading1: rootSec?.is_active ? rootSec.heading : null,
    subheading2: rootSec?.is_active ? rootSec.subheading : null,
    subtext: rootSec?.is_active ? rootSec.subtext : null,
    overview: overviewSec?.is_active ? overviewSec.items.map((item: any) => ({
      title: item.title?.trim() || null,
      description: item.description?.trim() || null,
    })) : null,
    stats: statsSec?.is_active ? statsSec.items.map((item: any) => ({
      icon: item.icon?.trim() || null,
      value: item.value?.trim() || null,
      title: item.title?.trim() || null,
    })) : null,
    highlights: highlightsSec?.is_active ? {
      tag: highlightsSec.tag?.trim() || null,
      subheading1: highlightsSec.heading?.trim() || null,
      subheading2: highlightsSec.subheading?.trim() || null,
      subtext: highlightsSec.subtext?.trim() || null,
      items: highlightsSec.items.map((item: any) => ({
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
        icon: item.icon?.trim() || null,
      })),
    } : null,
    benefits: benefitsSec?.is_active ? {
      tag: benefitsSec.tag?.trim() || null,
      subheading1: benefitsSec.heading?.trim() || null,
      subheading2: benefitsSec.subheading?.trim() || null,
      subtext: benefitsSec.subtext?.trim() || null,
      items: benefitsSec.items.map((item: any) => ({
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
        icon: item.icon?.trim() || null,
      })),
    } : null,
    related: relatedSec?.is_active ? {
      tag: relatedSec.tag?.trim() || null,
      subheading1: relatedSec.heading?.trim() || null,
      subheading2: relatedSec.subheading?.trim() || null,
      subtext: relatedSec.subtext?.trim() || null,
      items: relatedSec.items.map((item: any) => ({
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
        icon: item.icon?.trim() || null,
        badge: item.badge?.trim() || null,
        tags: typeof item.tags === "string"
          ? item.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : (Array.isArray(item.tags) ? item.tags : []),
        href: item.href?.trim() || null,
      })),
    } : null,
    faq: faqSec?.is_active ? {
      tag: faqSec.tag?.trim() || null,
      subheading1: faqSec.heading?.trim() || null,
      subheading2: faqSec.subheading?.trim() || null,
      subtext: faqSec.subtext?.trim() || null,
      items: faqSec.items.map((q: any) => ({
        question: q.question?.trim() || null,
        answer: q.answer?.trim() || null,
      })),
    } : null,
    cta: ctaSec?.is_active ? {
      preview: {
        text: ctaItem.cta_preview_text?.trim() || null,
        url: ctaItem.cta_preview_url?.trim() || null,
      },
      full: {
        description: ctaItem.cta_full_description?.trim() || null,
        text: ctaItem.cta_full_text?.trim() || null,
        url: ctaItem.cta_full_url?.trim() || null,
      },
    } : null,
  });
}

// Fetch Dynamic Industry Single Page (replaces IndustryPages array values)
export async function fetchIndustryPage(slug: string): Promise<any> {
  const sections = await fetchServiceSections(slug);
  if (sections.length === 0) return null;

  const rootSec = sections.find((s) => s.section_key === "industries");
  const seoSec = sections.find((s) => s.section_key === "seo");
  const heroSec = sections.find((s) => s.section_key === "hero");
  const overviewSec = sections.find((s) => s.section_key === "overview");
  const statsSec = sections.find((s) => s.section_key === "stats");
  const highlightsSec = sections.find((s) => s.section_key === "highlights");
  const benefitsSec = sections.find((s) => s.section_key === "benefits");
  const relatedSec = sections.find((s) => s.section_key === "related");
  const faqSec = sections.find((s) => s.section_key === "faq");
  const ctaSec = sections.find((s) => s.section_key === "cta");

  const ctaItem = ctaSec?.items?.[0] ?? {};
  const seoItem = seoSec?.items?.[0] ?? {};

  return cleanEmpty({
    slug: slug,
    seo: seoSec?.is_active ? {
      title: seoItem.title?.trim() || null,
      description: seoItem.description?.trim() || null,
      keywords: typeof seoItem.keywords === "string"
        ? seoItem.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
        : (Array.isArray(seoItem.keywords) ? seoItem.keywords : []),
      image: seoItem.image?.trim() || null,
      path: seoItem.path?.trim() || null,
    } : null,
    hero: heroSec?.is_active ? {
      tag: heroSec.tag?.trim() || null,
      title1: heroSec.heading?.trim() || null,
      title2: heroSec.subheading?.trim() || null,
      description: heroSec.subtext?.trim() || null,
    } : null,
    tag: rootSec?.is_active ? rootSec.tag : null,
    subheading1: rootSec?.is_active ? rootSec.heading : null,
    subheading2: rootSec?.is_active ? rootSec.subheading : null,
    subtext: rootSec?.is_active ? rootSec.subtext : null,
    overview: overviewSec?.is_active ? overviewSec.items.map((item: any) => ({
      title: item.title?.trim() || null,
      description: item.description?.trim() || null,
    })) : null,
    stats: statsSec?.is_active ? statsSec.items.map((item: any) => ({
      icon: item.icon?.trim() || null,
      value: item.value?.trim() || null,
      title: item.title?.trim() || null,
    })) : null,
    highlights: highlightsSec?.is_active ? {
      tag: highlightsSec.tag?.trim() || null,
      subheading1: highlightsSec.heading?.trim() || null,
      subheading2: highlightsSec.subheading?.trim() || null,
      subtext: highlightsSec.subtext?.trim() || null,
      items: highlightsSec.items.map((item: any) => ({
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
        icon: item.icon?.trim() || null,
      })),
    } : null,
    benefits: benefitsSec?.is_active ? {
      tag: benefitsSec.tag?.trim() || null,
      subheading1: benefitsSec.heading?.trim() || null,
      subheading2: benefitsSec.subheading?.trim() || null,
      subtext: benefitsSec.subtext?.trim() || null,
      items: benefitsSec.items.map((item: any) => ({
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
        icon: item.icon?.trim() || null,
      })),
    } : null,
    related: relatedSec?.is_active ? {
      tag: relatedSec.tag?.trim() || null,
      subheading1: relatedSec.heading?.trim() || null,
      subheading2: relatedSec.subheading?.trim() || null,
      subtext: relatedSec.subtext?.trim() || null,
      items: relatedSec.items.map((item: any) => ({
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
        icon: item.icon?.trim() || null,
        badge: item.badge?.trim() || null,
        tags: typeof item.tags === "string"
          ? item.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : (Array.isArray(item.tags) ? item.tags : []),
        href: item.href?.trim() || null,
      })),
    } : null,
    faq: faqSec?.is_active ? {
      tag: faqSec.tag?.trim() || null,
      subheading1: faqSec.heading?.trim() || null,
      subheading2: faqSec.subheading?.trim() || null,
      subtext: faqSec.subtext?.trim() || null,
      items: faqSec.items.map((q: any) => ({
        question: q.question?.trim() || null,
        answer: q.answer?.trim() || null,
      })),
    } : null,
    cta: ctaSec?.is_active ? {
      preview: {
        text: ctaItem.cta_preview_text?.trim() || null,
        url: ctaItem.cta_preview_url?.trim() || null,
      },
      full: {
        description: ctaItem.cta_full_description?.trim() || null,
        text: ctaItem.cta_full_text?.trim() || null,
        url: ctaItem.cta_full_url?.trim() || null,
      },
    } : null,
  });
}

// Fetch Dynamic Service Single Page (replaces ServicePages array values)
export async function fetchServicePage(slug: string): Promise<any> {
  const sections = await fetchServiceSections(slug);
  if (sections.length === 0) return null;

  const rootSec = sections.find((s) => s.section_key === "services" || s.section_key === slug);
  const seoSec = sections.find((s) => s.section_key === "seo");
  const heroSec = sections.find((s) => s.section_key === "hero");
  const overviewSec = sections.find((s) => s.section_key === "overview");
  const statsSec = sections.find((s) => s.section_key === "stats");
  const highlightsSec = sections.find((s) => s.section_key === "highlights");
  const benefitsSec = sections.find((s) => s.section_key === "benefits");
  const relatedSec = sections.find((s) => s.section_key === "related");
  const faqSec = sections.find((s) => s.section_key === "faq");
  const ctaSec = sections.find((s) => s.section_key === "cta");

  const ctaItem = ctaSec?.items?.[0] ?? {};
  const seoItem = seoSec?.items?.[0] ?? {};

  return cleanEmpty({
    slug: slug,
    seo: seoSec?.is_active ? {
      title: seoItem.title?.trim() || null,
      description: seoItem.description?.trim() || null,
      keywords: typeof seoItem.keywords === "string"
        ? seoItem.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
        : (Array.isArray(seoItem.keywords) ? seoItem.keywords : []),
      image: seoItem.image?.trim() || null,
      path: seoItem.path?.trim() || null,
    } : null,
    hero: heroSec?.is_active ? {
      tag: heroSec.tag?.trim() || null,
      title1: heroSec.heading?.trim() || null,
      title2: heroSec.subheading?.trim() || null,
      description: heroSec.subtext?.trim() || null,
    } : null,
    tag: rootSec?.is_active ? rootSec.tag : null,
    subheading1: rootSec?.is_active ? rootSec.heading : null,
    subheading2: rootSec?.is_active ? rootSec.subheading : null,
    subtext: rootSec?.is_active ? rootSec.subtext : null,
    overview: overviewSec?.is_active ? overviewSec.items.map((item: any) => ({
      title: item.title?.trim() || null,
      description: item.description?.trim() || null,
    })) : null,
    stats: statsSec?.is_active ? statsSec.items.map((item: any) => ({
      icon: item.icon?.trim() || null,
      value: item.value?.trim() || null,
      title: item.title?.trim() || null,
    })) : null,
    highlights: highlightsSec?.is_active ? {
      tag: highlightsSec.tag?.trim() || null,
      subheading1: highlightsSec.heading?.trim() || null,
      subheading2: highlightsSec.subheading?.trim() || null,
      subtext: highlightsSec.subtext?.trim() || null,
      items: highlightsSec.items.map((item: any) => ({
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
        icon: item.icon?.trim() || null,
      })),
    } : null,
    benefits: benefitsSec?.is_active ? {
      tag: benefitsSec.tag?.trim() || null,
      subheading1: benefitsSec.heading?.trim() || null,
      subheading2: benefitsSec.subheading?.trim() || null,
      subtext: benefitsSec.subtext?.trim() || null,
      items: benefitsSec.items.map((item: any) => ({
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
        icon: item.icon?.trim() || null,
      })),
    } : null,
    related: relatedSec?.is_active ? {
      tag: relatedSec.tag?.trim() || null,
      subheading1: relatedSec.heading?.trim() || null,
      subheading2: relatedSec.subheading?.trim() || null,
      subtext: relatedSec.subtext?.trim() || null,
      items: relatedSec.items.map((item: any) => ({
        title: item.title?.trim() || null,
        description: item.description?.trim() || null,
        icon: item.icon?.trim() || null,
        badge: item.badge?.trim() || null,
        tags: typeof item.tags === "string"
          ? item.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : (Array.isArray(item.tags) ? item.tags : []),
        href: item.href?.trim() || null,
      })),
    } : null,
    faq: faqSec?.is_active ? {
      tag: faqSec.tag?.trim() || null,
      subheading1: faqSec.heading?.trim() || null,
      subheading2: faqSec.subheading?.trim() || null,
      subtext: faqSec.subtext?.trim() || null,
      items: faqSec.items.map((q: any) => ({
        question: q.question?.trim() || null,
        answer: q.answer?.trim() || null,
      })),
    } : null,
    cta: ctaSec?.is_active ? {
      preview: {
        text: ctaItem.cta_preview_text?.trim() || null,
        url: ctaItem.cta_preview_url?.trim() || null,
      },
      full: {
        description: ctaItem.cta_full_description?.trim() || null,
        text: ctaItem.cta_full_text?.trim() || null,
        url: ctaItem.cta_full_url?.trim() || null,
      },
    } : null,
  });
}

function mapContentPageSections(page: any): Record<string, any> {
  const sectionsMap: Record<string, any> = {};
  if (!page || !page.sections) return sectionsMap;

  const rawSections = page.sections;
  const comparisonSec = rawSections.find((s: any) => s.section_key === "comparison");
  const ctaSec = rawSections.find((s: any) => s.section_key === "cta");

  // Construct common CTA mapping
  const ctaItem = ctaSec?.items?.[0] ?? {};
  const mappedCta = {
    section_key: "cta",
    preview: {
      text: ctaItem.cta_preview_text || ctaItem.preview_text || ctaItem.preview?.text || null,
      url: ctaItem.cta_preview_url || ctaItem.preview_url || ctaItem.preview?.url || null,
    },
    full: {
      description: ctaItem.cta_full_description || ctaItem.full_description || ctaItem.full?.description || null,
      text: ctaItem.cta_full_text || ctaItem.full_text || ctaItem.full?.text || null,
      url: ctaItem.cta_full_url || ctaItem.full_url || ctaItem.full?.url || null,
    }
  };

  rawSections.forEach((sec: any) => {
    if (sec.is_visible === false) return;

    const secKey = sec.section_key;

    // Default basic mapping
    const baseSection: any = {
      section_key: secKey,
      tag: sec.tag || sec.data?.tag || null,
      subheading1: sec.subheading1 || sec.heading || sec.title || sec.data?.heading || null,
      subheading2: sec.subheading2 || sec.subheading || sec.content || sec.data?.subheading || null,
      subtext: sec.subtext || sec.description || sec.data?.subtext || null,
      header: {
        tag: sec.tag || sec.data?.tag || null,
        subheading1: sec.subheading1 || sec.heading || sec.title || sec.data?.heading || null,
        subheading2: sec.subheading2 || sec.subheading || sec.content || sec.data?.subheading || null,
        subtext: sec.subtext || sec.description || sec.data?.subtext || null,
      },
      items: (sec.items || []).map((item: any) => {
        let resultsArray: string[] = [];
        if (Array.isArray(item.results)) resultsArray = item.results;
        else if (typeof item.results === "string") resultsArray = item.results.split("\n").map((r: string) => r.trim()).filter(Boolean);
        else if (item.resultsText) resultsArray = item.resultsText.split("\n").map((r: string) => r.trim()).filter(Boolean);

        let tagsArray: string[] = [];
        if (Array.isArray(item.tags)) tagsArray = item.tags;
        else if (typeof item.tags === "string") tagsArray = item.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
        else if (item.tagsText) tagsArray = item.tagsText.split(",").map((t: string) => t.trim()).filter(Boolean);

        return {
          ...item,
          icon: item.icon || "Check",
          number: item.number || "",
          title: item.title || item.question || item.name || "",
          description: item.description || item.answer || item.content || item.text || "",
          text: item.text || item.description || "",
          url: item.url || item.href || item.project_url || "",
          results: resultsArray,
          tags: tagsArray,
        };
      }),
      cta: mappedCta,
    };

    // Merge comparison details if available in the section itself or from the standalone comparison section
    const selfComparison = sec.data?.comparison || sec.comparison;
    if (selfComparison) {
      baseSection["comparison"] = {
        leftHeading: selfComparison.leftHeading || selfComparison.left_heading || null,
        rightHeading: selfComparison.rightHeading || selfComparison.right_heading || null,
        leftPoints: selfComparison.leftPoints || selfComparison.left_points || null,
        rightPoints: selfComparison.rightPoints || selfComparison.right_points || null,
      };
    } else if (comparisonSec) {
      baseSection["comparison"] = {
        leftHeading: comparisonSec.left_heading || comparisonSec.data?.leftHeading || null,
        rightHeading: comparisonSec.right_heading || comparisonSec.data?.rightHeading || null,
        leftPoints: comparisonSec.left_points || comparisonSec.data?.leftPoints || null,
        rightPoints: comparisonSec.right_points || comparisonSec.data?.rightPoints || null,
      };
    }

    sectionsMap[secKey] = baseSection;
  });

  // Fallback alias mappings for legacy compatibility
  if (sectionsMap["whyus"]) {
    sectionsMap["why-choose"] = sectionsMap["whyus"];
  }
  if (sectionsMap["why-choose"]) {
    sectionsMap["whyus"] = sectionsMap["why-choose"];
  }
  if (sectionsMap["result"]) {
    sectionsMap["portfolio"] = sectionsMap["result"];
  }
  if (sectionsMap["portfolio"]) {
    sectionsMap["result"] = sectionsMap["portfolio"];
  }
  if (sectionsMap["review"]) {
    sectionsMap["testimonials"] = sectionsMap["review"];
  }
  if (sectionsMap["testimonials"]) {
    sectionsMap["review"] = sectionsMap["testimonials"];
  }
  if (sectionsMap["services-grid"]) {
    sectionsMap["services"] = sectionsMap["services-grid"];
  }
  if (sectionsMap["services"]) {
    sectionsMap["services-grid"] = sectionsMap["services"];
  }

  return sectionsMap;
}

// Fetch Dynamic Content Pages sections (replaces homedata.ts sections)
export async function fetchHomeData(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/content-pages?format=compiled`);
    if (!res.ok) return null;
    const payload = await res.json();
    const compiledData = payload.data ?? {};

    const mappedPages: Record<string, any> = {};

    // Loop through all pages in the compiled response
    Object.keys(compiledData).forEach((slug) => {
      const rawSectionsMap = compiledData[slug] || {};
      const normalizedSections: Record<string, any> = {};

      const comparisonSec = Object.values(rawSectionsMap).find((s: any) => s.section_key === "comparison") as any;
      const ctaSec = Object.values(rawSectionsMap).find((s: any) => s.section_key === "cta") as any;
      const ctaItem = ctaSec?.items?.[0] ?? {};
      const mappedCta = {
        section_key: "cta",
        preview: {
          text: ctaItem.cta_preview_text || ctaItem.preview_text || ctaItem.preview?.text || null,
          url: ctaItem.cta_preview_url || ctaItem.preview_url || ctaItem.preview?.url || null,
        },
        full: {
          description: ctaItem.cta_full_description || ctaItem.full_description || ctaItem.full?.description || null,
          text: ctaItem.cta_full_text || ctaItem.full_text || ctaItem.full?.text || null,
          url: ctaItem.cta_full_url || ctaItem.full_url || ctaItem.full?.url || null,
        }
      };

      Object.keys(rawSectionsMap).forEach((secKey) => {
        const sec = rawSectionsMap[secKey];
        if (!sec) return;

        const baseSection: any = {
          section_key: secKey,
          tag: sec.tag || sec.data?.tag || null,
          subheading1: sec.subheading1 || sec.heading || sec.title || sec.data?.heading || null,
          subheading2: sec.subheading2 || sec.subheading || sec.content || sec.data?.subheading || null,
          subtext: sec.subtext || sec.description || sec.data?.subtext || null,
          header: {
            tag: sec.tag || sec.data?.tag || null,
            subheading1: sec.subheading1 || sec.heading || sec.title || sec.data?.heading || null,
            subheading2: sec.subheading2 || sec.subheading || sec.content || sec.data?.subheading || null,
            subtext: sec.subtext || sec.description || sec.data?.subtext || null,
          },
          items: (sec.items || []).map((item: any) => {
            let resultsArray: string[] = [];
            if (Array.isArray(item.results)) resultsArray = item.results;
            else if (typeof item.results === "string") resultsArray = item.results.split("\n").map((r: string) => r.trim()).filter(Boolean);
            else if (item.resultsText) resultsArray = item.resultsText.split("\n").map((r: string) => r.trim()).filter(Boolean);

            let tagsArray: string[] = [];
            if (Array.isArray(item.tags)) tagsArray = item.tags;
            else if (typeof item.tags === "string") tagsArray = item.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
            else if (item.tagsText) tagsArray = item.tagsText.split(",").map((t: string) => t.trim()).filter(Boolean);

            return {
              ...item,
              icon: item.icon || "Check",
              number: item.number || "",
              title: item.title || item.question || item.name || "",
              description: item.description || item.answer || item.content || item.text || "",
              text: item.text || item.description || "",
              url: item.url || item.href || item.project_url || "",
              results: resultsArray,
              tags: tagsArray,
            };
          }),
          cta: mappedCta,
        };

        // Merge comparison details
        const selfComparison = sec.data?.comparison || sec.comparison;
        if (selfComparison) {
          baseSection["comparison"] = {
            leftHeading: selfComparison.leftHeading || selfComparison.left_heading || null,
            rightHeading: selfComparison.rightHeading || selfComparison.right_heading || null,
            leftPoints: selfComparison.leftPoints || selfComparison.left_points || null,
            rightPoints: selfComparison.rightPoints || selfComparison.right_points || null,
          };
        } else if (comparisonSec) {
          baseSection["comparison"] = {
            leftHeading: comparisonSec.left_heading || comparisonSec.data?.leftHeading || null,
            rightHeading: comparisonSec.right_heading || comparisonSec.data?.rightHeading || null,
            leftPoints: comparisonSec.left_points || comparisonSec.data?.leftPoints || null,
            rightPoints: comparisonSec.right_points || comparisonSec.data?.rightPoints || null,
          };
        }

        normalizedSections[secKey] = baseSection;
      });

      // Alias mappings
      if (normalizedSections["whyus"]) {
        normalizedSections["why-choose"] = normalizedSections["whyus"];
      }
      if (normalizedSections["why-choose"]) {
        normalizedSections["whyus"] = normalizedSections["why-choose"];
      }
      if (normalizedSections["result"]) {
        normalizedSections["portfolio"] = normalizedSections["result"];
      }
      if (normalizedSections["portfolio"]) {
        normalizedSections["result"] = normalizedSections["portfolio"];
      }
      if (normalizedSections["review"]) {
        normalizedSections["testimonials"] = normalizedSections["review"];
      }
      if (normalizedSections["testimonials"]) {
        normalizedSections["review"] = normalizedSections["testimonials"];
      }
      if (normalizedSections["services-grid"]) {
        normalizedSections["services"] = normalizedSections["services-grid"];
      }
      if (normalizedSections["services"]) {
        normalizedSections["services-grid"] = normalizedSections["services"];
      }

      // Store in mappedPages by original slug
      mappedPages[slug] = normalizedSections;

      // Store by normalized aliases
      if (slug === "home" || slug === "homepage" || slug === "/") {
        mappedPages["/"] = normalizedSections;
        mappedPages["home"] = normalizedSections;
      }
      if (slug === "data" || slug === "datahub" || slug === "/datahub" || slug === "/data") {
        mappedPages["/datahub"] = normalizedSections;
        mappedPages["/data"] = normalizedSections;
        mappedPages["data"] = normalizedSections;
        mappedPages["datahub"] = normalizedSections;
      }
      if (slug === "contact" || slug === "contact-us" || slug === "/contact" || slug === "/contact-us") {
        mappedPages["/contact"] = normalizedSections;
        mappedPages["/contact-us"] = normalizedSections;
        mappedPages["contact"] = normalizedSections;
        mappedPages["contact-us"] = normalizedSections;
      }
      if (slug === "privacy" || slug === "privacy-policy" || slug === "/privacy" || slug === "/privacy-policy") {
        mappedPages["/privacy"] = normalizedSections;
        mappedPages["/privacy-policy"] = normalizedSections;
        mappedPages["privacy"] = normalizedSections;
        mappedPages["privacy-policy"] = normalizedSections;
      }
      if (slug === "terms" || slug === "terms-of-service" || slug === "/terms" || slug === "/terms-of-service") {
        mappedPages["/terms"] = normalizedSections;
        mappedPages["/terms-of-service"] = normalizedSections;
        mappedPages["terms"] = normalizedSections;
        mappedPages["terms-of-service"] = normalizedSections;
      }

      let pathKey = slug;
      if (!pathKey.startsWith("/") && pathKey !== "") {
        pathKey = "/" + pathKey;
      }
      mappedPages[pathKey] = normalizedSections;
    });

    cachedContentPages = mappedPages;

    const homeSections = mappedPages["/"] || {};
    return {
      sections: Object.values(homeSections),
    };
  } catch (e) {
    console.error("fetchHomeData error:", e);
    return null;
  }
}

// Helper fetchers to compile lists of all solution and industry pages
export async function fetchAllSolutionPages(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/solutions?per_page=100`);
    if (!res.ok) return [];
    const payload = await res.json();
    const solutionsList = payload.data?.data ?? [];
    const pages = await Promise.all(
      solutionsList.map(async (s: any) => {
        return await fetchSolutionPage(s.slug);
      })
    );
    return pages.filter(Boolean);
  } catch {
    return [];
  }
}

export async function fetchAllIndustryPages(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/industries?per_page=100`);
    if (!res.ok) return [];
    const payload = await res.json();
    const industriesList = payload.data ?? [];
    const pages = await Promise.all(
      industriesList.map(async (ind: any) => {
        return await fetchIndustryPage(ind.slug);
      })
    );
    return pages.filter(Boolean);
  } catch {
    return [];
  }
}

export async function fetchAllServicePages(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/services?per_page=100`);
    if (!res.ok) return [];
    const payload = await res.json();
    const servicesList = payload.data?.data ?? [];
    const regularServices = servicesList.filter((s: any) => {
      const slug = s.slug;
      return (
        slug !== "home" &&
        slug !== "blogs" &&
        slug !== "tools" &&
        slug !== "solutions" &&
        slug !== "industries" &&
        slug !== "comparisons" &&
        slug !== "case-studies" &&
        slug !== "free-tools"
      );
    });
    const pages = await Promise.all(
      regularServices.map(async (s: any) => {
        return await fetchServicePage(s.slug);
      })
    );
    return pages.filter(Boolean);
  } catch {
    return [];
  }
}

// ========================================================
// Cache Initialization and Sync Exports
// ========================================================

const cachedDataHub: Record<string, any> = {};
let cachedContentPages: Record<string, Record<string, any>> = {};
let cachedSolutionPages: any[] = [];
let cachedIndustryPages: any[] = [];
let cachedServicePages: any[] = [];
let cachedHomeData: any = null;

// Modules fetch and cache populate on module load (top-level await)
try {
  const keys = ["hub", "blogs", "tools", "solutions", "industries", "comparisons", "case-studies", "free-tools"];
  const results = await Promise.all(
    keys.map(async (key) => {
      try {
        const sec = await fetchDataHubSection(key);
        return { key, sec };
      } catch {
        return { key, sec: null };
      }
    })
  );
  results.forEach(({ key, sec }) => {
    if (sec) {
      cachedDataHub[key] = sec;
    }
  });
} catch (e) {
  console.warn("Failed to pre-fetch dynamic datahub sections:", e);
}

try {
  cachedSolutionPages = await fetchAllSolutionPages();
} catch (e) {
  console.warn("Failed to pre-fetch solution pages:", e);
}

try {
  cachedIndustryPages = await fetchAllIndustryPages();
} catch (e) {
  console.warn("Failed to pre-fetch industry pages:", e);
}

try {
  cachedServicePages = await fetchAllServicePages();
} catch (e) {
  console.warn("Failed to pre-fetch service pages:", e);
}

try {
  cachedHomeData = await fetchHomeData();
} catch (e) {
  console.warn("Failed to pre-fetch home data:", e);
}

// Synchronous exports matching static structure APIs with live-merged caching
export function getDataHub(key: string): any {
  const dynamicSec = cachedDataHub[key];
  if (dynamicSec) return dynamicSec;
  return getStaticDataHub(key);
}

export const solutionPages = staticSolutionPages.map((staticPage: any) => {
  const dynamicPage = cachedSolutionPages.find((p) => p.slug === staticPage.slug);
  return dynamicPage || staticPage;
});

export const industryPages = staticIndustryPages.map((staticPage: any) => {
  const dynamicPage = cachedIndustryPages.find((p) => p.slug === staticPage.slug);
  return dynamicPage || staticPage;
});

export const ServicePages = staticServicePages.map((staticPage: any) => {
  const dynamicPage = cachedServicePages.find((p) => p.slug === staticPage.slug);
  return dynamicPage || staticPage;
});

export const homeData = cachedHomeData && cachedHomeData.sections?.length > 0 ? cachedHomeData : staticHomeData;

let isFetchingHomeData = false;
async function refreshHomeDataInBackground() {
  if (isFetchingHomeData) return;
  isFetchingHomeData = true;
  try {
    await fetchHomeData();
  } catch (e) {
    // ignore
  } finally {
    isFetchingHomeData = false;
  }
}

export function getHome(key: string, pageSlug?: string): any {
  // Trigger background refresh to keep cache warm and dynamically update on next tick/render
  refreshHomeDataInBackground();

  // 1. Resolve path dynamically at runtime or use explicitly provided pageSlug
  let pageKey = "/";
  if (pageSlug) {
    pageKey = pageSlug;
  } else {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
    pageKey = pathname || "/";
  }

  if (pageKey !== "/" && pageKey.endsWith("/")) {
    pageKey = pageKey.slice(0, -1);
  }

  // 2. Lookup page-specific sections cache
  const pageSections = cachedContentPages[pageKey];
  if (pageSections) {
    let lookupKey = key;
    if (lookupKey === "why-choose") lookupKey = "whyus";
    if (lookupKey === "portfolio") lookupKey = "result";
    if (lookupKey === "testimonials") lookupKey = "review";
    if (lookupKey === "services") lookupKey = "services-grid";

    const section = pageSections[lookupKey] || pageSections[key];
    if (section) return section;
  }

  // 3. Fallback to Home sections cache ("/")
  const homeSections = cachedContentPages["/"];
  if (homeSections) {
    let lookupKey = key;
    if (lookupKey === "why-choose") lookupKey = "whyus";
    if (lookupKey === "portfolio") lookupKey = "result";
    if (lookupKey === "testimonials") lookupKey = "review";
    if (lookupKey === "services") lookupKey = "services-grid";

    const section = homeSections[lookupKey] || homeSections[key];
    if (section) return section;
  }

  // 4. Static Fallback: search static homedata sections
  let staticLookup = key;
  if (staticLookup === "why-choose") staticLookup = "whyus";
  if (staticLookup === "portfolio") staticLookup = "result";
  if (staticLookup === "testimonials") staticLookup = "review";
  if (staticLookup === "services") staticLookup = "services-grid";

  const staticSec = staticHomeData.sections.find((section: any) => section.section_key === key || section.section_key === staticLookup);
  if (staticSec) return staticSec;

  return null;
}
