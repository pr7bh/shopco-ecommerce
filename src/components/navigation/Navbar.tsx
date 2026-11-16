"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import { useWishlistStore } from "@/features/wishlist/store";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./MegaMenu";
import { SearchOverlay } from "./SearchOverlay";
import { MobileMenu } from "./MobileMenu";

const LEFT_LINKS = [
  { label: "WOMEN", href: "/shop?category=casual", hasMega: true },
  { label: "MEN", href: "/shop?category=formal", hasMega: true },
  { label: "KIDS", href: "/shop", hasMega: false },
  { label: "SALE", href: "/shop?category=sale", hasMega: false },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega = useCallback((label: string) => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setMegaOpen(label);
  }, []);

  const closeMega = useCallback(() => {
    megaTimerRef.current = setTimeout(() => setMegaOpen(null), 150);
  }, []);

  const keepMegaOpen = useCallback(() => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white border-b border-[#EEEEEC]"
            : "bg-white/0"
        )}
      >
        <div className="shopco-container">
          <div className="flex h-[68px] items-center">

            {/* LEFT — primary nav links */}
            <nav className="hidden md:flex items-center gap-6 flex-1">
              {LEFT_LINKS.map((link) =>
                link.hasMega ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => openMega(link.label)}
                    onMouseLeave={closeMega}
                  >
                    <button
                      className={cn(
                        "eyebrow text-[#292929] hover:text-black transition-colors pb-0.5",
                        megaOpen === link.label && "border-b border-black"
                      )}
                      aria-expanded={megaOpen === link.label}
                    >
                      {link.label}
                    </button>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "eyebrow text-[#292929] hover:text-black transition-colors",
                      link.label === "SALE" && "text-red-600 hover:text-red-700"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CENTER — logo */}
            <div className="flex-1 md:flex-none flex justify-start md:justify-center">
              <Link
                href="/"
                className="font-black text-lg tracking-[0.15em] uppercase whitespace-nowrap"
                style={{ fontFamily: "var(--font-hero)" }}
              >
                SHOP.CO
              </Link>
            </div>

            {/* RIGHT — icon actions */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              {/* Search */}
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center hover:opacity-60 transition-opacity"
              >
                <Search size={19} strokeWidth={1.5} />
              </button>

              {/* Account */}
              <Link
                href="/account"
                aria-label="Account"
                className="hidden md:flex items-center hover:opacity-60 transition-opacity"
              >
                <User size={19} strokeWidth={1.5} />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative hover:opacity-60 transition-opacity"
              >
                <Heart size={19} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Shopping bag"
                className="relative hover:opacity-60 transition-opacity"
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile search */}
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="md:hidden hover:opacity-60 transition-opacity"
              >
                <Search size={19} strokeWidth={1.5} />
              </button>

              {/* Mobile hamburger */}
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="md:hidden hover:opacity-60 transition-opacity"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Mega menu */}
        {megaOpen && (
          <div
            onMouseEnter={keepMegaOpen}
            onMouseLeave={closeMega}
          >
            <MegaMenu category={megaOpen} onClose={() => setMegaOpen(null)} />
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {/* Mobile menu */}
      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </>
  );
}
