import { generateSEO } from "@/data/seo";
import { ServicesPage } from "@/views/Services";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Services",
  description:
    "Explore the services that we provide for our clients.",
    path: "/services",
});

export default function Page() {
  return (
    <ServicesPage/>
  )
}