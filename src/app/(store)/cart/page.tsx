import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = { title: "Your Cart | SHOP.CO" };

export default function CartPage() {
  return <CartPageClient />;
}
