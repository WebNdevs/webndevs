import { generateSEO } from "@/data/seo";
import { TermsPage } from "@/views/Terms";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Terms of Services",
  description:
    "Terms & Conditions applied for using our services.",
    path: "/terms",
});

export default function Page() {
  return (
    <TermsPage />
  )
}