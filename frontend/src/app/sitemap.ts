import { MetadataRoute } from "next";
import { IndustryPages } from "@/data/industry";
import { ServicePages } from "@/data/services";
import { solutionPages } from "@/data/solution";
import { blogArticles, caseStudyArticles } from "@/data/articles";
import { getModule } from "@/data/content";
import { ContentCardProps } from "@/components/cards/content-card";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://webndevs.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/comparisons`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/datahub`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/free-tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/industries`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/solutions`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/testimonials`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  // Attempt fetching live module pages from backend API
  const [liveServices, liveArticles] = await Promise.all([
    getModule("service").catch(() => []),
    getModule("article").catch(() => []),
  ]);

  const industrySlugs = IndustryPages.map((item) => (item.slug || "").replace(/^\/+/, "")).filter(Boolean);

  const serviceSlugSet = new Set<string>([
    ...ServicePages.map((item) => (item.slug || "").replace(/^\/+/, "")),
    ...liveServices.map((page) => (page.slug || "").replace(/^\/+/, "")),
  ]);

  const solutionSlugs = solutionPages.map((item) => (item.slug || "").replace(/^\/+/, "")).filter(Boolean);

  // Extract live articles items from backend API
  const blogSection = liveArticles.find((p) => p.slug === "/blogs" || p.slug === "blogs");
  const liveBlogItems = (
    (blogSection?.content as { items?: ContentCardProps[] })?.items ||
    blogSection?.items ||
    []
  ) as ContentCardProps[];

  const caseStudySection = liveArticles.find((p) => p.slug === "/case-studies" || p.slug === "case-studies");
  const liveCaseStudyItems = (
    (caseStudySection?.content as { items?: ContentCardProps[] })?.items ||
    caseStudySection?.items ||
    []
  ) as ContentCardProps[];

  const blogSlugSet = new Set<string>([
    ...blogArticles.map((item) => (item.slug || "").replace(/^\/+/, "")),
    ...liveBlogItems.map((item) => (item.slug || "").replace(/^\/+/, "")),
  ]);

  const caseStudySlugSet = new Set<string>([
    ...caseStudyArticles.map((item) => (item.slug || "").replace(/^\/+/, "")),
    ...liveCaseStudyItems.map((item) => (item.slug || "").replace(/^\/+/, "")),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...industrySlugs.map((slug) => ({
      url: `${baseUrl}/industries/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...Array.from(serviceSlugSet).filter(Boolean).map((slug) => ({
      url: `${baseUrl}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...solutionSlugs.map((slug) => ({
      url: `${baseUrl}/solutions/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...Array.from(blogSlugSet).filter(Boolean).map((slug) => ({
      url: `${baseUrl}/blogs/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...Array.from(caseStudySlugSet).filter(Boolean).map((slug) => ({
      url: `${baseUrl}/case-studies/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
