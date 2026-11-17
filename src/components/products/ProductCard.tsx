"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { WishlistButton } from "@/components/products/WishlistButton";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Replaces the default "New" badge, e.g. "Bestseller". */
  label?: string;
  sizes?: string;
}

const SIZES = "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw";
const MAX_SWATCHES = 4;

export function ProductCard({ product, className, label, sizes = SIZES }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : null;
  const colors = product.colors ?? [];

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.sizes?.[0], product.colors?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/products/${product.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-[2/3] overflow-hidden bg-[#F2F2F0]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {(label || product.isNew || discount) && (
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {(label || product.isNew) && (
              <span className="bg-white/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-black">
                {label ?? "New"}
              </span>
            )}
            {discount && (
              <span className="bg-white/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[#C8102E]">
                -{discount}%
              </span>
            )}
          </div>
        )}

        <WishlistButton
          product={product}
          size={16}
          className="absolute top-1.5 right-1.5 w-8 h-8 border-0 bg-transparent hover:bg-white/70"
        />

        <button
          onClick={handleQuickAdd}
          aria-label={added ? `${product.name} added to bag` : `Quick add ${product.name}`}
          className={cn(
            "absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center bg-white text-black shadow-sm transition-all duration-200",
            "md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 focus-visible:opacity-100",
            added && "bg-black text-white md:opacity-100"
          )}
        >
          {added ? <Check size={16} strokeWidth={1.75} /> : <Plus size={16} strokeWidth={1.5} />}
        </button>
      </div>

      <div className="pt-2.5 space-y-1">
        <h3 className="text-[13px] leading-snug text-[#292929] line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[13px] flex items-baseline gap-2">
          <span className={discount ? "text-[#C8102E]" : "text-black"}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[#8A8A8A] line-through text-xs">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </p>
        {colors.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1" aria-label={`${colors.length} colours`}>
            {colors.slice(0, MAX_SWATCHES).map((c) => (
              <span
                key={c.hex}
                title={c.name}
                className="w-2.5 h-2.5 border border-black/15"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {colors.length > MAX_SWATCHES && (
              <span className="text-[11px] text-[#8A8A8A]">+{colors.length - MAX_SWATCHES}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
