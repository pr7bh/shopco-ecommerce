import Image from "next/image";
import Link from "next/link";
import { STYLE_CATEGORIES } from "@/lib/mock-data";
import { SectionHeader } from "@/components/common/SectionHeader";

export function StyleCategoryGrid() {
  return (
    <section className="shopco-section">
      <div className="shopco-container">
        <div className="bg-[#F0F0F0] rounded-[var(--radius-card-lg)] p-8 md:p-12">
          <SectionHeader title="Browse by Dress Style" className="mb-8 md:mb-10" />

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {STYLE_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group relative overflow-hidden rounded-[var(--radius-card)] bg-white"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-5 text-white font-display font-bold text-xl md:text-2xl drop-shadow-sm">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
