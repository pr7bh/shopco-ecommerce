import { siteConfig } from "@/config/site";

export function BrandBar() {
  const brands = [...siteConfig.brands, ...siteConfig.brands];

  return (
    <div className="bg-black overflow-hidden py-7">
      <div className="relative flex">
        <div className="marquee-track flex items-center gap-16 whitespace-nowrap">
          {brands.map((brand, i) => (
            <span
              key={i}
              className="text-white font-display font-bold text-xl md:text-2xl tracking-wider flex-shrink-0"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
