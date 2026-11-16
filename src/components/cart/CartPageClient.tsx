"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, Tag, X } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import { formatPrice } from "@/lib/utils";

export function CartPageClient() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    promoCode,
    promoDiscount,
    applyPromo,
    removePromo,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const total = subtotal - promoDiscount + shipping;

  function handleApplyPromo() {
    setPromoError("");
    if (!promoInput.trim()) return;
    const ok = applyPromo(promoInput.trim());
    if (!ok) setPromoError("Invalid promo code. Try SHOP20, SAVE10, or NEWUSER.");
    else setPromoInput("");
  }

  if (items.length === 0) {
    return (
      <div className="shopco-container py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBag size={36} className="text-gray-400" />
        </div>
        <div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your cart is empty
          </h1>
          <p className="text-gray-500 text-sm">Add some products to get started.</p>
        </div>
        <Link
          href="/shop"
          className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="shopco-container py-10">
      <h1
        className="text-2xl font-bold uppercase mb-8 tracking-tight"
        style={{ fontFamily: "var(--font-hero)" }}
      >
        Your Cart
        <span className="ml-3 text-base font-normal text-gray-500 normal-case tracking-normal">
          ({items.reduce((n, i) => n + i.quantity, 0)} items)
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Cart items ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          {items.map((item) => {
            const key = `${item.product.id}:${item.size ?? ""}:${item.color?.hex ?? ""}`;
            const lineTotal = item.product.price * item.quantity;
            return (
              <div
                key={key}
                className="flex gap-4 bg-white border border-gray-200 rounded-[var(--radius-card)] p-4"
              >
                {/* Image */}
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-semibold text-sm leading-tight hover:underline line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <span className="text-xs text-gray-400 capitalize mt-0.5 block">
                        {item.product.category}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        removeItem(item.product.id, item.size, item.color)
                      }
                      aria-label="Remove item"
                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-gray-200 inline-block"
                          style={{ backgroundColor: item.color.hex }}
                        />
                        {item.color.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.size,
                            item.color
                          )
                        }
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-sm font-medium min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.size,
                            item.color
                          )
                        }
                        className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-bold text-sm">{formatPrice(lineTotal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Order summary ───────────────────────────────────── */}
        <div className="lg:w-[360px] shrink-0">
          <div className="bg-white border border-gray-200 rounded-[var(--radius-card-lg)] p-6 lg:sticky lg:top-24 space-y-5">
            <h2
              className="font-bold text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag size={13} />
                    Discount ({promoCode})
                  </span>
                  <span className="font-medium">−{formatPrice(promoDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Promo code */}
            {promoCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 text-sm">
                <span className="text-green-700 font-medium flex items-center gap-1.5">
                  <Tag size={13} />✓ {promoCode} applied — saving {formatPrice(promoDiscount)}
                </span>
                <button
                  onClick={removePromo}
                  className="text-green-600 hover:text-green-800 transition-colors"
                  aria-label="Remove promo"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition-colors"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs">{promoError}</p>
                )}
                <p className="text-gray-400 text-xs">Try: SHOP20, SAVE10, NEWUSER</p>
              </div>
            )}

            <hr className="border-gray-100" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors"
            >
              Proceed to Checkout →
            </Link>

            <Link
              href="/shop"
              className="block text-center text-sm text-gray-500 hover:text-black transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
