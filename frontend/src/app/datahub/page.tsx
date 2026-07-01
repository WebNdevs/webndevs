import { generateSEO } from "@/data/seo";
import { DataHubPage } from "@/views/DataHub";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Data Hub & Developer Resource Center | WebNDevs",
  description:
    "Welcome to the WebNDevs Data Hub. Access structured datasets, developer resources, integration guidelines, and technical documentation to power your software.",
  path: "/datahub",
  keywords: ["data hub", "developer resources", "technical datasets", "integration API guidelines", "developer center"],
});

export default function Page() {
  return (
    <DataHubPage/>
  )
}