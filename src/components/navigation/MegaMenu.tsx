import Image from "next/image";
import Link from "next/link";

interface MegaMenuProps {
  category: string;
  onClose: () => void;
}

const WOMEN_CLOTHING = [
  { label: "T-Shirts", href: "/shop?gender=women&subcategory=basic-tshirts" },
  { label: "Dresses", href: "/shop?gender=women&subcategory=dresses" },
  { label: "Jeans & Denim", href: "/shop?gender=women&subcategory=jeans" },
  { label: "Hoodies", href: "/shop?gender=women&subcategory=hoodies-sweatshirts" },
  { label: "Knitwear", href: "/shop?gender=women&subcategory=knitwear" },
  { label: "Outerwear", href: "/shop?gender=women&subcategory=outerwear" },
];

const MEN_CLOTHING = [
  { label: "T-Shirts", href: "/shop?gender=men&subcategory=basic-tshirts" },
  { label: "Shirts", href: "/shop?gender=men&subcategory=shirts" },
  { label: "Jeans & Denim", href: "/shop?gender=men&subcategory=jeans" },
  { label: "Hoodies", href: "/shop?gender=men&subcategory=hoodies-sweatshirts" },
  { label: "Outerwear", href: "/shop?gender=men&subcategory=outerwear" },
];

const ACCESSORIES_LINKS = [
  { label: "All Accessories", href: "/shop?gender=unisex" },
  { label: "Bags", href: "/shop?gender=unisex&subcategory=accessories" },
  { label: "Hats & Caps", href: "/shop?gender=unisex&subcategory=accessories" },
  { label: "Jewellery", href: "/shop?gender=unisex&subcategory=accessories" },
];

const HIGHLIGHTS_LINKS = [
  { label: "New Arrivals →", href: "/shop?sort=newest" },
  { label: "Sale →", href: "/shop?category=sale" },
  { label: "Trending →", href: "/shop?sort=rating" },
];

const IMAGES: Record<string, string> = {
  WOMEN:
    "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
  MEN: "https://images.pexels.com/photos/1844012/pexels-photo-1844012.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
};

export function MegaMenu({ category, onClose }: MegaMenuProps) {
  const imgSrc =
    IMAGES[category] ??
    "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop";
  const clothingLinks = category === "MEN" ? MEN_CLOTHING : WOMEN_CLOTHING;

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white border-b border-[#EEEEEC] shadow-lg z-40"
      onMouseLeave={onClose}
    >
      <div className="shopco-container py-10">
        <div className="grid grid-cols-[1fr_320px] gap-10">
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
                {HIGHLIGHTS_LINKS.map((l) => (
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
            <div className="relative h-[200px] overflow-hidden rounded-sm img-zoom">
              <Image
                src={imgSrc}
                alt={`${category} collection`}
                fill
                sizes="320px"
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
