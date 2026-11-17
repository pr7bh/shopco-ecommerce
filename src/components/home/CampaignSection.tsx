"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { createTimeline } from "animejs";
import Magnet from "@/components/reactbits/Magnet";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";
import { useInViewMotion } from "@/hooks/useInViewMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { $, blurIn, fadeUp, prepareBlur, prepareFade } from "@/lib/motion";
import { pexelsUrl } from "./hero/campaigns";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function Headline({ className }: { className?: string }) {
  return (
    <h2
      className={className}
      style={{ fontFamily: "var(--font-hero)" }}
    >
      <span className="block">
        <span className="camp-word inline-block">Style</span> <span className="camp-word inline-block">beyond</span>
      </span>
      <span className="block">
        <span className="camp-word inline-block">the</span> <span className="camp-word inline-block">ordinary</span>
      </span>
    </h2>
  );
}

export function CampaignSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const insetRef = useRef<HTMLDivElement>(null);

  // Scroll: the frame opens from an inset to full bleed while the photo settles; type and inset drift independently.
  useScrollProgress(sectionRef, (p) => {
    const r = clamp01((p - 0.08) / 0.42);
    const eased = 1 - Math.pow(1 - r, 3);
    if (stageRef.current) {
      const v = (1 - eased) * 9;
      const h = (1 - eased) * 16;
      stageRef.current.style.clipPath = `inset(${v.toFixed(2)}% ${h.toFixed(2)}% ${v.toFixed(2)}% ${h.toFixed(2)}%)`;
    }
    if (photoRef.current) photoRef.current.style.transform = `scale(${(1.18 - 0.18 * eased).toFixed(4)})`;
    if (typeRef.current) typeRef.current.style.translate = `0 ${((0.5 - p) * 140).toFixed(1)}px`;
    if (insetRef.current) insetRef.current.style.translate = `0 ${((p - 0.5) * 120).toFixed(1)}px`;
  });

  useInViewMotion(sectionRef, {
    threshold: 0.25,
    prepare: (root) => {
      prepareBlur($(root, ".camp-word"));
      prepareFade($(root, ".camp-meta"));
      prepareFade($(root, ".camp-cta"));
    },
    play: (root) => {
      const tl = createTimeline();
      blurIn(tl, $(root, ".camp-word"), 200, 110);
      fadeUp(tl, $(root, ".camp-meta"), 750, 90);
      fadeUp(tl, $(root, ".camp-cta"), 1150, 0);
    },
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Campaign: Style beyond the ordinary"
      className="relative overflow-hidden bg-[#F7F6F3] py-[clamp(4.5rem,9vw,8rem)]"
    >
      <div className="shopco-container flex items-center justify-between border-b border-black/10 pb-4 text-[11px] tracking-[0.22em] uppercase text-black/50">
        <span className="camp-meta">Campaign — 04</span>
        <span className="camp-meta hidden sm:inline">Studio Series · 2026</span>
      </div>

      <div className="relative mt-8 md:mt-12">
        <div
          ref={stageRef}
          className="relative mx-auto aspect-[4/5] w-full overflow-hidden bg-[#e9e6e0] sm:aspect-[16/10] lg:aspect-auto lg:h-[clamp(540px,84vh,880px)]"
        >
          <div ref={photoRef} className="absolute inset-0 will-change-transform">
            <Image
              src={pexelsUrl(20369224, 2200)}
              alt="Three models in relaxed tailoring and denim posing in a sunlit white studio"
              fill
              sizes="100vw"
              className="object-cover object-[30%_50%] sm:object-[50%_45%]"
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-l from-white/35 via-transparent to-transparent" />

          <div ref={typeRef} className="absolute right-[4%] top-[7%] hidden w-[58%] lg:block">
            <Headline className="font-black uppercase leading-[0.88] tracking-[-0.03em] text-black text-[clamp(2.5rem,4.7vw,5rem)] text-right" />
          </div>
        </div>

        <span
          aria-hidden
          className="camp-meta absolute left-[1.5%] top-1/2 hidden -translate-y-1/2 rotate-180 text-[10px] tracking-[0.38em] uppercase text-black/40 [writing-mode:vertical-rl] xl:block"
        >
          SHOP.CO — Editorial — Look 01
        </span>

        <div
          ref={insetRef}
          className="absolute -bottom-36 right-[6%] hidden w-[15%] min-w-[180px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.45)] lg:block"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-[#e9e6e0]">
            <Image
              src={pexelsUrl(7691346, 900)}
              alt="Two models in ribbed camel and cream knitwear standing back to back"
              fill
              sizes="18vw"
              className="object-cover object-[50%_40%]"
            />
          </div>
          <p className="camp-meta mt-3 text-[10px] tracking-[0.22em] uppercase text-black/50">Look 02 — Rib knit</p>
        </div>
      </div>

      <div className="shopco-container mt-10 grid grid-cols-1 gap-8 md:mt-14 lg:grid-cols-12 lg:gap-8">
        <Headline className="font-black uppercase leading-[0.9] tracking-[-0.03em] text-black text-[clamp(2.4rem,9vw,4rem)] lg:hidden" />
        <p className="camp-meta text-[11px] tracking-[0.22em] uppercase text-black/45 lg:col-span-2">No. 01 / 03</p>
        <div className="lg:col-span-5">
          <p className="camp-meta max-w-md text-base leading-relaxed text-black/70 md:text-lg">
            Relaxed tailoring, washed denim and soft knits, worn your own way. A study in pieces
            that move easily between studio, street and everything in between.
          </p>
          <div className="camp-cta mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Magnet padding={60} magnetStrength={3.5} maxOffset={10}>
              <Link
                href="/shop?sort=newest"
                className="group inline-flex items-center gap-4 bg-black px-7 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-white transition-colors hover:bg-[#292929]"
              >
                Explore the edit
                <ArrowGlyph className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnet>
            <Link href="/shop?subcategory=jeans" className="ed-link text-black">
              Shop denim
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
