"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { ChevronDown } from "lucide-react";

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterBarProps = {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
};

export const filterOptions = (
  categories: string[]
): FilterOption[] => [
  { value: "all", label: "All" },
  ...categories.map((category) => ({
    value: category.toLowerCase(),
    label: category,
  })),
];

export const FilterBar = memo(function FilterBar({
  options,
  value,
  onChange,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? options[0],
    [options, value]
  );

  const toggleDropdown = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      onChange(value);
      setOpen(false);
    },
    [onChange]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex flex-wrap gap-3">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              aria-pressed={active}
              className={[
                "rounded-full border px-4 py-2 text-sm font-medium",
                "transition-colors duration-150",
                active
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "border-white/10  text-slate-300 hover:border-[#22C55E]/50 hover:text-[#22C55E]",
              ].join(" ")}
            >
              <span>{option.label}</span>

              {option.count !== undefined && (
                <span className="ml-2 text-xs opacity-70">
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile */}
      <div
        ref={dropdownRef}
        className="relative inline-block md:hidden"
      >
        <button
          type="button"
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Filter by category"
          className="flex min-w-48 items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors duration-150 hover:bg-white/10"
        >
          <span>{selected.label}</span>

          <ChevronDown
            className={`h-4 w-4 transition-transform duration-150 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-2xl">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                aria-pressed={option.value === value}
                className={[
                  "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
                  "transition-colors duration-150 hover:bg-white/10",
                  option.value === value
                    ? "text-emerald-400"
                    : "text-slate-300",
                ].join(" ")}
              >
                <span>{option.label}</span>

                {option.count !== undefined && (
                  <span className="text-xs opacity-70">
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
});

FilterBar.displayName = "FilterBar";