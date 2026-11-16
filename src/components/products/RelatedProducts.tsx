import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export function RelatedProducts({
  products,
  title = "YOU MAY ALSO LIKE",
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-[#EEEEEC] pt-16 editorial-section">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="eyebrow text-[#B8A99A] mb-3">More From Us</p>
          <h2
            className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            {title}
          </h2>
        </div>
        <Link
          href="/shop"
          className="eyebrow text-[#292929] hover:text-black transition-colors border-b border-[#292929] hover:border-black pb-0.5 hidden sm:block"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
