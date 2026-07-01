import { generateSEO } from "@/data/seo";
import { BlogPage } from "@/views/Blog";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Tech Blog: Software Development & AI Automation Insights | WebNDevs",
  description:
    "Read the WebNDevs blog for the latest guides, industry news, and expert tutorials on custom software development, next-gen web frameworks, and AI workflows.",
  path: "/blogs",
  keywords: ["software development blog", "AI automation articles", "Next.js tips", "coding tutorials", "business technology insights"],
});

export default function Page() {
  return (
    <BlogPage/>
  )
}