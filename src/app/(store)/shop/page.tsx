import { Suspense } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortBar } from "@/components/shop/SortBar";
import { ALL_PRODUCTS, filterAndSort } from "@/lib/products";

const PAGE_SIZE = 9;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    colors?: string;
    sizes?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
}

export const instant = false;

export const metadata = {
  title: "Shop | SHOP.CO",
  description: "Browse our full collection of premium fashion.",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;

  const filtered = filterAndSort(ALL_PRODUCTS, {
    category: sp.category,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    colors: sp.colors?.split(",").filter(Boolean),
    sizes: sp.sizes?.split(",").filter(Boolean),
    sort: sp.sort,
    q: sp.q,
  });

  const page = Math.max(1, Number(sp.page ?? 1));
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const title = sp.category
    ? sp.category.charAt(0).toUpperCase() + sp.category.slice(1).replace(/-/g, " ")
    : "All Products";

  return (
    <div className="shopco-container py-10">
      {/* Page heading */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        {sp.q && (
          <p className="text-sm text-gray-500 mt-1">
            Search results for &ldquo;{sp.q}&rdquo;
          </p>
        )}
      </div>

      <div className="flex gap-8 items-start">
        {/* Sidebar — Suspense required because it uses useSearchParams */}
        <Suspense fallback={null}>
          <FilterSidebar />
        </Suspense>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={null}>
            <SortBar total={total} page={page} pageSize={PAGE_SIZE} />
          </Suspense>

          {paginated.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              searchParams={sp}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  function buildHref(p: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "page") params.set(k, v);
    }
    if (p > 1) params.set("page", String(p));
    const q = params.toString();
    return `/shop${q ? `?${q}` : ""}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      <a
        href={page > 1 ? buildHref(page - 1) : undefined}
        aria-disabled={page <= 1}
        className={`px-4 py-2 text-sm border rounded-full transition-colors ${
          page <= 1
            ? "border-gray-100 text-gray-300 pointer-events-none"
            : "border-gray-200 hover:border-black"
        }`}
      >
        ← Previous
      </a>
      <div className="flex gap-1">
        {pages.map((p) => (
          <a
            key={p}
            href={buildHref(p)}
            className={`w-9 h-9 flex items-center justify-center text-sm rounded-full border transition-colors ${
              p === page
                ? "bg-black text-white border-black"
                : "border-gray-200 hover:border-black"
            }`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </a>
        ))}
      </div>
      <a
        href={page < totalPages ? buildHref(page + 1) : undefined}
        aria-disabled={page >= totalPages}
        className={`px-4 py-2 text-sm border rounded-full transition-colors ${
          page >= totalPages
            ? "border-gray-100 text-gray-300 pointer-events-none"
            : "border-gray-200 hover:border-black"
        }`}
      >
        Next →
      </a>
    </nav>
  );
}
