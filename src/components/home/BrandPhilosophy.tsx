"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import { createTimeline } from "animejs";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";
import { useInViewMotion } from "@/hooks/useInViewMotion";
import { $, blurIn, fadeUp, prepareBlur, prepareFade } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LINES: { text: string; accent?: boolean }[] = [
  { text: "Fashion is not" },
  { text: "about following." },
  { text: "It's about", accent: true },
  { text: "expressing.", accent: true },
];

export function BrandPhilosophy() {
  const ref = useRef<HTMLElement>(null);
  useInViewMotion(ref, {
    threshold: 0.3,
    prepare: (root) => {
      prepareBlur($(root, ".ph-word"));
      prepareFade($(root, ".ph-meta"));
    },
    play: (root) => {
      const tl = createTimeline();
      blurIn(tl, $(root, ".ph-word"), 0, 95);
      fadeUp(tl, $(root, ".ph-meta"), 900, 90);
    },
  });

  return (
    <section ref={ref} aria-labelledby="philosophy-heading" className="bg-[#F7F6F3] py-[clamp(5.5rem,12vw,11rem)]">
      <div className="shopco-container">
        <p className="ph-meta text-[11px] tracking-[0.22em] uppercase text-black/45">Our philosophy</p>
        <h2
          id="philosophy-heading"
          className="mt-8 font-black uppercase leading-[0.92] tracking-[-0.035em] text-[clamp(2.4rem,8.2vw,8rem)]"
          style={{ fontFamily: "var(--font-hero)" }}
        >
          {LINES.map((line, li) => (
            <span key={line.text} className={cn("block", line.accent && "text-[#C8BBAA]", li === 2 && "lg:pl-[12%]", li === 3 && "lg:pl-[24%]")}>
              {line.text.split(" ").map((word, wi, arr) => (
                <Fragment key={`${word}-${wi}`}>
                  <span className="ph-word inline-block">{word}</span>
                  {wi < arr.length - 1 ? " " : null}
                </Fragment>
              ))}
              {li < LINES.length - 1 ? " " : null}
            </span>
          ))}
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-black/10 pt-8 md:mt-20 lg:grid-cols-12">
          <p className="ph-meta text-[11px] tracking-[0.22em] uppercase text-black/45 lg:col-span-3">SHOP.CO — Est. 2026</p>
          <p className="ph-meta max-w-xl text-base leading-relaxed text-black/70 md:text-lg lg:col-span-6">
            We choose every piece with intention: honest fabrics, considered fits and colours that work
            together, so getting dressed becomes a way to say something about yourself.
          </p>
          <div className="ph-meta lg:col-span-3 lg:justify-self-end">
            <Link href="/about#story" className="ed-link text-black">
              Our story
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
