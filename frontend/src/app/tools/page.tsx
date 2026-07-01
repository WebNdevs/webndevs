import { generateSEO } from "@/data/seo";
import { ToolsPage } from "@/views/Tools";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Custom Development Tools & CMS Platforms | WebNDevs",
  description:
    "Explore our collection of custom web development tools, CMS platforms, and automated software utilities designed to accelerate business workflows.",
  path: "/tools",
  keywords: ["development tools", "custom CMS", "software utility tools", "workflow automation", "web developer utilities"],
});

export default function Page() {
  return (
    <ToolsPage/>
  )
}