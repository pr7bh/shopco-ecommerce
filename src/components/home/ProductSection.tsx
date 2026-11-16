"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 320 : -320,
      behavior: "smooth",
    });
  }

  return (
    <section className="editorial-section">
      <div className="shopco-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <div className="eyebrow text-gray-500 mb-2">{subtitle}</div>
            )}
            <h2
              className="text-3xl md:text-4xl font-black uppercase tracking-tight"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <ArrowRight size={16} />
            </button>
            <Link
              href={viewAllHref}
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline ml-2"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Horizontal scroll rail */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[260px] md:w-[300px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: View All */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 border border-black text-sm font-medium px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all tracking-wide uppercase"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
