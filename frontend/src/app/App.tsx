import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { ErrorBoundary } from "./components/error-boundary";
import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";
import { useMaintenanceMode } from "./hooks/useMaintenanceMode";

// If a lazy chunk fails to load (stale hash after HMR or deploy), reload the page
// once so the browser fetches the fresh chunk rather than crashing into the error boundary.
function retryLazyLoad<T>(factory: () => Promise<T>): Promise<T> {
  return factory().catch(() => {
    window.location.reload();
    return new Promise<T>(() => {});
  });
}

const HomePage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.HomePage }))));
const ServicesPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.ServicesPage }))));
const PortfolioPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.PortfolioPage }))));
const TestimonialsPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.TestimonialsPage }))));
const DataHubPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.DataHubPage }))));
const ContactPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.ContactPage }))));
const FAQPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.FAQPage }))));
const CategoryListingPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.CategoryListingPage }))));
const EntityDetailPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.EntityDetailPage }))));
const CrossReferencePage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.CrossReferencePage }))));
const IndustryPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.IndustryPage }))));
const SolutionPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.SolutionPage }))));
const ComparisonPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.ComparisonPage }))));
const ComparisonListingPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.ComparisonListingPage }))));
const CaseStudyListingPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.CaseStudyListingPage }))));
const CaseStudySinglePage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.CaseStudySinglePage }))));
const FreeToolPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.FreeToolPage }))));
const FreeToolListingPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.FreeToolListingPage }))));
const BlogListingPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.BlogListingPage }))));
const BlogSinglePage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.BlogSinglePage }))));
const ServiceDetailPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.ServiceDetailPage }))));
const ServerErrorPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.ServerErrorPage }))));
const NotFoundPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.NotFoundPage }))));
const MaintenancePage = lazy(() => retryLazyLoad(() => import("./frontend/MaintenancePage").then((m) => ({ default: m.MaintenancePage }))));
const PrivacyPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.PrivacyPolicyPage }))));
const TermsPage = lazy(() => retryLazyLoad(() => import("./frontend/pages").then((m) => ({ default: m.TermsOfServicePage }))));

function GlobalOrganizationSchema() {
  useEffect(() => {
    const selector = 'script[data-schema-id="organization-global"]';
    let script = document.head.querySelector(selector) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.schemaId = "organization-global";
      document.head.appendChild(script);
    }

    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "WebNDevs",
      url: window.location.origin,
    });
  }, []);

  return null;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="min-h-screen bg-[#0B0F14]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#111827] focus:px-4 focus:py-2 focus:text-[#F9FAFB]"
      >
        Skip to main content
      </a>
      <GlobalOrganizationSchema />
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}

const suspenseFallback = (
  <div className="grid gap-3 px-4 py-8" aria-live="polite" aria-busy="true">
    <div className="skeleton-block h-8 w-2/5 rounded-md" />
    <div className="skeleton-block h-4 w-full rounded-md" />
    <div className="skeleton-block h-4 w-4/5 rounded-md" />
    <div className="skeleton-block h-28 w-full rounded-lg" />
  </div>
);

// Reads location.state.scrollTo (set by Navbar when navigating home from an
// inner page) and scrolls to the target section after the page renders.
// Polls until the element exists in the DOM (lazy-loaded pages mount asynchronously).
function ScrollToSection() {
  const location = useLocation();
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target || location.pathname !== "/") return;
    let attempts = 0;
    let timerId: ReturnType<typeof setTimeout>;
    const tryScroll = () => {
      const el = document.getElementById(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: "smooth" });
      } else if (++attempts < 20) {
        timerId = setTimeout(tryScroll, 150);
      }
    };
    timerId = setTimeout(tryScroll, 100);
    return () => clearTimeout(timerId);
  }, [location]);
  return null;
}
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
// Separated so useLocation() is available inside BrowserRouter.
// ErrorBoundary uses location.key (unique per history entry) so it resets on
// every navigation — including back/forward to the same pathname.
// The inner div uses location.pathname for the CSS fade animation so it only
// re-triggers on actual path changes, not on query/hash updates.
function AppRoutes() {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.key}>
      <ScrollToSection />
      <div key={location.pathname} className="route-fade-in">
        <Suspense fallback={suspenseFallback}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/data" element={<DataHubPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/tools" element={<CategoryListingPage type="tools" />} />
            <Route path="/tools/:slug" element={<EntityDetailPage />} />
            <Route path="/tools/:toolSlug/:crossrefSlug" element={<CrossReferencePage />} />

            <Route path="/industries" element={<CategoryListingPage type="industries" />} />
            <Route path="/industries/:slug" element={<IndustryPage />} />

            <Route path="/crm" element={<CategoryListingPage type="crm" />} />
            <Route path="/crm/:slug" element={<EntityDetailPage />} />
            <Route path="/crm/:slug/:crossref" element={<CrossReferencePage />} />

            <Route path="/automation" element={<CategoryListingPage type="automation" />} />
            <Route path="/automation/:slug" element={<EntityDetailPage />} />
            <Route path="/automation/:slug/:crossref" element={<CrossReferencePage />} />

            <Route path="/platforms" element={<CategoryListingPage type="platforms" />} />
            <Route path="/platforms/:slug" element={<EntityDetailPage />} />

            <Route path="/services/:slug" element={<ServiceDetailPage />} />

            <Route path="/solutions" element={<CategoryListingPage type="solutions" />} />
            <Route path="/solutions/:slug" element={<SolutionPage />} />

            <Route path="/compare" element={<ComparisonListingPage />} />
            <Route path="/compare/:slug" element={<ComparisonPage />} />
            <Route path="/case-studies" element={<CaseStudyListingPage />} />
            <Route path="/case-studies/:slug" element={<CaseStudySinglePage />} />
            <Route path="/free-tools" element={<FreeToolListingPage />} />
            <Route path="/free-tools/:slug" element={<FreeToolPage />} />

            <Route path="/blogs" element={<BlogListingPage />} />
            <Route path="/blogs/:slug" element={<BlogSinglePage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  const { isUnderMaintenance, isLoading } = useMaintenanceMode();

  // Show loading while checking maintenance mode
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-[#6366F1] animate-pulse">Loading...</div>
      </div>
    );
  }

  // Show maintenance page when enabled
  if (isUnderMaintenance) {
    return (
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-[#0B0F14] flex items-center justify-center"><div className="text-[#6366F1]">Loading...</div></div>}>
          <MaintenancePage />
        </Suspense>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Shell>
        <ScrollToTop />
        <AppRoutes />
      </Shell>
    </BrowserRouter>
  );
}

export default App;
