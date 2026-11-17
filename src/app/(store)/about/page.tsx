import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/common/InfoPage";

export const metadata: Metadata = {
  title: "About",
  description: "The idea behind SHOP.CO, a demonstration fashion storefront.",
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About SHOP.CO"
      title="Our story"
      intro="SHOP.CO imagines a fashion retailer built around fewer, better pieces — and presents them with the care of an editorial."
      sections={[
        {
          id: "story",
          heading: "Our story",
          body: (
            <>
              <p>
                The idea is simple: a wardrobe should feel considered, not crowded. Collections are organised
                into clear edits — everyday essentials, denim, knitwear, outerwear — so pieces work together
                instead of competing.
              </p>
              <p>
                SHOP.CO is a demonstration project. The products, prices and campaigns are illustrative, and the
                photography is licensed from Pexels and Unsplash. <Link href="/shop" className="underline underline-offset-4">Browse the collection</Link>.
              </p>
            </>
          ),
        },
        {
          id: "sustainability",
          heading: "Sustainability",
          body: (
            <p>
              We won&apos;t make sustainability claims we can&apos;t back up. As a demo store, SHOP.CO has no
              factories, supply chain or shipments to report on, so there is nothing to certify here.
            </p>
          ),
        },
        {
          id: "careers",
          heading: "Careers",
          body: <p>SHOP.CO isn&apos;t hiring — it&apos;s a demonstration project rather than a company.</p>,
        },
      ]}
    />
  );
}
