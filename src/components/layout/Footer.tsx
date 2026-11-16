"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

// ── Inline SVG social icons ───────────────────────────────────────
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ── Payment badge ─────────────────────────────────────────────────
function PaymentBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    paypal: "PayPal",
    applepay: "Apple Pay",
    gpay: "Google Pay",
  };
  return (
    <div className="h-7 px-2.5 bg-white border border-[#EEEEEC] rounded flex items-center justify-center">
      <span className="text-[11px] font-semibold text-[#292929] whitespace-nowrap">
        {labels[type] ?? type}
      </span>
    </div>
  );
}

// ── Newsletter strip (needs client interactivity) ─────────────────
function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <div className="bg-black text-white">
      <div className="shopco-container py-12 md:py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2
              className="text-2xl md:text-3xl font-black uppercase tracking-tight"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              Stay in the Loop
            </h2>
            <p className="text-white/50 text-sm mt-1">
              New arrivals, exclusive offers and style inspiration.
            </p>
          </div>

          {submitted ? (
            <p className="text-sm text-white/70 md:text-right">
              ✓ Thank you — you&apos;re on the list.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 md:min-w-[400px]"
            >
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="w-full bg-transparent border-b border-white/30 focus:border-white pb-2 text-sm text-white placeholder:text-white/40 outline-none transition-colors"
                />
                {error && (
                  <p className="text-red-400 text-xs mt-1">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="shrink-0 px-6 py-2.5 border border-white text-xs font-semibold tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Footer columns data ───────────────────────────────────────────
const FOOTER_COLS = [
  {
    heading: "Shop",
    links: [
      { label: "Women", href: "/shop?category=casual" },
      { label: "Men", href: "/shop?category=formal" },
      { label: "Kids", href: "/shop" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Sale", href: "/shop?category=sale" },
      { label: "All Products", href: "/shop" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "FAQ", href: "/" },
      { label: "Shipping & Returns", href: "/" },
      { label: "Order Tracking", href: "/" },
      { label: "Store Locator", href: "/" },
      { label: "Contact Us", href: "/" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our Story", href: "/" },
      { label: "Careers", href: "/" },
      { label: "Sustainability", href: "/" },
      { label: "Press", href: "/" },
      { label: "Affiliate Program", href: "/" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
      { label: "Accessibility", href: "/" },
    ],
  },
];

// ── Main Footer ───────────────────────────────────────────────────
export function Footer() {
  const year = 2026;

  return (
    <footer>
      <NewsletterStrip />

      {/* Main grid */}
      <div className="bg-[#F7F6F3]">
        <div className="shopco-container py-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1 lg:pr-6">
              <Link
                href="/"
                className="inline-block font-black text-base tracking-[0.15em] uppercase mb-4"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                SHOP.CO
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-[200px]">
                Refined fashion for the everyday.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { href: siteConfig.social.twitter, Icon: TwitterIcon, label: "Twitter" },
                  { href: siteConfig.social.instagram, Icon: InstagramIcon, label: "Instagram" },
                  { href: siteConfig.social.facebook, Icon: FacebookIcon, label: "Facebook" },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-full border border-[#EEEEEC] flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <h3 className="eyebrow text-[#292929] mb-5">{col.heading}</h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-black transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#EEEEEC]">
          <div className="shopco-container py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-400">
                © {year} SHOP.CO. All rights reserved.
              </p>
              <span className="hidden sm:block text-xs text-gray-300">|</span>
              <p className="hidden sm:block text-xs text-gray-400">
                🇺🇸 United States
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {siteConfig.paymentMethods.map((method) => (
                <PaymentBadge key={method} type={method} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
