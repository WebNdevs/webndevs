import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { PrivacyPolicyPage } from "@/views/Privacy";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Privacy Policy | WebNDevs Data Protection Commitment",
  description:
    "Review the WebNDevs Privacy Policy. Understand how we collect, process, secure, and manage your data in compliance with general data protection guidelines.",
  path: "/privacy-policy",
  keywords: ["privacy policy", "data protection", "GDPR compliance", "privacy policy webndevs"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getPage("content", "/privacy-policy")) || (await getPage("content", "/privacy"));
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <PrivacyPolicyPage />
  )
}