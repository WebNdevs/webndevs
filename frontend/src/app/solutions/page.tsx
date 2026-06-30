import { generateSEO } from "@/data/seo";
import { SolutionsPage } from "@/views/Solutions";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Solutions",
  description:
    "Information and insights about some widely recognized industry Solutions.",
    path: "/solutions",
});

export default function Page() {
  return (
    <SolutionsPage/>
  )
}