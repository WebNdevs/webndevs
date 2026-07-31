import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { ServicesPage } from "@/views/Services";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Professional Web Development & Custom Software Services | WebNDevs",
  description:
    "Explore our complete range of digital services including high-performance web development, custom software development, mobile apps, database integrations, and AI automation.",
  path: "/services",
  keywords: ["custom software services", "professional web development", "AI workflow automation", "mobile app developers", "database solutions"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("content", "/services");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <ServicesPage/>
  )
}