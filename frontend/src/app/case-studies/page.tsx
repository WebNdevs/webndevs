import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { CaseStudyPage } from "@/views/CaseStudy";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Case Studies: Client Success & Technical Results | WebNDevs",
  description:
    "Explore our deep-dive case studies. Discover how we helped enterprise companies and startups scale using Next.js web portals, robust APIs, and custom database engineering.",
  path: "/case-studies",
  keywords: ["software case studies", "business success stories", "web development results", "custom programming case studies", "client ROI cases"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("article", "/case-studies");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <CaseStudyPage/>
  )
}