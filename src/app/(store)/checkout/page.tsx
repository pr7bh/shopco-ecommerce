import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export const metadata: Metadata = { title: "Checkout | SHOP.CO" };

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
