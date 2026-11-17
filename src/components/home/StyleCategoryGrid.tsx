"use client";

import { useRef } from "react";
import Link from "next/link";
import { createTimeline } from "animejs";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";
import { useInViewMotion } from "@/hooks/useInViewMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { $, blurIn, fadeUp, maskIn, prepareBlur, prepareFade, prepareMask, resetPointer, trackPointer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { EditorialFrame, type EditorialImage } from "./EditorialFrame";

interface Category {
  number: string;
  title: string;
  href: string;
  description: string;
  cta: string;
  image: EditorialImage;
  hover: EditorialImage;
}

const WOMEN: Category = {
  number: "01",
  title: "Women",
  href: "/shop?gender=women",
  description: "Fluid tailoring, easy dresses and knitwear in a quiet, considered palette.",
  cta: "Shop women",
  image: { id: 31649570, alt: "Model in a cream utility jumpsuit against a warm studio backdrop", focus: "50% 25%" },
  hover: { id: 18173600, alt: "", focus: "50% 25%" },
};
const MEN: Category = {
  number: "02",
  title: "Men",
  href: "/shop?gender=men",
  description: "Relaxed essentials, clean shirting and everyday layers.",
  cta: "Shop men",
  image: { id: 16646775, alt: "Model in a black t-shirt and dark jeans seated on a stool in a white studio", focus: "50% 40%" },
  hover: { id: 8217535, alt: "", focus: "50% 30%" },
};
const ACCESSORIES: Category = {
  number: "03",
  title: "Accessories",
  href: "/shop?gender=unisex",
  description: "Leather bags, caps, belts and eyewear to finish the look.",
  cta: "Shop accessories",
  image: { id: 13055401, alt: "Brown leather shoulder bag carried against a white backdrop", focus: "50% 45%" },
  hover: { id: 13525167, alt: "", focus: "50% 50%" },
};

function useTileReveal(ref: React.RefObject<HTMLElement | null>) {
  useInViewMotion(ref, {
    prepare: (root) => {
      prepareMask($(root, "[data-reveal-frame]"));
      prepareBlur($(root, ".cat-title"));
      prepareFade($(root, ".cat-meta"));
    },
    play: (root) => {
      const tl = createTimeline();
      maskIn(tl, $(root, "[data-reveal-frame]"), 0);
      blurIn(tl, $(root, ".cat-title"), 380);
      fadeUp(tl, $(root, ".cat-meta"), 620, 70);
    },
  });
}

function Caption({ category, titleClass, className }: { category: Category; titleClass: string; className?: string }) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div className="min-w-0">
        <p className="cat-meta text-[11px] tracking-[0.22em] text-black/45 tabular-nums">
          {category.number} / 03
        </p>
        <h3
          className={cn("cat-title mt-2 font-black uppercase leading-[0.88] tracking-[-0.03em]", titleClass)}
          style={{ fontFamily: "var(--font-hero)" }}
        >
          {category.title}
        </h3>
        <p className="cat-meta mt-4 max-w-[22rem] text-sm leading-relaxed text-black/60">{category.description}</p>
      </div>
      <span className="cat-meta ed-link mb-1 shrink-0 text-black">
        {category.cta}
        <ArrowGlyph />
      </span>
    </div>
  );
}

function CategoryTile({
  category,
  frameClass,
  titleClass,
  sizes,
  depth,
  className,
}: {
  category: Category;
  frameClass: string;
  titleClass: string;
  sizes: string;
  depth: number;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useTileReveal(ref);
  return (
    <Link
      ref={ref}
      href={category.href}
      className={cn("group block", className)}
      onPointerMove={trackPointer}
      onPointerLeave={resetPointer}
    >
      <EditorialFrame image={category.image} hover={category.hover} sizes={sizes} depth={depth} className={frameClass} />
      <Caption category={category} titleClass={titleClass} className="mt-5 md:mt-6" />
    </Link>
  );
}

export function StyleCategoryGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const accessoriesRef = useRef<HTMLAnchorElement>(null);

  useScrollProgress(sectionRef, (p, root) => {
    root.style.setProperty("--py", ((0.5 - p) * 70).toFixed(2));
  });
  useInViewMotion(introRef, {
    prepare: (root) => {
      prepareBlur($(root, ".cat-word"));
      prepareFade($(root, ".cat-meta"));
    },
    play: (root) => {
      const tl = createTimeline();
      fadeUp(tl, $(root, ".cat-meta"), 0, 80);
      blurIn(tl, $(root, ".cat-word"), 120, 90);
    },
  });
  useTileReveal(accessoriesRef);

  return (
    <section ref={sectionRef} aria-labelledby="categories-heading" className="bg-white py-[clamp(4.5rem,9vw,8.5rem)]">
      <div className="shopco-container">
        <div className="grid grid-cols-1 gap-y-14 md:gap-y-20 lg:grid-cols-12 lg:gap-x-8">
          <div ref={introRef} className="lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:pt-4">
            <p className="cat-meta text-[11px] tracking-[0.22em] uppercase text-black/45">Explore — The Edit</p>
            <h2
              id="categories-heading"
              className="mt-4 font-black uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(2.1rem,4vw,3.4rem)]"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              <span className="cat-word inline-block">Dressed</span> <span className="cat-word inline-block">for</span>{" "}
              <span className="cat-word inline-block">every</span> <span className="cat-word inline-block">day</span>
            </h2>
            <p className="cat-meta mt-5 max-w-sm text-sm leading-relaxed text-black/60">
              Three ways into the new season — from tailored womenswear to everyday menswear and the
              accessories that finish both.
            </p>
          </div>

          <CategoryTile
            category={WOMEN}
            className="lg:col-span-7 lg:row-span-2 lg:row-start-1"
            frameClass="aspect-[4/5]"
            titleClass="text-[clamp(3.25rem,8vw,7rem)]"
            sizes="(max-width: 1023px) 100vw, 58vw"
            depth={0.6}
          />

          <CategoryTile
            category={MEN}
            className="lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:self-end"
            frameClass="aspect-[4/5]"
            titleClass="text-[clamp(3rem,6vw,4.75rem)]"
            sizes="(max-width: 1023px) 100vw, 33vw"
            depth={1.2}
          />

          <Link
            ref={accessoriesRef}
            href={ACCESSORIES.href}
            className="group grid grid-cols-1 items-end gap-6 md:gap-8 lg:col-span-12 lg:grid-cols-12"
            onPointerMove={trackPointer}
            onPointerLeave={resetPointer}
          >
            <EditorialFrame
              image={ACCESSORIES.image}
              hover={ACCESSORIES.hover}
              sizes="(max-width: 1023px) 100vw, 58vw"
              depth={0.9}
              className="aspect-[3/2] lg:col-span-7 lg:col-start-1"
            />
            <Caption
              category={ACCESSORIES}
              titleClass="text-[clamp(1.9rem,8.6vw,4rem)] lg:text-[clamp(2rem,3.1vw,2.85rem)]"
              className="lg:col-span-5 lg:col-start-8 lg:flex-col lg:items-start lg:pb-2"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
