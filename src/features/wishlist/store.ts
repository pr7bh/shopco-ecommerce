"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
  addItem(product: Product): void;
  removeItem(productId: string): void;
  toggleItem(product: Product): void;
  isWishlisted(productId: string): boolean;
  clearWishlist(): void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (get().isWishlisted(product.id)) return;
        set((s) => ({ items: [...s.items, product] }));
      },
      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((p) => p.id !== productId) })),
      toggleItem: (product) => {
        get().isWishlisted(product.id)
          ? get().removeItem(product.id)
          : get().addItem(product);
      },
      isWishlisted: (productId) => get().items.some((p) => p.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "shopco-wishlist",
      onRehydrateStorage: () => (state, error) => {
        if (error) console.warn("Wishlist hydration failed", error);
      },
    }
  )
);
