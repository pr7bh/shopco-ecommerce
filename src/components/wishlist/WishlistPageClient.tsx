"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";
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
      <div className="shopco-container py-24 flex flex-col items-center gap-8 text-center">
        <div className="w-20 h-20 border border-[#EEEEEC] flex items-center justify-center">
          <Heart size={32} strokeWidth={1} className="text-[#B8A99A]" />
        </div>
        <div>
          <p className="eyebrow text-[#B8A99A] mb-3">Wishlist</p>
          <h1
            className="text-3xl font-black uppercase tracking-tight mb-2"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            Nothing saved yet
          </h1>
          <p className="text-sm text-[#B8A99A]">
            Pieces you love will be waiting for you here.
          </p>
        </div>
        <Link
          href="/shop"
          className="eyebrow bg-black text-white px-10 py-4 hover:bg-[#292929] transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="shopco-container py-10 pb-20">
      {/* Header */}
      <p className="eyebrow text-[#B8A99A] mb-2">Wishlist</p>
      <h1
        className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-10"
        style={{ fontFamily: "var(--font-hero)" }}
      >
        Saved Pieces
        <span
          className="ml-4 text-base font-normal text-[#B8A99A] normal-case tracking-normal"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {items.length} items
        </span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {items.map((product) => (
          <div key={product.id} className="group flex flex-col">
            {/* Image */}
            <div className="relative overflow-hidden bg-[#F7F6F3]" style={{ aspectRatio: "3/4" }}>
              <Link href={`/products/${product.slug}`} className="block w-full h-full">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>

              {/* Remove */}
              <button
                onClick={() => removeItem(product.id)}
                aria-label="Remove from wishlist"
                className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center text-[#B8A99A] hover:text-black transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} strokeWidth={1.5} />
              </button>

              {/* Add to bag overlay */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button
                  onClick={() => moveToCart(product.id)}
                  className="w-full eyebrow bg-black text-white py-3 hover:bg-[#292929] transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={12} strokeWidth={1.5} />
                  Add to Bag
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="pt-3 flex-1 flex flex-col">
              <p className="eyebrow text-[#B8A99A] mb-1 capitalize">{product.category}</p>
              <Link
                href={`/products/${product.slug}`}
                className="font-semibold text-sm uppercase tracking-tight leading-tight hover:text-[#292929] transition-colors mb-2 line-clamp-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.name}
              </Link>
              <div className="flex items-center gap-2 mt-auto">
                <span
                  className="font-bold text-sm"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-[#B8A99A] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile add to bag (always visible on small screens) */}
            <button
              onClick={() => moveToCart(product.id)}
              className="mt-3 md:hidden w-full eyebrow border border-[#EEEEEC] py-3 text-[#292929] hover:bg-black hover:text-white hover:border-black transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
              Add to Bag
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
