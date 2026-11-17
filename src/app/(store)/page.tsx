import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { StyleCategoryGrid } from "@/components/home/StyleCategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { CampaignSection } from "@/components/home/CampaignSection";
import { CollectionsSection, type CollectionKey } from "@/components/home/CollectionsSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { SeasonalBanner } from "@/components/home/SeasonalBanner";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { TestimonialSection, type TestimonialItem } from "@/components/home/TestimonialSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ALL_PRODUCTS } from "@/lib/products";
import { TESTIMONIALS } from "@/lib/mock-data";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "New Season Collection",
  description:
    "Shop the new season collection at SHOP.CO. Premium fashion for women, men and accessories — refined pieces for the modern wardrobe.",
};

/** Round-robin across subcategories so a selection never shows five t-shirts in a row. */
function varied(list: Product[], n: number) {
  const groups = new Map<string, Product[]>();
  for (const p of list) {
    const key = p.subcategory ?? p.category;
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  const queues = [...groups.values()];
  const out: Product[] = [];
  while (out.length < n && queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next) out.push(next);
      if (out.length === n) break;
    }
  }
  return out;
}

const popularity = (p: Product) => p.rating * Math.log10(p.reviewCount + 10);

export default function HomePage() {
  const newArrivals = varied(ALL_PRODUCTS.filter((p) => p.isNew), 10);
  const shown = new Set(newArrivals.map((p) => p.id));
  const trending = varied(
    ALL_PRODUCTS.filter((p) => p.isBestseller && !shown.has(p.id)).sort((a, b) => popularity(b) - popularity(a)),
    7
  );

  const bySub = (sub: string) => ALL_PRODUCTS.filter((p) => p.subcategory === sub).length;
  const collectionCounts: Record<CollectionKey, number> = {
    essentials: bySub("basic-tshirts"),
    minimal: bySub("knitwear"),
    classics: bySub("shirts"),
    denim: bySub("jeans"),
    outerwear: bySub("outerwear"),
    accessories: ALL_PRODUCTS.filter((p) => p.gender === "unisex").length,
  };

  const testimonials: TestimonialItem[] = TESTIMONIALS.map((review) => {
    const p = ALL_PRODUCTS.find((x) => x.id === review.productId);
    return { review, product: p ? { name: p.name, slug: p.slug, image: p.images[0] } : undefined };
  });

  return (
    <>
      <HeroSection />
      <StyleCategoryGrid />
      <ProductSection
        id="new-arrivals"
        eyebrow="Just in — new arrivals"
        title={["New", "arrivals"]}
        description="Fresh pieces across womenswear, menswear and accessories — landed this season."
        products={newArrivals}
        viewAllHref="/shop?sort=newest"
        viewAllLabel="View all new in"
      />
      <CampaignSection />
      <CollectionsSection counts={collectionCounts} />
      <TrendingSection products={trending} />
      <SeasonalBanner />
      <BrandPhilosophy />
      <TestimonialSection items={testimonials} />
      <NewsletterSection />
    </>
  );
}
