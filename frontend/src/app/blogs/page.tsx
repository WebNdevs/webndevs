import { generateSEO } from "@/data/seo";
import { BlogPage } from "@/views/Blog";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Blogs",
  description:
    "Latest news and articles about some very interesting topics of the IT industry.",
    canonical: "/blogs",
})

export default function Page() {
  return (
    <BlogPage/>
  )
}