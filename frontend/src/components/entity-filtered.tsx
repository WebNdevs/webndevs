"use client";

import { useMemo, useState } from "react";

import { EntityGrid, EntityCardProps } from "./cards/entity-card";
import { FilterBar } from "./filter-bar";
import { generateFilters } from "@/data/filter";

type Props = {
  items: EntityCardProps[];
};

export function FilteredEntityGrid({
  items,
}: Props) {
  const [selected, setSelected] = useState("All");

  const filters = useMemo(
    () => generateFilters(items),
    [items]
  );

  const filteredItems = useMemo(() => {
    if (selected === "All") return items;

    return items.filter(
      (item) => item.badge === selected
    );
  }, [items, selected]);

  return (
    <>
      <div className="mb-8">
        <FilterBar
          options={filters}
          value={selected}
          onChange={setSelected}
        />
      </div>

      <EntityGrid items={filteredItems} />
    </>
  );
}