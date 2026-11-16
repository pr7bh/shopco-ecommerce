export const instant = false;

import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductOptions } from "@/components/products/ProductOptions";
import { ReviewsSection } from "@/components/products/ReviewsSection";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import {
  getProductBySlug,
  getRelatedProducts,
  PRODUCT_REVIEWS,
} from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/products/StarRating";

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
    <div className="shopco-container py-10 space-y-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <a href="/" className="hover:text-black transition-colors">
          Home
        </a>
        <span>/</span>
        <a href="/shop" className="hover:text-black transition-colors">
          Shop
        </a>
        <span>/</span>
        <a
          href={`/shop?category=${product.category}`}
          className="hover:text-black transition-colors capitalize"
        >
          {product.category}
        </a>
        <span>/</span>
        <span className="text-black font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main product section */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <Suspense
          fallback={
            <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          }
        >
          <ProductGallery
            images={product.images}
            name={product.name}
            model3dUrl={product.model3dUrl}
          />
        </Suspense>

        {/* Product info + actions */}
        <div className="space-y-6">
          {/* Title */}
          <h1
            className="text-3xl font-bold uppercase leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.name}
          </h1>

          {/* Summary rating */}
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size={14}
            showLabel
          />

          {/* Price preview */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-base text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Options: color, size, qty, add to cart */}
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
