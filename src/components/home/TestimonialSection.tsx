"use client";

import { useState } from "react";
import type { RefObject } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StarRating } from "@/components/products/StarRating";
import { TESTIMONIALS } from "@/lib/mock-data";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function VerifiedIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-label="Verified"
      className="text-green-500"
    >
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path
        d="M5 8l2 2 4-4"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TestimonialSection() {
  const [page, setPage] = useState(0);
  const ref = useScrollReveal({ selector: ".testimonial-card", staggerDelay: 100 });
  const perPage = 3;
  const total = Math.ceil(TESTIMONIALS.length / perPage);
  const visible = TESTIMONIALS.slice(page * perPage, page * perPage + perPage);

  return (
    <section ref={ref as RefObject<HTMLElement>} className="editorial-section bg-[#F7F6F3]">
      <div className="shopco-container">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow text-gray-500 mb-3">
              WHAT OUR COMMUNITY SAYS
            </div>
            <h2
              className="font-black uppercase leading-none tracking-tight"
              style={{
                fontFamily: "var(--font-hero)",
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
              }}
            >
              REAL PEOPLE,
              <br />
              REAL STYLE.
            </h2>
          </div>
          {total > 1 && (
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous testimonials"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                aria-label="Next testimonials"
                onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
                disabled={page >= total - 1}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((review) => (
            <div
              key={review.id}
              className="testimonial-card bg-white border border-[#EEEEEC] rounded-[var(--radius-card)] p-7 flex flex-col gap-4"
            >
              {/* Large opening quote */}
              <div
                className="text-5xl leading-none font-serif text-[#B8A99A] select-none"
                aria-hidden
              >
                &ldquo;
              </div>
              <StarRating rating={review.rating} size={16} showLabel={false} />
              <p className="text-sm text-gray-700 leading-relaxed flex-1">
                {review.content}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-[#EEEEEC]">
                <span className="font-semibold text-sm">{review.userName}</span>
                {review.verified && <VerifiedIcon />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
