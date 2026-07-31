import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { FAQPage } from "@/views/Faq";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Frequently Asked Questions (FAQ) | WebNDevs",
  description:
    "Find answers to frequently asked questions about our web development, custom software pricing, delivery timelines, AI automation integration, and support SLA.",
  path: "/faq",
  keywords: ["web development FAQs", "custom software cost", "project delivery timeline", "software development process FAQ", "WebNDevs support"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("content", "/faq");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <FAQPage/>
  )
}