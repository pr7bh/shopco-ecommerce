"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { useOrdersStore } from "@/features/orders/store";
import { formatPrice } from "@/lib/utils";

interface Props {
  orderId: string;
}

function deliveryLabel(method: string): string {
  if (method === "express") return "Express (2–3 days)";
  if (method === "overnight") return "Overnight (next day)";
  return "Standard (5–7 days)";
}

export function OrderConfirmationClient({ orderId }: Props) {
  const getOrder = useOrdersStore((s) => s.getOrder);
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="shopco-container py-24 flex flex-col items-center gap-8 text-center">
        <p className="eyebrow text-[#B8A99A]">Order Confirmation</p>
        <p
          className="text-3xl font-black uppercase tracking-tight"
          style={{ fontFamily: "var(--font-hero)" }}
        >
          Order not found
        </p>
        <Link
          href="/shop"
          className="eyebrow bg-black text-white px-10 py-4 hover:bg-[#292929] transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="shopco-container py-10 pb-20">
      {/* Success header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center gap-6 mb-14">
          <div className="w-16 h-16 bg-black flex items-center justify-center">
            <Check size={28} strokeWidth={2} className="text-white" />
          </div>
          <div>
            <p className="eyebrow text-[#B8A99A] mb-3">Thank you</p>
            <h1
              className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-3"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              Order Confirmed
            </h1>
            <p className="text-sm text-[#B8A99A] max-w-sm mx-auto leading-relaxed">
              We&apos;ve received your order and will get it on its way soon.
            </p>
          </div>
          <div className="border border-[#EEEEEC] px-6 py-2.5">
            <span className="eyebrow text-[#292929]">{order.id}</span>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <p className="eyebrow text-[#292929] mb-4">Items Ordered</p>
          <div className="border-t border-[#EEEEEC]">
            {order.items.map((item) => (
              <div
                key={`${item.product.id}:${item.size ?? ""}:${item.color?.hex ?? ""}`}
                className="flex gap-5 py-5 border-b border-[#EEEEEC]"
              >
                <div
                  className="relative w-20 shrink-0 bg-[#F7F6F3] overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p
                    className="font-semibold text-sm uppercase tracking-tight leading-tight mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.product.name}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {item.size && (
                      <span className="eyebrow text-[#B8A99A] text-[9px]">Size: {item.size}</span>
                    )}
                    {item.color && (
                      <span className="eyebrow text-[#B8A99A] text-[9px] flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 inline-block border border-[#EEEEEC]"
                          style={{ backgroundColor: item.color.hex }}
                        />
                        {item.color.name}
                      </span>
                    )}
                    <span className="eyebrow text-[#B8A99A] text-[9px]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span
                  className="font-bold text-sm shrink-0 self-center"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Two-col: shipping + price */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Shipping */}
          <div className="bg-[#F7F6F3] p-5">
            <p className="eyebrow text-[#292929] mb-4">Shipping Details</p>
            <p className="text-sm text-[#292929] leading-relaxed">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}
            </p>
            <div className="mt-4 pt-4 border-t border-[#EEEEEC]">
              <p className="eyebrow text-[#B8A99A] mb-1">Delivery Method</p>
              <p className="text-sm text-[#292929]">{deliveryLabel(order.deliveryMethod)}</p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-[#F7F6F3] p-5">
            <p className="eyebrow text-[#292929] mb-4">Price Breakdown</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#B8A99A]">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {order.promoDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#B8A99A]">Discount ({order.promoCode})</span>
                  <span className="font-medium">−{formatPrice(order.promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#B8A99A]">Shipping</span>
                <span className="font-medium">
                  {order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="border-t border-[#EEEEEC] pt-3 flex justify-between items-baseline">
                <span
                  className="font-black uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-hero)" }}
                >
                  Total
                </span>
                <span
                  className="font-bold text-xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="flex-1 text-center eyebrow bg-black text-white py-4 hover:bg-[#292929] transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 text-center eyebrow border border-[#EEEEEC] py-4 hover:border-black transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
