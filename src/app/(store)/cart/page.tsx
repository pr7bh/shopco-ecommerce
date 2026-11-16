import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = { title: "Shopping Bag" };

export default function CartPage() {
  return <CartPageClient />;
}
