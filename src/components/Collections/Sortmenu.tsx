"use client";

import React from "react";

export type SortKey = "recommended" | "new" | "bestselling" | "price-asc" | "price-desc";

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "new", label: "New Arrivals" },
  { value: "bestselling", label: "Best Selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SortMenu({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#241c16]">
      <span className="hidden text-[#6d6259] sm:inline">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="rounded-full border border-[#e7dfd5] bg-white px-4 py-2.5 text-sm font-medium text-[#241c16] outline-none transition focus:border-[#a47735]"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}