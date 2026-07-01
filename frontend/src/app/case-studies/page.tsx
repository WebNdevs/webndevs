import { generateSEO } from "@/data/seo";
import { CaseStudyPage } from "@/views/CaseStudy";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Case Studies: Client Success & Technical Results | WebNDevs",
  description:
    "Explore our deep-dive case studies. Discover how we helped enterprise companies and startups scale using Next.js web portals, robust APIs, and custom database engineering.",
  path: "/case-studies",
  keywords: ["software case studies", "business success stories", "web development results", "custom programming case studies", "client ROI cases"],
});

export default function Page() {
  return (
    <CaseStudyPage/>
  )
}