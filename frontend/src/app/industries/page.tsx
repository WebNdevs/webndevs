import { generateSEO } from "@/data/seo";
import { IndustriesPage } from "@/views/Industries";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Industries",
  description:
    "Information and insights about some widely recognized Industries.",
    path: "/industries",
});

export default function Page() {
  return (
    <IndustriesPage/>
  )
}