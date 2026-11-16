"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, Size, Color } from "@/types";

const PROMO_CODES: Record<string, { type: "percent" | "fixed"; value: number }> = {
  SHOP20: { type: "percent", value: 20 },
  SAVE10: { type: "fixed", value: 10 },
  NEWUSER: { type: "percent", value: 15 },
};

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string;
  promoDiscount: number;

  addItem: (product: Product, quantity?: number, size?: Size, color?: Color) => void;
  removeItem: (productId: string, size?: Size, color?: Color) => void;
  updateQuantity: (productId: string, quantity: number, size?: Size, color?: Color) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;

  get itemCount(): number;
  get subtotal(): number;
  get shipping(): number;
  get total(): number;
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
      promoDiscount: 0,

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

      clearCart: () => set({ items: [], promoCode: "", promoDiscount: 0 }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyPromo(code) {
        const promo = PROMO_CODES[code.toUpperCase().trim()];
        if (!promo) return false;
        const subtotal = get().subtotal;
        const discount =
          promo.type === "percent"
            ? Math.round((subtotal * promo.value) / 100)
            : promo.value;
        set({ promoCode: code.toUpperCase().trim(), promoDiscount: discount });
        return true;
      },

      removePromo() {
        set({ promoCode: "", promoDiscount: 0 });
      },

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
      get subtotal() {
        return get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        );
      },
      get shipping() {
        return get().subtotal >= 200 ? 0 : 15;
      },
      get total() {
        const s = get();
        return s.subtotal - s.promoDiscount + s.shipping;
      },
    }),
    { name: "shopco-cart" }
  )
);
