"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus, Truck, RotateCcw, ChevronDown } from "lucide-react";
import { WishlistButton } from "@/components/products/WishlistButton";
import { StarRating } from "@/components/products/StarRating";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store";
import type { Product, Size, Color } from "@/types";

interface ProductOptionsProps {
  product: Product;
}

const SIZE_LABELS: Record<string, string> = {
  XS: "X-Small",
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "X-Large",
  XXL: "2X-Large",
};

export function ProductOptions({ product }: ProductOptionsProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(product.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [descOpen, setDescOpen] = useState(false);

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : undefined;

  function handleAddToCart() {
    addItem(product, qty, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-6">
      {/* Product name */}
      <h1
        className="text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight"
        style={{ fontFamily: "var(--font-hero)" }}
      >
        {product.name}
      </h1>

      {/* Rating */}
      <StarRating rating={product.rating} reviewCount={product.reviewCount} size={14} showLabel />

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-lg text-[#B8A99A] line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
        {discount && (
          <span className="eyebrow bg-black text-white px-2.5 py-1 text-[9px]">
            -{discount}%
          </span>
        )}
      </div>

      <div className="border-t border-[#EEEEEC]" />

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="eyebrow text-[#292929] mb-3">
            Color — <span className="normal-case font-normal text-xs tracking-normal">{selectedColor?.name}</span>
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                title={color.name}
                className={cn(
                  "w-9 h-9 rounded-full border-2 transition-all",
                  selectedColor?.name === color.name
                    ? "border-black scale-110"
                    : "border-transparent hover:border-[#B8A99A]"
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
                aria-pressed={selectedColor?.name === color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <p className="eyebrow text-[#292929] mb-3">
            Size — <span className="normal-case font-normal text-xs tracking-normal">{selectedSize ? SIZE_LABELS[selectedSize] ?? selectedSize : ""}</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-4 py-2 text-xs font-semibold tracking-wide border transition-all",
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "border-[#EEEEEC] text-[#292929] hover:border-black"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-[#EEEEEC]" />

      {/* Qty + Add */}
      <div className="flex items-stretch gap-3">
        <div className="flex items-center border border-[#EEEEEC]">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-3 hover:bg-[#F7F6F3] transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="px-4 text-sm font-semibold min-w-[40px] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="px-3 py-3 hover:bg-[#F7F6F3] transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 eyebrow transition-all",
            added
              ? "bg-[#292929] text-[#B8A99A]"
              : product.stock === 0
              ? "bg-[#EEEEEC] text-[#B8A99A] cursor-not-allowed"
              : "bg-black text-white hover:bg-[#292929]"
          )}
        >
          <ShoppingBag size={15} strokeWidth={1.5} />
          {added ? "Added to Bag" : product.stock === 0 ? "Out of Stock" : "Add to Bag"}
        </button>

        <WishlistButton product={product} className="w-12 h-auto border border-[#EEEEEC] hover:border-black" />
      </div>

      {product.stock < 10 && product.stock > 0 && (
        <p className="eyebrow text-orange-600 text-[9px]">
          Only {product.stock} left in stock
        </p>
      )}

      {/* Delivery info */}
      <div className="border border-[#EEEEEC] divide-y divide-[#EEEEEC]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Truck size={16} className="shrink-0 text-[#292929]" strokeWidth={1.5} />
          <div>
            <p className="text-xs font-semibold text-[#292929]">Free Shipping</p>
            <p className="text-xs text-gray-500">On orders over $200 — arrives in 3–5 days</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <RotateCcw size={16} className="shrink-0 text-[#292929]" strokeWidth={1.5} />
          <div>
            <p className="text-xs font-semibold text-[#292929]">Free Returns</p>
            <p className="text-xs text-gray-500">30-day returns for unused items</p>
          </div>
        </div>
      </div>

      {/* Description accordion */}
      <div className="border-t border-[#EEEEEC]">
        <button
          onClick={() => setDescOpen((o) => !o)}
          className="w-full flex items-center justify-between py-4 group"
        >
          <span className="eyebrow text-[#292929] group-hover:text-black transition-colors">
            Product Description
          </span>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className={cn("transition-transform duration-200", descOpen && "rotate-180")}
          />
        </button>
        {descOpen && (
          <p className="text-sm text-gray-600 leading-relaxed pb-4">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}
