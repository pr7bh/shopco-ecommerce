"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
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
      <div className="shopco-container py-20 flex flex-col items-center gap-6 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link
          href="/shop"
          className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="shopco-container py-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={36} className="text-green-600" />
        </div>
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            Order Confirmed!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Thank you for your purchase. We&apos;ll get this shipped to you soon.
          </p>
        </div>
        <span className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full">
          Order #{order.id}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-200 rounded-[var(--radius-card-lg)] p-6 space-y-4 mb-6">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
          Items Ordered
        </h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={`${item.product.id}:${item.size ?? ""}:${item.color?.hex ?? ""}`}
              className="flex gap-4"
            >
              <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color.name}`]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold text-sm shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white border border-gray-200 rounded-[var(--radius-card-lg)] p-6 mb-6">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-3">
          Shipping Details
        </h2>
        <p className="text-sm text-gray-700">
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
          {order.shippingAddress.address}<br />
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
          {order.shippingAddress.country}
        </p>
        <p className="text-sm text-gray-500 mt-3">
          Delivery: <span className="font-medium text-black">{deliveryLabel(order.deliveryMethod)}</span>
        </p>
      </div>

      {/* Price breakdown */}
      <div className="bg-white border border-gray-200 rounded-[var(--radius-card-lg)] p-6 mb-8">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-4">
          Price Breakdown
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.promoDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({order.promoCode})</span>
              <span>−{formatPrice(order.promoDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Shipping</span>
            <span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span>
          </div>
          <hr className="border-gray-100" />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/shop"
        className="block w-full text-center bg-black text-white py-4 rounded-full font-semibold text-sm hover:bg-gray-900 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
