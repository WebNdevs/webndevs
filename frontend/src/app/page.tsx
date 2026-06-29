import { generateSEO } from "@/data/seo";
import { HomePage } from "../views/Home";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "WebNDevs",
  description:
  "WebNDevs helps businesses build modern websites, AI automation, custom software, mobile apps, analytics dashboards, and digital solutions that drive growth.",
  canonical: "/",
});

export default function Page() {
  return <HomePage />;
}