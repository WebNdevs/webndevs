"use client";

import { useState, useEffect, useRef, useReducer } from "react";
import Link from "next/link";
import { solutionPages } from "@/data/solution";
import { ServicePages } from "@/data/services";
import { IndustryPages } from "@/data/industry";
import { getDataHub } from "@/data/datahub";

const MIN_SEARCH_LENGTH = 2;

type SearchItem = {
  label: string;
  to: string;
};

type GlobalSearchProps = {
  placeholder?: string;
  limit?: number;
};

type SearchState = {
  results: SearchItem[];
  loading: boolean;
  searchError: boolean;
  selectedIndex: number;
};

type SearchAction = Partial<SearchState>;

export function GlobalSearch({
  placeholder = "Search tools, industries, solutions...",
  limit = 8,
}: GlobalSearchProps) {
  const [term, setTerm] = useState("");
  const [searchState, dispatchSearch] = useReducer(
    (state: SearchState, action: SearchAction): SearchState => ({
      ...state,
      ...action,
    }),
    {
      results: [],
      loading: false,
      searchError: false,
      selectedIndex: -1,
    }
  );

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (term.length < MIN_SEARCH_LENGTH) {
      dispatchSearch({ results: [], searchError: false, selectedIndex: -1 });
      return;
    }

    dispatchSearch({ loading: true, searchError: false });

    const timer = setTimeout(() => {
      try {
        const query = term.toLowerCase().trim();
        const results: SearchItem[] = [];

        // 1. Search Services
        ServicePages.forEach((page) => {
          const title = `${page.hero?.title1 || ""} ${page.hero?.title2 || ""}`;
          const desc = page.hero?.description || "";
          const seoTitle = page.seo?.title || "";
          const seoDesc = page.seo?.description || "";

          if (
            seoTitle.toLowerCase().includes(query) ||
            seoDesc.toLowerCase().includes(query) ||
            title.toLowerCase().includes(query) ||
            desc.toLowerCase().includes(query)
          ) {
            results.push({
              label: `Service: ${page.seo?.title || title || page.slug}`,
              to: `/services/${page.slug}`,
            });
          }
        });

        // 2. Search Solutions
        solutionPages.forEach((page) => {
          const title = `${page.hero?.title1 || ""} ${page.hero?.title2 || ""}`;
          const desc = page.hero?.description || "";
          const seoTitle = page.seo?.title || "";
          const seoDesc = page.seo?.description || "";

          if (
            seoTitle.toLowerCase().includes(query) ||
            seoDesc.toLowerCase().includes(query) ||
            title.toLowerCase().includes(query) ||
            desc.toLowerCase().includes(query)
          ) {
            results.push({
              label: `Solution: ${page.seo?.title || title || page.slug}`,
              to: `/solutions/${page.slug}`,
            });
          }
        });

        // 3. Search Industries
        IndustryPages.forEach((page) => {
          const title = `${page.hero?.title1 || ""} ${page.hero?.title2 || ""}`;
          const desc = page.hero?.description || "";
          const seoTitle = page.seo?.title || "";
          const seoDesc = page.seo?.description || "";

          if (
            seoTitle.toLowerCase().includes(query) ||
            seoDesc.toLowerCase().includes(query) ||
            title.toLowerCase().includes(query) ||
            desc.toLowerCase().includes(query)
          ) {
            results.push({
              label: `Industry: ${page.seo?.title || title || page.slug}`,
              to: `/industries/${page.slug}`,
            });
          }
        });

        // 4. Search Tools
        const toolsSection = getDataHub("tools");
        if (toolsSection) {
          const toolsItems = [
            ...(toolsSection.featured?.items || []),
            ...(toolsSection.directory?.items || []),
            ...(toolsSection.tools?.items || []),
          ];
          const uniqueTools = new Set<string>();
          toolsItems.forEach((item) => {
            const title = item.title || "";
            const desc = (item as { description?: string }).description || "";
            if (
              (title.toLowerCase().includes(query) ||
                desc.toLowerCase().includes(query)) &&
              !uniqueTools.has(title)
            ) {
              uniqueTools.add(title);
              results.push({
                label: `Tool: ${title}`,
                to: `/tools`,
              });
            }
          });
        }

        // 5. Search Comparisons
        const compSection = getDataHub("comparisons");
        if (compSection && compSection.items) {
          (compSection.items as { title?: string; description?: string }[]).forEach((item) => {
            const title = item.title || "";
            const desc = item.description || "";
            if (
              title.toLowerCase().includes(query) ||
              desc.toLowerCase().includes(query)
            ) {
              results.push({
                label: `Compare: ${title}`,
                to: `/comparisons`,
              });
            }
          });
        }

        // 6. Search Case Studies
        const caseSection = getDataHub("case-studies");
        if (caseSection && caseSection.items) {
          (
            caseSection.items as {
              title?: string;
              excerpt?: string;
              content?: string;
            }[]
          ).forEach((item) => {
            const title = item.title || "";
            const excerpt = item.excerpt || "";
            const content = item.content || "";
            if (
              title.toLowerCase().includes(query) ||
              excerpt.toLowerCase().includes(query) ||
              content.toLowerCase().includes(query)
            ) {
              results.push({
                label: `Case Study: ${title}`,
                to: `/case-studies`,
              });
            }
          });
        }

        // 7. Search Blogs
        const blogsSection = getDataHub("blogs");
        if (blogsSection && blogsSection.items) {
          (blogsSection.items as { title?: string; description?: string }[]).forEach((item) => {
            const title = item.title || "";
            const desc = item.description || "";
            if (
              title.toLowerCase().includes(query) ||
              desc.toLowerCase().includes(query)
            ) {
              results.push({
                label: `Blog: ${title}`,
                to: `/blogs`,
              });
            }
          });
        }

        dispatchSearch({ results: results.slice(0, limit), selectedIndex: -1 });
      } catch (err) {
        console.error(err);
        dispatchSearch({ results: [], searchError: true });
      } finally {
        dispatchSearch({ loading: false });
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [term, limit]);

  useEffect(() => {
    if (
      searchState.selectedIndex >= 0 &&
      searchState.selectedIndex < linkRefs.current.length
    ) {
      linkRefs.current[searchState.selectedIndex]?.focus();
    }
  }, [searchState.selectedIndex]);

  const clearSearch = () => {
    setTerm("");
    dispatchSearch({ results: [], selectedIndex: -1 });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!searchState.results.length) return;

    const resultsLength = searchState.results.length;
    let newIndex = searchState.selectedIndex;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        newIndex = searchState.selectedIndex < resultsLength - 1 
          ? searchState.selectedIndex + 1 
          : 0;
        break;

      case "ArrowUp":
        event.preventDefault();
        newIndex = searchState.selectedIndex > 0 
          ? searchState.selectedIndex - 1 
          : resultsLength - 1;
        break;

      case "Escape":
        clearSearch();
        return;

      case "Enter":
        if (
          searchState.selectedIndex >= 0 &&
          searchState.results[searchState.selectedIndex]
        ) {
          window.location.href =
            searchState.results[searchState.selectedIndex].to;
        }
        return;

      default:
        return;
    }

    dispatchSearch({ selectedIndex: newIndex });
  };

  return (
    <div role="search" className="rounded-xl border border-white/10 p-4 mb-16">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Global Search"
        className="w-full rounded-lg bg-linear-to-r from-[#22C55E]/10 to-[#06B6D4]/10 px-4 py-3 text-white placeholder:text-slate-400 border border-transparent hover:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
      />

      {searchState.loading && (
        <p className="mt-3 text-sm text-slate-400 animate-pulse">
          Searching...
        </p>
      )}

      {!searchState.loading && searchState.results.length > 0 && (
        <ul className="mt-3 space-y-1">
          {searchState.results.map((item, index) => (
            <li key={item.to + index}>
              <Link
                href={item.to}
                ref={(node) => {
                  linkRefs.current[index] = node;
                }}
                onClick={clearSearch}
                className={`block rounded-lg px-3 py-2 transition-colors ${
                  searchState.selectedIndex === index
                    ? "bg-white/20 text-white"
                    : "text-slate-200 hover:bg-linear-to-r from-[#22C55E]/15 to-[#06B6D4]/15"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!searchState.loading && searchState.searchError && (
        <p className="mt-3 text-sm text-slate-400">
          Search is unavailable right now.
        </p>
      )}

      {!searchState.loading &&
        !searchState.searchError &&
        term.length >= MIN_SEARCH_LENGTH &&
        searchState.results.length === 0 && (
          <p className="mt-3 text-sm text-slate-400">
            No results found for &ldquo;{term}&rdquo;.
          </p>
        )}
    </div>
  );
}
