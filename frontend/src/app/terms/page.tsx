import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { TermsPage } from "@/views/Terms";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Terms of Service | WebNDevs Usage Agreement",
  description:
    "Read the WebNDevs Terms of Service. Understand the terms, conditions, and intellectual property rights associated with our web development and custom software services.",
  path: "/terms",
  keywords: ["terms of service", "terms and conditions", "software usage agreement", "WebNDevs terms"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("content", "/terms");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <TermsPage />
  )
}