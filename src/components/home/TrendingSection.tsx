"use client";

import { useRef } from "react";
import Link from "next/link";
import { createTimeline } from "animejs";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";
import { useInViewMotion } from "@/hooks/useInViewMotion";
import { $, blurIn, fadeUp, maskIn, prepareBlur, prepareFade, prepareMask } from "@/lib/motion";
import type { Product } from "@/types";

const rank = (i: number) => `No. ${String(i + 1).padStart(2, "0")}`;

export function TrendingSection({ products }: { products: Product[] }) {
  const leadRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const [featured, ...rest] = products;

  useInViewMotion(leadRef, {
    prepare: (root) => {
      prepareBlur($(root, ".tr-word"));
      prepareFade($(root, ".tr-meta"));
      prepareMask($(root, ".tr-card"));
    },
    play: (root) => {
      const tl = createTimeline();
      blurIn(tl, $(root, ".tr-word"), 0, 90);
      fadeUp(tl, $(root, ".tr-meta"), 250, 70);
      maskIn(tl, $(root, ".tr-card"), 400);
    },
  });
  useInViewMotion(gridRef, {
    threshold: 0.08,
    prepare: (root) => prepareMask($(root, ".tr-card")),
    play: (root) => {
      maskIn(createTimeline(), $(root, ".tr-card"), 0, 120);
    },
  });

  if (!featured) return null;

  return (
    <section aria-labelledby="trending-heading" className="bg-[#F7F6F3] py-[clamp(4.5rem,9vw,8.5rem)]">
      <div className="shopco-container grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div ref={leadRef} className="lg:sticky lg:top-24">
            <p className="tr-meta flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-black/45">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C8102E]" aria-hidden />
              Trending now
            </p>
            <h2
              id="trending-heading"
              className="mt-4 font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.6rem,6vw,5.25rem)]"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              <span className="tr-word inline-block">Most</span> <span className="tr-word inline-block">loved</span>
            </h2>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <p className="tr-meta max-w-xs text-sm leading-relaxed text-black/60">
                The pieces our customers keep coming back to this season, ranked.
              </p>
              <Link href="/shop?sort=rating" className="tr-meta ed-link text-black">
                Shop top rated
                <ArrowGlyph />
              </Link>
            </div>
            <div className="tr-card mt-10">
              <p className="mb-3 text-[11px] tracking-[0.2em] uppercase text-black/50">{rank(0)} — This week</p>
              <ProductCard product={featured} label="Bestseller" sizes="(max-width: 1023px) 100vw, 40vw" />
            </div>
          </div>
        </div>

        <ul
          ref={gridRef}
          className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-4 lg:col-span-6 lg:col-start-7 lg:gap-y-16 lg:pt-6"
        >
          {rest.map((product, i) => (
            <li key={product.id} className="tr-card lg:[&:nth-child(even)]:translate-y-20">
              <p className="mb-3 text-[11px] tracking-[0.2em] uppercase text-black/50">{rank(i + 1)}</p>
              <ProductCard product={product} label="Bestseller" sizes="(max-width: 1023px) 50vw, 25vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
