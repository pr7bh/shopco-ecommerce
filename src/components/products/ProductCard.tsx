"use client";

import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/products/StarRating";
import { WishlistButton } from "@/components/products/WishlistButton";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col bg-white rounded-[var(--radius-card)] overflow-hidden",
        "card-3d",
        className
      )}
    >
      {/* Image area */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden rounded-[var(--radius-card)]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Wishlist button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton product={product} size={14} className="w-8 h-8 shadow-sm" />
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1 px-1">
        <h3 className="font-medium text-sm leading-tight mb-1.5 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size={14}
          className="mb-2"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-base">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm font-medium">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {discount && (
            <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
