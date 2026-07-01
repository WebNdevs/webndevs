import { generateSEO } from "@/data/seo";
import { ContactPage } from "@/views/Contact";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Contact WebNDevs | Get a Free Project Cost Estimate",
  description:
    "Get in touch with WebNDevs today. Talk to our senior software architects and get a free project consultation and cost estimate for your website, app, or automation system.",
  path: "/contact",
  keywords: ["contact software developer", "get website quote", "free project consultation", "hire web developer", "hire app developer"],
});

export default function Page() {
  return (
    <ContactPage/>
  )
}