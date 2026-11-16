"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronRight, AlertTriangle } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
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

// ── Delivery cost helper ────────────────────────────────────────
function deliveryCost(method: DeliveryMethod, cartShipping: number): number {
  if (method === "express") return 25;
  if (method === "overnight") return 45;
  return cartShipping; // standard
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
    <ol className="flex items-center gap-0 mb-8">
      {STEPS.map((label, idx) => {
        const num = idx + 1;
        const done = num < current;
        const active = num === current;
        return (
          <li key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all",
                  done
                    ? "bg-black border-black text-white"
                    : active
                    ? "bg-black border-black text-white"
                    : "bg-white border-gray-300 text-gray-400"
                )}
              >
                {done ? <Check size={14} /> : num}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1 hidden sm:block",
                  active ? "font-semibold text-black" : "text-gray-400"
                )}
              >
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-1 mb-4",
                  done ? "bg-black" : "bg-gray-200"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

// ── Order summary sidebar ──────────────────────────────────────
function OrderSummary() {
  const { items, subtotal, promoDiscount, promoCode } = useCartStore();
  const { deliveryMethod } = useCheckoutStore();
  const cartShipping = useCartStore((s) => s.shipping);
  const shipCost = deliveryCost(deliveryMethod, cartShipping);
  const total = subtotal - promoDiscount + shipCost;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-[var(--radius-card-lg)] p-5 space-y-4 lg:sticky lg:top-24">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">
        Order Summary
      </h3>

      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={`${item.product.id}:${item.size ?? ""}:${item.color?.hex ?? ""}`}
            className="flex gap-3"
          >
            <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium line-clamp-1">{item.product.name}</p>
              {item.size && (
                <p className="text-xs text-gray-400">Size: {item.size}</p>
              )}
              <p className="text-xs text-gray-500">
                {formatPrice(item.product.price)} × {item.quantity}
              </p>
            </div>
            <span className="text-xs font-semibold shrink-0">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-gray-200" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({promoCode})</span>
            <span>−{formatPrice(promoDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span>{shipCost === 0 ? "FREE" : formatPrice(shipCost)}</span>
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export function CheckoutPageClient() {
  const router = useRouter();
  const cart = useCartStore();
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
      <div className="shopco-container py-20 text-center space-y-4">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link
          href="/shop"
          className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black transition-colors";
  const labelClass = "block text-sm font-medium mb-1.5";
  const errorClass = "text-red-500 text-xs mt-1";

  function handlePlaceOrder() {
    const addr = checkout.shippingAddress as ShippingFormData;
    const shipCost = deliveryCost(checkout.deliveryMethod, cart.shipping);
    const total = cart.subtotal - cart.promoDiscount + shipCost;
    const id = "SHOPCO-" + Date.now().toString(36).toUpperCase();

    addOrder({
      id,
      createdAt: new Date().toISOString(),
      items: cart.items,
      subtotal: cart.subtotal,
      promoDiscount: cart.promoDiscount,
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

  const cartShipping = cart.shipping;

  return (
    <div className="shopco-container py-10">
      <div className="flex flex-col lg:flex-row gap-10">
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
              className="space-y-5"
            >
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
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
                className="w-full bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={16} />
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
              className="space-y-5"
            >
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
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
                <input className={inputClass} placeholder="123 Main St" {...shippingForm.register("address")} />
                {shippingForm.formState.errors.address && (
                  <p className={errorClass}>{shippingForm.formState.errors.address.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => checkout.setStep(1)}
                  className="flex-1 border border-gray-300 py-3.5 rounded-full font-medium text-sm hover:border-black transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Delivery */}
          {checkout.step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Delivery Method
              </h2>
              {(
                [
                  { id: "standard", label: "Standard", desc: "5–7 business days", price: cartShipping === 0 ? "FREE" : formatPrice(cartShipping) },
                  { id: "express", label: "Express", desc: "2–3 business days", price: formatPrice(25) },
                  { id: "overnight", label: "Overnight", desc: "Next business day", price: formatPrice(45) },
                ] as { id: DeliveryMethod; label: string; desc: string; price: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => checkout.setDeliveryMethod(opt.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                    checkout.deliveryMethod === opt.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        checkout.deliveryMethod === opt.id
                          ? "border-black bg-black"
                          : "border-gray-300"
                      )}
                    >
                      {checkout.deliveryMethod === opt.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">{opt.price}</span>
                </button>
              ))}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => checkout.setStep(2)}
                  className="flex-1 border border-gray-300 py-3.5 rounded-full font-medium text-sm hover:border-black transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => checkout.setStep(4)}
                  className="flex-1 bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {checkout.step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Payment Method
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 flex items-start gap-2 text-sm text-yellow-800">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Demo only</strong> — no real payment is processed. Do not enter real card details.
                </span>
              </div>

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
                      "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                      checkout.paymentMethod === opt.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                        checkout.paymentMethod === opt.id
                          ? "border-black bg-black"
                          : "border-gray-300"
                      )}
                    >
                      {checkout.paymentMethod === opt.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-semibold text-sm">{opt.label}</span>
                  </button>

                  {checkout.paymentMethod === "card" && opt.id === "card" && (
                    <div className="mt-3 p-4 border border-gray-200 rounded-xl space-y-3 bg-gray-50">
                      <div>
                        <label className={labelClass}>Card number (demo)</label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          value={demoCard.number}
                          onChange={(e) =>
                            setDemoCard((d) => ({ ...d, number: e.target.value }))
                          }
                          className={inputClass}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Expiry (demo)</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={demoCard.expiry}
                            onChange={(e) =>
                              setDemoCard((d) => ({ ...d, expiry: e.target.value }))
                            }
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
                            onChange={(e) =>
                              setDemoCard((d) => ({ ...d, cvv: e.target.value }))
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>
                      {cardError && <p className={errorClass}>{cardError}</p>}
                    </div>
                  )}

                  {checkout.paymentMethod === "paypal" && opt.id === "paypal" && (
                    <p className="mt-2 text-sm text-gray-500 px-4">
                      You&apos;ll be redirected to PayPal to complete your payment (demo).
                    </p>
                  )}

                  {checkout.paymentMethod === "apple_pay" && opt.id === "apple_pay" && (
                    <p className="mt-2 text-sm text-gray-500 px-4">
                      Apple Pay (demo) — no real payment will occur.
                    </p>
                  )}
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => checkout.setStep(3)}
                  className="flex-1 border border-gray-300 py-3.5 rounded-full font-medium text-sm hover:border-black transition-colors"
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
                  className="flex-1 bg-black text-white py-3.5 rounded-full font-medium text-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {checkout.step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Review Your Order
              </h2>

              {/* Contact */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">Contact</h3>
                  <button onClick={() => checkout.setStep(1)} className="text-xs text-gray-400 hover:text-black">Edit</button>
                </div>
                <p className="text-sm text-gray-600">{(checkout.contactInfo as { email?: string }).email}</p>
                <p className="text-sm text-gray-600">{(checkout.contactInfo as { phone?: string }).phone}</p>
              </div>

              {/* Shipping */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">Shipping Address</h3>
                  <button onClick={() => checkout.setStep(2)} className="text-xs text-gray-400 hover:text-black">Edit</button>
                </div>
                {(() => {
                  const a = checkout.shippingAddress as ShippingFormData;
                  return (
                    <p className="text-sm text-gray-600">
                      {a.firstName} {a.lastName}<br />
                      {a.address}<br />
                      {a.city}, {a.state} {a.zip}<br />
                      {a.country}
                    </p>
                  );
                })()}
              </div>

              {/* Delivery */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">Delivery</h3>
                  <button onClick={() => checkout.setStep(3)} className="text-xs text-gray-400 hover:text-black">Edit</button>
                </div>
                <p className="text-sm text-gray-600">
                  {deliveryLabel(checkout.deliveryMethod)} — {formatPrice(deliveryCost(checkout.deliveryMethod, cart.shipping))}
                </p>
              </div>

              {/* Payment */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-sm">Payment</h3>
                  <button onClick={() => checkout.setStep(4)} className="text-xs text-gray-400 hover:text-black">Edit</button>
                </div>
                <p className="text-sm text-gray-600 capitalize">{checkout.paymentMethod.replace("_", " ")} (demo)</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800 flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>This is a demo order. No real payment will be charged.</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => checkout.setStep(4)}
                  className="flex-1 border border-gray-300 py-3.5 rounded-full font-medium text-sm hover:border-black transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-black text-white py-3.5 rounded-full font-bold text-sm hover:bg-gray-900 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Order summary ──────────────────────────── */}
        <div className="lg:w-[360px] shrink-0">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
