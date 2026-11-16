"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const SORT_OPTIONS = [
  { label: "Most Popular", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
] as const;

interface SortBarProps {
  total: number;
  page: number;
  pageSize: number;
}

export function SortBar({ total, page, pageSize }: SortBarProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const sort = sp.get("sort") ?? "featured";
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

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
    <div className="flex items-center justify-between gap-4 mb-6">
      <p className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium text-black">
          {from}–{to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-black">{total}</span> products
      </p>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="text-sm border border-gray-200 rounded-full px-3 py-1.5 focus:outline-none focus:border-black bg-white cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
