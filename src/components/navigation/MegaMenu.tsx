import Image from "next/image";
import Link from "next/link";

interface MegaMenuProps {
  category: string;
  onClose: () => void;
}

const CLOTHING_LINKS = [
  { label: "T-shirts", href: "/shop?category=casual" },
  { label: "Jeans", href: "/shop?category=casual" },
  { label: "Shirts", href: "/shop?category=formal" },
  { label: "Shorts", href: "/shop?category=casual" },
  { label: "Hoodies", href: "/shop?category=casual" },
];

const ACCESSORIES_LINKS = [
  { label: "Belts", href: "/shop" },
  { label: "Bags", href: "/shop" },
  { label: "Scarves", href: "/shop" },
  { label: "Hats", href: "/shop" },
];

const HIGHLIGHTS_LINKS = [
  { label: "New Arrivals →", href: "/shop?sort=newest" },
  { label: "Sale →", href: "/shop?category=sale" },
  { label: "Trending →", href: "/shop" },
];

const IMAGES: Record<string, string> = {
  WOMEN:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop&auto=format",
  MEN: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=400&fit=crop&auto=format",
};

export function MegaMenu({ category, onClose }: MegaMenuProps) {
  const imgSrc =
    IMAGES[category] ??
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop&auto=format";

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
                {CLOTHING_LINKS.map((l) => (
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
