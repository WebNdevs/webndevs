import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { AboutPage } from "@/views/About";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "About Us | What we do? | WebNDevs",
  description:
    "Learn about WebNDevs, our core principles, work culture, and how we deliver professional custom software, web development, and digital marketing solutions.",
  path: "/about",
  keywords: ["about WebNDevs", "custom software agency", "software engineering principles", "work culture", "Jaipur digital marketing agency"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("content", "/about");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <AboutPage />
  );
}