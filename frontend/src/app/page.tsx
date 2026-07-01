import { generateSEO } from "@/data/seo";
import { HomePage } from "../views/Home";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "WebNDevs | Custom Software, Web Development & AI Automation Agency",
  description:
    "Partner with WebNDevs to build modern websites, mobile apps, custom business software, and AI automation workflows designed to drive growth and efficiency.",
  path: "/",
  keywords: ["custom software development", "web development agency", "AI automation agency", "Next.js websites", "mobile app development", "software solutions"],
});

export default function Page() {
  return <HomePage />;
}