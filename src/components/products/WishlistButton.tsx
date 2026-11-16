"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/features/wishlist/store";
import type { Product } from "@/types";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: number;
}

export function WishlistButton({ product, className, size = 16 }: WishlistButtonProps) {
  const { isWishlisted, toggleItem } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
      }}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-full border transition-all",
        wishlisted
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "bg-white/80 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200",
        className
      )}
    >
      <Heart size={size} fill={wishlisted ? "currentColor" : "none"} />
    </button>
  );
}
