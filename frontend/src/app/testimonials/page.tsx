import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { TestimonialsPage } from "@/views/Testimonial";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Client Testimonials & Reviews | WebNDevs Success Stories",
  description:
    "See what our clients say about us. Read verified reviews and success stories regarding our web portals, automation engineering, and custom software systems.",
  path: "/testimonials",
  keywords: ["client reviews", "web development testimonials", "software design ratings", "WebNDevs reviews", "verified client feedback"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("content", "/testimonials");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <TestimonialsPage />
  )
}