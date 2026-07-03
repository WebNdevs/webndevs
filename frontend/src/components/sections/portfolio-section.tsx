"use client";

import { useState, useMemo } from "react";
import { HeaderSection } from '../cards/header-card';
import { getHome } from '@/data/homedata';
import { StatsCardGrid, StatsCardProps } from '../cards/stats-card';
import { ShortCTA } from './cta-section';
import { PageHero, PageHeroProps } from './pagehero';
import { useContentPage, ContentItem } from '@/hooks/useContentPage';
import { Search, ExternalLink } from "lucide-react";

export type PortfolioSectionProps = {
  variant?: "preview" | "full";
}

export function PortfolioSection({ variant = 'full' }: PortfolioSectionProps) {
  const staticSection = getHome("portfolio");
  const { data: pageData } = useContentPage("portfolio");

  // Determine section headers / hero
  const section = pageData?.sections.find(s => s.section_key === "portfolio") || staticSection;
  const heroData = pageData?.sections.find(s => s.section_key === "hero") || staticSection?.hero;
  const ctaData = pageData?.sections.find(s => s.section_key === "cta") || staticSection?.cta;

  // Construct dynamic/static hero props
  const heroProps = useMemo(() => {
    if (!heroData) return null;
    return {
      tag: (heroData as any).tag || "OUR WORK",
      title1: (heroData as any).subheading1 || (heroData as any).title1 || (heroData as any).title || "Selected",
      title2: (heroData as any).subheading2 || (heroData as any).title2 || "Digital Legacies.",
      description: (heroData as any).subtext || (heroData as any).description || (heroData as any).content || "",
    };
  }, [heroData]);

  // Items fallback: use DB items if pageData loaded successfully, otherwise static items
  const dbItems = pageData?.sections.find(s => s.section_key === "portfolio")?.items;
  const rawItems = (dbItems && dbItems.length > 0 ? dbItems : staticSection?.items || []) as ContentItem[];

  // State for filters (only for full view)
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories dynamically from the actual items
  const categories = useMemo(() => {
    const cats = new Set<string>();
    rawItems.forEach(item => {
      const catStr = item.pro_category || item.category || "";
      catStr.split(",").map(c => c.trim()).forEach(c => {
        if (c) cats.add(c);
      });
    });
    return ["All", ...Array.from(cats)];
  }, [rawItems]);

  // Filter items based on active category and search query
  const filteredItems = useMemo(() => {
    let result = rawItems;

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter(item => {
        const catStr = item.pro_category || item.category || "";
        const itemCats = catStr.split(",").map(c => c.trim().toLowerCase());
        return itemCats.includes(activeCategory.toLowerCase());
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => {
        const title = item.pro_name || item.title;
        const desc = item.pro_description || item.description;
        return (
          title?.toLowerCase().includes(query) ||
          desc?.toLowerCase().includes(query)
        );
      });
    }

    // Limit to 6 for home page preview if variant is preview
    if (variant === "preview") {
      return result.slice(0, 6);
    }

    return result;
  }, [rawItems, activeCategory, searchQuery, variant]);

  if (!section) return null;

  return (
    <section id="portfolio" aria-label="Our Portfolio" className="py-20 px-6 bg-[#0B0F14] text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Page Hero */}
        {heroProps && <PageHero variant={variant} {...heroProps as PageHeroProps} />}

        <HeaderSection 
          tag={section.tag || undefined}
          subheading1={section.subheading1 || undefined}
          subheading2={section.subheading2 || undefined}
          subtext={section.subtext || undefined}
        />

        {/* Filters & Search - ONLY displayed on full view */}
        {variant === "full" && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 bg-[#111827]/40 p-6 rounded-xl border border-gray-800/40">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#22C55E] text-[#0B0F14] shadow-[0_0_15px_rgba(34,197,94,0.3)] font-semibold"
                        : "bg-[#1f2937]/50 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-[#1f2937]/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
              />
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredItems.map((item, index) => {
              const projectUrl = item.pro_url || item.url || "#";
              const imageUrl = getRelativeImageUrl(item.avatar);
              const category = item.pro_category || item.category || "Project";
              const title = item.pro_name || item.title || "Untitled Project";

              return (
                <div
                  key={item.id || index}
                  className="group block bg-[#111827] border border-gray-800/40 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.15)] hover:border-gray-700/60 transition-all duration-300 flex flex-col"
                >
                  {/* Scroll-on-hover screenshot container pointing to image */}
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-image-scroll-container w-full h-[260px] relative overflow-hidden bg-gray-900 border-b border-gray-800/40 block cursor-pointer"
                  >
                    <div
                      className="portfolio-image-scroll-bg w-full h-full"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    
                    {/* Hover Link Overlay */}
                    <div className="absolute inset-0 bg-[#0B0F14]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <div className="p-3 bg-[#22C55E] text-[#0B0F14] rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <ExternalLink size={20} strokeWidth={2.5} />
                      </div>
                    </div>
                  </a>

                  {/* Title & Category Bar pointing to website */}
                  <a
                    href={projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 flex flex-col justify-between grow block hover:bg-[#1f2937]/20 transition-colors"
                  >
                    <div>
                      <span className="text-[12px] font-bold text-[#22C55E] uppercase tracking-wider mb-2 block">
                        {category}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#22C55E] transition-colors line-clamp-1">
                        {title}
                      </h3>
                      {(item.pro_description || item.description) && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                          {item.pro_description || item.description}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111827]/20 border border-gray-800/40 rounded-xl mb-16">
            <p className="text-gray-400 text-base">No projects found matching your filters.</p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 text-[#22C55E] hover:underline text-sm font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Stats Section - dynamically rendered from API if present, otherwise static */}
        {(section as any).stats && <StatsCardGrid items={(section as any).stats as StatsCardProps[]} />}

        {/* CTA */}
        {ctaData && <ShortCTA variant={variant} {...ctaData as any} />}
      </div>
    </section>
  );
}

function getRelativeImageUrl(url: string | null | undefined): string {
  if (!url) return "/image.jpg";
  const storageIndex = url.indexOf("/storage/");
  if (storageIndex !== -1) {
    return url.substring(storageIndex);
  }
  return url;
}
