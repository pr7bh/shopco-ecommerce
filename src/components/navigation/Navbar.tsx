"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useWishlistStore } from "@/features/wishlist/store";
import { Container } from "@/components/common/Container";
import { NAV_LINKS } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow duration-200",
        scrolled && "shadow-sm"
      )}
    >
      <Container>
        <div className="flex h-[68px] items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 font-display text-xl font-bold tracking-tight"
          >
            SHOP.CO
          </Link>

          {/* Desktop nav */}
          <nav ref={dropdownRef} className="hidden md:flex items-center gap-5 flex-shrink-0">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="relative">
                {link.hasDropdown ? (
                  <>
                    <button
                      className="flex items-center gap-1 text-sm font-medium hover:opacity-70 transition-opacity"
                      onClick={() =>
                        setDropdownOpen(
                          dropdownOpen === link.label ? null : link.label
                        )
                      }
                      aria-expanded={dropdownOpen === link.label}
                    >
                      {link.label}
                      <ChevronDown
                        size={15}
                        className={cn(
                          "transition-transform duration-200",
                          dropdownOpen === link.label && "rotate-180"
                        )}
                      />
                    </button>
                    {dropdownOpen === link.label && link.children && (
                      <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            onClick={() => setDropdownOpen(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm font-medium hover:opacity-70 transition-opacity"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Search bar */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-2.5 flex-1 max-w-[500px]">
            <Search size={16} className="text-gray-500 flex-shrink-0" />
            <input
              type="search"
              placeholder="Search for products..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
            />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            {/* Mobile search */}
            <Link href="/search" className="lg:hidden" aria-label="Search">
              <Search size={20} />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative" aria-label="Shopping cart">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link href="/account" aria-label="My account">
              <User size={20} />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <Container>
            {/* Mobile search */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-2.5 mt-3 mb-2">
              <Search size={16} className="text-gray-500 flex-shrink-0" />
              <input
                type="search"
                placeholder="Search for products..."
                className="bg-transparent text-sm outline-none w-full placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <nav className="pb-4">
              {NAV_LINKS.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-3.5 text-sm font-medium border-b border-gray-100 last:border-0"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown size={15} />}
                  </Link>
                </div>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
