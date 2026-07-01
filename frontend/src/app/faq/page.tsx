import { generateSEO } from "@/data/seo";
import { FAQPage } from "@/views/Faq";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Frequently Asked Questions (FAQ) | WebNDevs",
  description:
    "Find answers to frequently asked questions about our web development, custom software pricing, delivery timelines, AI automation integration, and support SLA.",
  path: "/faq",
  keywords: ["web development FAQs", "custom software cost", "project delivery timeline", "software development process FAQ", "WebNDevs support"],
});

export default function Page() {
  return (
    <FAQPage/>
  )
}