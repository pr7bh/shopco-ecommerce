import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { StyleCategoryGrid } from "@/components/home/StyleCategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { CampaignSection } from "@/components/home/CampaignSection";
import { SeasonalBanner } from "@/components/home/SeasonalBanner";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { ALL_PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "SHOP.CO — Find Clothes That Match Your Style",
  description:
    "Browse our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
};

export default function HomePage() {
  const newArrivals = ALL_PRODUCTS.filter((p) => p.isNew).slice(0, 8);
  const trending = ALL_PRODUCTS.filter(
    (p) => p.isFeatured || p.rating >= 4.5
  ).slice(0, 8);
  const bestsellers = ALL_PRODUCTS.filter((p) => p.isBestseller).slice(0, 8);

  return (
    <>
      <HeroSection />
      <StyleCategoryGrid />
      <ProductSection
        title="New Arrivals"
        subtitle="JUST DROPPED"
        products={newArrivals}
        viewAllHref="/shop?sort=newest"
      />
      <CampaignSection />
      <ProductSection
        title="Trending Now"
        subtitle="MOST LOVED"
        products={trending}
        viewAllHref="/shop?sort=rating"
      />
      <SeasonalBanner />
      {bestsellers.length > 0 && (
        <ProductSection
          title="Bestsellers"
          subtitle="FAN FAVOURITES"
          products={bestsellers}
          viewAllHref="/shop"
        />
      )}
      <TestimonialSection />
      <BrandPhilosophy />
    </>
  );
}
