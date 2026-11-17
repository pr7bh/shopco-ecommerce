"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, AlertTriangle } from "lucide-react";
import { useCartStore, useCartTotals, cartTotals } from "@/features/cart/store";
import { useCheckoutStore } from "@/features/checkout/store";
import { useOrdersStore } from "@/features/orders/store";
import { formatPrice, cn } from "@/lib/utils";
import type { DeliveryMethod, PaymentMethod } from "@/features/checkout/store";

// ── Zod schemas ────────────────────────────────────────────────
const contactSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;
type ShippingFormData = z.infer<typeof shippingSchema>;

// ── Helpers ────────────────────────────────────────────────────
function deliveryCost(method: DeliveryMethod, cartShipping: number): number {
  if (method === "express") return 25;
  if (method === "overnight") return 45;
  return cartShipping;
}

function deliveryLabel(method: DeliveryMethod): string {
  if (method === "express") return "Express (2–3 days)";
  if (method === "overnight") return "Overnight (next day)";
  return "Standard (5–7 days)";
}

// ── Step indicator ─────────────────────────────────────────────
const STEPS = ["Contact", "Shipping", "Delivery", "Payment", "Review"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, idx) => {
        const num = idx + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-7 h-7 flex items-center justify-center transition-all",
                  done
                    ? "bg-black text-white"
                    : active
                    ? "bg-black text-white"
                    : "border border-[#EEEEEC] text-[#B8A99A]"
                )}
              >
                {done ? (
                  <Check size={12} strokeWidth={2} />
                ) : (
                  <span className="text-[10px] font-bold">{num}</span>
                )}
              </div>
              <span
                className={cn(
                  "eyebrow text-[9px] hidden sm:block",
                  active ? "text-[#292929]" : done ? "text-[#292929]" : "text-[#B8A99A]"
                )}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2 mb-4",
                  done ? "bg-black" : "bg-[#EEEEEC]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Order summary sidebar ──────────────────────────────────────
function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const { subtotal, discount: promoDiscount, shipping: cartShipping } = useCartTotals();
  const { deliveryMethod } = useCheckoutStore();
  const shipCost = deliveryCost(deliveryMethod, cartShipping);
  const total = subtotal - promoDiscount + shipCost;

  return (
    <div className="bg-[#F7F6F3] p-6 space-y-6 lg:sticky lg:top-24">
      <p className="eyebrow text-[#292929]">Order Summary</p>

      <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={`${item.product.id}:${item.size ?? ""}:${item.color?.hex ?? ""}`}
            className="flex gap-3"
          >
            <div className="relative w-14 shrink-0 bg-white overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                sizes="56px"
                className="object-cover"
              />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-bold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold uppercase tracking-tight leading-tight line-clamp-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.product.name}
              </p>
              {item.size && (
                <p className="eyebrow text-[#B8A99A] text-[9px] mt-1">Size: {item.size}</p>
              )}
            </div>
            <span
              className="text-xs font-bold shrink-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#EEEEEC]" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[#B8A99A]">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-[#B8A99A]">Discount ({promoCode})</span>
            <span className="font-medium">−{formatPrice(promoDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#B8A99A]">Shipping</span>
          <span className="font-medium">{shipCost === 0 ? "FREE" : formatPrice(shipCost)}</span>
        </div>
      </div>

      <div className="border-t border-[#EEEEEC]" />

      <div className="flex justify-between items-baseline">
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
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}

// ── Shared field styles ────────────────────────────────────────
const inputClass =
  "w-full border-b border-[#EEEEEC] px-0 py-3 text-sm bg-transparent outline-none focus:border-black transition-colors placeholder:text-[#B8A99A]";
const labelClass = "block eyebrow text-[#B8A99A] text-[9px] mb-1";
const errorClass = "text-red-500 text-xs mt-1";

// ── Main component ─────────────────────────────────────────────
export function CheckoutPageClient() {
  const router = useRouter();
  const cart = useCartStore();
  const { shipping: cartShipping } = useCartTotals();
  const checkout = useCheckoutStore();
  const { addOrder } = useOrdersStore();

  const [demoCard, setDemoCard] = useState({ number: "", expiry: "", cvv: "" });
  const [cardError, setCardError] = useState("");

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: (checkout.contactInfo as ContactFormData).email ?? "",
      phone: (checkout.contactInfo as ContactFormData).phone ?? "",
    },
  });

  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: (checkout.shippingAddress as ShippingFormData).firstName ?? "",
      lastName: (checkout.shippingAddress as ShippingFormData).lastName ?? "",
      address: (checkout.shippingAddress as ShippingFormData).address ?? "",
      city: (checkout.shippingAddress as ShippingFormData).city ?? "",
      state: (checkout.shippingAddress as ShippingFormData).state ?? "",
      zip: (checkout.shippingAddress as ShippingFormData).zip ?? "",
      country: (checkout.shippingAddress as ShippingFormData).country ?? "United States",
    },
  });

  if (cart.items.length === 0 && checkout.step !== 5) {
    return (
      <div className="shopco-container py-24 text-center space-y-6">
        <p className="eyebrow text-[#B8A99A]">Checkout</p>
        <p
          className="text-3xl font-black uppercase tracking-tight"
          style={{ fontFamily: "var(--font-hero)" }}
        >
          Your bag is empty
        </p>
        <Link
          href="/shop"
          className="inline-block eyebrow bg-black text-white px-10 py-4 hover:bg-[#292929] transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  function handlePlaceOrder() {
    const addr = checkout.shippingAddress as ShippingFormData;
    const totals = cartTotals(cart.items, cart.promoCode);
    const shipCost = deliveryCost(checkout.deliveryMethod, totals.shipping);
    const total = totals.subtotal - totals.discount + shipCost;
    const id = "SHOPCO-" + Date.now().toString(36).toUpperCase();

    addOrder({
      id,
      createdAt: new Date().toISOString(),
      items: cart.items,
      subtotal: totals.subtotal,
      promoDiscount: totals.discount,
      shipping: shipCost,
      total,
      promoCode: cart.promoCode,
      shippingAddress: {
        firstName: addr.firstName,
        lastName: addr.lastName,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        country: addr.country,
      },
      deliveryMethod: checkout.deliveryMethod,
    });

    cart.clearCart();
    checkout.reset();
    router.push(`/order-confirmation?id=${id}`);
  }


  return (
    <div className="shopco-container py-10 pb-20">
      {/* Page heading */}
      <p className="eyebrow text-[#B8A99A] mb-2">Checkout</p>
      <h1
        className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-10"
        style={{ fontFamily: "var(--font-hero)" }}
      >
        Complete Order
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* ── Left: Form steps ─────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <StepIndicator current={checkout.step} />

          {/* Step 1: Contact */}
          {checkout.step === 1 && (
            <form
              onSubmit={contactForm.handleSubmit((data) => {
                checkout.setContactInfo(data);
                checkout.setStep(2);
              })}
              className="space-y-8"
            >
              <h2
                className="text-xl font-black uppercase tracking-tight"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                Contact Information
              </h2>
              <div>
                <label className={labelClass}>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={inputClass}
                  {...contactForm.register("email")}
                />
                {contactForm.formState.errors.email && (
                  <p className={errorClass}>{contactForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Phone number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className={inputClass}
                  {...contactForm.register("phone")}
                />
                {contactForm.formState.errors.phone && (
                  <p className={errorClass}>{contactForm.formState.errors.phone.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full eyebrow bg-black text-white py-4 hover:bg-[#292929] transition-colors"
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Shipping */}
          {checkout.step === 2 && (
            <form
              onSubmit={shippingForm.handleSubmit((data) => {
                checkout.setShippingAddress(data);
                checkout.setStep(3);
              })}
              className="space-y-8"
            >
              <h2
                className="text-xl font-black uppercase tracking-tight"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>First name</label>
                  <input className={inputClass} {...shippingForm.register("firstName")} />
                  {shippingForm.formState.errors.firstName && (
                    <p className={errorClass}>{shippingForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Last name</label>
                  <input className={inputClass} {...shippingForm.register("lastName")} />
                  {shippingForm.formState.errors.lastName && (
                    <p className={errorClass}>{shippingForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input
                  className={inputClass}
                  placeholder="123 Main St"
                  {...shippingForm.register("address")}
                />
                {shippingForm.formState.errors.address && (
                  <p className={errorClass}>{shippingForm.formState.errors.address.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>City</label>
                  <input className={inputClass} {...shippingForm.register("city")} />
                  {shippingForm.formState.errors.city && (
                    <p className={errorClass}>{shippingForm.formState.errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>State / Province</label>
                  <input className={inputClass} {...shippingForm.register("state")} />
                  {shippingForm.formState.errors.state && (
                    <p className={errorClass}>{shippingForm.formState.errors.state.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>ZIP / Postal code</label>
                  <input className={inputClass} {...shippingForm.register("zip")} />
                  {shippingForm.formState.errors.zip && (
                    <p className={errorClass}>{shippingForm.formState.errors.zip.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input className={inputClass} {...shippingForm.register("country")} />
                  {shippingForm.formState.errors.country && (
                    <p className={errorClass}>{shippingForm.formState.errors.country.message}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => checkout.setStep(1)}
                  className="flex-1 eyebrow border border-[#EEEEEC] py-4 hover:border-black transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 eyebrow bg-black text-white py-4 hover:bg-[#292929] transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Delivery */}
          {checkout.step === 3 && (
            <div className="space-y-8">
              <h2
                className="text-xl font-black uppercase tracking-tight"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                Delivery Method
              </h2>
              <div className="space-y-3">
                {(
                  [
                    {
                      id: "standard",
                      label: "Standard",
                      desc: "5–7 business days",
                      price: cartShipping === 0 ? "FREE" : formatPrice(cartShipping),
                    },
                    { id: "express", label: "Express", desc: "2–3 business days", price: formatPrice(25) },
                    { id: "overnight", label: "Overnight", desc: "Next business day", price: formatPrice(45) },
                  ] as { id: DeliveryMethod; label: string; desc: string; price: string }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => checkout.setDeliveryMethod(opt.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 border transition-all text-left",
                      checkout.deliveryMethod === opt.id
                        ? "border-black bg-[#F7F6F3]"
                        : "border-[#EEEEEC] hover:border-[#B8A99A]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-4 h-4 border-2 flex items-center justify-center transition-all shrink-0",
                          checkout.deliveryMethod === opt.id
                            ? "border-black bg-black"
                            : "border-[#EEEEEC]"
                        )}
                      >
                        {checkout.deliveryMethod === opt.id && (
                          <div className="w-1.5 h-1.5 bg-white" />
                        )}
                      </div>
                      <div>
                        <p
                          className="font-semibold text-sm uppercase tracking-tight"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {opt.label}
                        </p>
                        <p className="eyebrow text-[#B8A99A] text-[9px] mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                    <span
                      className="font-bold text-sm"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {opt.price}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => checkout.setStep(2)}
                  className="flex-1 eyebrow border border-[#EEEEEC] py-4 hover:border-black transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => checkout.setStep(4)}
                  className="flex-1 eyebrow bg-black text-white py-4 hover:bg-[#292929] transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {checkout.step === 4 && (
            <div className="space-y-8">
              <h2
                className="text-xl font-black uppercase tracking-tight"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                Payment Method
              </h2>

              <div className="border border-[#EEEEEC] bg-[#F7F6F3] px-5 py-4 flex items-start gap-3 text-sm">
                <AlertTriangle size={14} strokeWidth={1.5} className="shrink-0 mt-0.5 text-[#B8A99A]" />
                <span className="text-[#292929] text-xs leading-relaxed">
                  <strong>Demo only</strong> — no real payment is processed. Do not enter real card details.
                </span>
              </div>

              <div className="space-y-3">
                {(
                  [
                    { id: "card", label: "Credit / Debit Card" },
                    { id: "paypal", label: "PayPal" },
                    { id: "apple_pay", label: "Apple Pay" },
                  ] as { id: PaymentMethod; label: string }[]
                ).map((opt) => (
                  <div key={opt.id}>
                    <button
                      type="button"
                      onClick={() => checkout.setPaymentMethod(opt.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 border transition-all text-left",
                        checkout.paymentMethod === opt.id
                          ? "border-black bg-[#F7F6F3]"
                          : "border-[#EEEEEC] hover:border-[#B8A99A]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 border-2 flex items-center justify-center transition-all shrink-0",
                          checkout.paymentMethod === opt.id
                            ? "border-black bg-black"
                            : "border-[#EEEEEC]"
                        )}
                      >
                        {checkout.paymentMethod === opt.id && (
                          <div className="w-1.5 h-1.5 bg-white" />
                        )}
                      </div>
                      <span
                        className="font-semibold text-sm uppercase tracking-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {opt.label}
                      </span>
                    </button>

                    {checkout.paymentMethod === "card" && opt.id === "card" && (
                      <div className="mt-3 p-5 border border-[#EEEEEC] bg-[#F7F6F3] space-y-6">
                        <div>
                          <label className={labelClass}>Card number (demo)</label>
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                            value={demoCard.number}
                            onChange={(e) => setDemoCard((d) => ({ ...d, number: e.target.value }))}
                            className={inputClass}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className={labelClass}>Expiry (demo)</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={demoCard.expiry}
                              onChange={(e) => setDemoCard((d) => ({ ...d, expiry: e.target.value }))}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>CVV (demo)</label>
                            <input
                              type="text"
                              placeholder="123"
                              maxLength={4}
                              value={demoCard.cvv}
                              onChange={(e) => setDemoCard((d) => ({ ...d, cvv: e.target.value }))}
                              className={inputClass}
                            />
                          </div>
                        </div>
                        {cardError && <p className={errorClass}>{cardError}</p>}
                      </div>
                    )}

                    {checkout.paymentMethod === "paypal" && opt.id === "paypal" && (
                      <p className="mt-2 text-xs text-[#B8A99A] px-5">
                        You&apos;ll be redirected to PayPal to complete your payment (demo).
                      </p>
                    )}

                    {checkout.paymentMethod === "apple_pay" && opt.id === "apple_pay" && (
                      <p className="mt-2 text-xs text-[#B8A99A] px-5">
                        Apple Pay (demo) — no real payment will occur.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => checkout.setStep(3)}
                  className="flex-1 eyebrow border border-[#EEEEEC] py-4 hover:border-black transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (checkout.paymentMethod === "card") {
                      if (!demoCard.number || !demoCard.expiry || !demoCard.cvv) {
                        setCardError("Please fill in all card fields (demo data only).");
                        return;
                      }
                    }
                    setCardError("");
                    checkout.setStep(5);
                  }}
                  className="flex-1 eyebrow bg-black text-white py-4 hover:bg-[#292929] transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {checkout.step === 5 && (
            <div className="space-y-6">
              <h2
                className="text-xl font-black uppercase tracking-tight"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                Review Your Order
              </h2>

              {/* Contact */}
              <div className="border border-[#EEEEEC] p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="eyebrow text-[#292929]">Contact</p>
                  <button
                    onClick={() => checkout.setStep(1)}
                    className="eyebrow text-[#B8A99A] hover:text-black transition-colors text-[9px]"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-[#292929]">{(checkout.contactInfo as { email?: string }).email}</p>
                <p className="text-sm text-[#B8A99A]">{(checkout.contactInfo as { phone?: string }).phone}</p>
              </div>

              {/* Shipping */}
              <div className="border border-[#EEEEEC] p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="eyebrow text-[#292929]">Shipping Address</p>
                  <button
                    onClick={() => checkout.setStep(2)}
                    className="eyebrow text-[#B8A99A] hover:text-black transition-colors text-[9px]"
                  >
                    Edit
                  </button>
                </div>
                {(() => {
                  const a = checkout.shippingAddress as ShippingFormData;
                  return (
                    <p className="text-sm text-[#292929] leading-relaxed">
                      {a.firstName} {a.lastName}<br />
                      {a.address}<br />
                      {a.city}, {a.state} {a.zip}<br />
                      {a.country}
                    </p>
                  );
                })()}
              </div>

              {/* Delivery */}
              <div className="border border-[#EEEEEC] p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="eyebrow text-[#292929]">Delivery</p>
                  <button
                    onClick={() => checkout.setStep(3)}
                    className="eyebrow text-[#B8A99A] hover:text-black transition-colors text-[9px]"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-[#292929]">
                  {deliveryLabel(checkout.deliveryMethod)}{" "}
                  <span className="text-[#B8A99A]">
                    — {formatPrice(deliveryCost(checkout.deliveryMethod, cartShipping))}
                  </span>
                </p>
              </div>

              {/* Payment */}
              <div className="border border-[#EEEEEC] p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="eyebrow text-[#292929]">Payment</p>
                  <button
                    onClick={() => checkout.setStep(4)}
                    className="eyebrow text-[#B8A99A] hover:text-black transition-colors text-[9px]"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-[#292929] capitalize">
                  {checkout.paymentMethod.replace("_", " ")}{" "}
                  <span className="text-[#B8A99A]">(demo)</span>
                </p>
              </div>

              <div className="border border-[#EEEEEC] bg-[#F7F6F3] px-5 py-4 flex items-start gap-3">
                <AlertTriangle size={14} strokeWidth={1.5} className="shrink-0 mt-0.5 text-[#B8A99A]" />
                <span className="text-xs text-[#292929] leading-relaxed">
                  This is a demo order. No real payment will be charged.
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => checkout.setStep(4)}
                  className="flex-1 eyebrow border border-[#EEEEEC] py-4 hover:border-black transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 eyebrow bg-black text-white py-4 hover:bg-[#292929] transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Order summary ──────────────────────────── */}
        <div className="lg:w-[380px] shrink-0">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
