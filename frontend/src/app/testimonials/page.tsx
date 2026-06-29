import { generateSEO } from "@/data/seo";
import { TestimonialsPage } from "@/views/Testimonial";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Testimonials",
  description:
    "Success stories of many clients that found the results as expected.",
    canonical: "/testimonials",
});

export default function Page() {
  return (
    <TestimonialsPage />
  )
}