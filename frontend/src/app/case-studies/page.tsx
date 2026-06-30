import { generateSEO } from "@/data/seo";
import { CaseStudyPage } from "@/views/CaseStudy";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "CaseStudies",
  description:
    "Our case studies on some important and helpful researches",
    path: "/case-studies",
});

export default function Page() {
  return (
    <CaseStudyPage/>
  )
}