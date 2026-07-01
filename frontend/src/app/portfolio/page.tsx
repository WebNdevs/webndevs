import { generateSEO } from "@/data/seo";
import { PortfolioPage } from "@/views/Portfolio";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Our Work & Project Portfolio | WebNDevs Solutions",
  description:
    "Explore our portfolio of custom software systems, Next.js web applications, mobile apps, and business automation platforms developed by WebNDevs.",
  path: "/portfolio",
  keywords: ["software portfolio", "web development case studies", "mobile app examples", "business automation solutions", "client case studies"],
});

export default function Page() {
  return (
    <PortfolioPage />
  );
}