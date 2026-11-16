export const instant = false;

import type { Metadata } from "next";
import { OrderConfirmationClient } from "@/components/order/OrderConfirmationClient";

export const metadata: Metadata = { title: "Order Confirmed | SHOP.CO" };

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const id = Array.isArray(sp.id) ? sp.id[0] : (sp.id ?? "");
  return <OrderConfirmationClient orderId={id} />;
}
