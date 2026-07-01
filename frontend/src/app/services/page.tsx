import { generateSEO } from "@/data/seo";
import { ServicesPage } from "@/views/Services";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Professional Web Development & Custom Software Services | WebNDevs",
  description:
    "Explore our complete range of digital services including high-performance web development, custom software development, mobile apps, database integrations, and AI automation.",
  path: "/services",
  keywords: ["custom software services", "professional web development", "AI workflow automation", "mobile app developers", "database solutions"],
});

export default function Page() {
  return (
    <ServicesPage/>
  )
}