import { generateSEO } from "@/data/seo";
import { IndustriesPage } from "@/views/Industries";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Industry-Specific Software & Tech Solutions | WebNDevs",
  description:
    "Tailored digital products for specific domains. Explore our software developments in Healthcare, Real Estate, E-commerce, Finance, and Education.",
  path: "/industries",
  keywords: ["industry solutions", "healthcare technology", "real estate software", "financial software portals", "e-commerce development"],
});

export default function Page() {
  return (
    <IndustriesPage/>
  )
}