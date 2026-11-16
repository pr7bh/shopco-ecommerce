"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Casual", value: "casual" },
  { label: "Formal", value: "formal" },
  { label: "Party", value: "party" },
  { label: "Gym", value: "gym" },
  { label: "New Arrivals", value: "new-arrivals" },
  { label: "Sale", value: "sale" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const COLORS = [
  { name: "Green", hex: "#2d6a4f" },
  { name: "Red", hex: "#b22222" },
  { name: "Yellow", hex: "#f5c842" },
  { name: "Orange", hex: "#e35d1a" },
  { name: "Blue", hex: "#1565c0" },
  { name: "Purple", hex: "#6a1b9a" },
  { name: "Pink", hex: "#e91e8c" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Navy", hex: "#1a237e" },
];

export function FilterSidebar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const currentCategory = sp.get("category") ?? "";
  const currentSizes = sp.get("sizes")?.split(",").filter(Boolean) ?? [];
  const currentColors = sp.get("colors")?.split(",").filter(Boolean) ?? [];
  const currentMin = sp.get("minPrice") ? Number(sp.get("minPrice")) : 0;
  const currentMax = sp.get("maxPrice") ? Number(sp.get("maxPrice")) : 500;

  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);
  const [open, setOpen] = useState(false);

  const push = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.replace(`/shop?${params.toString()}`, { scroll: false });
      });
    },
    [router]
  );

  function buildParams(overrides: Record<string, string | null>): URLSearchParams {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    next.delete("page");
    return next;
  }

  function toggleSize(size: string) {
    const next = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    push(buildParams({ sizes: next.join(",") || null }));
  }

  function toggleColor(name: string) {
    const next = currentColors.includes(name)
      ? currentColors.filter((c) => c !== name)
      : [...currentColors, name];
    push(buildParams({ colors: next.join(",") || null }));
  }

  function applyPrice() {
    push(
      buildParams({
        minPrice: localMin > 0 ? String(localMin) : null,
        maxPrice: localMax < 500 ? String(localMax) : null,
      })
    );
  }

  function clearAll() {
    setLocalMin(0);
    setLocalMax(500);
    router.replace("/shop", { scroll: false });
  }

  const hasFilters =
    currentCategory ||
    currentSizes.length > 0 ||
    currentColors.length > 0 ||
    currentMin > 0 ||
    currentMax < 500;

  const inner = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-base">Filters</span>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-black flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-500 hover:text-black"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Dress Style / Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
          Dress Style
        </p>
        <ul className="space-y-1">
          {CATEGORIES.map((cat) => (
            <li key={cat.value}>
              <button
                onClick={() =>
                  push(buildParams({ category: cat.value || null }))
                }
                className={cn(
                  "w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                  currentCategory === cat.value
                    ? "bg-black text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
          Price Range
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 mb-1 block">Min</label>
              <input
                type="number"
                min={0}
                max={localMax - 1}
                value={localMin}
                onChange={(e) => setLocalMin(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <span className="text-gray-400 mt-5">–</span>
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 mb-1 block">Max</label>
              <input
                type="number"
                min={localMin + 1}
                max={2000}
                value={localMax}
                onChange={(e) => setLocalMax(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <button
            onClick={applyPrice}
            className="w-full bg-black text-white text-xs font-semibold py-2 rounded-full hover:bg-gray-900 transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Colors */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
          Colors
        </p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => toggleColor(c.name)}
              title={c.name}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all",
                currentColors.includes(c.name)
                  ? "border-black scale-110"
                  : "border-transparent hover:border-gray-400"
              )}
              style={{ backgroundColor: c.hex }}
              aria-label={c.name}
              aria-pressed={currentColors.includes(c.name)}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
          Size
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                currentSizes.includes(s)
                  ? "bg-black text-white border-black"
                  : "border-gray-300 text-gray-700 hover:border-black"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm font-medium hover:border-black transition-colors"
      >
        <SlidersHorizontal size={15} />
        Filters
        {hasFilters && (
          <span className="ml-1 w-5 h-5 bg-black text-white rounded-full text-[10px] flex items-center justify-center">
            {[currentCategory, ...currentSizes, ...currentColors].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-white p-6 overflow-y-auto">
            {inner}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl p-5">
          {inner}
        </div>
      </aside>
    </>
  );
}
