import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { ToolsPage } from "@/views/Tools";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Custom Development Tools & CMS Platforms | WebNDevs",
  description:
    "Explore our collection of custom web development tools, CMS platforms, and automated software utilities designed to accelerate business workflows.",
  path: "/tools",
  keywords: ["development tools", "custom CMS", "software utility tools", "workflow automation", "web developer utilities"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("datahub", "/tools");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <ToolsPage/>
  )
}