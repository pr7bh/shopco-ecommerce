"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { CartItem, Product, Size, Color } from "@/types";

const PROMO_CODES: Record<string, { type: "percent" | "fixed"; value: number }> = {
  SHOP20: { type: "percent", value: 20 },
  SAVE10: { type: "fixed", value: 10 },
  NEWUSER: { type: "percent", value: 15 },
};

export const FREE_SHIPPING_THRESHOLD = 200;
const STANDARD_SHIPPING = 15;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string;

  addItem: (product: Product, quantity?: number, size?: Size, color?: Color) => void;
  removeItem: (productId: string, size?: Size, color?: Color) => void;
  updateQuantity: (productId: string, quantity: number, size?: Size, color?: Color) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// Derived values must never live in store state: Zustand's set() flattens getters into stale snapshots.
export function cartTotals(items: CartItem[], promoCode: string): CartTotals {
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = round2(items.reduce((sum, i) => sum + i.product.price * i.quantity, 0));
  const promo = PROMO_CODES[promoCode];
  const rawDiscount = !promo
    ? 0
    : promo.type === "percent"
      ? round2((subtotal * promo.value) / 100)
      : promo.value;
  const discount = Math.min(rawDiscount, subtotal);
  const shipping = itemCount === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = round2(subtotal - discount + shipping);
  return { itemCount, subtotal, discount, shipping, total };
}

function itemKey(productId: string, size?: Size, color?: Color): string {
  return `${productId}:${size ?? ""}:${color?.hex ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: "",

      addItem(product, quantity = 1, size, color) {
        set((state) => {
          const key = itemKey(product.id, size, color);
          const existing = state.items.find(
            (i) => itemKey(i.product.id, i.size, i.color) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.product.id, i.size, i.color) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity, size, color }] };
        });
      },

      removeItem(productId, size, color) {
        const key = itemKey(productId, size, color);
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.product.id, i.size, i.color) !== key
          ),
        }));
      },

      updateQuantity(productId, quantity, size, color) {
        const key = itemKey(productId, size, color);
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.product.id, i.size, i.color) === key
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], promoCode: "" }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyPromo(code) {
        const normalized = code.toUpperCase().trim();
        if (!PROMO_CODES[normalized]) return false;
        set({ promoCode: normalized });
        return true;
      },

      removePromo() {
        set({ promoCode: "" });
      },
    }),
    {
      name: "shopco-cart",
      version: 2,
      partialize: (s) => ({ items: s.items, promoCode: s.promoCode }),
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<CartState>;
        return { items: p.items ?? [], promoCode: p.promoCode ?? "" } as CartState;
      },
    }
  )
);

export function useCartTotals(): CartTotals {
  return useCartStore(useShallow((s) => cartTotals(s.items, s.promoCode)));
}
