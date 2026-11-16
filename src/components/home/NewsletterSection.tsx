"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="shopco-section px-4 md:px-6">
      <div className="shopco-container">
        <div className="bg-black rounded-[var(--radius-card-lg)] p-8 md:p-12 lg:p-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Headline */}
            <h2
              className="text-white text-3xl font-black uppercase leading-tight max-w-[420px] md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              Stay Upto Date About Our Latest Offers
            </h2>

            {/* Form */}
            <div className="flex flex-col gap-3 w-full lg:max-w-[420px]">
              {submitted ? (
                <div className="bg-white/10 text-white rounded-full px-6 py-3.5 text-sm text-center">
                  ✓ You&apos;re subscribed! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ✉
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-white rounded-full pl-10 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-white/50 placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-white text-black text-sm font-semibold rounded-full px-6 py-3.5 hover:bg-gray-100 transition-colors"
                  >
                    Subscribe to Newsletter
                    <ArrowRight size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
