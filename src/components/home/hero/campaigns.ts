export type LayerKey = "back" | "main" | "front";

export interface CampaignImage {
  id: number;
  alt: string;
  /** CSS object-position for the DOM layer (WebGL planes use centered cover). */
  focus?: string;
}

export interface Campaign {
  number: string;
  collection: string;
  eyebrow: string;
  headline: [string, string];
  description: string;
  cta: { label: string; href: string };
  secondary: { label: string; href: string };
  images: Record<LayerKey, CampaignImage>;
}

export const CAMPAIGNS: Campaign[] = [
  {
    number: "01",
    collection: "Women",
    eyebrow: "Spring / Summer 2026",
    headline: ["The New", "Season"],
    description: "Discover pieces designed for everyday expression.",
    cta: { label: "Explore Women", href: "/shop?gender=women" },
    secondary: { label: "New arrivals", href: "/shop?gender=women&sort=newest" },
    images: {
      main: { id: 9604191, alt: "Model in a brown knit top and white wide-leg jeans in a grey studio", focus: "50% 30%" },
      front: { id: 19456445, alt: "Model in a black blouse and beige trousers against a warm backdrop", focus: "50% 25%" },
      back: { id: 13816064, alt: "Model in a long cream dress in a pale studio", focus: "50% 20%" },
    },
  },
  {
    number: "02",
    collection: "Men",
    eyebrow: "The Essentials",
    headline: ["Effortless", "Everyday"],
    description: "Modern essentials. Timeless silhouettes.",
    cta: { label: "Explore Men", href: "/shop?gender=men" },
    secondary: { label: "Shirts & polos", href: "/shop?gender=men&subcategory=shirts" },
    images: {
      main: { id: 6626999, alt: "Model in a cream overshirt and trousers in warm studio light", focus: "50% 30%" },
      front: { id: 7764014, alt: "Model in a white shirt and black trousers in a grey studio", focus: "50% 20%" },
      back: { id: 9255736, alt: "Group of models in neutral beige and white outfits", focus: "50% 30%" },
    },
  },
  {
    number: "03",
    collection: "Outerwear",
    eyebrow: "Autumn / Winter",
    headline: ["The Winter", "Edit"],
    description: "Layer up with this season's essentials.",
    cta: { label: "Shop Outerwear", href: "/shop?subcategory=outerwear" },
    secondary: { label: "Knitwear", href: "/shop?subcategory=knitwear" },
    images: {
      main: { id: 9563823, alt: "Model in a long wool coat walking through a snowy forest", focus: "50% 35%" },
      front: { id: 8360771, alt: "Model in a black longline coat in a snowy landscape", focus: "50% 30%" },
      back: { id: 10955935, alt: "Model in a cream teddy coat among snowy trees", focus: "50% 30%" },
    },
  },
];

export const pexelsUrl = (id: number, width: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

/**
 * Shared by the DOM composition and the WebGL scene so both render the same layout.
 * cx/cy/h are fractions of the composition box; z is world depth; parallax scales pointer response.
 */
export const LAYERS: {
  key: LayerKey;
  cx: number;
  cy: number;
  h: number;
  z: number;
  rotY: number;
  rotZ: number;
  parallax: number;
  delay: number;
}[] = [
  { key: "back", cx: 0.8, cy: 0.28, h: 0.46, z: -1.4, rotY: -0.14, rotZ: 0.012, parallax: 0.35, delay: 260 },
  { key: "main", cx: 0.5, cy: 0.5, h: 0.9, z: 0, rotY: -0.05, rotZ: 0, parallax: 0.6, delay: 0 },
  { key: "front", cx: 0.14, cy: 0.78, h: 0.36, z: 1.1, rotY: 0.11, rotZ: -0.01, parallax: 1, delay: 140 },
];

export const PLANE_ASPECT = 3 / 4;
export const AUTOPLAY_MS = 7000;
