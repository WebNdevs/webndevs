import { generateSEO } from "@/data/seo";
import { TestimonialsPage } from "@/views/Testimonial";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Client Testimonials & Reviews | WebNDevs Success Stories",
  description:
    "See what our clients say about us. Read verified reviews and success stories regarding our web portals, automation engineering, and custom software systems.",
  path: "/testimonials",
  keywords: ["client reviews", "web development testimonials", "software design ratings", "WebNDevs reviews", "verified client feedback"],
});

export default function Page() {
  return (
    <TestimonialsPage />
  )
}