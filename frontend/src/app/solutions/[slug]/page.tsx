import { DynamicSection } from "@/components/sections/dynamic-content-section";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateSEOFromCMS } from "@/data/seo";
import { buildRoute, getModule } from "@/data/content";
import { solutionPages } from "@/data/solution";

const CATEGORY = "solutions";

const SLUG_ALIASES: Record<string, string> = {
  "cloud-solutions": "cloud-infrastructure",
  "cloud": "cloud-infrastructure",
  "marketing-automation": "email-marketing",
  "customer-support": "customer-support-solutions",
  "crm": "crm-solutions",
  "erp": "erp-solutions",
};

const normalizeSlug = (s: string) => {
  const clean = s.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
  const aliased = SLUG_ALIASES[clean] || clean;
  return aliased.replace(/-solutions$/, "");
};

async function resolveSolutionPage(slug: string) {
  const targetNorm = normalizeSlug(slug);

  // 1. Try resolving from CMS singlepage module
  const cmsPages = await getModule("singlepage").catch(() => []);
  const cmsMatch = cmsPages.find((page) => {
    const route = buildRoute(page, "singlepage");
    if (!route.startsWith(`/${CATEGORY}/`)) return false;
    const pageSlug = route.slice(`/${CATEGORY}/`.length);
    return (
      pageSlug === slug ||
      normalizeSlug(pageSlug) === targetNorm
    );
  });

  if (cmsMatch) return cmsMatch;

  // 2. Fallback to hardcoded solutionPages dataset
  const localMatch = solutionPages.find((item) => {
    const itemSlug = (item.slug || "").replace(/^\/+/, "");
    return (
      itemSlug === slug ||
      normalizeSlug(itemSlug) === targetNorm
    );
  });

  return localMatch;
}

export async function generateStaticParams() {
  const cmsPages = await getModule("singlepage").catch(() => []);
  const cmsSlugs = cmsPages
    .filter((page) => buildRoute(page, "singlepage").startsWith(`/${CATEGORY}/`))
    .map((page) => buildRoute(page, "singlepage").slice(`/${CATEGORY}/`.length));

  const localSlugs = solutionPages.flatMap((item) => {
    const s = (item.slug || "").replace(/^\/+/, "");
    const base = normalizeSlug(s);
    return [s, base, `${base}-solutions`].filter(Boolean);
  });

  const allSlugs = Array.from(new Set([...cmsSlugs, ...localSlugs]));

  return allSlugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = await resolveSolutionPage(slug);

  return generateSEOFromCMS(
    {
      title: "Solution | WebNDevs",
      description: "Explore custom software and enterprise solutions from WebNDevs.",
      path: `/${CATEGORY}/${slug}`,
      keywords: ["solutions", "software solutions", "enterprise web apps"],
    },
    solution
  );
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await resolveSolutionPage(slug);

  if (!page) {
    notFound();
  }

  return <DynamicSection page={page} />;
}
