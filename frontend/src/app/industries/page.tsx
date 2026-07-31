import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { IndustriesPage } from "@/views/Industries";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Industry-Specific Software & Tech Solutions | WebNDevs",
  description:
    "Tailored digital products for specific domains. Explore our software developments in Healthcare, Real Estate, E-commerce, Finance, and Education.",
  path: "/industries",
  keywords: ["industry solutions", "healthcare technology", "real estate software", "financial software portals", "e-commerce development"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("datahub", "/industries");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <IndustriesPage/>
  )
}