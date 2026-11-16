import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { BrandBar } from "@/components/home/BrandBar";
import { ProductSection } from "@/components/home/ProductSection";
import { StyleCategoryGrid } from "@/components/home/StyleCategoryGrid";
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
      <BrandBar />
      <ProductSection
        title="New Arrivals"
        products={NEW_ARRIVALS}
        viewAllHref="/new-arrivals"
      />
      <div className="border-t border-gray-200" />
      <ProductSection
        title="Top Selling"
        products={TOP_SELLING}
        viewAllHref="/shop?sort=top-selling"
      />
      <StyleCategoryGrid />
      <TestimonialSection />
      <NewsletterSection />
    </>
  );
}
