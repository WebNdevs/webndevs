import { generateSEO } from "@/data/seo";
import { PrivacyPolicyPage } from "@/views/Privacy";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Privacy Policy | WebNDevs Data Protection Commitment",
  description:
    "Review the WebNDevs Privacy Policy. Understand how we collect, process, secure, and manage your data in compliance with general data protection guidelines.",
  path: "/privacy-policy",
  keywords: ["privacy policy", "data protection", "GDPR compliance", "privacy policy webndevs"],
});

export default function Page() {
  return (
    <PrivacyPolicyPage />
  )
}