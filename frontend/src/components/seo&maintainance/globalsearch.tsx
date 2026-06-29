"use client";

import { useState, useEffect, useRef } from "react";
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

export function GlobalSearch({
  placeholder = "Search tools, industries, solutions...",
  limit = 8,
}: GlobalSearchProps) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (term.length < MIN_SEARCH_LENGTH) {
      setResults([]);
      setSearchError(false);
      setSelectedIndex(-1);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setSearchError(false);

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

        setResults(mapped);
        setSelectedIndex(-1);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setSearchError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
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
      selectedIndex >= 0 &&
      selectedIndex < linkRefs.current.length
    ) {
      linkRefs.current[selectedIndex]?.focus();
    }
  }, [selectedIndex]);

  const clearSearch = () => {
    setTerm("");
    setResults([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!results.length) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;

      case "Escape":
        clearSearch();
        break;

      case "Enter":
        if (
          selectedIndex >= 0 &&
          results[selectedIndex]
        ) {
          window.location.href =
            results[selectedIndex].to;
        }
        break;
    }
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

      {loading && (
        <p className="mt-3 text-sm text-slate-400">
          Searching...
        </p>
      )}

      {!loading && results.length > 0 && (
        <ul className="mt-3 space-y-1">
          {results.map((item, index) => (
            <li key={item.to}>
              <Link
                href={item.to}
                ref={(node) => {
                  linkRefs.current[index] = node;
                }}
                onClick={clearSearch}
                className={`block rounded-lg px-3 py-2 transition-colors ${
                  selectedIndex === index
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

      {!loading && searchError && (
        <p className="mt-3 text-sm text-slate-400">
          Search is unavailable right now.
        </p>
      )}

      {!loading &&
        !searchError &&
        term.length >= MIN_SEARCH_LENGTH &&
        results.length === 0 && (
          <p className="mt-3 text-sm text-slate-400">
            No results found for "{term}".
          </p>
        )}
    </div>
  );
}