"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="bg-black text-white py-24 md:py-32">
      <div className="shopco-container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="eyebrow text-white/40 mb-6">STAY CONNECTED</div>
          <h2
            className="font-black uppercase leading-none tracking-tight mb-5"
            style={{
              fontFamily: "var(--font-hero)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            JOIN THE
            <br />
            SHOP.CO COMMUNITY
          </h2>
          <p className="text-white/50 text-sm md:text-base leading-relaxed mb-10 max-w-sm mx-auto">
            Get first access to new arrivals, exclusive offers, and style
            inspiration delivered straight to your inbox.
          </p>

          {status === "success" ? (
            <div className="border border-white/20 py-5 px-8 inline-flex items-center gap-3 text-sm tracking-wide">
              <span className="text-[#B8A99A]">✓</span> You&apos;re on the list
              — look out for our next drop.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-stretch gap-0 max-w-md mx-auto"
            >
              <div className="flex-1 relative border-b border-white/30 focus-within:border-white transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Your email address"
                  className="w-full bg-transparent text-white placeholder:text-white/30 text-sm py-3 outline-none"
                />
              </div>
              <button
                type="submit"
                className="sm:ml-6 flex items-center justify-center gap-2 border border-white/30 text-white text-xs tracking-widest uppercase px-8 py-3 hover:border-white hover:bg-white hover:text-black transition-all mt-4 sm:mt-0 self-end"
              >
                SUBSCRIBE <ArrowRight size={14} />
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-red-400 text-xs mt-3">
              Please enter a valid email address.
            </p>
          )}

          <p className="text-white/25 text-xs mt-8 tracking-wide">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
