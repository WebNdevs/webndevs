import { DynamicSection } from "@/components/sections/dynamic-content-section";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateSEOFromCMS } from "@/data/seo";
import { buildRoute, getModule } from "@/data/content";
import { IndustryPages } from "@/data/industry";

const CATEGORY = "industries";

const normalizeSlug = (s: string) =>
  s.trim().toLowerCase().replace(/^\/+|\/+$/g, "").replace(/-solutions$|-industry$/, "");

async function resolveIndustryPage(slug: string) {
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

  // 2. Fallback to hardcoded IndustryPages dataset
  const localMatch = IndustryPages.find((item) => {
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

  const localSlugs = IndustryPages.flatMap((item) => {
    const s = (item.slug || "").replace(/^\/+/, "");
    const base = normalizeSlug(s);
    return [s, base].filter(Boolean);
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
  const industry = await resolveIndustryPage(slug);

  return generateSEOFromCMS(
    {
      title: "Industry Solutions | WebNDevs",
      description: "Custom software and technology solutions tailored to your industry.",
      path: `/${CATEGORY}/${slug}`,
      keywords: ["industry solutions", "custom software", "industry web apps"],
    },
    industry
  );
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await resolveIndustryPage(slug);

  if (!page) {
    notFound();
  }

  return <DynamicSection page={page} />;
}
