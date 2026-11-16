"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  promoDiscount: number;
  shipping: number;
  total: number;
  promoCode: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  deliveryMethod: string;
}

interface OrdersState {
  orders: Order[];
  addOrder(order: Order): void;
  getOrder(id: string): Order | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    {
      name: "shopco-orders",
      onRehydrateStorage: () => (state, error) => {
        if (error) console.warn("Orders hydration failed", error);
      },
    }
  )
);
