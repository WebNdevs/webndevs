import { generateSEO } from "@/data/seo";
import { ContactPage } from "@/views/Contact";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Contact Us",
  description:
    "We are here to support and guide you through the process and your queries.",
    path: "/contact",
});

export default function Page() {
  return (
    <ContactPage/>
  )
}