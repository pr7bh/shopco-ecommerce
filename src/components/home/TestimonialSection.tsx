"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StarRating } from "@/components/products/StarRating";
import { TESTIMONIALS } from "@/lib/mock-data";

function VerifiedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Verified" className="text-green-500">
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TestimonialSection() {
  const [page, setPage] = useState(0);
  const perPage = typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : 1;
  const total = Math.ceil(TESTIMONIALS.length / perPage);

  return (
    <section className="shopco-section">
      <div className="shopco-container">
        <div className="flex items-center justify-between mb-10">
          <h2
            className="text-2xl font-black uppercase tracking-wide md:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            Our Happy Customers
          </h2>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous testimonials"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Next testimonials"
              onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
              disabled={page >= total - 1}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 overflow-hidden">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-[var(--radius-card)] p-6 flex flex-col gap-3"
            >
              <StarRating rating={review.rating} size={18} showLabel={false} />
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{review.userName}</span>
                {review.verified && <VerifiedIcon />}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                &ldquo;{review.content}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
