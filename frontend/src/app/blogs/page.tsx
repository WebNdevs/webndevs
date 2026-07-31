import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { BlogPage } from "@/views/Blog";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Tech Blog: Software Development & AI Automation Insights | WebNDevs",
  description:
    "Read the WebNDevs blog for the latest guides, industry news, and expert tutorials on custom software development, next-gen web frameworks, and AI workflows.",
  path: "/blogs",
  keywords: ["software development blog", "AI automation articles", "Next.js tips", "coding tutorials", "business technology insights"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("article", "/blogs");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <BlogPage/>
  )
}