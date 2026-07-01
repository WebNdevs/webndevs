import { generateSEO } from "@/data/seo";
import { FreeToolsPage } from "@/views/FreeTools";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Free Web Developer & SEO Utility Tools | WebNDevs",
  description:
    "Enhance your development speed with WebNDevs free tools. Explore formatters, minifiers, performance analyzers, and SEO meta generators.",
  path: "/free-tools",
  keywords: ["free developer tools", "online utility tools", "SEO generators", "web formatting tools", "code minifiers"],
});

export default function Page() {
  return (
    <FreeToolsPage/>
  )
}