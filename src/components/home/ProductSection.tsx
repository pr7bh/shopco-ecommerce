"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createTimeline } from "animejs";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";
import { useInViewMotion } from "@/hooks/useInViewMotion";
import { $, blurIn, fadeUp, maskIn, prepareBlur, prepareFade, prepareMask, REDUCED_MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductSectionProps {
  id: string;
  eyebrow: string;
  title: [string, string];
  description: string;
  products: Product[];
  viewAllHref: string;
  viewAllLabel: string;
}

const RAIL_PAD = "max(clamp(1rem, 4vw, 2rem), calc((100% - 1240px) / 2 + clamp(1rem, 4vw, 2rem)))";

export function ProductSection({ id, eyebrow, title, description, products, viewAllHref, viewAllLabel }: ProductSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useInViewMotion(sectionRef, {
    prepare: (root) => {
      prepareBlur($(root, ".rail-word"));
      prepareFade($(root, ".rail-meta"));
      prepareMask($(root, ".rail-item"));
    },
    play: (root) => {
      const tl = createTimeline();
      blurIn(tl, $(root, ".rail-word"), 0, 90);
      fadeUp(tl, $(root, ".rail-meta"), 250, 70);
      maskIn(tl, $(root, ".rail-item"), 350, 110);
    },
  });

  // Progress thumb + arrow availability, updated once per frame while the rail scrolls.
  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!rail || !thumb) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = rail.scrollWidth - rail.clientWidth;
      const fraction = Math.min(1, rail.clientWidth / rail.scrollWidth);
      const p = max > 0 ? rail.scrollLeft / max : 0;
      thumb.style.width = `${(fraction * 100).toFixed(2)}%`;
      thumb.style.transform = `translateX(${((p * (1 - fraction)) / fraction) * 100}%)`;
      const start = rail.scrollLeft <= 4;
      const end = rail.scrollLeft >= max - 4;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    rail.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      rail.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Mouse drag-to-scroll; touch keeps native scrolling and snap.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let startX = 0;
    let startScroll = 0;
    let pointerId: number | null = null;
    let dragging = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startScroll = rail.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 6) {
        dragging = true;
        rail.dataset.dragging = "true";
        rail.setPointerCapture(e.pointerId);
      }
      if (dragging) rail.scrollLeft = startScroll - dx;
    };
    const up = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      if (dragging) {
        dragging = false;
        // Let snap settle after the drag; the click that follows lands on the rail, not a card.
        requestAnimationFrame(() => delete rail.dataset.dragging);
      }
    };
    rail.addEventListener("pointerdown", down);
    rail.addEventListener("pointermove", move);
    rail.addEventListener("pointerup", up);
    rail.addEventListener("pointercancel", up);
    return () => {
      rail.removeEventListener("pointerdown", down);
      rail.removeEventListener("pointermove", move);
      rail.removeEventListener("pointerup", up);
      rail.removeEventListener("pointercancel", up);
    };
  }, []);

  function page(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".rail-item");
    const step = card ? card.offsetWidth + 16 : rail.clientWidth * 0.8;
    const smooth = !window.matchMedia(REDUCED_MOTION).matches;
    rail.scrollBy({ left: dir * step * (window.innerWidth >= 1024 ? 2 : 1), behavior: smooth ? "smooth" : "auto" });
  }

  return (
    <section ref={sectionRef} aria-labelledby={`${id}-heading`} className="bg-white pb-[clamp(4.5rem,9vw,8rem)]">
      <div className="shopco-container">
        <div className="grid grid-cols-1 items-end gap-6 border-t border-[#EEEEEC] pt-10 md:pt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="rail-meta text-[11px] tracking-[0.22em] uppercase text-black/45">{eyebrow}</p>
            <h2
              id={`${id}-heading`}
              className="mt-4 font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.6rem,7vw,6rem)]"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              <span className="rail-word inline-block">{title[0]}</span>{" "}
              <span className="rail-word inline-block text-black/25">{title[1]}</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pb-3">
            <p className="rail-meta max-w-sm text-sm leading-relaxed text-black/60">{description}</p>
            <Link href={viewAllHref} className="rail-meta ed-link mt-5 text-black">
              {viewAllLabel}
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        role="region"
        aria-label={`${title.join(" ")} — scroll horizontally`}
        tabIndex={0}
        className="ed-rail mt-10 flex gap-4 overflow-x-auto pb-2 md:mt-14 focus-visible:outline-offset-[-2px]"
        style={{ paddingInline: RAIL_PAD, ["--rail-pad" as string]: RAIL_PAD }}
      >
        {products.map((product) => (
          <div key={product.id} className="rail-item w-[72vw] shrink-0 sm:w-[44vw] md:w-[31vw] lg:w-[23.5%]">
            <ProductCard product={product} sizes="(max-width: 640px) 72vw, (max-width: 1024px) 31vw, 24vw" />
          </div>
        ))}
      </div>

      <div className="shopco-container mt-8 flex items-center gap-6">
        <div className="relative h-px flex-1 overflow-hidden bg-[#EEEEEC]" aria-hidden>
          <span ref={thumbRef} className="absolute inset-y-0 left-0 bg-black transition-transform duration-150 ease-out" />
        </div>
        <span className="text-[11px] tracking-[0.2em] text-black/45 tabular-nums">
          {String(products.length).padStart(2, "0")} pieces
        </span>
        <div className="flex gap-1">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => page(dir)}
              disabled={dir === -1 ? edges.start : edges.end}
              aria-label={dir === -1 ? "Previous products" : "Next products"}
              className={cn(
                "flex h-11 w-11 items-center justify-center border border-[#EEEEEC] text-black transition-colors",
                "hover:border-black disabled:cursor-default disabled:opacity-30 disabled:hover:border-[#EEEEEC]"
              )}
            >
              <ArrowGlyph className={dir === -1 ? "rotate-180" : undefined} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
