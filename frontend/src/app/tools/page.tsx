import { generateSEO } from "@/data/seo";
import { ToolsPage } from "@/views/Tools";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Tools",
  description:
    "Information and insights about some widely recognized industry tools.",
    canonical: "/tools",
})

export default function Page() {
  return (
    <ToolsPage/>
  )
}