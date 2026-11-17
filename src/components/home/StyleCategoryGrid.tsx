"use client";

import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function StyleCategoryGrid() {
  const ref = useScrollReveal();
  return (
    <section ref={ref as RefObject<HTMLElement>} className="editorial-section bg-[#F7F6F3]">
      <div className="shopco-container">
        <div className="eyebrow text-gray-500 mb-8">EXPLORE CATEGORIES</div>

        <div
          className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4"
          style={{ height: "clamp(520px, 65vh, 780px)" }}
        >
          {/* WOMEN — 3/5 columns, full height */}
          <Link
            href="/shop?gender=women"
            className="md:col-span-3 relative img-zoom rounded-[var(--radius-card)] overflow-hidden block"
          >
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop&auto=format"
              alt="Women's Collection"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="eyebrow text-white/60 mb-2">COLLECTION</div>
              <h3
                className="text-white font-black text-3xl md:text-4xl uppercase tracking-tight"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                WOMEN
              </h3>
              <div className="mt-3 text-white/80 text-xs tracking-widest uppercase border-b border-white/40 pb-1 w-fit hover:border-white transition-colors">
                Shop Now
              </div>
            </div>
          </Link>

          {/* Right column — 2/5 cols, two stacked panels */}
          <div className="md:col-span-2 grid grid-rows-2 gap-3 md:gap-4">
            {/* MEN */}
            <Link
              href="/shop?gender=men"
              className="relative img-zoom rounded-[var(--radius-card)] overflow-hidden block"
            >
              <Image
                src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=500&fit=crop&auto=format"
                alt="Men's Collection"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <h3
                  className="text-white font-black text-2xl md:text-3xl uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-hero)" }}
                >
                  MEN
                </h3>
                <div className="mt-2 text-white/80 text-xs tracking-widest uppercase border-b border-white/40 pb-0.5 w-fit hover:border-white transition-colors">
                  Shop Now
                </div>
              </div>
            </Link>

            {/* ACCESSORIES */}
            <Link
              href="/shop?gender=unisex"
              className="relative img-zoom rounded-[var(--radius-card)] overflow-hidden block bg-[#292929]"
            >
              <Image
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=400&fit=crop&auto=format"
                alt="Accessories Collection"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <h3
                  className="text-white font-black text-2xl md:text-3xl uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-hero)" }}
                >
                  ACCESSORIES
                </h3>
                <div className="mt-2 text-white/80 text-xs tracking-widest uppercase border-b border-white/40 pb-0.5 w-fit hover:border-white transition-colors">
                  Shop Now
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
