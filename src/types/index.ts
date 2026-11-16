/* ─── Product ─────────────────────────────────────────────────── */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sizes?: Size[];
  colors?: Color[];
  isNew?: boolean;
  isSale?: boolean;
  isFeatured?: boolean;
  model3dUrl?: string;
}

export type ProductCategory =
  | "casual"
  | "formal"
  | "party"
  | "gym"
  | "new-arrivals"
  | "sale";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface Color {
  name: string;
  hex: string;
}

/* ─── Cart ────────────────────────────────────────────────────── */
export interface CartItem {
  product: Product;
  quantity: number;
  size?: Size;
  color?: Color;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  discount?: number;
}

/* ─── User ────────────────────────────────────────────────────── */
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

/* ─── Order ───────────────────────────────────────────────────── */
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem extends CartItem {
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  shippingAddress: Address;
  createdAt: string;
}

/* ─── Address ─────────────────────────────────────────────────── */
export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

/* ─── Review ──────────────────────────────────────────────────── */
export interface Review {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  productId: string;
  rating: number;
  content: string;
  createdAt: string;
  verified?: boolean;
}

/* ─── Filter / Sort ───────────────────────────────────────────── */
export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export interface ProductFilters {
  category?: ProductCategory;
  sizes?: Size[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  search?: string;
}
