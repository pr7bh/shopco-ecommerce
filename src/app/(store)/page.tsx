import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { StyleCategoryGrid } from "@/components/home/StyleCategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { CampaignSection } from "@/components/home/CampaignSection";
import { SeasonalBanner } from "@/components/home/SeasonalBanner";
import { BrandPhilosophy } from "@/components/home/BrandPhilosophy";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { NEW_ARRIVALS, TOP_SELLING } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "SHOP.CO — Find Clothes That Match Your Style",
  description:
    "Browse our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StyleCategoryGrid />
      <ProductSection
        title="New Arrivals"
        subtitle="JUST DROPPED"
        products={NEW_ARRIVALS}
        viewAllHref="/new-arrivals"
      />
      <CampaignSection />
      <ProductSection
        title="Top Selling"
        subtitle="TRENDING NOW"
        products={TOP_SELLING}
        viewAllHref="/shop?sort=top-selling"
      />
      <SeasonalBanner />
      <BrandPhilosophy />
      <TestimonialSection />
      <NewsletterSection />
    </>
  );
}
