"use client";

import { create } from "zustand";

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type DeliveryMethod = "standard" | "express" | "overnight";
export type PaymentMethod = "card" | "paypal" | "apple_pay";

interface CheckoutState {
  step: 1 | 2 | 3 | 4 | 5;
  contactInfo: Partial<ContactInfo>;
  shippingAddress: Partial<ShippingAddress>;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  setStep(step: 1 | 2 | 3 | 4 | 5): void;
  setContactInfo(info: ContactInfo): void;
  setShippingAddress(addr: ShippingAddress): void;
  setDeliveryMethod(method: DeliveryMethod): void;
  setPaymentMethod(method: PaymentMethod): void;
  reset(): void;
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  step: 1,
  contactInfo: {},
  shippingAddress: {},
  deliveryMethod: "standard",
  paymentMethod: "card",
  setStep: (step) => set({ step }),
  setContactInfo: (contactInfo) => set({ contactInfo }),
  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  reset: () =>
    set({
      step: 1,
      contactInfo: {},
      shippingAddress: {},
      deliveryMethod: "standard",
      paymentMethod: "card",
    }),
}));
