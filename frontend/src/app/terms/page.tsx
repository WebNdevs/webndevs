import { generateSEO } from "@/data/seo";
import { TermsPage } from "@/views/Terms";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Terms of Service | WebNDevs Usage Agreement",
  description:
    "Read the WebNDevs Terms of Service. Understand the terms, conditions, and intellectual property rights associated with our web development and custom software services.",
  path: "/terms",
  keywords: ["terms of service", "terms and conditions", "software usage agreement", "WebNDevs terms"],
});

export default function Page() {
  return (
    <TermsPage />
  )
}