import { generateSEO } from "@/data/seo";
import { AboutPage } from "@/views/About";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "About Us | What we do? | WebNDevs",
  description:
    "Learn about WebNDevs, our core principles, work culture, and how we deliver professional custom software, web development, and digital marketing solutions.",
  path: "/about",
  keywords: ["about WebNDevs", "custom software agency", "software engineering principles", "work culture", "Jaipur digital marketing agency"],
});

export default function Page() {
  return (
    <AboutPage />
  );
}
