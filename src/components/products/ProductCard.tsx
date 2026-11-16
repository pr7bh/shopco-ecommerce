"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { StarRating } from "@/components/products/StarRating";
import { WishlistButton } from "@/components/products/WishlistButton";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store";
import type { Product } from "@/types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : null;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.sizes?.[0], product.colors?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn("group flex flex-col", className)}
    >
      {/* Image */}
      <div className="relative bg-[#F7F6F3] aspect-[3/4] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="eyebrow bg-black text-white px-2.5 py-1 text-[9px]">
              NEW
            </span>
          )}
          {discount && (
            <span className="eyebrow bg-[#B8A99A] text-white px-2.5 py-1 text-[9px]">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton product={product} size={14} className="w-8 h-8 shadow-sm bg-white" />
        </div>

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold tracking-widest uppercase transition-colors",
              added
                ? "bg-[#292929] text-[#B8A99A]"
                : "bg-black text-white hover:bg-[#292929]"
            )}
          >
            <ShoppingBag size={13} strokeWidth={1.5} />
            {added ? "✓ Added" : "ADD TO BAG"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        <h3
          className="text-sm font-medium leading-snug mb-1.5 line-clamp-2 text-[#292929] group-hover:text-black transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {product.name}
        </h3>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size={12}
          className="mb-2"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm text-black">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[#B8A99A] line-through text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
