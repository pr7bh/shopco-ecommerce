"use client";

import { useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/features/wishlist/store";
import { animate } from "animejs";
import type { Product } from "@/types";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: number;
}

const noopSubscribe = () => () => {};

export function WishlistButton({ product, className, size = 16 }: WishlistButtonProps) {
  // Server HTML has no localStorage; render "not wishlisted" during hydration, then the persisted state.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const inWishlist = useWishlistStore((s) => s.items.some((p) => p.id === product.id));
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const wishlisted = hydrated && inWishlist;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
        const btn = e.currentTarget as HTMLElement;
        animate(btn, {
          scale: [1, 1.4, 1],
          duration: 400,
          easing: "easeOutBack",
        });
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
