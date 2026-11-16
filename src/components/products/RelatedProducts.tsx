import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export function RelatedProducts({
  products,
  title = "You Might Also Like",
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-gray-100 pt-14">
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl font-bold uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        <Link
          href="/shop"
          className="text-sm font-medium border border-gray-200 px-5 py-2 rounded-full hover:border-black transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
