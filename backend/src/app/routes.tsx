import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { DashboardHome } from "./pages/DashboardHome";
import { ArticleModule } from "./pages/ArticleModule";
import { CustomersModule } from "./pages/CustomersModule";
import { InvoicingModule } from "./pages/InvoicingModule";
import { SitemapModule } from "./pages/SitemapModule";
import { GooglePoliciesModule } from "./pages/GooglePoliciesModule";
import { ContentModule } from "./pages/ContentModule";
import { ServicePlansModule } from "./pages/ServicePlansModule";
import { ServiceModule } from "./pages/ServicesModule";
import { LoginPage } from "./pages/LoginPage";
import { SettingsModule } from "./pages/SettingsModule";
import { DataHubModule } from "./pages/DataHubModule";
import { SinglePageModule } from "./pages/SinglePageModule";
import { EntityManagerModule } from "./pages/EntityManagerModule";
import { CrossReferenceModule } from "./pages/CrossReferenceModule";
import { AiContentModule } from "./pages/AiContentModule";
import { NavigationBuilderModule } from "./pages/NavigationBuilderModule";
import { SeoModule } from "./pages/SeoModule";

export const router = createBrowserRouter(
  [
    {
      path: "/login",
      Component: LoginPage,
    },
    {
      path: "/",
      Component: Root,
      children: [
        { index: true, Component: DashboardHome },
        { path: "service-management", Component: ServicePlansModule },
        { path: "service", Component: ServiceModule },
        { path: "articles", Component: ArticleModule },
        { path: "customers", Component: CustomersModule },
        { path: "invoicing", Component: InvoicingModule },
        { path: "sitemap", Component: SitemapModule },
        { path: "policies", Component: GooglePoliciesModule },
        { path: "content", Component: ContentModule },
        { path: "settings", Component: SettingsModule },
        { path: "datahub", Component: DataHubModule },
        { path: "single-page", Component: SinglePageModule },
        { path: "entities", Component: EntityManagerModule },
        { path: "cross-references", Component: CrossReferenceModule },
        { path: "ai-content", Component: AiContentModule },
        { path: "navigation", Component: NavigationBuilderModule },
        { path: "seo", Component: SeoModule },
      ],
    },
  ],
  {
    basename: "/",
  }
);
