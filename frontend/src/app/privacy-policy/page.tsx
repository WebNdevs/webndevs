import { generateSEO } from "@/data/seo";
import { PrivacyPolicyPage } from "@/views/Privacy";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Privacy Policy",
  description:
    "Privacy is needed to be guaranteed and given by default.",
    path: "/privacy-policy",
});

export default function Page() {
  return (
    <PrivacyPolicyPage />
  )
}