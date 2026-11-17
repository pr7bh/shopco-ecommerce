import Image from "next/image";
import Link from "next/link";

interface MegaMenuProps {
  category: string;
  onClose: () => void;
}

const WOMEN_CLOTHING = [
  { label: "T-Shirts", href: "/shop?gender=women&subcategory=basic-tshirts" },
  { label: "Oversized Tees", href: "/shop?gender=women&subcategory=oversized-tshirts" },
  { label: "Shirts & Blouses", href: "/shop?gender=women&subcategory=shirts-blouses" },
  { label: "Dresses", href: "/shop?gender=women&subcategory=dresses" },
  { label: "Knitwear", href: "/shop?gender=women&subcategory=knitwear" },
  { label: "Hoodies & Sweatshirts", href: "/shop?gender=women&subcategory=hoodies-sweatshirts" },
  { label: "Jeans", href: "/shop?gender=women&subcategory=jeans" },
  { label: "Trousers & Skirts", href: "/shop?gender=women&subcategory=trousers-skirts" },
  { label: "Outerwear", href: "/shop?gender=women&subcategory=outerwear" },
];

const MEN_CLOTHING = [
  { label: "T-Shirts", href: "/shop?gender=men&subcategory=basic-tshirts" },
  { label: "Oversized Tees", href: "/shop?gender=men&subcategory=oversized-tshirts" },
  { label: "Shirts & Polos", href: "/shop?gender=men&subcategory=shirts" },
  { label: "Knitwear", href: "/shop?gender=men&subcategory=knitwear" },
  { label: "Hoodies & Sweatshirts", href: "/shop?gender=men&subcategory=hoodies-sweatshirts" },
  { label: "Trousers & Jeans", href: "/shop?gender=men&subcategory=bottoms" },
  { label: "Outerwear", href: "/shop?gender=men&subcategory=outerwear" },
];

const ACCESSORIES_LINKS = [
  { label: "All Accessories", href: "/shop?gender=unisex" },
  { label: "Bags", href: "/shop?subcategory=bags" },
  { label: "Caps & Hats", href: "/shop?subcategory=headwear" },
  { label: "Sunglasses", href: "/shop?subcategory=eyewear" },
  { label: "Belts & Wallets", href: "/shop?gender=unisex&sort=newest" },
];

const IMAGES: Record<string, { src: string; alt: string }> = {
  WOMEN: {
    src: "https://images.pexels.com/photos/14577586/pexels-photo-14577586.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop",
    alt: "Flat lay of a blush wool coat, cream knit and light-wash jeans",
  },
  MEN: {
    src: "https://images.pexels.com/photos/7679725/pexels-photo-7679725.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop",
    alt: "Leather and suede jackets hanging on a rail",
  },
};

export function MegaMenu({ category, onClose }: MegaMenuProps) {
  const gender = category === "MEN" ? "men" : "women";
  const img = IMAGES[category] ?? IMAGES.WOMEN;
  const clothingLinks = category === "MEN" ? MEN_CLOTHING : WOMEN_CLOTHING;
  const highlights = [
    { label: "New Arrivals", href: `/shop?gender=${gender}&sort=newest` },
    { label: "Bestsellers", href: `/shop?gender=${gender}&sort=rating` },
    { label: "Sale", href: `/shop?gender=${gender}&category=sale` },
    { label: `View all ${gender}`, href: `/shop?gender=${gender}` },
  ];

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white border-b border-[#EEEEEC] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.12)] z-40"
    >
      <div className="shopco-container py-10">
        <div className="grid grid-cols-[1fr_240px] gap-10">
          {/* Left: category columns */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="eyebrow text-gray-400 mb-4">Clothing</p>
              <ul className="space-y-2.5">
                {clothingLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="text-sm text-[#292929] hover:text-black hover:underline underline-offset-2 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow text-gray-400 mb-4">Accessories</p>
              <ul className="space-y-2.5">
                {ACCESSORIES_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="text-sm text-[#292929] hover:text-black hover:underline underline-offset-2 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow text-gray-400 mb-4">Highlights</p>
              <ul className="space-y-2.5">
                {highlights.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="text-sm font-medium text-black hover:underline underline-offset-2 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: editorial image */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F2F2F0] img-zoom">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
            <p className="eyebrow text-gray-400 mt-3">New Season Collection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
