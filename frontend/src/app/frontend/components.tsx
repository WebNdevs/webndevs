import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useId, useRef, useState } from "react";
import { apiFetch } from "@/config/api";
import { DSButton } from "../components/ds-button";

const cardStyles =
  "rounded-xl border border-white/10 bg-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-white/10 hover:shadow-[0_12px_28px_-16px_rgba(34,197,94,0.7)]";

function prefetchRoutes() {
  void import("./pages");
}

function Reveal({ children, delayMs = 0 }: { children: React.ReactNode; delayMs?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-500 motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function PrefetchLink({ to, className, children }: { to: string; className: string; children: React.ReactNode }) {
  return (
    <Link to={to} onMouseEnter={prefetchRoutes} onFocus={prefetchRoutes} className={className}>
      {children}
    </Link>
  );
}

type NavItem = { id: number; label: string; url: string | null; is_active: boolean; children?: NavItem[] };
type NavMenu = { id: number; location: string; name: string; is_active: boolean; items: NavItem[] };

const FALLBACK_NAV = [
  { label: "Tools", to: "/tools" },
  { label: "Industries", to: "/industries" },
  { label: "Solutions", to: "/solutions" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Comparison", to: "/compare" },
];

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [navItems, setNavItems] = useState<{ label: string; to: string }[]>(FALLBACK_NAV);

  useEffect(() => {
    apiFetch<NavMenu | null>("/navigation/header")
      .then((menu) => {
        if (!menu?.items?.length) return;
        const mapped = menu.items
          .filter((i) => i.is_active && i.url)
          .sort((a, b) => a.id - b.id)
          .map((i) => ({ label: i.label, to: i.url! }));
        if (mapped.length) setNavItems(mapped);
      })
      .catch(() => {
        // keep fallback items
      });
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = itemRefs.current.findIndex((el) => el === document.activeElement);
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (currentIndex < 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      itemRefs.current[(currentIndex + 1) % itemRefs.current.length]?.focus();
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      itemRefs.current[(currentIndex - 1 + itemRefs.current.length) % itemRefs.current.length]?.focus();
    }
  };

  return (
    <nav aria-label="Mega menu" className="rounded-xl border border-white/10 bg-white/5 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mega-menu-panel"
        className="w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm font-medium text-slate-100 hover:bg-white/15"
      >
        Browse Sections
      </button>
      <div
        id="mega-menu-panel"
        onKeyDown={handleKeyDown}
        aria-hidden={!open}
        className={`grid overflow-hidden transition-all duration-300 ${open ? "mt-3 max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mt-2">
          {navItems.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              onMouseEnter={prefetchRoutes}
              onFocus={prefetchRoutes}
              ref={(node) => { itemRefs.current[index] = node; }}
              className="rounded-lg bg-white/8 px-3 py-2 text-sm text-slate-100 hover:bg-white/15 focus-visible:bg-white/20"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function BreadcrumbNav({ items }: { items: { label: string; to?: string }[] }) {
  const schemaItems = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.label,
    ...(item.to ? { item: `${window.location.origin}${item.to}` } : {}),
  }));

  return (
    <>
      <SchemaOrg id="breadcrumb-schema" data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: schemaItems }} />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
        <ol className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {item.to ? <Link to={item.to}>{item.label}</Link> : <span className="text-white">{item.label}</span>}
              {idx < items.length - 1 ? <span>/</span> : null}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function RelatedEntitiesGrid({
  items,
}: {
  items: {
    title: string;
    slug?: string;
    type: string;
    entity_a?: { slug: string };
    entity_b?: { slug: string };
  }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const href =
          item.entity_a?.slug && item.entity_b?.slug
            ? `/${item.type}/${item.entity_a.slug}/${item.entity_b.slug}`
            : `/${item.type}/${item.slug}`;

        return (
          <Reveal
            key={`${item.type}-${item.slug || index}`}
            delayMs={index * 60}
          >
            <PrefetchLink
              to={href}
              className={`${cardStyles} block p-4`}
            >
              <p className="text-xs uppercase text-slate-300">
                {item.type}
              </p>

              <p className="font-semibold text-white">
                {item.title}
              </p>
            </PrefetchLink>
          </Reveal>
        );
      })}
    </div>
  );
}

export function EntityHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 md:p-6">
      <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">{title}</h1>
      <p className="mt-2 text-slate-200 md:max-w-3xl">{subtitle}</p>
    </header>
  );
}

export function DefinitionBox({ term, definition }: { term: string; definition: string }) {
  return (
    <section className="rounded-xl border border-blue-400/30 bg-blue-950/30 p-4">
      <p className="text-xs uppercase text-blue-300">Definition</p>
      <h2 className="text-lg font-semibold text-white">{term}</h2>
      <p className="mt-1 text-slate-200">{definition}</p>
    </section>
  );
}

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      {items.length > 0 ? <SchemaOrg id={`faq-schema-${uid}`} data={faqSchema} /> : null}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.question} className="rounded-lg border border-white/10">
            <button className="w-full px-4 py-3 text-left text-white" onClick={() => setOpen(open === index ? null : index)}>
              {item.question}
            </button>
            {open === index ? <p className="px-4 pb-4 text-slate-300">{item.answer}</p> : null}
          </div>
        ))}
      </div>
    </>
  );
}

export function ProcessSteps({ steps }: { steps: { title: string; description: string; duration?: string }[] }) {
  return (
    <ol className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 xl:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className={`${cardStyles} border-l-2 border-l-cyan-400 p-4`}>
          <p className="text-xs text-cyan-200">Step {i + 1}</p>
          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
          <p className="text-slate-200">{step.description}</p>
          {step.duration ? <p className="mt-2 text-xs text-slate-300">{step.duration}</p> : null}
        </li>
      ))}
    </ol>
  );
}

function AnimatedMetric({ value }: { value: string }) {
  const [current, setCurrent] = useState(0);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    const match = value.match(/^(.*?)(\d+(?:\.\d+)?)(.*)/);
    if (!match) {
      setCurrent(0);
      setPrefix("");
      setSuffix(value);
      return;
    }
    setPrefix(match[1] ?? "");
    const target = Number(match[2]);
    setSuffix(match[3] ?? "");
    let raf = 0;
    const startedAt = performance.now();
    const duration = 850;
    const step = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      setCurrent(Math.round(target * progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span>
      {prefix}
      {current}
      {suffix}
    </span>
  );
}

export function MetricCards({ items }: { items: { label: string; before: string; after: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Reveal key={item.label} delayMs={index * 80}>
          <article className={`${cardStyles} p-4`}>
            <p className="text-sm text-slate-200">{item.label}</p>
            <p className="text-rose-200">Before: <AnimatedMetric value={item.before} /></p>
            <p className="text-emerald-200">After: <AnimatedMetric value={item.after} /></p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function StatCallout({ label, value, source }: { label: string; value: string; source: string }) {
  return (
    <article className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
      <p className="text-sm text-emerald-300">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">Source: {source}</p>
    </article>
  );
}

export function TestimonialCard({ item }: { item: { name: string; company: string; content: string; rating?: number } }) {
  const stars = "★".repeat(item.rating || 5);
  return (
    <article className={`${cardStyles} p-4`}>
      <p className="text-amber-300">{stars}</p>
      <p className="mt-2 text-slate-100">{item.content}</p>
      <p className="mt-3 text-sm text-slate-200">
        {item.name} · {item.company}
      </p>
    </article>
  );
}

export function ToolCard({ slug, name, category, description }: { slug: string; name: string; category: string; description: string }) {
  return (
    <PrefetchLink to={`/tools/${slug}`} className={`${cardStyles} block p-4`}>
      <p className="text-xs text-slate-300">{category}</p>
      <h3 className="font-semibold text-white">{name}</h3>
      <p className="text-sm text-slate-200">{description}</p>
    </PrefetchLink>
  );
}

export function IndustryCard({ slug, name, description }: { slug: string; name: string; description: string }) {
  return (
    <PrefetchLink to={`/industries/${slug}`} className={`${cardStyles} block p-4`}>
      <h3 className="font-semibold text-white">{name}</h3>
      <p className="text-sm text-slate-200">{description}</p>
    </PrefetchLink>
  );
}

export function SolutionCard({ slug, name, summary }: { slug: string; name: string; summary: string }) {
  return (
    <PrefetchLink to={`/solutions/${slug}`} className={`${cardStyles} block p-4`}>
      <h3 className="font-semibold text-white">{name}</h3>
      <p className="text-sm text-slate-200">{summary}</p>
    </PrefetchLink>
  );
}

export function CTABanner({ title, actionLabel }: { title: string; actionLabel: string }) {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToContact = () => {
    const el = document.getElementById("get-started");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleClick = () => {
    if (location.pathname === "/") {
      scrollToContact();
    } else {
      navigate("/", { state: { scrollTo: "get-started" } });
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-[#1F2937] to-[#111827] border border-[#22C55E]/30 p-6">
      <h2 className="text-xl font-bold text-[#F9FAFB] mb-2">{title}</h2>
      <p className="text-[14px] text-[#9CA3AF] mb-4">Fill out the form and we'll get back to you within 24 hours.</p>
      <DSButton type="button" size="md" onClick={handleClick}>
        {actionLabel}
      </DSButton>
    </div>
  );
}

export function FeatureMatrix({
  rows,
  labels,
}: {
  rows: { feature: string; values: string[] }[];
  labels: string[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="min-w-[640px] w-full text-sm text-slate-200">
        <thead>
          <tr>
            <th className="p-3 text-left">Feature</th>
            {labels.map((label) => (
              <th key={label} className="p-3 text-left">
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-t border-white/10">
              <td className="p-3">{row.feature}</td>

              {row.values.map((value, index) => (
                <td key={`${row.feature}-${index}`} className="p-3">
                  {value || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TechStackDisplay({ tools }: { tools: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((tool) => (
        <span key={tool} className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
          {tool}
        </span>
      ))}
    </div>
  );
}

export function FilterBar({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
      >
        {selected?.label ?? "Filter"}
        <span className={`text-xs transition-transform duration-150 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 min-w-[9rem] rounded-lg border border-white/20 bg-[#1f2937] py-1 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-white/10 ${value === opt.value ? "text-emerald-400" : "text-slate-100"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded bg-white/10 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-40">
        Prev
      </button>
      <span className="text-slate-200">
        Page {page} / {total}
      </span>
      <button disabled={page >= total} onClick={() => onChange(page + 1)} className="rounded bg-white/10 px-3 py-1 text-white disabled:cursor-not-allowed disabled:opacity-40">
        Next
      </button>
    </div>
  );
}

export function LoadingSkeleton() {
  return <div className="h-32 animate-pulse rounded-xl bg-white/10" />;
}

export function TableOfContents({ items }: { items: string[] }) {
  return (
    <aside className="rounded-xl border border-white/10 p-4">
      <p className="font-semibold text-white">Table of Contents</p>
      <ul className="mt-2 space-y-1 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

export function SocialShare({ url }: { url: string }) {
  return (
    <div className="flex gap-2">
      <a
        className="rounded border border-white/20 px-3 py-1 text-sm text-white"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
      </a>
      <a
        className="rounded border border-white/20 px-3 py-1 text-sm text-white"
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
      >
        X
      </a>
    </div>
  );
}

type SearchResults = {
  query: string;
  results: {
    tools?: { name: string; slug: string }[];
    industries?: { name: string; slug: string }[];
    solutions?: { name: string; slug: string }[];
    comparisons?: { title: string; slug: string }[];
    case_studies?: { title: string; slug: string }[];
  };
};

export function GlobalSearch() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<{ label: string; to: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (term.length < 2) { setResults([]); setSearchError(false); return; }

    timerRef.current = setTimeout(() => {
      setLoading(true);
      setSearchError(false);
      apiFetch<SearchResults>(`/search?q=${encodeURIComponent(term)}&limit=5`)
        .then((res) => {
          const r = res.results ?? {};
          const flat: { label: string; to: string }[] = [
            ...(r.tools ?? []).map((t) => ({ label: `Tool: ${t.name}`, to: `/tools/${t.slug}` })),
            ...(r.industries ?? []).map((i) => ({ label: `Industry: ${i.name}`, to: `/industries/${i.slug}` })),
            ...(r.solutions ?? []).map((s) => ({ label: `Solution: ${s.name}`, to: `/solutions/${s.slug}` })),
            ...(r.comparisons ?? []).map((c) => ({ label: `Compare: ${c.title}`, to: `/compare/${c.slug}` })),
            ...(r.case_studies ?? []).map((cs) => ({ label: `Case Study: ${cs.title}`, to: `/case-studies/${cs.slug}` })),
          ];
          setResults(flat.slice(0, 8));
        })
        .catch(() => { setResults([]); setSearchError(true); })
        .finally(() => setLoading(false));
    }, 300);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [term]);

  return (
    <div className="rounded-xl border border-white/10 p-3">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search tools, industries, solutions…"
        className="w-full rounded bg-white/10 px-3 py-2 text-white placeholder:text-slate-400"
        aria-label="Global search"
      />
      {loading && <p className="mt-2 text-xs text-slate-400">Searching…</p>}
      {!loading && results.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-slate-300">
          {results.map((r) => (
            <li key={r.to}>
              <Link
                to={r.to}
                onClick={() => { setTerm(""); setResults([]); }}
                className="block rounded px-2 py-1 text-slate-200 hover:bg-white/10"
              >
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!loading && searchError && (
        <p className="mt-2 text-xs text-slate-400">Search is unavailable right now.</p>
      )}
      {!loading && !searchError && term.length >= 2 && results.length === 0 && (
        <p className="mt-2 text-xs text-slate-400">No results for "{term}".</p>
      )}
    </div>
  );
}

export function SchemaOrg({ id, data }: { id: string; data: Record<string, unknown> }) {
  useEffect(() => {
    const selector = `script[data-schema-id="${id}"]`;
    let script = document.head.querySelector(selector) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.schemaId = id;
      document.head.appendChild(script);
    }

    script.text = JSON.stringify(data);
    return () => script?.remove();
  }, [id, data]);

  return null;
}
