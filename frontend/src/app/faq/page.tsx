import { generateSEO } from "@/data/seo";
import { FAQPage } from "@/views/Faq";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "FAQs",
  description:
    "Find answers to some of your queries and doubts.",
    canonical: "/faq",
});

export default function Page() {
  return (
    <FAQPage/>
  )
}