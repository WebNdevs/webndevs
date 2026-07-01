"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DSButton } from "./DScomponents";
import { ContentCardProps, ContentCardGrid } from "./content-card";

type ContentModalProps = {
  content?: ContentCardProps | null;
  onClose: () => void;
};

export function ContentModal({content, onClose} : ContentModalProps) {
  useEffect(() => {
    document.body.style.overflow =
      content ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [content]);

  if (!content) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 mt-10 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#111827] rounded-2xl p-8"
      >
        <button
          onClick={onClose}
          className="float-right text-[#9CA3AF]"
        >
          ✕
        </button>

        <Image
          width={300}
          height={48}
          src={content.image || "/logo.png"}
          alt={content.title || "WebNDevs Project Showcase"}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />

        <h2 className="text-4xl font-bold text-white mb-4">
          {content.title}
        </h2>

        {content.tags?.length ? (
          <div className="flex flex-wrap gap-2 my-3">
            {content.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-[11px] rounded-full bg-[#111827] border border-[#374151] text-[#22C55E]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="text-[#D1D5DB] whitespace-pre-wrap leading-relaxed">
          {content.content}
        </div>
      </div>
    </div>
  );
}

type ContentViewerProps = {
  items?: ContentCardProps[];
};

export function ContentViewer({items = []} : ContentViewerProps) {
  const [selectedContent, setSelectedContent] = useState<ContentCardProps | null>(null);

  const [filter, setFilter] = useState<"latest" | "featured">("latest");

  const filteredContents = useMemo(() => {
    if (filter === "featured") {
      return items.filter(
        (content) => content.featured
      );
    }

    return [...items].sort(
      (a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    )
  }, [items, filter]);

  return (
    <>
      <div className="flex justify-center gap-4 mb-10">
        <DSButton
          variant={
            filter === "latest"
              ? "primary"
              : "secondary"
          }
          onClick={() =>
            setFilter("latest")
          }
        >
          Latest
        </DSButton>

        <DSButton
          variant={
            filter === "featured"
              ? "primary"
              : "secondary"
          }
          onClick={() =>
            setFilter("featured")
          }
        >
          Featured
        </DSButton>
      </div>

      <ContentCardGrid
        items={filteredContents}
        onSelect={setSelectedContent}
      />

      <ContentModal
        content={selectedContent}
        onClose={() =>
          setSelectedContent(null)
        }
      />
    </>
  );
}