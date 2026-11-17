"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const SORT_OPTIONS = [
  { label: "Most Popular", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
] as const;

export function SortBar() {
  const router = useRouter();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const sort = sp.get("sort") ?? "featured";

  function handleSort(value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value === "featured") next.delete("sort");
    else next.set("sort", value);
    next.delete("page");
    startTransition(() => {
      router.replace(`/shop?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex items-center">
      <label className="flex items-center">
        <span className="sr-only">Sort by</span>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="eyebrow h-10 text-[#292929] border border-[#EEEEEC] px-3 focus:outline-none focus:border-black bg-white cursor-pointer hover:border-black transition-colors"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
