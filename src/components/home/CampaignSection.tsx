"use client";

import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function CampaignSection() {
  const ref = useScrollReveal({ selector: ".campaign-col", staggerDelay: 120 });
  return (
    <section ref={ref as RefObject<HTMLElement>} className="editorial-section bg-[#F7F6F3]">
      <div className="shopco-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <div className="campaign-col relative aspect-[4/5] img-zoom rounded-[var(--radius-card)] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop&auto=format"
              alt="The Collection Campaign"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div className="campaign-col lg:pl-8">
            <div className="eyebrow text-[#B8A99A] mb-6">THE COLLECTION</div>
            <h2
              className="campaign-heading mb-6"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
            >
              LESS,
              <br />
              BUT
              <br />
              BETTER.
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-sm mb-10 text-sm md:text-base">
              We believe in the power of investment pieces — carefully crafted
              garments that transcend seasons and stand the test of time.
              Quality over quantity, always.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-black text-white text-xs tracking-widest uppercase px-8 py-4 hover:bg-[#292929] transition-colors"
            >
              EXPLORE THE COLLECTION
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
