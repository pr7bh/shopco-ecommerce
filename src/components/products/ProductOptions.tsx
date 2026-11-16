"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { WishlistButton } from "@/components/products/WishlistButton";
import { cn } from "@/lib/utils";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store";
import { StarRating } from "@/components/products/StarRating";
import type { Product, Size, Color } from "@/types";

interface ProductOptionsProps {
  product: Product;
}

export function ProductOptions({ product }: ProductOptionsProps) {
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(
    product.sizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(
    product.colors?.[0]
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : undefined;

  function handleAddToCart() {
    addItem(product, qty, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-5">
      {/* Price row */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-lg text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
        {discount && (
          <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Rating */}
      <StarRating
        rating={product.rating}
        reviewCount={product.reviewCount}
        size={14}
        showLabel
      />

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

      <hr className="border-gray-100" />

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">
            Select Colors
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
                    ? "border-black scale-110 shadow-md"
                    : "border-transparent hover:border-gray-400"
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
          <p className="text-sm font-medium mb-3">
            Choose Size
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-4 py-2 text-sm rounded-full border transition-colors",
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "border-gray-200 text-gray-700 hover:border-black"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <hr className="border-gray-100" />

      {/* Qty + Add to cart */}
      <div className="flex items-center gap-3">
        {/* Quantity */}
        <div className="flex items-center gap-0 border border-gray-200 rounded-full overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2.5 hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="px-3 text-sm font-medium min-w-[32px] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="px-3 py-2.5 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all",
            added
              ? "bg-green-600 text-white"
              : "bg-black text-white hover:bg-gray-900"
          )}
        >
          <ShoppingCart size={16} />
          {added ? "Added!" : "Add to Cart"}
        </button>

        {/* Wishlist */}
        <WishlistButton product={product} className="w-11 h-11" />
      </div>

      {product.stock < 10 && product.stock > 0 && (
        <p className="text-xs text-orange-600 font-medium">
          Only {product.stock} left in stock
        </p>
      )}
      {product.stock === 0 && (
        <p className="text-xs text-red-600 font-medium">Out of stock</p>
      )}
    </div>
  );
}
