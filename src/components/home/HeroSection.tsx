"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, stagger } from "animejs";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=900&fit=crop&auto=format",
    eyebrow: "NEW SEASON 2026",
    headline: ["THE ART OF", "EVERYDAY", "STYLE"],
    sub: "Discover the new season collection — refined pieces for the modern wardrobe.",
    cta: "EXPLORE COLLECTION",
    href: "/shop",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&h=900&fit=crop&auto=format",
    eyebrow: "CURATED ESSENTIALS",
    headline: ["LESS,", "BUT", "BETTER."],
    sub: "Investment pieces designed to last. Quality over quantity, always.",
    cta: "SHOP NEW ARRIVALS",
    href: "/shop?sort=newest",
  },
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop&auto=format",
    eyebrow: "EXPRESS YOURSELF",
    headline: ["WEAR", "YOUR", "STORY."],
    sub: "Fashion is personal. Find styles that speak your language.",
    cta: "SHOP NOW",
    href: "/shop",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((s) => (s + 1) % SLIDES.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  // anime.js text reveal on slide change
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    animate(el.querySelectorAll(".hs-word"), {
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 600,
      delay: stagger(80),
      ease: "outExpo",
    });
    animate(el.querySelectorAll(".hs-fade"), {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 500,
      delay: stagger(100, { start: 300 }),
      ease: "outCubic",
    });
  }, [current]);

  const slide = SLIDES[current];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={s.image}
            alt={s.eyebrow}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content — bottom-left */}
      <div
        ref={contentRef}
        key={current}
        className="absolute inset-0 flex flex-col justify-end px-6 pb-20 md:pb-28 md:px-12 lg:px-16 max-w-[1240px] mx-auto"
      >
        {/* Eyebrow */}
        <div className="eyebrow text-white/70 mb-5 hs-fade">{slide.eyebrow}</div>

        {/* Headline */}
        <h1
          className="font-black uppercase leading-none tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-hero)",
            fontSize: "clamp(3rem, 8vw, 9rem)",
          }}
        >
          {slide.headline.map((word, i) => (
            <span key={i} className="block text-white hs-word" style={{ opacity: 0 }}>
              {word}
            </span>
          ))}
        </h1>

        {/* Sub */}
        <p className="text-white/80 max-w-md mb-8 text-sm md:text-base leading-relaxed hs-fade" style={{ opacity: 0 }}>
          {slide.sub}
        </p>

        {/* CTA */}
        <div className="hs-fade" style={{ opacity: 0 }}>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-3 border border-white text-white text-xs tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
          >
            {slide.cta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-[2px] transition-all duration-300",
              i === current ? "bg-white w-8" : "bg-white/40 w-5"
            )}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 md:right-12 lg:right-16 text-white/60 text-xs tracking-widest z-10">
        {String(current + 1).padStart(2, "0")} — {String(SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
}
