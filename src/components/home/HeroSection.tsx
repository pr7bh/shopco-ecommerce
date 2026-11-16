"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, createTimeline, stagger } from "animejs";
import { siteConfig } from "@/config/site";

function SparkleIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden className={className}>
      <path
        d="M28 0C28 0 30 20 56 28C30 36 28 56 28 56C28 56 26 36 0 28C26 20 28 0 28 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

const HEADLINE = "Find Clothes That Matches Your Style";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Immediately reveal all animated elements for reduced-motion users
    if (reducedMotion) {
      section.querySelectorAll(
        ".ha-badge, .ha-word, .ha-subtitle, .ha-cta, .ha-stat, .ha-panel, .ha-float"
      ).forEach((el) => {
        const e = el as HTMLElement;
        e.style.opacity = "1";
        e.style.transform = "";
        e.style.filter = "";
      });
      return;
    }

    // ── Entrance timeline ──────────────────────────────────────────
    createTimeline({ defaults: { ease: "outExpo" } })

      // 1. "New Collection" pill drops in
      .add(".ha-badge",
        { opacity: [0, 1], translateY: [-12, 0], duration: 420, ease: "outBack(1.4)" },
        0
      )

      // 2. Headline words slide up through overflow-hidden clips
      .add(".ha-word",
        { translateY: [72, 0], opacity: [0, 1], duration: 680, delay: stagger(70) },
        60
      )

      // 3. Subtitle fades + lifts (React Bits BlurText style)
      .add(".ha-subtitle",
        { opacity: [0, 1], translateY: [18, 0], duration: 580, ease: "outCubic" },
        380
      )

      // 4. CTA button springs in
      .add(".ha-cta",
        { scale: [0.88, 1], opacity: [0, 1], duration: 500, ease: "outBack(1.3)" },
        600
      )

      // 5. Stats slide up staggered
      .add(".ha-stat",
        { translateY: [22, 0], opacity: [0, 1], duration: 480, delay: stagger(100), ease: "outCubic" },
        820
      )

      // 6. Right image panel sweeps in from right
      .add(".ha-panel",
        { translateX: [90, 0], opacity: [0, 1], duration: 780, ease: "outExpo" },
        140
      )

      // 7. Floating info badges pop in with overshoot
      .add(".ha-float",
        { scale: [0.55, 1], opacity: [0, 1], duration: 520, delay: stagger(170), ease: "outBack(1.6)" },
        920
      );

    // ── Ongoing ambient loops ──────────────────────────────────────

    // Image — slow gentle float
    animate(".ha-image-wrap", {
      translateY: [-8, 8],
      duration: 4400,
      alternate: true,
      loop: true,
      ease: "inOutSine",
    });

    // Sparkles — slow perpetual spin
    animate(".ha-sparkle", {
      rotate: [0, 360],
      duration: 16000,
      loop: true,
      ease: "linear",
      delay: stagger(5000),
    });

    // Floating badges — independent bob
    animate(".ha-float",
      {
        translateY: [0, -7],
        duration: 2800,
        alternate: true,
        loop: true,
        ease: "inOutSine",
        delay: stagger(800, { start: 1600 }),
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F0F0F0] overflow-hidden relative hero-aurora">
      <div className="shopco-container">
        <div className="relative min-h-[600px] lg:min-h-[680px] flex items-center">

          {/* ── Left: text content ───────────────────────────────── */}
          <div className="relative z-10 max-w-[600px] py-16 lg:py-20">

            {/* New collection badge — React Bits ShinyText style */}
            <div className="ha-badge opacity-0 inline-flex items-center gap-2 bg-black text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 inline-block shrink-0" />
              New Collection 2026
            </div>

            {/* Headline — word-by-word slide-up reveal (React Bits SplitText) */}
            <h1
              className="text-5xl font-black uppercase leading-[1.0] tracking-tight mb-6 lg:text-6xl xl:text-7xl"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              {HEADLINE.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden mr-[0.22em] mb-[0.1em]"
                  style={{ lineHeight: 1.08 }}
                >
                  <span className="ha-word inline-block opacity-0">{word}</span>
                </span>
              ))}
            </h1>

            {/* Subtitle — React Bits BlurText fade */}
            <p className="ha-subtitle opacity-0 text-gray-600 text-base leading-relaxed mb-8 max-w-[480px]">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of style.
            </p>

            {/* CTA */}
            <Link
              href="/shop"
              className="ha-cta opacity-0 inline-flex items-center justify-center bg-black text-white text-sm font-medium px-8 py-3.5 rounded-full hover:bg-gray-900 transition-colors"
            >
              Shop Now
            </Link>

            {/* Stats */}
            <div className="flex items-stretch gap-0 mt-10 border-t border-gray-300 pt-8">
              {siteConfig.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`ha-stat opacity-0 flex-1 ${
                    i > 0 ? "pl-6 border-l border-gray-300 ml-6" : ""
                  }`}
                >
                  <div
                    className="text-3xl font-black leading-tight"
                    style={{ fontFamily: "var(--font-hero)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: image panel ───────────────────────────────── */}
          <div className="ha-panel opacity-0 hidden lg:flex absolute right-0 top-0 bottom-0 w-[520px] xl:w-[580px] items-center justify-center">
            <div className="relative">

              {/* Blurred glow behind the card — adds depth */}
              <div
                className="absolute inset-8 rounded-[36px] bg-black/10 blur-3xl"
                aria-hidden
              />

              {/* Main image card with float */}
              <div className="ha-image-wrap relative w-[380px] h-[500px] xl:w-[420px] xl:h-[540px]">
                <div className="relative w-full h-full rounded-[28px] overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=580&h=700&fit=crop&auto=format"
                    alt="Two models showcasing SHOP.CO fashion"
                    fill
                    priority
                    sizes="420px"
                    className="object-cover object-top"
                  />
                  {/* Bottom scrim */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Top-left floating badge */}
                <div className="ha-float opacity-0 absolute -top-5 left-6 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-white text-sm">✦</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                      Style
                    </div>
                    <div className="text-xs font-bold leading-none">New Arrivals</div>
                  </div>
                </div>

                {/* Bottom-right floating badge */}
                <div className="ha-float opacity-0 absolute -bottom-5 right-4 bg-black text-white rounded-2xl px-4 py-3 shadow-xl min-w-[140px]">
                  <div className="flex gap-0.5 mb-1.5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <span key={s} className="text-[#FFC633] text-[10px] leading-none">★</span>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">
                    Happy Customers
                  </div>
                  <div className="text-base font-black leading-none">2,000+</div>
                </div>
              </div>

              {/* Sparkle decorations */}
              <SparkleIcon
                size={50}
                className="ha-sparkle absolute top-10 -left-7 text-black"
              />
              <SparkleIcon
                size={26}
                className="ha-sparkle absolute bottom-28 -right-5 text-black"
              />
            </div>
          </div>

          {/* Mobile background image */}
          <div className="lg:hidden absolute inset-0 opacity-15 pointer-events-none" aria-hidden>
            <Image
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=580&h=700&fit=crop&auto=format"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
