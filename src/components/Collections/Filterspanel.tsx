"use client";

import React from "react";
import styles from "../../styles/Braceletscollection.module.css";
import { Rashi } from "../../data/Rashibracelets";
import { formatINR } from "../../lib/Currency";
import RashiAvatar from "./RashiAvatar";

export interface FilterState {
  rashiIds: string[];
  types: string[];
  stones: string[];
  materials: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  minRating: number;
}

export interface FiltersPanelProps {
  rashis: Rashi[];
  types: string[];
  stones: string[];
  materials: string[];
  colors: string[];
  priceBounds: [number, number];
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}

function toggleInArray(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function FiltersPanel({
  rashis,
  types,
  stones,
  materials,
  colors,
  priceBounds,
  value,
  onChange,
  onReset,
}: FiltersPanelProps) {
  const [floor, ceiling] = priceBounds;
  const minPct = ((value.priceMin - floor) / (ceiling - floor)) * 100;
  const maxPct = ((value.priceMax - floor) / (ceiling - floor)) * 100;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#241c16]">Filters</h3>
        <button type="button" onClick={onReset} className="text-xs font-medium text-[#8c6327] underline underline-offset-2">
          Reset all
        </button>
      </div>

      <FilterGroup title="Rashi">
        <div className="grid grid-cols-2 gap-x-2 gap-y-2">
          {rashis.map((r) => (
            <Checkbox
              key={r.id}
              label={r.nameHi}
              icon={<RashiAvatar rashi={r} size={18} />}
              checked={value.rashiIds.includes(r.id)}
              onChange={() => onChange({ ...value, rashiIds: toggleInArray(value.rashiIds, r.id) })}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Bracelet Type">
        {types.map((t) => (
          <Checkbox
            key={t}
            label={t}
            checked={value.types.includes(t)}
            onChange={() => onChange({ ...value, types: toggleInArray(value.types, t) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Gemstone">
        {stones.map((s) => (
          <Checkbox
            key={s}
            label={s}
            checked={value.stones.includes(s)}
            onChange={() => onChange({ ...value, stones: toggleInArray(value.stones, s) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Material">
        {materials.map((m) => (
          <Checkbox
            key={m}
            label={m}
            checked={value.materials.includes(m)}
            onChange={() => onChange({ ...value, materials: toggleInArray(value.materials, m) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Color">
        {colors.map((c) => (
          <Checkbox
            key={c}
            label={c}
            checked={value.colors.includes(c)}
            onChange={() => onChange({ ...value, colors: toggleInArray(value.colors, c) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="flex items-center justify-between text-xs text-[#6d6259]">
          <span>{formatINR(value.priceMin)}</span>
          <span>{formatINR(value.priceMax)}</span>
        </div>
        <div className="relative mt-3 h-4">
          <div
            className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-[#a47735]"
            style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
          />
          <input
            type="range"
            min={floor}
            max={ceiling}
            step={50}
            value={value.priceMin}
            onChange={(e) => onChange({ ...value, priceMin: Math.min(Number(e.target.value), value.priceMax - 50) })}
            className={`${styles.rangeInput} absolute inset-x-0 top-1/2 -translate-y-1/2`}
          />
          <input
            type="range"
            min={floor}
            max={ceiling}
            step={50}
            value={value.priceMax}
            onChange={(e) => onChange({ ...value, priceMax: Math.max(Number(e.target.value), value.priceMin + 50) })}
            className={`${styles.rangeInput} absolute inset-x-0 top-1/2 -translate-y-1/2`}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChange({ ...value, minRating: r })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                value.minRating === r
                  ? "border-[#a47735] bg-[#faf3e7] text-[#8c6327]"
                  : "border-[#e7dfd5] text-[#6d6259] hover:border-[#d9c8a5]"
              }`}
            >
              {r === 0 ? "Any" : `${r}+ ★`}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <Checkbox
          label="In stock only"
          checked={value.inStockOnly}
          onChange={() => onChange({ ...value, inStockOnly: !value.inStockOnly })}
        />
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[#efe8dc] pt-5 first:border-t-0 first:pt-0">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[#a47735]">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Checkbox({
  label,
  icon,
  checked,
  onChange,
}: {
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[#241c16]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded border-[#c9bba3] text-[#a47735] focus:ring-[#a47735]"
      />
      {icon}
      <span>{label}</span>
    </label>
  );
}