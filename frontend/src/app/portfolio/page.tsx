import { generateSEO } from "@/data/seo";
import { PortfolioPage } from "@/views/Portfolio";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Portfolio",
  description:
    "Explore WebNDevs projects, case studies, and measurable business results.",
    path: "/portfolio",
});

export default function Page() {
  return (
    <PortfolioPage />
  );
}