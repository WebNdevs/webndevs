import { generateSEO } from "@/data/seo";
import { FreeToolsPage } from "@/views/FreeTools";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Free Tools",
  description:
    "Information about some widely recognized free tools.",
    path: "/free-tools",
});

export default function Page() {
  return (
    <FreeToolsPage/>
  )
}