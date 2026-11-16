import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { Product } from "@/types";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllHref: string;
}

export function ProductSection({
  title,
  products,
  viewAllHref,
}: ProductSectionProps) {
  return (
    <section className="shopco-section">
      <div className="shopco-container">
        <SectionHeader title={title} className="mb-10" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center justify-center border border-gray-300 text-sm font-medium px-16 py-3.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
