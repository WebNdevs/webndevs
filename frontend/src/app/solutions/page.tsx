import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { SolutionsPage } from "@/views/Solutions";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Enterprise Software & Tech Business Solutions | WebNDevs",
  description:
    "Discover customized enterprise software systems, CRM solutions, cloud database infrastructures, and custom software integrations built to streamline corporate workflows.",
  path: "/solutions",
  keywords: ["business solutions", "enterprise software systems", "custom corporate solutions", "CRM integrations", "cloud database systems"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("datahub", "/solutions");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <SolutionsPage/>
  )
}