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
    <div className="flex items-center justify-between gap-4 mb-7">
      <p className="text-xs text-[#B8A99A]">
        <span className="text-[#292929] font-semibold">{from}–{to}</span>{" "}
        of{" "}
        <span className="text-[#292929] font-semibold">{total}</span> products
      </p>

      <div className="flex items-center gap-2">
        <span className="eyebrow text-[#B8A99A] hidden sm:block">Sort</span>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="eyebrow text-[#292929] border border-[#EEEEEC] px-3 py-2 focus:outline-none focus:border-black bg-white cursor-pointer hover:border-black transition-colors"
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
