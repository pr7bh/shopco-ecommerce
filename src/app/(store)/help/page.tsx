import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/common/InfoPage";

export const metadata: Metadata = {
  title: "Help",
  description: "Shipping, returns, orders and answers to common questions about the SHOP.CO demo store.",
};

export default function HelpPage() {
  return (
    <InfoPage
      eyebrow="Customer service"
      title="Help"
      intro="SHOP.CO is a demonstration storefront. Browsing, your bag, checkout and orders all work, but everything happens in your browser — nothing is charged or shipped."
      sections={[
        {
          id: "faq",
          heading: "FAQ",
          body: (
            <>
              <p>
                <strong className="text-black">Is this a real shop?</strong> No. It&apos;s a working demo of an
                online store. You can add to your bag and complete checkout, but no payment is taken and no
                parcel is sent.
              </p>
              <p>
                <strong className="text-black">Where is my bag saved?</strong> In this browser only. Clearing your
                site data empties it.
              </p>
              <p>
                <strong className="text-black">Do promo codes work?</strong> Yes — try SHOP20 (20% off), SAVE10
                ($10 off) or NEWUSER (15% off) in your <Link href="/cart" className="underline underline-offset-4">bag</Link>.
              </p>
            </>
          ),
        },
        {
          id: "shipping",
          heading: "Shipping",
          body: (
            <>
              <p>Standard delivery (5–7 business days) is $15, or free on orders of $200 or more before discounts.</p>
              <p>Express (2–3 business days) is $25 and Overnight (next business day) is $45, chosen at checkout.</p>
              <p>As a demo store, these are shown for realism; no order is dispatched.</p>
            </>
          ),
        },
        {
          id: "returns",
          heading: "Returns",
          body: (
            <p>
              Because orders here are simulated, nothing ships and there is nothing to return. You can change
              quantities or remove items from your bag at any time before checkout.
            </p>
          ),
        },
        {
          id: "orders",
          heading: "Order tracking",
          body: (
            <p>
              After checkout you&apos;ll see an order number beginning with SHOPCO- on the confirmation page,
              along with the full order summary. Orders are stored in this browser only, so there is no
              shipment to track.
            </p>
          ),
        },
        {
          id: "contact",
          heading: "Contact",
          body: (
            <p>
              There&apos;s no customer service team or support inbox behind this demo. Everything you need to
              use the store is on this page.
            </p>
          ),
        },
      ]}
    />
  );
}
