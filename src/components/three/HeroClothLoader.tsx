"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

// dynamic() with ssr:false must live in a Client Component in Next.js 16.
const HeroCloth = dynamic(
  () => import("@/components/three/HeroCloth").then((m) => ({ default: m.HeroCloth })),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=580&h=700&fit=crop&auto=format"
          alt="Two models showcasing SHOP.CO fashion"
          fill
          priority
          sizes="580px"
          className="object-cover object-top"
        />
      </div>
    ),
  }
);

export function HeroClothLoader() {
  return <HeroCloth />;
}
