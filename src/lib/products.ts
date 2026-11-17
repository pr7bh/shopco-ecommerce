import type { Product, Review } from "@/types";
import { WOMEN_PRODUCTS } from "./products-women";
import { MEN_PRODUCTS } from "./products-men";
import { ACCESSORIES_PRODUCTS } from "./products-accessories";

// ─── Core products (original 12) ────────────────────────────────────
const CORE_PRODUCTS: Product[] = [
  // ── New Arrivals (from mock-data) ──────────────────────────────
  {
    id: "na-1",
    name: "T-shirt with Tape Details",
    slug: "t-shirt-tape-details",
    description:
      "A clean minimalist tee with subtle tape detail on the sleeves. Crafted from 100% combed cotton for all-day comfort.",
    price: 29.99,
    images: [
      "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
      "https://images.pexels.com/photos/8532638/pexels-photo-8532638.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
    ],
    category: "casual",
    subcategory: "basic-tshirts",
    gender: "men",
    tags: ["t-shirt", "casual", "new"],
    rating: 4.5,
    reviewCount: 145,
    stock: 24,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "White", hex: "#ffffff" },
    ],
    isNew: true,
  },
  {
    id: "na-2",
    name: "Skinny Fit Jeans",
    slug: "skinny-fit-jeans",
    description:
      "Classic skinny fit jeans in a mid-wash blue. Stretch denim for maximum comfort and movement.",
    price: 64.99,
    originalPrice: 69.99,
    images: [
      "https://images.pexels.com/photos/6764143/pexels-photo-6764143.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
      "https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
    ],
    category: "casual",
    subcategory: "jeans",
    gender: "women",
    tags: ["jeans", "denim", "new"],
    rating: 4.5,
    reviewCount: 87,
    stock: 16,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Mid Blue", hex: "#5b8dd9" },
      { name: "Dark Blue", hex: "#1f3c6e" },
    ],
    isNew: true,
    isSale: true,
  },
  {
    id: "na-3",
    name: "Checkered Shirt",
    slug: "checkered-shirt",
    description:
      "A timeless checkered pattern shirt in a relaxed fit. Perfect for casual outings or layering.",
    price: 44.99,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&h=1067&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&h=1067&q=80",
    ],
    category: "casual",
    subcategory: "shirts",
    gender: "men",
    tags: ["shirt", "checkered", "new"],
    rating: 4.5,
    reviewCount: 212,
    stock: 32,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Red Check", hex: "#b22222" },
      { name: "Blue Check", hex: "#1e4d8c" },
    ],
    isNew: true,
  },
  {
    id: "na-4",
    name: "Sleeve Striped T-shirt",
    slug: "sleeve-striped-tshirt",
    description:
      "Bold sleeve stripes on a lightweight jersey tee. The modern take on a sporting classic.",
    price: 27.99,
    originalPrice: 34.99,
    images: [
      "https://images.pexels.com/photos/12955555/pexels-photo-12955555.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
    ],
    category: "casual",
    subcategory: "basic-tshirts",
    gender: "men",
    tags: ["t-shirt", "striped", "new"],
    rating: 4.5,
    reviewCount: 65,
    stock: 18,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Orange/Black", hex: "#e85c1a" },
      { name: "Navy/White", hex: "#1a237e" },
    ],
    isNew: true,
    isSale: true,
  },

  // ── Top Selling (from mock-data) ───────────────────────────────
  {
    id: "ts-1",
    name: "Vertical Striped Shirt",
    slug: "vertical-striped-shirt",
    description:
      "Clean vertical stripes in a relaxed-fit woven shirt. A wardrobe staple that pairs with anything.",
    price: 44.99,
    originalPrice: 49.99,
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&h=1067&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&h=1067&q=80",
    ],
    category: "casual",
    subcategory: "shirts",
    gender: "men",
    tags: ["shirt", "striped", "top-selling"],
    rating: 5.0,
    reviewCount: 198,
    stock: 41,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Green/White", hex: "#2d6a4f" },
      { name: "Blue/White", hex: "#1565c0" },
    ],
    isSale: true,
    isFeatured: true,
  },
  {
    id: "ts-2",
    name: "Courage Graphic T-shirt",
    slug: "courage-graphic-tshirt",
    description:
      "A statement graphic tee featuring bold typography. Printed on premium heavyweight cotton.",
    price: 32.99,
    images: [
      "https://images.pexels.com/photos/8148577/pexels-photo-8148577.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
    ],
    category: "casual",
    subcategory: "basic-tshirts",
    gender: "men",
    tags: ["t-shirt", "graphic", "top-selling"],
    rating: 4.0,
    reviewCount: 56,
    stock: 27,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Orange", hex: "#e35d1a" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    isFeatured: true,
  },
  {
    id: "ts-3",
    name: "Loose Fit Bermuda Shorts",
    slug: "loose-fit-bermuda-shorts",
    description:
      "Relaxed-cut Bermuda shorts in a durable twill fabric. Ideal for warm days and active lifestyles.",
    price: 39.99,
    images: [
      "https://images.pexels.com/photos/38581932/pexels-photo-38581932.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
      "https://images.pexels.com/photos/5405630/pexels-photo-5405630.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
    ],
    category: "gym",
    subcategory: "shorts",
    gender: "men",
    tags: ["shorts", "casual", "top-selling"],
    rating: 3.5,
    reviewCount: 32,
    stock: 54,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Khaki", hex: "#c8b560" },
      { name: "Navy", hex: "#1a237e" },
    ],
    isFeatured: true,
  },
  {
    id: "ts-4",
    name: "Faded Skinny Jeans",
    slug: "faded-skinny-jeans",
    description:
      "An expertly faded finish on our signature skinny jean cut. Distressed at the knees for an effortless look.",
    price: 64.99,
    images: [
      "https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
      "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
    ],
    category: "casual",
    subcategory: "jeans",
    gender: "men",
    tags: ["jeans", "denim", "top-selling"],
    rating: 4.5,
    reviewCount: 143,
    stock: 19,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Faded Black", hex: "#2c2c2c" },
      { name: "Faded Blue", hex: "#4a6fa5" },
    ],
    isFeatured: true,
  },

  // ── New products ───────────────────────────────────────────────
  {
    id: "pl-1",
    name: "One Life Graphic T-shirt",
    slug: "one-life-graphic-tshirt",
    description:
      "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    price: 29.99,
    originalPrice: 34.99,
    images: [
      "https://images.pexels.com/photos/6461401/pexels-photo-6461401.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
    ],
    category: "casual",
    subcategory: "basic-tshirts",
    gender: "women",
    tags: ["t-shirt", "graphic", "featured"],
    rating: 4.5,
    reviewCount: 451,
    stock: 30,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Olive", hex: "#6b7c3c" },
      { name: "Forest Green", hex: "#2d4a1e" },
      { name: "Navy", hex: "#1a2744" },
    ],
    isNew: false,
    isSale: true,
    isFeatured: true,
  },
  {
    id: "pl-2",
    name: "Polo with Contrast Trims",
    slug: "polo-contrast-trims",
    description:
      "A refined polo shirt with contrast-color trims at the collar and cuffs. Smart-casual essential for any wardrobe.",
    price: 34.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&h=1067&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&h=1067&q=80",
    ],
    category: "formal",
    subcategory: "shirts",
    gender: "men",
    tags: ["polo", "formal", "top-selling"],
    rating: 4.0,
    reviewCount: 180,
    stock: 22,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Blue", hex: "#1565c0" },
      { name: "Pink", hex: "#e91e8c" },
    ],
    isSale: true,
  },
  {
    id: "pl-3",
    name: "Gradient Graphic T-shirt",
    slug: "gradient-graphic-tshirt",
    description:
      "A vivid gradient print on premium cotton jersey. Eye-catching and comfortable for everyday wear.",
    price: 32.99,
    images: [
      "https://images.pexels.com/photos/26601197/pexels-photo-26601197.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop",
    ],
    category: "casual",
    subcategory: "basic-tshirts",
    gender: "men",
    tags: ["t-shirt", "graphic", "casual"],
    rating: 3.5,
    reviewCount: 92,
    stock: 35,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "White", hex: "#ffffff" }],
  },
  {
    id: "pl-4",
    name: "Polo with Tipping Details",
    slug: "polo-tipping-details",
    description:
      "Classic polo with elegant tipping details. A versatile piece that transitions seamlessly from casual to smart-casual.",
    price: 39.99,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&h=1067&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&h=1067&q=80",
    ],
    category: "formal",
    subcategory: "shirts",
    gender: "women",
    tags: ["polo", "formal", "classic"],
    rating: 4.5,
    reviewCount: 134,
    stock: 28,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Pink", hex: "#f48fb1" },
      { name: "White", hex: "#ffffff" },
    ],
  },
];

// ─── Full product catalog ────────────────────────────────────────────
export const ALL_PRODUCTS: Product[] = [
  ...CORE_PRODUCTS,
  ...(WOMEN_PRODUCTS as unknown as Product[]),
  ...(MEN_PRODUCTS as unknown as Product[]),
  ...(ACCESSORIES_PRODUCTS as unknown as Product[]),
];

// ─── Per-product reviews ─────────────────────────────────────────────
export const PRODUCT_REVIEWS: Record<string, Review[]> = {
  "pl-1": [
    {
      id: "rev-pl1-1",
      userId: "u-sd",
      userName: "Samantha D.",
      productId: "pl-1",
      rating: 5,
      content:
        "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It’s become my favorite go-to shirt.",
      createdAt: "2023-08-14",
      verified: true,
    },
    {
      id: "rev-pl1-2",
      userId: "u-am",
      userName: "Alex M.",
      productId: "pl-1",
      rating: 5,
      content:
        "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I’m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
      createdAt: "2023-08-15",
      verified: true,
    },
    {
      id: "rev-pl1-3",
      userId: "u-er",
      userName: "Ethan R.",
      productId: "pl-1",
      rating: 5,
      content:
        "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer’s touch in every aspect of this shirt.",
      createdAt: "2023-08-16",
      verified: true,
    },
    {
      id: "rev-pl1-4",
      userId: "u-op",
      userName: "Olivia P.",
      productId: "pl-1",
      rating: 5,
      content:
        "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It’s evident that the designer poured their creativity into making this t-shirt stand out.",
      createdAt: "2023-08-17",
      verified: true,
    },
    {
      id: "rev-pl1-5",
      userId: "u-lk",
      userName: "Liam K.",
      productId: "pl-1",
      rating: 5,
      content:
        "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer’s skill. It’s like wearing a piece of art that reflects my passion for both design and fashion.",
      createdAt: "2023-08-18",
      verified: true,
    },
    {
      id: "rev-pl1-6",
      userId: "u-ah",
      userName: "Ava H.",
      productId: "pl-1",
      rating: 5,
      content:
        "I’m not just wearing a t-shirt; I’m wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
      createdAt: "2023-08-19",
      verified: true,
    },
  ],
  "ts-1": [
    {
      id: "rev-ts1-1",
      userId: "u-jd",
      userName: "James D.",
      productId: "ts-1",
      rating: 5,
      content:
        "Perfect shirt for any occasion. The vertical stripes are sharp and the fabric is excellent quality.",
      createdAt: "2024-01-10",
      verified: true,
    },
    {
      id: "rev-ts1-2",
      userId: "u-mw",
      userName: "Maria W.",
      productId: "ts-1",
      rating: 5,
      content:
        "Looks great and fits true to size. Already bought two colors — highly recommend.",
      createdAt: "2024-02-05",
      verified: true,
    },
  ],
};

// ─── Helper functions ────────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, count);
}

interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  sort?: string;
  q?: string;
  gender?: string;
  subcategory?: string;
}

export function filterAndSort(
  products: Product[],
  filters: FilterOptions
): Product[] {
  let result = [...products];

  // Gender
  if (filters.gender) {
    result = result.filter((p) => p.gender === filters.gender);
  }

  // Subcategory
  if (filters.subcategory) {
    result = result.filter((p) => p.subcategory === filters.subcategory);
  }

  // Category
  if (filters.category) {
    const cat = filters.category.toLowerCase();
    if (cat === "new-arrivals") {
      result = result.filter((p) => p.isNew);
    } else if (cat === "sale") {
      result = result.filter((p) => p.isSale);
    } else {
      result = result.filter((p) => p.category === cat);
    }
  }

  // Price
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  // Colors
  if (filters.colors && filters.colors.length > 0) {
    const fColors = filters.colors.map((c) => c.toLowerCase());
    result = result.filter((p) =>
      p.colors?.some((c) => fColors.includes(c.name.toLowerCase()))
    );
  }

  // Sizes
  if (filters.sizes && filters.sizes.length > 0) {
    result = result.filter((p) =>
      p.sizes?.some((s) => filters.sizes!.includes(s))
    );
  }

  // Search
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort
  switch (filters.sort) {
    case "newest":
      result = result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case "price-asc":
      result = result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result = result.sort((a, b) => b.rating - a.rating);
      break;
    default: // "featured"
      result = result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return result;
}
