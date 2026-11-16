"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/products/StarRating";
import type { Review } from "@/types";

interface ReviewsSectionProps {
  reviews: Review[];
  productId: string;
}

const TABS = ["Product Details", "Rating & Reviews", "FAQs"] as const;
type Tab = (typeof TABS)[number];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{review.userName}</span>
            {review.verified && (
              <span className="flex items-center gap-1 text-green-600 text-[10px] font-medium">
                <CheckCircle size={11} />
                Verified
              </span>
            )}
          </div>
          <StarRating rating={review.rating} size={12} className="mt-1" />
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {new Date(review.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
    </div>
  );
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Rating & Reviews");
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? reviews : reviews.slice(0, 6);

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            )}
          >
            {tab}
            {tab === "Rating & Reviews" && reviews.length > 0 && (
              <span className="ml-1.5 text-xs text-gray-400">({reviews.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Panel: Rating & Reviews */}
      {activeTab === "Rating & Reviews" && (
        <div>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {visible.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
              {reviews.length > 6 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAll((s) => !s)}
                    className="border border-gray-200 px-6 py-2.5 rounded-full text-sm font-medium hover:border-black transition-colors"
                  >
                    {showAll ? "Show Less" : `Load All ${reviews.length} Reviews`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Panel: Product Details */}
      {activeTab === "Product Details" && (
        <div className="text-sm text-gray-600 space-y-3 max-w-2xl">
          <p>
            All products are made from premium materials and go through strict
            quality control. Each garment is inspected before dispatch to ensure
            the highest standards.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>100% premium cotton / stretch blend (varies by product)</li>
            <li>Machine wash cold, tumble dry low</li>
            <li>Ships in 2–5 business days</li>
            <li>Free returns within 30 days</li>
          </ul>
        </div>
      )}

      {/* Panel: FAQs */}
      {activeTab === "FAQs" && (
        <div className="text-sm text-gray-600 space-y-5 max-w-2xl">
          {[
            {
              q: "How do I find the right size?",
              a: "Use our size guide located on each product page. When in doubt, size up.",
            },
            {
              q: "What is your return policy?",
              a: "We offer free returns within 30 days of delivery for unused items in original packaging.",
            },
            {
              q: "Do you ship internationally?",
              a: "Yes, we ship to over 50 countries. International orders typically arrive within 7–14 business days.",
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <p className="font-semibold text-black mb-1">{q}</p>
              <p>{a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
