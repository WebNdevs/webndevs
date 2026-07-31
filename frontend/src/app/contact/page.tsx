import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { ContactPage } from "@/views/Contact";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Contact WebNDevs | Get a Free Project Cost Estimate",
  description:
    "Get in touch with WebNDevs today. Talk to our senior software architects and get a free project consultation and cost estimate for your website, app, or automation system.",
  path: "/contact",
  keywords: ["contact software developer", "get website quote", "free project consultation", "hire web developer", "hire app developer"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("content", "/contact");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <ContactPage/>
  )
}