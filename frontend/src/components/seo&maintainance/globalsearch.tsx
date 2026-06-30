"use client";

import { useState, useEffect, useRef, useReducer } from "react";
import Link from "next/link";
import { apiFetch } from "@/config/api";

const MIN_SEARCH_LENGTH = 2;

type SearchItem = {
  label: string;
  to: string;
};

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

type GlobalSearchProps = {
  placeholder?: string;
  limit?: number;
};

function flattenResults(
  results: SearchResults["results"],
  limit: number
): SearchItem[] {
  const flat: SearchItem[] = [];

  (results.tools ?? []).forEach((item) =>
    flat.push({
      label: `Tool: ${item.name}`,
      to: `/tools/${item.slug}`,
    })
  );

  (results.industries ?? []).forEach((item) =>
    flat.push({
      label: `Industry: ${item.name}`,
      to: `/industries/${item.slug}`,
    })
  );

  (results.solutions ?? []).forEach((item) =>
    flat.push({
      label: `Solution: ${item.name}`,
      to: `/solutions/${item.slug}`,
    })
  );

  (results.comparisons ?? []).forEach((item) =>
    flat.push({
      label: `Compare: ${item.title}`,
      to: `/compare/${item.slug}`,
    })
  );

  (results.case_studies ?? []).forEach((item) =>
    flat.push({
      label: `Case Study: ${item.title}`,
      to: `/case-studies/${item.slug}`,
    })
  );

  return flat.slice(0, limit);
}

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

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      dispatchSearch({ loading: true, searchError: false });

      try {
        const response = await apiFetch<SearchResults>(
          `/search?q=${encodeURIComponent(term)}&limit=${limit}`,
          {
            signal: controller.signal,
          }
        );

        const mapped = flattenResults(
          response.results ?? {},
          limit
        );

        dispatchSearch({ results: mapped, selectedIndex: -1 });
      } catch {
        if (!controller.signal.aborted) {
          dispatchSearch({ results: [], searchError: true });
        }
      } finally {
        if (!controller.signal.aborted) {
          dispatchSearch({ loading: false });
        }
      }
    }, 300);

    return () => {
      controller.abort();
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
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-16">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Global Search"
        className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
      />

      {searchState.loading && (
        <p className="mt-3 text-sm text-slate-400">
          Searching...
        </p>
      )}

      {!searchState.loading && searchState.results.length > 0 && (
        <ul className="mt-3 space-y-1">
          {searchState.results.map((item, index) => (
            <li key={item.to}>
              <Link
                href={item.to}
                ref={(node) => {
                  linkRefs.current[index] = node;
                }}
                onClick={clearSearch}
                className={`block rounded-lg px-3 py-2 transition-colors ${
                  searchState.selectedIndex === index
                    ? "bg-white/20 text-white"
                    : "text-slate-200 hover:bg-white/10"
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
            No results found for `${term}`.
          </p>
        )}
    </div>
  );
}
