"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

export type MegaMenuItem = {
  label: string;
  to: string;
};

type MegaMenuProps = {
  items?: MegaMenuItem[];
};

const FALLBACK_NAV: MegaMenuItem[] = [
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Data Hub", to: "/data-hub" },
  { label: "Contact", to: "/contact" },
];

export function MegaMenu({
  items = FALLBACK_NAV,
}: MegaMenuProps) {
  const [open, setOpen] = useState(false);

  const itemRefs =
    useRef<(HTMLAnchorElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex =
        itemRefs.current.findIndex(
          (el) => el === document.activeElement
        );

      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (currentIndex < 0) return;

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();

        itemRefs.current[
          (currentIndex + 1) %
            itemRefs.current.length
        ]?.focus();
      }

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();

        itemRefs.current[
          (currentIndex - 1 +
            itemRefs.current.length) %
            itemRefs.current.length
        ]?.focus();
      }
    },
    []
  );

  return (
    <nav
      aria-label="Site Navigation"
      className="rounded-xl border border-white/10 bg-white/5 p-4"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
        aria-expanded={open}
        aria-controls="mega-menu-panel"
        className="w-full rounded-lg bg-white/10 px-4 py-3 text-left text-sm font-medium text-slate-100 hover:bg-white/15"
      >
        Browse Sections
      </button>

      <div
        id="mega-menu-panel"
        aria-hidden={!open}
        onKeyDown={handleKeyDown}
        className={`
          overflow-hidden
          transition-all
          duration-300
          ${
            open
              ? "mt-4 max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item, index) => (
            <Link
              key={item.to}
              href={item.to}
              ref={(node) => {
                itemRefs.current[index] =
                  node;
              }}
              aria-label={item.label}
              className="rounded-lg bg-white/10 px-4 py-3 text-sm text-slate-100 hover:bg-white/15 focus-visible:bg-white/20"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

// export function BreadcrumbNav({ items }: { items: { label: string; to?: string }[] }) {
//   const schemaItems = items.map((item, index) => ({
//     "@type": "ListItem",
//     position: index + 1,
//     name: item.label,
//     ...(item.to ? { item: `${window.location.origin}${item.to}` } : {}),
//   }));

//   return (
//     <>
//       <SchemaOrg id="breadcrumb-schema" data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: schemaItems }} />
//       <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
//         <ol className="flex flex-wrap gap-2">
//           {items.map((item, idx) => (
//             <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
//               {item.to ? <Link href={item.to}>{item.label}</Link> : <span className="text-white">{item.label}</span>}
//               {idx < items.length - 1 ? <span>/</span> : null}
//             </li>
//           ))}
//         </ol>
//       </nav>
//     </>
//   );
// }

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