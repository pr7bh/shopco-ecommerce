"use client";

import {
  useCallback,
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { animate, createScope, createTimeline, stagger, utils, type JSAnimation, type Timeline } from "animejs";
import Magnet from "@/components/reactbits/Magnet";
import { cn } from "@/lib/utils";
import { AUTOPLAY_MS, CAMPAIGNS, LAYERS, pexelsUrl } from "./hero/campaigns";
import type { HeroPointer } from "./hero/HeroScene";

const HeroScene = dynamic(() => import("./hero/HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => null,
});

const COUNT = CAMPAIGNS.length;
const pad = (n: number) => String(n).padStart(2, "0");
const TEXT_TARGETS = ".hx-meta, .hw, .hx-desc, .hx-cta";

const noopSubscribe = () => () => {};
let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport === null) {
    try {
      const c = document.createElement("canvas");
      webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

function usePageVisible() {
  return useSyncExternalStore(
    (cb) => {
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => !document.hidden,
    () => true
  );
}

// Keyframes follow React Bits BlurText's "blur" effect: blur → half blur → sharp while rising into place.
function addTextIn(tl: Timeline, root: HTMLElement, at: number) {
  const q = (s: string) => root.querySelectorAll<HTMLElement>(s);
  tl.add(q(".hx-meta"), { opacity: [0, 1], translateY: [10, 0], duration: 700, delay: stagger(70), ease: "outQuart" }, at)
    .add(
      q(".hw"),
      {
        opacity: [0, 0.5, 1],
        filter: ["blur(12px)", "blur(5px)", "blur(0px)"],
        translateY: [44, -4, 0],
        duration: 1100,
        delay: stagger(85),
        ease: "outQuart",
      },
      at + 120
    )
    .add(
      q(".hx-desc"),
      { opacity: [0, 1], translateY: [18, 0], filter: ["blur(4px)", "blur(0px)"], duration: 900, ease: "outQuart" },
      at + 620
    )
    .add(q(".hx-cta"), { opacity: [0, 1], scale: [0.94, 1], duration: 850, delay: stagger(90), ease: "outQuart" }, at + 780);
  return tl;
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const [sceneAllowed, setSceneAllowed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);

  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const finePointer = useMedia("(pointer: fine)");
  const desktop = useMedia("(min-width: 1024px)");
  const pageVisible = usePageVisible();
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);

  const rootRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef<HeroPointer>({ x: 0, y: 0 });
  const indexRef = useRef(0);
  const lastText = useRef(0);
  const transitioning = useRef(false);
  const outAnim = useRef<JSAnimation | null>(null);
  const autoplay = useRef<JSAnimation | null>(null);
  const firstAutoplay = useRef(true);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);
  const sceneReadyRef = useRef(false);
  const touchStart = useRef<number | null>(null);

  const useScene = desktop && finePointer && webgl && !reduced && !sceneFailed;
  const paused = userPaused || hovered || focused || !pageVisible || !inView;
  const campaign = CAMPAIGNS[textIndex];

  useEffect(() => {
    reducedRef.current = reduced;
    sceneReadyRef.current = sceneReady;
  }, [reduced, sceneReady]);

  const go = useCallback((target: number) => {
    const next = ((target % COUNT) + COUNT) % COUNT;
    if (next === indexRef.current) return;
    indexRef.current = next;
    setIndex(next);
    if (!sceneReadyRef.current) setVisited((v) => (v.includes(next) ? v : [...v, next]));
    const root = textRef.current;
    if (reducedRef.current || !root) {
      setTextIndex(next);
      return;
    }
    // A click mid-transition only retargets; the running exit hands over to the latest index.
    if (transitioning.current) return;
    transitioning.current = true;
    outAnim.current?.cancel();
    outAnim.current = animate(root.querySelectorAll(TEXT_TARGETS), {
      opacity: 0,
      translateY: -14,
      filter: "blur(6px)",
      duration: 360,
      delay: stagger(22),
      ease: "inQuad",
      onComplete: () => {
        transitioning.current = false;
        setTextIndex(indexRef.current);
      },
    });
  }, []);

  // Entrance choreography: background → masked image reveal → headline → copy → CTA → chrome → ambient drift.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.intro = "done";
      return;
    }
    const scope = createScope({ root }).add(() => {
      const q = (s: string) => root.querySelectorAll<HTMLElement>(s);
      utils.set([...q(TEXT_TARGETS), ...q(".hx-chrome"), ...q(".hero-bg")], { opacity: 0 });
      root.dataset.intro = "running";
      const tl = createTimeline({
        onComplete: () => {
          root.dataset.intro = "done";
          setSceneAllowed(true);
        },
      });
      tl.add(q(".hero-bg"), { opacity: [0, 1], duration: 1400, ease: "outQuad" }, 0).add(
        q(".hero-curtain"),
        { scaleY: [1, 0], duration: 1150, delay: stagger(160), ease: "inOutQuart" },
        150
      );
      addTextIn(tl, root, 650);
      tl.add(q(".hx-chrome"), { opacity: [0, 1], translateY: [8, 0], duration: 900, delay: stagger(70), ease: "outQuart" }, 1500);
      animate(q(".hero-drift"), {
        scale: [1.04, 1.1],
        translateX: ["0%", "-1.5%"],
        duration: 16000,
        ease: "inOutSine",
        alternate: true,
        loop: true,
      });
    });
    return () => scope.revert();
  }, []);

  // New campaign copy enters after the outgoing copy has cleared.
  useLayoutEffect(() => {
    if (textIndex === lastText.current) return;
    lastText.current = textIndex;
    const root = textRef.current;
    if (!root || reducedRef.current) return;
    utils.set(root.querySelectorAll(TEXT_TARGETS), { opacity: 0 });
    const tl = addTextIn(createTimeline(), root, 0);
    return () => {
      tl.cancel();
    };
  }, [textIndex]);

  // Autoplay progress bar doubles as the slide timer.
  useEffect(() => {
    if (reduced) return;
    const bar = barRefs.current[index];
    if (!bar) return;
    barRefs.current.forEach((b, i) => {
      if (b && i !== index) b.style.transform = "";
    });
    let live = true;
    const anim = animate(bar, {
      scaleX: [0, 1],
      duration: AUTOPLAY_MS,
      delay: firstAutoplay.current ? 2000 : 0,
      ease: "linear",
      autoplay: false,
      onComplete: () => {
        if (live) go(indexRef.current + 1);
      },
    });
    firstAutoplay.current = false;
    autoplay.current = anim;
    if (!pausedRef.current) anim.play();
    return () => {
      live = false;
      anim.cancel();
      autoplay.current = null;
    };
  }, [index, reduced, go]);

  useEffect(() => {
    pausedRef.current = paused;
    const a = autoplay.current;
    if (!a) return;
    if (paused) a.pause();
    else a.resume();
  }, [paused]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // Pointer parallax for the DOM composition + spotlight; also feeds the WebGL scene.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !finePointer || reduced || !desktop) return;
    const layers = layerRefs.current;
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = root.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    let raf = 0;
    const tick = () => {
      const p = pointer.current;
      p.x += (target.x - p.x) * 0.08;
      p.y += (target.y - p.y) * 0.08;
      root.style.setProperty("--sx", `${((p.x + 1) * 50).toFixed(2)}%`);
      root.style.setProperty("--sy", `${((1 - p.y) * 50).toFixed(2)}%`);
      if (!sceneReadyRef.current) {
        LAYERS.forEach((layer, i) => {
          const el = layers[i];
          if (!el) return;
          const k = layer.parallax;
          el.style.transform = `translate3d(${(p.x * 18 * k).toFixed(2)}px, ${(-p.y * 12 * k).toFixed(2)}px, 0) rotateY(${(p.x * 3 * k).toFixed(2)}deg) rotateX(${(p.y * 2 * k).toFixed(2)}deg)`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      layers.forEach((el) => el && (el.style.transform = ""));
    };
  }, [finePointer, reduced, desktop]);

  useEffect(
    () => () => {
      outAnim.current?.cancel();
    },
    []
  );

  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const onSceneError = useCallback(() => {
    setSceneFailed(true);
    setSceneReady(false);
    setVisited(CAMPAIGNS.map((_, i) => i));
  }, []);

  const uiHover = {
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setHovered(true),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setHovered(false),
  };

  function scrollPastHero() {
    const root = rootRef.current;
    if (!root) return;
    window.scrollTo({ top: root.offsetTop + root.offsetHeight - 64, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <section
      ref={rootRef}
      data-intro="pending"
      aria-roledescription="carousel"
      aria-label="SHOP.CO campaigns"
      className="hero-root relative isolate overflow-hidden bg-[#0e0e0d] text-white h-[calc(100svh-104px)] min-h-140 md:min-h-160 max-h-250 touch-pan-y"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(indexRef.current + 1);
        if (e.key === "ArrowLeft") go(indexRef.current - 1);
      }}
      onFocus={(e) => {
        if ((e.target as HTMLElement).matches(":focus-visible")) setFocused(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") touchStart.current = e.clientX;
      }}
      onPointerCancel={() => {
        touchStart.current = null;
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== "touch" || touchStart.current === null) return;
        const dx = e.clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(dx) > 50) go(indexRef.current + (dx < 0 ? 1 : -1));
      }}
    >
      {/* Atmosphere: blurred campaign tint, spotlight and vignette */}
      <div aria-hidden className="hero-bg absolute inset-0 -z-10 hidden lg:block">
        <div className="hero-drift absolute inset-[-8%]">
          {CAMPAIGNS.map((c, i) => (
            <div
              key={c.number}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1400 motion-reduce:transition-none"
              style={{
                backgroundImage: `url(${pexelsUrl(c.images.main.id, 60)})`,
                filter: "blur(48px) saturate(1.15)",
                opacity: i === index ? 1 : 0,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[#0e0e0d]/72" />
        <div className="hero-spotlight absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_50%,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Composition stage */}
      <div className="absolute inset-0 lg:inset-auto lg:top-6 lg:bottom-24 lg:right-10 lg:w-[58%]">
        <span
          aria-hidden
          className="hero-ghost hidden lg:block absolute right-[3%] bottom-[9%] font-black leading-none select-none transition-opacity duration-700"
          style={{ fontFamily: "var(--font-hero)" }}
        >
          {CAMPAIGNS[index].number}
        </span>

        <div className={cn("absolute inset-0 transition-opacity duration-700", sceneReady && "opacity-0")}>
          {LAYERS.map((layer, li) => (
            <div
              key={layer.key}
              className={cn("hero-layer", `hero-layer--${layer.key}`)}
              style={
                {
                  "--cx": layer.cx,
                  "--cy": layer.cy,
                  "--h": layer.h,
                  "--rot": `${layer.rotY}rad`,
                  zIndex: li + 1,
                } as CSSProperties
              }
            >
              <div
                ref={(el) => {
                  layerRefs.current[li] = el;
                }}
                className="h-full w-full will-change-transform"
              >
                <div className="hero-frame relative h-full w-full overflow-hidden bg-[#1b1b1a]">
                  {CAMPAIGNS.map((c, ci) =>
                    visited.includes(ci) ? (
                      <Image
                        key={c.number}
                        src={pexelsUrl(c.images[layer.key].id, 1600)}
                        alt={ci === index && layer.key === "main" ? c.images.main.alt : ""}
                        fill
                        priority={ci === 0 && layer.key === "main"}
                        sizes={layer.key === "main" ? "(max-width: 1023px) 100vw, 34vw" : "(max-width: 1023px) 27vw, 18vw"}
                        className="object-cover transition-[opacity,transform] duration-1200 ease-out motion-reduce:transition-none"
                        style={{
                          objectPosition: c.images[layer.key].focus,
                          opacity: ci === index ? 1 : 0,
                          transform: ci === index ? "scale(1)" : "scale(1.06)",
                        }}
                      />
                    ) : null
                  )}
                  <div className="hero-curtain absolute inset-0 bg-[#0e0e0d]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {useScene && sceneAllowed && (
          <div
            aria-hidden
            className={cn("absolute inset-0 transition-opacity duration-700", sceneReady ? "opacity-100" : "opacity-0")}
          >
            <HeroScene
              index={index}
              active={inView && pageVisible}
              pointer={pointer}
              onReady={onSceneReady}
              onError={onSceneError}
            />
          </div>
        )}

        {/* Mobile legibility gradient over the full-bleed image */}
        <div
          aria-hidden
          className="lg:hidden absolute inset-0 z-5 bg-linear-to-t from-black/90 via-black/35 to-black/10"
        />
      </div>

      {/* Copy */}
      <div
        className="relative z-10 flex h-full flex-col justify-end px-5 pb-32 md:px-12 md:pb-36 lg:justify-center lg:pb-16 lg:pl-16 lg:pr-0 lg:w-[48%]"
        {...uiHover}
      >
        <div
          ref={textRef}
          key={textIndex}
          role="group"
          aria-roledescription="slide"
          aria-label={`${textIndex + 1} of ${COUNT}`}
        >
          <div className="hx-meta flex items-center gap-3 text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-white/65 mb-4 md:mb-7">
            <span className="text-white font-medium tabular-nums">
              {campaign.number} / {pad(COUNT)}
            </span>
            <span aria-hidden className="h-px w-8 bg-white/35" />
            <span>{campaign.collection}</span>
          </div>
          <p className="hx-meta text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-white/50 mb-3 md:mb-4">
            {campaign.eyebrow}
          </p>
          <h1
            className="font-black uppercase text-white leading-[0.92] tracking-[-0.02em] text-[clamp(2.3rem,10.5vw,3.4rem)] md:text-[clamp(3.25rem,8vw,4.75rem)] lg:text-[clamp(2.75rem,5.3vw,6.25rem)] text-balance"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            {campaign.headline.map((line, li) => (
              <span key={line} className="block">
                {line.split(" ").map((word, wi, arr) => (
                  <Fragment key={word}>
                    <span className="hw inline-block">{word}</span>
                    {wi < arr.length - 1 || li < campaign.headline.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>
          <p className="hx-desc mt-4 md:mt-7 max-w-88 text-sm md:text-base leading-relaxed text-white/75">
            {campaign.description}
          </p>
          <div className="mt-6 md:mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="hx-cta">
              <Magnet padding={70} magnetStrength={3.5} maxOffset={12} disabled={!finePointer}>
                <Link href={campaign.cta.href} className="hero-cta group">
                  {campaign.cta.label}
                  <span className="hero-cta-arrow" aria-hidden>
                    <Arrow className="hero-cta-arrow-a" />
                    <Arrow className="hero-cta-arrow-b" />
                  </span>
                </Link>
              </Magnet>
            </div>
            <div className="hx-cta">
              <Link href={campaign.secondary.href} className="hero-link">
                {campaign.secondary.label}
              </Link>
            </div>
          </div>
        </div>
        <p className="sr-only" aria-live={!paused && !reduced ? "off" : "polite"} aria-atomic="true">
          {`Campaign ${index + 1} of ${COUNT}: ${CAMPAIGNS[index].headline.join(" ")}`}
        </p>
      </div>

      {/* Vertical editorial label */}
      <div
        aria-hidden
        className="hx-chrome hidden lg:block absolute right-5 top-1/2 z-10 -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] text-[10px] tracking-[0.38em] uppercase text-white/40"
      >
        SHOP.CO — Campaign {CAMPAIGNS[index].number} — 2026
      </div>

      {/* Controls */}
      <div className="hx-chrome absolute inset-x-0 bottom-0 z-10 px-5 pb-5 md:px-12 md:pb-7 lg:px-16" {...uiHover}>
        <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-3 md:pt-4">
          <div className="flex items-center gap-4 md:gap-7" role="group" aria-label="Choose campaign">
            {CAMPAIGNS.map((c, i) => (
              <button
                key={c.number}
                type="button"
                onClick={() => go(i)}
                aria-label={`Campaign ${i + 1}: ${c.headline.join(" ")}`}
                aria-current={i === index ? "true" : undefined}
                className="group flex flex-col items-start gap-2 py-2 text-left"
              >
                <span
                  className={cn(
                    "text-[10px] tracking-[0.2em] tabular-nums transition-colors",
                    i === index ? "text-white" : "text-white/45 group-hover:text-white/80"
                  )}
                >
                  {c.number}
                </span>
                <span className="relative block h-px w-9 md:w-16 overflow-hidden bg-white/25">
                  <span
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    className={cn(
                      "absolute inset-0 origin-left bg-white",
                      reduced && i === index ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "hidden lg:block text-[10px] tracking-[0.18em] uppercase transition-colors",
                    i === index ? "text-white/80" : "text-white/35"
                  )}
                >
                  {c.collection}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollPastHero}
            className="hidden md:flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors"
          >
            Scroll
            <span aria-hidden className="hero-scroll-line" />
          </button>

          <div className="flex items-center gap-1">
            {!reduced && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                className="hero-icon-btn"
              >
                {userPaused ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <path d="M3 1.5v9l7-4.5z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />
                  </svg>
                )}
              </button>
            )}
            <button type="button" onClick={() => go(indexRef.current - 1)} aria-label="Previous campaign" className="hero-icon-btn">
              <Arrow className="rotate-180" />
            </button>
            <button type="button" onClick={() => go(indexRef.current + 1)} aria-label="Next campaign" className="hero-icon-btn">
              <Arrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
