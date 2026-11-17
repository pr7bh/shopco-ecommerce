"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SUBCATEGORIES = [
  { label: "All Categories", value: "" },
  { label: "T-Shirts", value: "basic-tshirts" },
  { label: "Shirts & Blouses", value: "shirts-blouses" },
  { label: "Shirts", value: "shirts" },
  { label: "Dresses", value: "dresses" },
  { label: "Jeans & Denim", value: "jeans" },
  { label: "Hoodies & Sweatshirts", value: "hoodies-sweatshirts" },
  { label: "Knitwear", value: "knitwear" },
  { label: "Outerwear", value: "outerwear" },
  { label: "Shorts", value: "shorts" },
  { label: "Accessories", value: "accessories" },
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

  const currentSubcategory = sp.get("subcategory") ?? "";
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
    currentSubcategory ||
    currentSizes.length > 0 ||
    currentColors.length > 0 ||
    currentMin > 0 ||
    currentMax < 500;

  const inner = (
    <div className="space-y-7">
      {/* Header */}
      {/* Subcategory */}
      <div>
        <p className="eyebrow text-[#B8A99A] mb-4">Category</p>
        <ul className="space-y-0.5">
          {SUBCATEGORIES.map((cat) => (
            <li key={cat.value}>
              <button
                onClick={() => push(buildParams({ subcategory: cat.value || null }))}
                className={cn(
                  "w-full text-left text-sm py-2 border-b border-transparent transition-colors",
                  currentSubcategory === cat.value
                    ? "text-black font-semibold border-b-black"
                    : "text-[#292929] hover:text-black"
                )}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[#EEEEEC]" />

      {/* Price Range */}
      <div>
        <p className="eyebrow text-[#B8A99A] mb-4">Price</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-[#B8A99A] mb-1 block tracking-wide">MIN ($)</label>
              <input
                type="number"
                min={0}
                max={localMax - 1}
                value={localMin}
                onChange={(e) => setLocalMin(Number(e.target.value))}
                className="w-full border border-[#EEEEEC] px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>
            <span className="text-[#B8A99A] mt-5">–</span>
            <div className="flex-1">
              <label className="text-[10px] text-[#B8A99A] mb-1 block tracking-wide">MAX ($)</label>
              <input
                type="number"
                min={localMin + 1}
                max={2000}
                value={localMax}
                onChange={(e) => setLocalMax(Number(e.target.value))}
                className="w-full border border-[#EEEEEC] px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>
          </div>
          <button
            onClick={applyPrice}
            className="w-full bg-black text-white eyebrow py-2.5 hover:bg-[#292929] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="border-t border-[#EEEEEC]" />

      {/* Colors */}
      <div>
        <p className="eyebrow text-[#B8A99A] mb-4">Color</p>
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
                  : "border-transparent hover:border-[#B8A99A]"
              )}
              style={{ backgroundColor: c.hex }}
              aria-label={c.name}
              aria-pressed={currentColors.includes(c.name)}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-[#EEEEEC]" />

      {/* Sizes */}
      <div>
        <p className="eyebrow text-[#B8A99A] mb-4">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold tracking-wide border transition-colors",
                currentSizes.includes(s)
                  ? "bg-black text-white border-black"
                  : "border-[#EEEEEC] text-[#292929] hover:border-black"
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
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-10 px-4 border border-[#EEEEEC] eyebrow text-[#292929] hover:border-black transition-colors"
      >
        <SlidersHorizontal size={14} strokeWidth={1.5} />
        Filter
        {hasFilters && (
          <span className="ml-1 w-5 h-5 bg-black text-white text-[9px] flex items-center justify-center">
            {[currentSubcategory, ...currentSizes, ...currentColors].filter(Boolean).length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 h-16 border-b border-[#EEEEEC]">
              <span className="eyebrow text-[#292929]">Filter</span>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="ml-auto mr-4 eyebrow text-[#B8A99A] hover:text-black transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="p-2 -mr-2 hover:opacity-60 transition-opacity"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-6">{inner}</div>
          </div>
        </div>
      )}
    </>
  );
}
