/**
 * @file Components/home/FilterTabs.tsx
 * @description Pílulas de filtro deslizáveis em material Apple Liquid Glass com HugeIcons.
 */

"use client";

import React from "react";
import { FiltroCategoria } from "@/database/schema";
import { FilterCategoryIcon } from "@/Components/ui/AppIcon";
import { C } from "@/constants/theme";

export interface FilterTabsProps {
  filters: FiltroCategoria[];
  activeFilter: string;
  onSelectFilter: (key: string) => void;
}

export function FilterTabs({
  filters,
  activeFilter,
  onSelectFilter,
}: FilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none py-1">
      {filters.map((f) => {
        const isActive = activeFilter === f.key;

        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onSelectFilter(f.key)}
            className={`
              flex-shrink-0 px-3.5 py-2 rounded-[18px] text-xs font-bold
              flex items-center gap-1.5 cursor-pointer apple-touch
              ${isActive ? "apple-glass-accent shadow-md" : "apple-glass-control text-[#774f38]"}
            `}
          >
            <FilterCategoryIcon
              filterKey={f.key}
              size={14}
              color={isActive ? "#ffffff" : C.salmao}
            />
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
