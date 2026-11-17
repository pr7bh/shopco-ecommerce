"use client";

import { useRef } from "react";
import Link from "next/link";
import { createTimeline } from "animejs";
import Magnet from "@/components/reactbits/Magnet";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";
import { useInViewMotion } from "@/hooks/useInViewMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { $, blurIn, fadeUp, maskIn, prepareBlur, prepareFade, prepareMask, resetPointer, trackPointer } from "@/lib/motion";
import { EditorialFrame } from "./EditorialFrame";

const LOOKS = [
  {
    label: "Look 02 — The long coat",
    href: "/shop?subcategory=outerwear",
    image: { id: 11051069, alt: "Model in a long brown wool coat among snow-covered trees", focus: "50% 30%" },
    className: "",
  },
  {
    label: "Look 03 — Cable knit",
    href: "/shop?subcategory=knitwear",
    image: { id: 6789127, alt: "Model in a cream cable-knit sweater standing by a window", focus: "50% 30%" },
    className: "mt-12 md:mt-16",
  },
];

export function SeasonalBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollProgress(sectionRef, (p, root) => {
    root.style.setProperty("--py", ((0.5 - p) * 80).toFixed(2));
  });
  useInViewMotion(sectionRef, {
    threshold: 0.15,
    prepare: (root) => {
      prepareMask($(root, "[data-reveal-frame]"));
      prepareBlur($(root, ".win-word"));
      prepareFade($(root, ".win-meta"));
    },
    play: (root) => {
      const tl = createTimeline();
      maskIn(tl, $(root, "[data-reveal-frame]"), 0, 200);
      blurIn(tl, $(root, ".win-word"), 300, 100);
      fadeUp(tl, $(root, ".win-meta"), 700, 80);
    },
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="winter-heading"
      className="overflow-hidden bg-[#1B1A18] py-[clamp(4.5rem,9vw,8.5rem)] text-[#F7F6F3]"
    >
      <div className="shopco-container grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:pt-6">
          <div className="win-meta flex items-center justify-between border-b border-white/15 pb-4 text-[11px] tracking-[0.22em] uppercase text-white/50">
            <span>Autumn / Winter 2026</span>
            <span className="tabular-nums">Looks 01—03</span>
          </div>
          <h2
            id="winter-heading"
            className="mt-8 font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.4rem,10vw,4rem)] lg:text-[clamp(2.75rem,4.2vw,4.25rem)]"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            <span className="block">
              <span className="win-word inline-block">The</span> <span className="win-word inline-block">winter</span>
            </span>
            <span className="win-word inline-block text-[#C8BBAA]">wardrobe</span>
          </h2>
          <p className="win-meta mt-6 max-w-sm text-base leading-relaxed text-white/70">
            Discover timeless layers and everyday essentials for colder days.
          </p>
          <div className="win-meta mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Magnet padding={60} magnetStrength={3.5} maxOffset={10}>
              <Link
                href="/shop?subcategory=outerwear"
                className="group inline-flex items-center gap-4 bg-[#F7F6F3] px-7 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-black transition-colors hover:bg-white"
              >
                Explore outerwear
                <ArrowGlyph className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnet>
            <Link href="/shop?subcategory=knitwear" className="ed-link text-[#F7F6F3]">
              Knitwear
              <ArrowGlyph />
            </Link>
          </div>
        </div>

        <figure className="lg:col-span-6 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <EditorialFrame
            image={{ id: 14495270, alt: "Model in a white wool coat and knitted beanie in a snowy forest", focus: "50% 30%" }}
            sizes="(max-width: 1023px) 100vw, 50vw"
            depth={0.7}
            className="aspect-[4/5] bg-[#2a2826] lg:aspect-[2/3]"
            width={1600}
          />
          <figcaption className="win-meta mt-4 flex justify-between text-[11px] tracking-[0.22em] uppercase text-white/50">
            <span>Look 01 — Wool coat &amp; beanie</span>
            <span aria-hidden>−2°C</span>
          </figcaption>
        </figure>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:self-end">
          {LOOKS.map((look) => (
            <Link
              key={look.label}
              href={look.href}
              className={`group block ${look.className}`}
              onPointerMove={trackPointer}
              onPointerLeave={resetPointer}
            >
              <EditorialFrame image={look.image} sizes="(max-width: 1023px) 50vw, 20vw" depth={1.4} className="aspect-[3/4] bg-[#2a2826]" width={900} />
              <span className="win-meta mt-3 flex items-center justify-between gap-2 text-[10px] tracking-[0.2em] uppercase text-white/55 transition-colors group-hover:text-white">
                {look.label}
                <ArrowGlyph size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
