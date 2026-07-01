import { generateSEO } from "@/data/seo";
import NotFoundPage from "@/views/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Page Not Found | WebNDevs",
  description: "Sorry, the page you are looking for does not exist or has been moved.",
  path: "/404",
  noIndex: true,
});

export default function Page() {
  return (
    <NotFoundPage/>
  )
}