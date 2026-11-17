"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, createTimeline, stagger } from "animejs";
import { StarRating } from "@/components/products/StarRating";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";
import { useInViewMotion } from "@/hooks/useInViewMotion";
import { $, blurIn, fadeUp, prepareBlur, prepareFade, REDUCED_MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

export interface TestimonialItem {
  review: Review;
  product?: { name: string; slug: string; image: string };
}

export function TestimonialSection({ items }: { items: TestimonialItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lastShown = useRef(0);
  const count = items.length;

  useInViewMotion(sectionRef, {
    prepare: (root) => {
      prepareBlur($(root, ".tm-word"));
      prepareFade($(root, ".tm-meta"));
    },
    play: (root) => {
      const tl = createTimeline();
      blurIn(tl, $(root, ".tm-word"), 0, 90);
      fadeUp(tl, $(root, ".tm-meta"), 250, 70);
    },
  });

  // New featured review settles in from a soft blur.
  useLayoutEffect(() => {
    if (active === lastShown.current) return;
    lastShown.current = active;
    const el = featureRef.current;
    if (!el || window.matchMedia(REDUCED_MOTION).matches) return;
    const anim = animate(el.children, {
      opacity: [0, 1],
      translateY: [18, 0],
      filter: ["blur(6px)", "blur(0px)"],
      duration: 700,
      delay: stagger(70),
      ease: "outQuart",
    });
    return () => {
      anim.cancel();
    };
  }, [active]);

  if (!count) return null;
  const go = (i: number) => setActive(((i % count) + count) % count);
  const { review, product } = items[active];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="testimonials-heading"
      className="bg-white py-[clamp(4.5rem,9vw,8.5rem)]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      <div className="shopco-container grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="tm-meta text-[11px] tracking-[0.22em] uppercase text-black/45">Community notes</p>
          <h2
            id="testimonials-heading"
            className="mt-4 font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.4rem,5vw,4.25rem)]"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            <span className="tm-word inline-block">In</span> <span className="tm-word inline-block">their</span>{" "}
            <span className="tm-word inline-block">words</span>
          </h2>
          <p className="tm-meta mt-5 max-w-xs border-l-2 border-[#C8BBAA] pl-3 text-xs leading-relaxed text-black/55">
            Sample reviews — demonstration content for this store, not from real customers.
          </p>

          <div className="tm-meta mt-10 flex items-center gap-5" role="group" aria-label="Choose review">
            <span className="text-[11px] tracking-[0.2em] text-black/50 tabular-nums">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <div className="flex flex-1 gap-1.5" aria-hidden>
              {items.map((item, i) => (
                <span key={item.review.id} className={cn("h-px flex-1 transition-colors duration-500", i === active ? "bg-black" : "bg-black/15")} />
              ))}
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => go(active - 1)} aria-label="Previous review" className="flex h-11 w-11 items-center justify-center border border-[#EEEEEC] transition-colors hover:border-black">
                <ArrowGlyph className="rotate-180" />
              </button>
              <button type="button" onClick={() => go(active + 1)} aria-label="Next review" className="flex h-11 w-11 items-center justify-center border border-[#EEEEEC] transition-colors hover:border-black">
                <ArrowGlyph />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <figure ref={featureRef} aria-live="polite" className="min-h-[18rem]">
            <span aria-hidden className="block font-serif text-7xl leading-none text-[#C8BBAA]">
              &ldquo;
            </span>
            <blockquote
              className="-mt-4 text-[clamp(1.35rem,2.6vw,2.15rem)] font-medium leading-[1.3] tracking-[-0.015em] text-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {review.content}
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-[#EEEEEC] pt-6">
              <div className="flex items-center gap-4">
                <StarRating rating={review.rating} size={14} showLabel={false} />
                <span className="text-sm font-semibold">{review.userName}</span>
                <span className="text-[11px] tracking-[0.18em] uppercase text-black/40">Sample review</span>
              </div>
              {product && (
                <Link href={`/products/${product.slug}`} className="group flex items-center gap-3">
                  <span className="relative block h-14 w-11 overflow-hidden bg-[#F2F2F0]">
                    <Image src={product.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="text-left">
                    <span className="block text-[10px] tracking-[0.2em] uppercase text-black/45">Reviewed</span>
                    <span className="text-sm font-medium text-black underline-offset-4 group-hover:underline">
                      {product.name}
                    </span>
                  </span>
                </Link>
              )}
            </figcaption>
          </figure>

          {count > 1 && (
            <ul className="mt-12 grid gap-4 sm:grid-cols-2" aria-label="More sample reviews">
              {items.map((item, i) =>
                i === active ? null : (
                  <li key={item.review.id}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      className="group h-full w-full border border-[#EEEEEC] p-5 text-left transition-colors hover:border-black"
                    >
                      <span className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{item.review.userName}</span>
                        <ArrowGlyph className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-black/55">{item.review.content}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
