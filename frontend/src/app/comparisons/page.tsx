import { generateSEO } from "@/data/seo";
import { ComparisonPage } from "@/views/Comparison";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Comparisons",
  description:
    "Our case studies on some important and helpful researches",
    canonical: "/comparisons",
});

export default function Page() {
  return (
    <ComparisonPage/>
  )
}