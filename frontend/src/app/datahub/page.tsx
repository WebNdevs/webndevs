import { generateSEO } from "@/data/seo";
import { DataHubPage } from "@/views/DataHub";
import { Metadata } from "next";

export const metadata: Metadata = generateSEO({
  title: "Data Hub",
  description:
    "Check out our resources for more information.",
    path: "/datahub",
});

export default function Page() {
  return (
    <DataHubPage/>
  )
}