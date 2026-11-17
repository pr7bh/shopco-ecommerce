"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu } from "lucide-react";
import { useCartStore } from "@/features/cart/store";
import { useWishlistStore } from "@/features/wishlist/store";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./MegaMenu";
import { SearchOverlay } from "./SearchOverlay";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { label: "Women", href: "/shop?gender=women", mega: "WOMEN" },
  { label: "Men", href: "/shop?gender=men", mega: "MEN" },
  { label: "Accessories", href: "/shop?gender=unisex" },
  { label: "Sale", href: "/shop?category=sale", sale: true },
] as const;

const iconBtn =
  "relative flex items-center justify-center w-10 h-10 text-[#292929] hover:text-black hover:opacity-70 transition-opacity";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 bg-black text-white text-[9px] font-semibold rounded-full flex items-center justify-center leading-none">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  const openMega = useCallback((key: string) => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setMegaOpen(key);
  }, []);

  const scheduleClose = useCallback(() => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    megaTimerRef.current = setTimeout(() => setMegaOpen(null), 120);
  }, []);

  const closeNow = useCallback(() => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setMegaOpen(null);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-white border-b transition-colors duration-200",
          scrolled || megaOpen ? "border-[#EEEEEC]" : "border-transparent"
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="shopco-container">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16">
            {/* Left */}
            <div className="flex items-center h-full">
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className={cn(iconBtn, "lg:hidden -ml-2.5")}
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              <nav aria-label="Main" className="hidden lg:flex items-stretch h-full gap-7">
                {NAV_LINKS.map((link) => {
                  const mega = "mega" in link ? link.mega : null;
                  const active = mega !== null && megaOpen === mega;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={closeNow}
                      onMouseEnter={() => (mega ? openMega(mega) : scheduleClose())}
                      onFocus={() => mega && openMega(mega)}
                      aria-expanded={mega ? active : undefined}
                      aria-haspopup={mega ? "true" : undefined}
                      className={cn(
                        "flex items-center border-b-2 pt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors",
                        active ? "border-black text-black" : "border-transparent hover:border-black",
                        "sale" in link ? "text-[#C8102E]" : "text-[#292929] hover:text-black"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Center */}
            <Link
              href="/"
              onClick={closeNow}
              className="font-black text-lg md:text-xl tracking-[0.15em] uppercase whitespace-nowrap px-2"
              style={{ fontFamily: "var(--font-hero)" }}
            >
              SHOP.CO
            </Link>

            {/* Right */}
            <div className="flex items-center justify-end -mr-2.5">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className={iconBtn}
              >
                <Search size={19} strokeWidth={1.5} />
              </button>
              <Link
                href="/wishlist"
                aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}
                className={cn(iconBtn, "hidden sm:flex")}
              >
                <Heart size={19} strokeWidth={1.5} />
                <CountBadge count={wishlistCount} />
              </Link>
              <Link
                href="/cart"
                aria-label={`Shopping bag${itemCount ? `, ${itemCount} items` : ""}`}
                className={iconBtn}
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                <CountBadge count={itemCount} />
              </Link>
            </div>
          </div>
        </div>

        {megaOpen && (
          <div onMouseEnter={() => openMega(megaOpen)}>
            <MegaMenu category={megaOpen} onClose={closeNow} />
          </div>
        )}
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </>
  );
}
