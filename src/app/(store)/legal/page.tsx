import type { Metadata } from "next";
import { InfoPage } from "@/components/common/InfoPage";

export const metadata: Metadata = {
  title: "Legal",
  description: "Privacy, terms, browser storage and accessibility for the SHOP.CO demo store.",
};

const STORAGE_KEYS = [
  ["shopco-cart", "Items in your bag and any promo code"],
  ["shopco-wishlist", "Products you've saved"],
  ["shopco-orders", "Orders placed through the demo checkout"],
  ["shopco-newsletter", "Email addresses entered in the newsletter form"],
  ["shopco-bar-dismissed", "Whether you closed the announcement bar"],
];

export default function LegalPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy & terms"
      intro="Plain-language notes on how this demo store handles your information."
      sections={[
        {
          id: "privacy",
          heading: "Privacy",
          body: (
            <>
              <p>
                SHOP.CO has no accounts and no database. Nothing you enter — your bag, wishlist, checkout details
                or newsletter email — is sent to a server we run. It stays in your browser.
              </p>
              <p>
                Product and campaign images load from Pexels and Unsplash, so those services receive standard web
                requests (such as your IP address) when images are displayed.
              </p>
            </>
          ),
        },
        {
          id: "terms",
          heading: "Terms",
          body: (
            <p>
              This is a demonstration store. Products, prices, promotions and reviews are illustrative, no
              payment is ever taken, and completing checkout does not create a contract or a delivery.
            </p>
          ),
        },
        {
          id: "storage",
          heading: "Cookies & storage",
          body: (
            <>
              <p>SHOP.CO sets no cookies. It uses your browser&apos;s local storage for these keys:</p>
              <ul className="divide-y divide-black/10 border-y border-black/10">
                {STORAGE_KEYS.map(([key, purpose]) => (
                  <li key={key} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                    <code className="w-48 shrink-0 text-[13px] text-black">{key}</code>
                    <span>{purpose}</span>
                  </li>
                ))}
              </ul>
              <p>Clear this site&apos;s data in your browser settings to remove all of it.</p>
            </>
          ),
        },
        {
          id: "accessibility",
          heading: "Accessibility",
          body: (
            <p>
              The store is built to be usable with a keyboard and screen reader, respects your reduced-motion
              setting by turning off animation, and lets you pause the homepage slideshow.
            </p>
          ),
        },
      ]}
    />
  );
}
