import { FilterOption } from "@/components/filter-bar";

export function generateFilters<T extends { badge?: string }>(
  items: T[]
): FilterOption[] {
  const categories = Array.from(
    new Set(
      items
        .map((item) => item.badge)
        .filter((badge): badge is string => !!badge)
    )
  ).sort();

  return [
    {
      value: "All",
      label: "All",
    },
    ...categories.map((badge) => ({
      value: badge,
      label: badge,
    })),
  ];
}