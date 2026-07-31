import { generateSEOFromCMS } from "@/data/seo";
import { getPage } from "@/data/content";
import { DataHubPage } from "@/views/DataHub";
import { Metadata } from "next";

const DEFAULT_SEO = {
  title: "Data Hub & Developer Resource Center | WebNDevs",
  description:
    "Welcome to the WebNDevs Data Hub. Access structured datasets, developer resources, integration guidelines, and technical documentation to power your software.",
  path: "/datahub",
  keywords: ["data hub", "developer resources", "technical datasets", "integration API guidelines", "developer center"],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("content", "/datahub");
  return generateSEOFromCMS(DEFAULT_SEO, page);
}

export default function Page() {
  return (
    <DataHubPage/>
  )
}