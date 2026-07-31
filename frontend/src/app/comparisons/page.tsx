import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { ComparisonPage } from "@/views/Comparison";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Tech Comparisons: Frameworks, Platforms & Tools | WebNDevs",
  description:
    "Make informed business decisions with our objective comparisons. Check out Next.js vs. React, custom CMS vs. WordPress, and other software architecture comparisons.",
  path: "/comparisons",
  keywords: ["tech comparisons", "Next.js vs React", "custom software comparison", "custom CMS vs WordPress", "platform comparisons"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("datahub", "/comparisons");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <ComparisonPage/>
  )
}