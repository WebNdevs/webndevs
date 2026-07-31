import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { FreeToolsPage } from "@/views/FreeTools";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Free Web Developer & SEO Utility Tools | WebNDevs",
  description:
    "Enhance your development speed with WebNDevs free tools. Explore formatters, minifiers, performance analyzers, and SEO meta generators.",
  path: "/free-tools",
  keywords: ["free developer tools", "online utility tools", "SEO generators", "web formatting tools", "code minifiers"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("datahub", "/free-tools");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <FreeToolsPage/>
  )
}