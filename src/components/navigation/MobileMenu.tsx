"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import { useWishlistStore } from "@/features/wishlist/store";

interface MobileMenuProps {
  onClose: () => void;
}

const PRIMARY_LINKS = [
  { label: "WOMEN", href: "/shop?category=casual" },
  { label: "MEN", href: "/shop?category=formal" },
  { label: "KIDS", href: "/shop" },
  { label: "SALE", href: "/shop?category=sale" },
  { label: "NEW ARRIVALS", href: "/shop?sort=newest" },
];

export function MobileMenu({ onClose }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Slide-in wrapper */}
      <div
        className="flex flex-col h-full transition-transform duration-300 ease-out"
        style={{ transform: mounted ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEEEEC]">
          <Link
            href="/"
            onClick={onClose}
            className="font-black text-lg tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            SHOP.CO
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 hover:opacity-60 transition-opacity"
          >
            <X size={22} />
          </button>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">
            {PRIMARY_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-4 font-display text-2xl font-bold uppercase tracking-tight border-b border-[#EEEEEC] hover:pl-2 transition-all"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Secondary */}
          <div className="mt-8 space-y-3">
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between text-sm text-gray-600 hover:text-black transition-colors py-2"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-between text-sm text-gray-600 hover:text-black transition-colors py-2"
            >
              <span>Shopping Bag</span>
              {itemCount > 0 && (
                <span className="bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              onClick={onClose}
              className="block text-sm text-gray-600 hover:text-black transition-colors py-2"
            >
              Account
            </Link>
          </div>
        </nav>

        {/* Footer strip */}
        <div className="px-6 py-5 border-t border-[#EEEEEC]">
          <p className="eyebrow text-gray-400">© 2026 SHOP.CO</p>
        </div>
      </div>
    </div>
  );
}
