import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { HomePage } from "../views/Home";
import type { Metadata } from "next";

const DEFAULT_SEO = {
  title: "WebNDevs | Custom Software, Web Development & AI Automation Agency",
  description:
    "Partner with WebNDevs to build modern websites, mobile apps, custom business software, and AI automation workflows designed to drive growth and efficiency.",
  path: "/",
  keywords: ["custom software development", "web development agency", "AI automation agency", "Next.js websites", "mobile app development", "software solutions"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("content", "/");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return <HomePage />;
}