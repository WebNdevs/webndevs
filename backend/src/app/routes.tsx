import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { DashboardHome } from "./pages/DashboardHome";
import { BlogModule } from "./pages/BlogModule";
import { CustomersModule } from "./pages/CustomersModule";
import { InvoicingModule } from "./pages/InvoicingModule";
import { SitemapModule } from "./pages/SitemapModule";
import { GooglePoliciesModule } from "./pages/GooglePoliciesModule";
import { ContentModule } from "./pages/ContentModule";
import { ServicePlansModule } from "./pages/ServicePlansModule";
import { LoginPage } from "./pages/LoginPage";
import { SettingsModule } from "./pages/SettingsModule";
import { ToolsModule } from "./pages/ToolsModule";
import { IndustriesModule } from "./pages/IndustriesModule";
import { EntityManagerModule } from "./pages/EntityManagerModule";
import { CrossReferenceModule } from "./pages/CrossReferenceModule";
import { SolutionsModule } from "./pages/SolutionsModule";
import { ComparisonModule } from "./pages/ComparisonModule";
import { AiContentModule } from "./pages/AiContentModule";
import { NavigationBuilderModule } from "./pages/NavigationBuilderModule";
import { SeoModule } from "./pages/SeoModule";
import { CaseStudiesModule } from "./pages/CaseStudiesModule";
import { FreeToolsModule } from "./pages/FreeToolsModule";

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
        { path: "blog", Component: BlogModule },
        { path: "customers", Component: CustomersModule },
        { path: "invoicing", Component: InvoicingModule },
        { path: "sitemap", Component: SitemapModule },
        { path: "policies", Component: GooglePoliciesModule },
        { path: "content", Component: ContentModule },
        { path: "settings", Component: SettingsModule },
        { path: "tools", Component: ToolsModule },
        { path: "industries", Component: IndustriesModule },
        { path: "entities", Component: EntityManagerModule },
        { path: "cross-references", Component: CrossReferenceModule },
        { path: "solutions", Component: SolutionsModule },
        { path: "comparisons", Component: ComparisonModule },
        { path: "ai-content", Component: AiContentModule },
        { path: "navigation", Component: NavigationBuilderModule },
        { path: "seo", Component: SeoModule },
        { path: "case-studies", Component: CaseStudiesModule },
        { path: "free-tools", Component: FreeToolsModule },
      ],
    },
  ],
  {
    basename: "/admin",
  }
);
