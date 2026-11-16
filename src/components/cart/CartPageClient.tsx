"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, X } from "lucide-react";
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
  const freeShippingThreshold = 200;
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remaining = freeShippingThreshold - subtotal;

  function handleApplyPromo() {
    setPromoError("");
    if (!promoInput.trim()) return;
    const ok = applyPromo(promoInput.trim());
    if (!ok) setPromoError("Invalid code. Try SHOP20, SAVE10, or NEWUSER.");
    else setPromoInput("");
  }

  if (items.length === 0) {
    return (
      <div className="shopco-container py-24 flex flex-col items-center gap-8 text-center">
        <div className="w-20 h-20 border border-[#EEEEEC] flex items-center justify-center">
          <ShoppingBag size={32} strokeWidth={1} className="text-[#B8A99A]" />
        </div>
        <div>
          <p className="eyebrow text-[#B8A99A] mb-3">Shopping Bag</p>
          <h1
            className="text-3xl font-black uppercase tracking-tight mb-2"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            Your bag is empty
          </h1>
          <p className="text-sm text-[#B8A99A]">
            Add pieces you love and they will appear here.
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
      <div className="flex items-baseline gap-4 mb-2">
        <p className="eyebrow text-[#B8A99A]">Shopping Bag</p>
      </div>
      <h1
        className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-10"
        style={{ fontFamily: "var(--font-hero)" }}
      >
        Your Bag
        <span
          className="ml-4 text-base font-normal text-[#B8A99A] normal-case tracking-normal"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {items.reduce((n, i) => n + i.quantity, 0)} items
        </span>
      </h1>

      {/* Free shipping progress */}
      {shipping > 0 && (
        <div className="mb-8 p-4 border border-[#EEEEEC] bg-[#F7F6F3]">
          <p className="eyebrow text-[#292929] mb-3">
            {remaining > 0
              ? `Add ${formatPrice(remaining)} more for free shipping`
              : "You qualify for free shipping!"}
          </p>
          <div className="h-0.5 bg-[#EEEEEC] relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-black transition-all duration-700"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ── Cart items ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="border-t border-[#EEEEEC]">
            {items.map((item) => {
              const key = `${item.product.id}:${item.size ?? ""}:${item.color?.hex ?? ""}`;
              const lineTotal = item.product.price * item.quantity;
              return (
                <div
                  key={key}
                  className="flex gap-5 py-6 border-b border-[#EEEEEC]"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative w-24 md:w-32 shrink-0 bg-[#F7F6F3] overflow-hidden block"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="(max-width: 768px) 96px, 128px"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="eyebrow text-[#B8A99A] mb-1 capitalize">
                          {item.product.category}
                        </p>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-black text-sm md:text-base uppercase tracking-tight hover:text-[#292929] transition-colors leading-tight"
                          style={{ fontFamily: "var(--font-hero)" }}
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                          {item.size && (
                            <span className="eyebrow text-[#B8A99A] text-[9px]">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="flex items-center gap-1.5">
                              <span
                                className="w-3 h-3 border border-[#EEEEEC] inline-block"
                                style={{ backgroundColor: item.color.hex }}
                              />
                              <span className="eyebrow text-[#B8A99A] text-[9px]">
                                {item.color.name}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        aria-label="Remove item"
                        className="text-[#B8A99A] hover:text-black transition-colors shrink-0 p-1"
                      >
                        <X size={14} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-[#EEEEEC]">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)
                          }
                          className="px-3 py-2 hover:bg-[#F7F6F3] transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus size={11} strokeWidth={1.5} />
                        </button>
                        <span className="px-4 text-sm font-semibold min-w-[36px] text-center border-x border-[#EEEEEC]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)
                          }
                          className="px-3 py-2 hover:bg-[#F7F6F3] transition-colors"
                          aria-label="Increase"
                        >
                          <Plus size={11} strokeWidth={1.5} />
                        </button>
                      </div>
                      <span
                        className="font-bold text-base"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {formatPrice(lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => items.forEach((i) => removeItem(i.product.id, i.size, i.color))}
              className="flex items-center gap-2 text-sm text-[#B8A99A] hover:text-black transition-colors"
            >
              <Trash2 size={13} strokeWidth={1.5} />
              Clear bag
            </button>
            <Link
              href="/shop"
              className="ml-auto text-sm text-[#B8A99A] hover:text-black transition-colors underline-offset-2 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Order summary ───────────────────────────────────── */}
        <div className="lg:w-[380px] shrink-0">
          <div className="bg-[#F7F6F3] p-6 lg:sticky lg:top-24 space-y-6">
            <p className="eyebrow text-[#292929]">Order Summary</p>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#B8A99A]">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-[#292929]">
                  <span className="flex items-center gap-1 text-[#292929]">
                    Discount ({promoCode})
                  </span>
                  <span className="font-medium">−{formatPrice(promoDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[#B8A99A]">Shipping</span>
                <span className={shipping === 0 ? "font-medium text-[#292929]" : "font-medium"}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="border-t border-[#EEEEEC]" />

            {/* Promo code */}
            {promoCode ? (
              <div className="flex items-center justify-between border border-[#EEEEEC] bg-white px-4 py-3">
                <span className="eyebrow text-[#292929] text-[9px]">
                  {promoCode} — saving {formatPrice(promoDiscount)}
                </span>
                <button
                  onClick={removePromo}
                  className="text-[#B8A99A] hover:text-black transition-colors"
                  aria-label="Remove promo"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex border border-[#EEEEEC] bg-white overflow-hidden">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    className="flex-1 px-4 py-3 text-sm bg-transparent outline-none placeholder:text-[#B8A99A]"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-black text-white px-5 eyebrow text-[9px] hover:bg-[#292929] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs">{promoError}</p>
                )}
                <p className="eyebrow text-[#B8A99A] text-[9px]">
                  Try: SHOP20 · SAVE10 · NEWUSER
                </p>
              </div>
            )}

            <div className="border-t border-[#EEEEEC]" />

            <div className="flex justify-between items-baseline">
              <span
                className="font-black text-lg uppercase tracking-tight"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                Total
              </span>
              <span
                className="font-bold text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatPrice(total)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center eyebrow bg-black text-white py-4 hover:bg-[#292929] transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
