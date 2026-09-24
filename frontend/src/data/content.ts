import { cache } from "react";
import { API_BASE_URL } from "@/config/api";
import { mergeSectionData, mergeItemData } from "@/data/schema";
import { blogArticles, caseStudyArticles } from "@/data/articles";

// `next.config.ts` builds this app with `output: "export"` (a static HTML
// export, no Next.js server in production), so this `revalidate` value has
// no runtime effect on the deployed site today — every module is fetched
// exactly once, at build time. It's kept so the same fetch call behaves
// correctly (background revalidation, no request-time caching surprises)
// if this app is ever deployed as a server instead of a static export.
// Under the static export, CMS edits only appear after a rebuild+redeploy.
const MODULE_REVALIDATE_SECONDS = 60;


// ========================================================
// TypeScript Interface for Normalized Page
// ========================================================

type SectionRecord = Record<string, unknown>;

export type NormalizedSection = {
  section_key?: string | null;
  section_type?: string | null;
  title?: string | null;
  description?: string | null;
  tag?: string | null;
  subheading1?: string | null;
  subheading2?: string | null;
  subtext?: string | null;
  header?: SectionRecord;
  items?: unknown[];
  cta?: SectionRecord;
  techspec?: SectionRecord;
  hero?: unknown;
  stats?: unknown[];
  [key: string]: unknown;
};

export type ModuleName =
  | "content"
  | "service"
  | "article"
  | "singlepage"
  | "datahub";

export type NormalizedPage = {
  id?: number | string;
  title?: string;
  slug: string;
  category_slug?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  meta_keywords?: string | null;
  // Lineage tracking fields
  sourceId?: number | string;
  sourceModule?: ModuleName;
  sourceSlug?: string;
  sourceRoute?: string;
  sourceTitle?: string;
  [section_key: string]: NormalizedSection | unknown;
};

export function logPageTrace(
  requestedUrl: string,
  expectedModule: ModuleName,
  page: NormalizedPage | undefined
) {
  if (process.env.NODE_ENV === "production") return;
  const sections = page ? Object.keys(page).filter(k => !["id", "title", "slug", "category_slug", "seo_title", "seo_description", "meta_keywords", "sourceId", "sourceModule", "sourceSlug", "sourceRoute", "sourceTitle"].includes(k)) : [];
  console.log(`[PAGE TRACE] URL: ${requestedUrl} | Module: ${expectedModule} | Record ID: ${page?.id ?? "none"} | Slug: ${page?.slug ?? "none"} | Title: "${page?.title ?? ""}" | Sections: [${sections.join(", ")}]`);
}

function isRecord(value: unknown): value is SectionRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toRecord(value: unknown): SectionRecord {
  return isRecord(value) ? value : {};
}

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toStringArray(value: unknown, delimiter = "\n"): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(delimiter).map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function getNestedValue(value: unknown, ...path: string[]): unknown {
  let current = value;

  for (const key of path) {
    if (!isRecord(current) || !(key in current)) {
      return undefined;
    }

    current = current[key];
  }

  return current;
}

function getNestedStringValue(value: unknown, ...path: string[]): string {
  return toString(getNestedValue(value, ...path));
}

function getDefaultSection(key: string): SectionRecord | undefined {
  const value = (defaultStaticHomePage as Record<string, unknown>)[key];
  return isRecord(value) ? value : undefined;
}

// Default Static Fallback Page for "/"
const defaultStaticHomePage: NormalizedPage = {
  title: "Home",
  slug: "/",
  category_slug: null,
  whyus: {
    section_key: "whyus",
    tag: "Why Us?",
    subheading1: "Why Choose",
    subheading2: "WebNDevs?",
    subtext: "We're not just another agency. We're the reliable digital partner you can count on for the long haul.",
    header: {
      tag: "Why Us?",
      subheading1: "Why Choose",
      subheading2: "WebNDevs?",
      subtext: "We're not just another agency. We're the reliable digital partner you can count on for the long haul.",
    },
    items: [
      {
        icon: "Users",
        title: "On Everything",
        description: "No more coordinating between designers, developers, and marketers. We handle it all seamlessly under one roof.",
      },
      {
        icon: "MessageCircle",
        title: "Clear Communication",
        description: "Direct access to your project manager. No middlemen, no confusion.",
      },
    ],
  },
  process: {
    section_key: "process",
    tag: "Our Process",
    subheading1: "From Idea to Launch in",
    subheading2: "5 Simple Steps",
    subtext: "Our proven process ensures your project is delivered on time, on budget, and exceeds expectations.",
    header: {
      tag: "Our Process",
      subheading1: "From Idea to Launch in",
      subheading2: "5 Simple Steps",
      subtext: "Our proven process ensures your project is delivered on time, on budget, and exceeds expectations.",
    },
    items: [
      {
        number: "01",
        icon: "Search",
        title: "Discover",
        description: "We start by understanding your business, goals, and challenges.",
        duration: "1-2 days",
      },
    ],
    cta: {
      preview: { text: "More Projects", url: "/portfolio" },
      full: { description: "Ready to get started?", text: "Schedule Your Free Call", url: "#get-started" },
    },
  },
  result: {
    section_key: "result",
    header: {
      tag: "Our Work",
      subheading1: "Real Results for",
      subheading2: "Real Businesses",
      subtext: "See how we've helped companies grow through design, development, automation, and data-driven solutions.",
    },
    items: [],
    cta: {
      preview: { text: "More Projects", url: "/portfolio" },
      full: { description: "Want results like these?", text: "Talk To Our Team", url: "#get-started" },
    },
  },
  comparison: {
    section_key: "comparison",
    tag: "Comparison",
    subheading1: "Why We Stand Out",
    subheading2: "Against Alternatives",
    subtext: "Compare our dedicated approach with traditional agencies or freelancers.",
    header: {
      tag: "Comparison",
      subheading1: "Why We Stand Out",
      subheading2: "Against Alternatives",
      subtext: "Compare our dedicated approach with traditional agencies or freelancers.",
    },
    items: [
      {
        title: "Traditional Agencies vs WebNDevs",
        description: "See why fast-growing companies choose our integrated digital model.",
        tag: "Comparison",
        comparison: {
          leftHeading: "Traditional Agencies",
          rightHeading: "WebNDevs Team",
          leftPoints: ["Slow communication", "High overhead costs", "Separated teams"],
          rightPoints: ["Direct communication", "Transparent pricing", "Dedicated full-stack team"],
        },
      },
    ],
  },
};

// ========================================================
// Section & Page Normalizers
// ========================================================

export function normalizeSection(rawSection: SectionRecord | null | undefined): NormalizedSection | null {
  if (!rawSection) return null;

  const sectionKey = toString(rawSection.section_key);
  const data = mergeSectionData(sectionKey, toRecord(rawSection.data));

  // Determine items strictly from the section itself, never from Home page fallback!
  const rawItems = Array.isArray(rawSection.items) && rawSection.items.length > 0
    ? rawSection.items
    : Array.isArray(data.items) && data.items.length > 0
    ? data.items
    : [];

  const items = Array.isArray(rawItems)
    ? rawItems.map((item: unknown) => {
      const itemRecord = toRecord(item);
      const itemData = toRecord(itemRecord.data ?? itemRecord);
      const resultsArray = toStringArray(itemData.results);
      const categoryStr = toString(itemData.category || itemData.badge || "");
      const tagsArray = toStringArray(itemData.tags, ",");
      if (tagsArray.length === 0 && categoryStr) {
        tagsArray.push(categoryStr);
      }
      const comp = toRecord(itemData.comparison ?? itemRecord.comparison);
      const desc = toString(itemData.description || itemData.answer || itemData.content || itemData.text || "");

      const val = toString(itemData.value || itemRecord.value || "");

      return {
        ...itemData,
        id: itemRecord.id ?? itemData.id,
        icon: toString(itemData.icon || (itemData.title || itemData.description || val ? "Check" : "")),
        value: val,
        number: toString(itemData.number || ""),
        title: toString(itemData.title || itemData.question || itemData.name || ""),
        description: desc,
        excerpt: toString(itemData.excerpt || desc),
        text: toString(itemData.text || desc),
        tag: toString(itemData.tag || ""),
        url: toString(itemData.url || itemData.href || itemData.project_url || ""),
        results: resultsArray,
        tags: tagsArray,
        comparison: {
          leftHeading: toString(comp.leftHeading || comp.left_heading || null),
          rightHeading: toString(comp.rightHeading || comp.right_heading || null),
          leftPoints: toStringArray(comp.leftPoints || comp.left_points),
          rightPoints: toStringArray(comp.rightPoints || comp.right_points),
        },
      };
    })
    .filter((item) => {
      const it = item as Record<string, unknown>;
      return Boolean(
        it.title || it.description || it.value || it.name || it.question || it.text || it.number || it.url || it.tag
      );
    })
    : [];

  const header: SectionRecord = {
    tag: rawSection.tag || data.tag || null,
    subheading1: rawSection.subheading1 || data.heading || data.title || data.subheading1 || null,
    subheading2: rawSection.subheading2 || data.subheading || data.content || data.subheading2 || null,
    subtext: rawSection.subtext || data.subtext || data.description || null,
  };

  const ctaData = toRecord(data.cta ?? rawSection.cta);
  const cta: SectionRecord = {
    preview: {
      text: toString(ctaData.cta_preview_text || ctaData.preview_text || getNestedStringValue(ctaData, "preview", "text") || null),
      url: toString(ctaData.cta_preview_url || ctaData.preview_url || getNestedStringValue(ctaData, "preview", "url") || null),
    },
    full: {
      description: toString(ctaData.cta_full_description || ctaData.full_description || getNestedStringValue(ctaData, "full", "description") || null),
      text: toString(ctaData.cta_full_text || ctaData.full_text || getNestedStringValue(ctaData, "full", "text") || null),
      url: toString(ctaData.cta_full_url || ctaData.full_url || getNestedStringValue(ctaData, "full", "url") || null),
    },
  };
  const sectionObj: NormalizedSection = {
    ...data,
    section_key: sectionKey,
    section_type: toString(rawSection.section_type),
    sourceKey: sectionKey,
    sourceType: toString(rawSection.section_type),
    tag: toString(rawSection.tag || data.tag || null),
    subheading1: toString(rawSection.subheading1 || data.heading || data.title || data.subheading1 || null),
    subheading2: toString(rawSection.subheading2 || data.subheading || data.content || data.subheading2 || null),
    subtext: toString(rawSection.subtext || data.subtext || data.description || null),
    header,
    items,
    cta,
  };

  if (data.techspec || rawSection.techspec) {
    const ts = toRecord(data.techspec ?? rawSection.techspec);
    sectionObj.techspec = {
      techHeading1: toString(ts.techHeading1 || ts.tech_heading1 || null),
      techHeading2: toString(ts.techHeading2 || ts.tech_heading2 || null),
      techSubtext: toString(ts.techSubtext || ts.tech_subtext || null),
      tags: toStringArray(ts.tags),
    };
  }

  return sectionObj;
}

export function hasMeaningfulHeader(header?: SectionRecord | null): boolean {
  if (!header) return false;
  return Boolean(
    toString(header.tag).trim() ||
    toString(header.subheading1).trim() ||
    toString(header.subheading2).trim() ||
    toString(header.subtext).trim()
  );
}

export function hasMeaningfulContent(section?: NormalizedSection | SectionRecord | null): boolean {
  if (!section || typeof section !== "object") return false;
  const sec = section as NormalizedSection;
  if (Array.isArray(sec.items) && sec.items.length > 0) return true;
  if (hasMeaningfulHeader(sec.header as SectionRecord || sec as SectionRecord)) return true;
  if (sec.cta && isRecord(sec.cta)) {
    const full = toRecord(sec.cta.full);
    const prev = toRecord(sec.cta.preview);
    if (toString(full.text).trim() || toString(prev.text).trim()) return true;
  }
  if (sec.techspec && isRecord(sec.techspec)) {
    const ts = toRecord(sec.techspec);
    if (toString(ts.techHeading1).trim() || (Array.isArray(ts.tags) && ts.tags.length > 0)) return true;
  }
  // If section has title1/title2/description (like hero)
  const rec = section as SectionRecord;
  if (toString(rec.title1).trim() || toString(rec.title2).trim() || toString(rec.description).trim()) return true;
  return false;
}

export function normalizePage(rawPage: SectionRecord | null | undefined, moduleName?: ModuleName): NormalizedPage {
  if (!rawPage) return { slug: "/" };

  const rawSlug = toString(rawPage.slug || "");
  const categorySlug = toString(rawPage.category_slug || getNestedStringValue(rawPage, "category", "slug") || null);
  const title = toString(rawPage.title || "");

  const page: NormalizedPage = {
    id: rawPage.id as number | string | undefined,
    title,
    slug: rawSlug,
    category_slug: categorySlug || null,
    seo_title: toString(rawPage.seo_title || null),
    seo_description: toString(rawPage.seo_description || null),
    meta_keywords: toString(rawPage.meta_keywords || null),
    sourceId: rawPage.id as number | string | undefined,
    sourceModule: moduleName,
    sourceSlug: rawSlug,
    sourceTitle: title,
  };

  if (Array.isArray(rawPage.sections)) {
    rawPage.sections.forEach((section: unknown) => {
      const sectionRecord = toRecord(section);
      if (sectionRecord.is_visible !== false && typeof sectionRecord.section_key === "string") {
        const key = sectionRecord.section_key as string;
        const normalized = normalizeSection(sectionRecord);
        if (hasMeaningfulContent(normalized)) {
          page[key] = normalized;
        }
      }
    });
  } else {
    Object.keys(rawPage).forEach((key) => {
      if (!["id", "title", "slug", "category_slug", "seo_title", "seo_description", "meta_keywords", "sourceId", "sourceModule", "sourceSlug", "sourceTitle"].includes(key)) {
        const val = rawPage[key];
        if (val && (typeof val !== "object" || Object.keys(val as object).length > 0)) {
          page[key] = val;
        }
      }
    });
  }

  return page;
}

// ========================================================
// Generic Module Fetcher (fetchModulePages)
// ========================================================
//
// Fetches fresh from the API on every call, relying on Next.js's fetch
// Data Cache + `revalidate` for cross-request caching. `cache()` from
// "react" memoizes the parsed/normalized result across section components
// in a single render pass without leaking across requests.

async function fetchModulePagesUncached(moduleName: string): Promise<NormalizedPage[]> {
  try {
    const endpointName = moduleName.endsWith("-pages") ? moduleName : `${moduleName}-pages`;
    const res = await fetch(`${API_BASE_URL}/${endpointName}`, {
      next: { revalidate: MODULE_REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      return [];
    }

    const payload: unknown = await res.json();
    let rawPages: unknown[] = [];

    if (Array.isArray(payload)) {
      rawPages = payload;
    } else if (isRecord(payload)) {
      if (Array.isArray(payload.data)) {
        rawPages = payload.data;
      } else if (Array.isArray(payload[endpointName])) {
        rawPages = payload[endpointName] as unknown[];
      } else {
        rawPages = Object.values(payload);
      }
    }

    return rawPages.map((rawPage: unknown) => normalizePage(toRecord(rawPage), moduleName as ModuleName));
  } catch (e) {
    console.warn(`Failed to fetch module pages for ${moduleName}:`, e);
    return [];
  }
}

export const fetchModulePages = cache(fetchModulePagesUncached);

// ========================================================
// Generic Route Helper (buildRoute)
// ========================================================

export function buildRoute(
  page: NormalizedPage,
  module: ModuleName
): string {
  if (!page) return "/";

  const categorySlug = (page.category_slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  const slug = (page.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  // Home
  if (!slug || slug === "home" || slug === "homepage") {
    return "/";
  }

  // Category pages take priority
  if (categorySlug && categorySlug !== "null") {
    return `/${categorySlug}/${slug}`;
  }

  // Module-based routes
  switch (module) {
    case "service":
      return `/services/${slug}`;

    case "article":
      return `/${slug}`;

    case "datahub":
      return `/${slug}`;

    case "singlepage":
      return `/${slug}`;

    default:
      return `/${slug}`;
  }
}

// ========================================================
// Generic Route Resolver (findPageByRoute)
// ========================================================

export function findPageByRoute(
  pages: NormalizedPage[],
  module: ModuleName,
  pathname: string
): NormalizedPage | undefined {
  const normalizeForCompare = (p: string | undefined) => {
    const s = (p || "/").trim().toLowerCase().replace(/^\/+|\/+$/g, "");
    return s === "" ? "/" : `/${s}`;
  };

  const cleanPath = normalizeForCompare(pathname);

  // 1. Exact route match via buildRoute
  const directMatch = pages.find((page) => {
    const route = normalizeForCompare(buildRoute(page, module));
    return route === cleanPath;
  });
  if (directMatch) return directMatch;

  // 2. Exact slug match
  const slugClean = cleanPath.replace(/^\/+/, "");
  const slugMatch = pages.find((page) => {
    const pSlug = (page.slug || "").trim().toLowerCase().replace(/^\/+|\/+$/g, "");
    return pSlug === slugClean;
  });
  if (slugMatch) return slugMatch;

  // 3. Known aliases (e.g. /privacy and /privacy-policy)
  if (cleanPath === "/privacy" || cleanPath === "/privacy-policy") {
    const privacyMatch = pages.find((page) => {
      const pSlug = (page.slug || "").trim().toLowerCase().replace(/^\/+|\/+$/g, "");
      return pSlug === "privacy" || pSlug === "privacy-policy";
    });
    if (privacyMatch) return privacyMatch;
  }

  return undefined;
}

// ========================================================
// Public API Functions (getModule, getPage & getSection)
// ========================================================
export async function getModule(module: ModuleName): Promise<NormalizedPage[]> {
  return fetchModulePages(module);
}

export const defaultStaticBlogPage: NormalizedPage = {
  title: "Tech Blog",
  slug: "/blogs",
  hero: {
    tag: "INSIGHTS",
    title1: "Ideas Worth",
    title2: "Building On.",
    description: "Stay ahead with practical articles covering AI, automation, web development, analytics, business growth, and emerging technologies.",
  },
  header: {
    tag: "Insights & Information",
    subheading1: "Practical Knowledge",
    subheading2: "For Modern Businesses",
    subtext: "Explore expert insights on web development, AI automation, analytics, SEO, and growth strategies that help businesses scale smarter.",
  },
  content: {
    section_key: "blogs",
    items: blogArticles,
  },
  cta: {
    preview: { text: "Explore Data Hub", url: "/datahub" },
    full: { description: "Want insights like these applied directly to your business?", text: "Talk to Our Team", url: "/contact" },
  },
};

export const defaultStaticCaseStudiesPage: NormalizedPage = {
  title: "Case Studies",
  slug: "/case-studies",
  hero: {
    tag: "CASE STUDIES",
    title1: "Success",
    title2: "In Action.",
    description: "Explore real-world examples of how organizations improved efficiency, increased revenue, and accelerated digital transformation.",
  },
  header: {
    tag: "Case Studies",
    subheading1: "Real Results From",
    subheading2: "Real World Businesses",
    subtext: "Discover how businesses transformed their operations, increased efficiency, and achieved measurable growth through innovative technology solutions.",
  },
  content: {
    section_key: "case-studies",
    items: caseStudyArticles,
  },
  cta: {
    preview: { text: "View All Services", url: "/services" },
    full: { description: "Ready to become our next success story?", text: "Start Your Project", url: "/contact" },
  },
};

export async function getPage(
  module: ModuleName,
  pathname: string
): Promise<NormalizedPage | undefined> {
  const pages = await getModule(module);
  const page = findPageByRoute(pages, module, pathname);

  if (page) {
    logPageTrace(pathname, module, page);
    return page;
  }

  const cleanPath = (pathname || "/").trim().replace(/^\/+/, "");

  if (module === "content" && (cleanPath === "" || cleanPath === "home")) {
    return defaultStaticHomePage;
  }

  if (module === "article") {
    if (cleanPath === "blogs" || cleanPath === "blog" || cleanPath === "") {
      return defaultStaticBlogPage;
    }
    if (cleanPath === "case-studies" || cleanPath === "case-study") {
      return defaultStaticCaseStudiesPage;
    }
  }

  return undefined;
}

export async function getSection(module: ModuleName, pathname: string, key: string): Promise<NormalizedSection | undefined> {
  const page = await getPage(module, pathname);
  return page?.[key] as NormalizedSection | undefined;
}

export function getPageSection<T = NormalizedSection>(page: NormalizedPage | undefined, key: string): T | undefined {
  if (!page) return undefined;
  const section = page[key];
  if (!section) return undefined;
  if (typeof section === "object" && !hasMeaningfulContent(section as unknown as NormalizedSection)) return undefined;

  const merged = mergeSectionData(key, section as Record<string, unknown>);
  return merged as unknown as T;
}
