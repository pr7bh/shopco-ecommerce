"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useWishlistStore } from "@/features/wishlist/store";
import { useCartStore } from "@/features/cart/store";
import { formatPrice } from "@/lib/utils";

export function WishlistPageClient() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  function moveToCart(productId: string) {
    const product = items.find((p) => p.id === productId);
    if (!product) return;
    addItem(product, 1);
    removeItem(productId);
  }

  if (items.length === 0) {
    return (
      <div className="shopco-container py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <Heart size={36} className="text-gray-300" />
        </div>
        <div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your wishlist is empty
          </h1>
          <p className="text-gray-500 text-sm">
            Save items you love and come back to them later.
          </p>
        </div>
        <Link
          href="/shop"
          className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="shopco-container py-10">
      <div className="flex items-baseline gap-3 mb-8">
        <h1
          className="text-2xl font-bold uppercase tracking-tight"
          style={{ fontFamily: "var(--font-hero)" }}
        >
          Wishlist
        </h1>
        <span className="text-sm text-gray-500">({items.length} items)</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="group bg-white border border-gray-200 rounded-[var(--radius-card)] overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <Link href={`/products/${product.slug}`}>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              {/* Remove button */}
              <button
                onClick={() => removeItem(product.id)}
                aria-label="Remove from wishlist"
                className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col flex-1 gap-2">
              <Link
                href={`/products/${product.slug}`}
                className="font-medium text-sm leading-tight line-clamp-2 hover:underline"
              >
                {product.name}
              </Link>
              <span className="font-bold text-sm">{formatPrice(product.price)}</span>

              <button
                onClick={() => moveToCart(product.id)}
                className="mt-auto flex items-center justify-center gap-2 bg-black text-white text-xs font-medium py-2 rounded-full hover:bg-gray-900 transition-colors"
              >
                <ShoppingCart size={13} />
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
