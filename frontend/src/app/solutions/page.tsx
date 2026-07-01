import { generateSEO } from "@/data/seo";
import { SolutionsPage } from "@/views/Solutions";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Enterprise Software & Tech Business Solutions | WebNDevs",
  description:
    "Discover customized enterprise software systems, CRM solutions, cloud database infrastructures, and custom software integrations built to streamline corporate workflows.",
  path: "/solutions",
  keywords: ["business solutions", "enterprise software systems", "custom corporate solutions", "CRM integrations", "cloud database systems"],
});

export default function Page() {
  return (
    <SolutionsPage/>
  )
}