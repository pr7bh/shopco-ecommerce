"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Search } from "lucide-react";
import { ALL_PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

interface SearchOverlayProps {
  onClose: () => void;
}

const TRENDING = ["T-shirts", "Jeans", "Casual", "Formal", "New Arrivals"];

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = query.trim().length > 0
    ? ALL_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(query.trim())}`;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEEEEC]">
        <span className="eyebrow text-gray-400">Search</span>
        <button
          onClick={onClose}
          aria-label="Close search"
          className="p-2 hover:opacity-60 transition-opacity"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search input */}
      <div className="shopco-container py-8">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 border-b-2 border-black pb-3">
            <Search size={22} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search styles, brands, products…"
              className="flex-1 text-2xl bg-transparent outline-none placeholder:text-gray-300 font-display"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>

        {/* Trending tags (no query) */}
        {!query && (
          <div className="mt-8">
            <p className="eyebrow text-gray-400 mb-4">Trending Searches</p>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="px-4 py-2 border border-[#EEEEEC] text-sm hover:border-black hover:bg-black hover:text-white transition-all rounded-full"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query.trim() && (
          <div className="mt-8">
            {results.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No products found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <>
                <p className="eyebrow text-gray-400 mb-5">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-sm border border-transparent hover:border-[#EEEEEC] hover:bg-[#F7F6F3] transition-all"
                    >
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-sm bg-[#F7F6F3]">
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {formatPrice(p.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
