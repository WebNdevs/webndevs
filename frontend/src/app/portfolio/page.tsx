import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { PortfolioPage } from "@/views/Portfolio";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Our Work & Project Portfolio | WebNDevs Solutions",
  description:
    "Explore our portfolio of custom software systems, Next.js web applications, mobile apps, and business automation platforms developed by WebNDevs.",
  path: "/portfolio",
  keywords: ["software portfolio", "web development case studies", "mobile app examples", "business automation solutions", "client case studies"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("content", "/portfolio");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <PortfolioPage />
  );
}