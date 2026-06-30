import { generateSEO } from "@/data/seo";
import NotFoundPage from "@/views/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "404",
  description:
    "Can't find what you're looking for?",
    path: "/not-found",
})

export default function Page() {
  return (
    <NotFoundPage/>
  )
}