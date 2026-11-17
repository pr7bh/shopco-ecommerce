import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortBar } from "@/components/shop/SortBar";
import { ALL_PRODUCTS, filterAndSort } from "@/lib/products";

const PAGE_SIZE = 48;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    minPrice?: string;
    maxPrice?: string;
    colors?: string;
    sizes?: string;
    sort?: string;
    q?: string;
    page?: string;
    gender?: string;
  }>;
}

export const instant = false;

export const metadata = {
  title: "Shop All",
  description: "Browse our full collection of premium fashion for women, men and accessories.",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;

  const filtered = filterAndSort(ALL_PRODUCTS, {
    category: sp.category,
    subcategory: sp.subcategory,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    colors: sp.colors?.split(",").filter(Boolean),
    sizes: sp.sizes?.split(",").filter(Boolean),
    sort: sp.sort,
    q: sp.q,
    gender: sp.gender,
  });

  const page = Math.max(1, Number(sp.page ?? 1));
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const title = sp.subcategory
    ? sp.subcategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : sp.gender === "unisex"
    ? "Accessories"
    : sp.gender
    ? sp.gender.charAt(0).toUpperCase() + sp.gender.slice(1)
    : sp.category
    ? sp.category.charAt(0).toUpperCase() + sp.category.slice(1).replace(/-/g, " ")
    : "All Products";

  function genderHref(g?: string) {
    const params = new URLSearchParams();
    if (sp.category) params.set("category", sp.category);
    if (sp.subcategory) params.set("subcategory", sp.subcategory);
    if (sp.sort) params.set("sort", sp.sort);
    if (sp.q) params.set("q", sp.q);
    if (g) params.set("gender", g);
    const q = params.toString();
    return `/shop${q ? `?${q}` : ""}`;
  }

  return (
    <>
      <div className="shopco-container pt-8 md:pt-12">
        <p className="eyebrow text-[#B8A99A] mb-2">Shop</p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1
            className="text-2xl md:text-4xl font-black uppercase tracking-tight"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            {title}
          </h1>
          <span className="text-xs text-[#B8A99A]">
            {total} {total === 1 ? "item" : "items"}
          </span>
        </div>
        {sp.q && (
          <p className="text-sm text-[#B8A99A] mt-2">
            Search results for &ldquo;{sp.q}&rdquo;
          </p>
        )}
      </div>

      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-[#EEEEEC] mt-6">
        <div className="shopco-container flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3">
          <nav className="flex w-full sm:w-auto min-w-0 -mx-3 overflow-x-auto no-scrollbar" aria-label="Department">
            {[
              { label: "All", value: undefined },
              { label: "Women", value: "women" },
              { label: "Men", value: "men" },
              { label: "Accessories", value: "unisex" },
            ].map(({ label, value }) => {
              const active = sp.gender === value || (!sp.gender && value === undefined);
              return (
                <Link
                  key={label}
                  href={genderHref(value)}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 text-[11px] tracking-[0.12em] uppercase whitespace-nowrap transition-colors ${
                    active
                      ? "text-black font-semibold underline underline-offset-[6px]"
                      : "text-[#8A8A8A] hover:text-black"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Suspense fallback={null}>
              <FilterSidebar />
            </Suspense>
            <Suspense fallback={null}>
              <SortBar />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="shopco-container pt-6 pb-16">
        <div>
          <div>
            {paginated.length === 0 ? (
              <div className="text-center py-24">
                <p className="eyebrow text-[#B8A99A] mb-3">No results</p>
                <p className="text-sm text-gray-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-8 md:gap-x-4 md:gap-y-12">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

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
    </>
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
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      <a
        href={page > 1 ? buildHref(page - 1) : undefined}
        aria-disabled={page <= 1}
        className={`px-5 py-2.5 eyebrow border transition-colors ${
          page <= 1
            ? "border-[#EEEEEC] text-[#B8A99A] pointer-events-none"
            : "border-[#292929] text-[#292929] hover:bg-black hover:text-white hover:border-black"
        }`}
      >
        ← Prev
      </a>
      <div className="flex gap-1">
        {pages.map((p) => (
          <a
            key={p}
            href={buildHref(p)}
            className={`w-9 h-9 flex items-center justify-center text-xs font-bold border transition-colors ${
              p === page
                ? "bg-black text-white border-black"
                : "border-[#EEEEEC] text-[#292929] hover:border-black"
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
        className={`px-5 py-2.5 eyebrow border transition-colors ${
          page >= totalPages
            ? "border-[#EEEEEC] text-[#B8A99A] pointer-events-none"
            : "border-[#292929] text-[#292929] hover:bg-black hover:text-white hover:border-black"
        }`}
      >
        Next →
      </a>
    </nav>
  );
}
