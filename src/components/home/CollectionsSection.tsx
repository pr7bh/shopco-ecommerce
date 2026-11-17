"use client";

import { useRef } from "react";
import Link from "next/link";
import { createTimeline } from "animejs";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";
import { useInViewMotion } from "@/hooks/useInViewMotion";
import { $, blurIn, fadeUp, maskIn, prepareBlur, prepareFade, prepareMask, resetPointer, trackPointer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { EditorialFrame, type EditorialImage } from "./EditorialFrame";

export type CollectionKey = "essentials" | "minimal" | "classics" | "denim" | "outerwear" | "accessories";

interface Collection {
  key: CollectionKey;
  title: string;
  description: string;
  href: string;
  image: EditorialImage;
  tile: string;
  frame: string;
  sizes: string;
}

const COLLECTIONS: Collection[] = [
  {
    key: "essentials",
    title: "Everyday Essentials",
    description: "The tees you reach for first — soft cotton, clean necklines, easy fits.",
    href: "/shop?subcategory=basic-tshirts",
    image: { id: 9775489, alt: "Model in a white t-shirt and dark jeans crouching in a white studio", focus: "45% 45%" },
    tile: "lg:col-span-7",
    frame: "aspect-[3/2]",
    sizes: "(max-width: 1023px) 100vw, 58vw",
  },
  {
    key: "minimal",
    title: "Minimal Wardrobe",
    description: "Fine-gauge and chunky knits in undyed, quiet tones.",
    href: "/shop?subcategory=knitwear",
    image: { id: 7760243, alt: "Model in an oatmeal knit sweater against a sand-coloured backdrop", focus: "50% 30%" },
    tile: "lg:col-span-5 lg:mt-28",
    frame: "aspect-[4/5]",
    sizes: "(max-width: 1023px) 100vw, 42vw",
  },
  {
    key: "classics",
    title: "Modern Classics",
    description: "Crisp shirting and polos, cut cleanly for now.",
    href: "/shop?subcategory=shirts",
    image: { id: 39705635, alt: "Model in a white shirt and black trousers seated in a white studio", focus: "50% 35%" },
    tile: "lg:col-span-4",
    frame: "aspect-[3/4]",
    sizes: "(max-width: 1023px) 100vw, 33vw",
  },
  {
    key: "denim",
    title: "The Denim Edit",
    description: "Straight, wide and barrel-leg jeans in true indigo washes.",
    href: "/shop?subcategory=jeans",
    image: { id: 6769366, alt: "Close-up of a light-wash denim jacket worn with matching jeans", focus: "50% 40%" },
    tile: "lg:col-span-8 lg:mt-36",
    frame: "aspect-[16/10]",
    sizes: "(max-width: 1023px) 100vw, 66vw",
  },
  {
    key: "outerwear",
    title: "Outerwear",
    description: "Trench coats, wool-blend overcoats and quilted layers.",
    href: "/shop?subcategory=outerwear",
    image: { id: 6218357, alt: "Model in a beige trench coat against a sunlit white wall", focus: "50% 30%" },
    tile: "lg:col-span-5",
    frame: "aspect-[4/5]",
    sizes: "(max-width: 1023px) 100vw, 42vw",
  },
  {
    key: "accessories",
    title: "Accessories Edit",
    description: "Leather bags and the finishing pieces that pull a look together.",
    href: "/shop?gender=unisex",
    image: { id: 19711183, alt: "Studio shot of two models styled with black and brown leather handbags", focus: "50% 45%" },
    tile: "lg:col-span-7 lg:mt-24",
    frame: "aspect-[4/3]",
    sizes: "(max-width: 1023px) 100vw, 58vw",
  },
];

function CollectionTile({ collection, index, count }: { collection: Collection; index: number; count: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useInViewMotion(ref, {
    prepare: (root) => {
      prepareMask($(root, "[data-reveal-frame]"));
      prepareFade($(root, ".col-meta"));
    },
    play: (root) => {
      const tl = createTimeline();
      maskIn(tl, $(root, "[data-reveal-frame]"), 0);
      fadeUp(tl, $(root, ".col-meta"), 450, 70);
    },
  });

  return (
    <Link
      ref={ref}
      href={collection.href}
      className={cn("group block", collection.tile)}
      onPointerMove={trackPointer}
      onPointerLeave={resetPointer}
    >
      <EditorialFrame
        image={collection.image}
        sizes={collection.sizes}
        className={collection.frame}
        width={1600}
      />
      <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 md:mt-6">
        <span className="col-meta text-[11px] tracking-[0.2em] text-black/40 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3
          className="col-meta text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold leading-tight tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {collection.title}
        </h3>
        <span className="col-meta text-[11px] tracking-[0.2em] uppercase text-black/45 tabular-nums">
          {count} pieces
        </span>
        <div className="col-start-2 col-end-4 mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 transition-[opacity,translate] duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
          <p className="max-w-sm text-sm leading-relaxed text-black/60">{collection.description}</p>
          <span className="ed-link text-black">
            Shop the edit
            <ArrowGlyph />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CollectionsSection({ counts }: { counts: Record<CollectionKey, number> }) {
  const headerRef = useRef<HTMLDivElement>(null);
  useInViewMotion(headerRef, {
    prepare: (root) => {
      prepareBlur($(root, ".colh-word"));
      prepareFade($(root, ".colh-meta"));
    },
    play: (root) => {
      const tl = createTimeline();
      fadeUp(tl, $(root, ".colh-meta"), 0, 80);
      blurIn(tl, $(root, ".colh-word"), 120, 100);
    },
  });

  return (
    <section aria-labelledby="collections-heading" className="bg-white py-[clamp(4.5rem,9vw,8.5rem)]">
      <div className="shopco-container">
        <div ref={headerRef} className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <p className="colh-meta text-[11px] tracking-[0.22em] uppercase text-black/45">Shop by collection</p>
            <h2
              id="collections-heading"
              className="mt-4 font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.6rem,7vw,6rem)]"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              <span className="colh-word inline-block">Six</span> <span className="colh-word inline-block text-[#C8BBAA]">edits</span>
            </h2>
          </div>
          <p className="colh-meta max-w-sm text-sm leading-relaxed text-black/60 lg:col-span-4 lg:pb-3">
            Curated stories across the collection — each one a shortcut to pieces that work together.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 md:mt-20 lg:grid-cols-12 lg:gap-y-24">
          {COLLECTIONS.map((collection, i) => (
            <CollectionTile key={collection.key} collection={collection} index={i} count={counts[collection.key]} />
          ))}
        </div>
      </div>
    </section>
  );
}
