import Link from "next/link";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Women", href: "/shop?gender=women" },
      { label: "Men", href: "/shop?gender=men" },
      { label: "Accessories", href: "/shop?gender=unisex" },
      { label: "New arrivals", href: "/shop?sort=newest" },
      { label: "Sale", href: "/shop?category=sale" },
      { label: "All products", href: "/shop" },
    ],
  },
  {
    heading: "Customer service",
    links: [
      { label: "FAQ", href: "/help#faq" },
      { label: "Shipping", href: "/help#shipping" },
      { label: "Returns", href: "/help#returns" },
      { label: "Order tracking", href: "/help#orders" },
      { label: "Contact", href: "/help#contact" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our story", href: "/about#story" },
      { label: "Sustainability", href: "/about#sustainability" },
      { label: "Careers", href: "/about#careers" },
      { label: "Newsletter", href: "/#newsletter" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/legal#privacy" },
      { label: "Terms", href: "/legal#terms" },
      { label: "Cookies & storage", href: "/legal#storage" },
      { label: "Accessibility", href: "/legal#accessibility" },
    ],
  },
];

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "Pinterest", href: "https://www.pinterest.com" },
  { label: "TikTok", href: "https://www.tiktok.com" },
];

const PAYMENTS = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"];

const footerLink =
  "relative text-sm text-black/60 transition-colors hover:text-black after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100";

export function Footer() {
  return (
    <footer className="bg-[#F7F6F3] text-black">
      <div className="shopco-container pt-16 md:pt-20">
        <div className="grid grid-cols-1 gap-10 border-b border-black/10 pb-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <Link
            href="/"
            aria-label="SHOP.CO home"
            className="font-black uppercase leading-none tracking-[-0.02em] text-[clamp(3rem,13vw,7.25rem)] lg:col-span-8"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            SHOP.CO
          </Link>
          <div className="lg:col-span-4 lg:pb-3">
            <p className="max-w-xs text-sm leading-relaxed text-black/60">
              Considered fashion for the everyday — new collections, seasonal edits and the pieces that
              outlast them.
            </p>
            <Link href="/#newsletter" className="ed-link mt-4 text-black">
              Join the newsletter
              <ArrowGlyph />
            </Link>
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/45">{col.heading}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-6 border-t border-black/10 py-6 text-xs text-black/50 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 SHOP.CO</span>
            <span>United States · English · USD</span>
            <ul className="flex gap-4" aria-label="Social media (opens in a new tab)">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-black">
                    {s.label}
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path d="M2 8l6-6M3.5 2H8v4.5" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {PAYMENTS.map((p) => (
              <li key={p} className="border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-black/70">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
