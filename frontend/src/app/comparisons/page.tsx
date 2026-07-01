import { generateSEO } from "@/data/seo";
import { ComparisonPage } from "@/views/Comparison";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Tech Comparisons: Frameworks, Platforms & Tools | WebNDevs",
  description:
    "Make informed business decisions with our objective comparisons. Check out Next.js vs. React, custom CMS vs. WordPress, and other software architecture comparisons.",
  path: "/comparisons",
  keywords: ["tech comparisons", "Next.js vs React", "custom software comparison", "custom CMS vs WordPress", "platform comparisons"],
});

export default function Page() {
  return (
    <ComparisonPage/>
  )
}