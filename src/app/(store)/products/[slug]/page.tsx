export const instant = false;

import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductOptions } from "@/components/products/ProductOptions";
import { ReviewsSection } from "@/components/products/ReviewsSection";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import {
  getProductBySlug,
  getRelatedProducts,
  PRODUCT_REVIEWS,
} from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | SHOP.CO" };
  return {
    title: `${product.name} | SHOP.CO`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const reviews = PRODUCT_REVIEWS[product.id] ?? [];
  const related = getRelatedProducts(product, 4);

  return (
    <div className="shopco-container py-8 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#B8A99A]">
        <Link href="/" className="hover:text-[#292929] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#292929] transition-colors">Shop</Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-[#292929] transition-colors capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#292929] font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main product section */}
      <div className="grid xl:grid-cols-[3fr_2fr] gap-10 xl:gap-16 items-start">
        {/* Gallery */}
        <Suspense
          fallback={
            <div className="aspect-[3/4] bg-[#F7F6F3] animate-pulse" />
          }
        >
          <ProductGallery
            images={product.images}
            name={product.name}
            model3dUrl={product.model3dUrl}
          />
        </Suspense>

        {/* Sticky product info */}
        <div className="xl:sticky xl:top-24">
          <ProductOptions product={product} />
        </div>
      </div>

      {/* Reviews + Tabs */}
      <Suspense fallback={null}>
        <ReviewsSection reviews={reviews} productId={product.id} />
      </Suspense>

      {/* Related products */}
      <RelatedProducts products={related} />
    </div>
  );
}
