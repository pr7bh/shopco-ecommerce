import Image from "next/image";
import Link from "next/link";

export function SeasonalBanner() {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop&auto=format"
        alt="The Winter Edit"
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <div className="eyebrow text-white/70 mb-6">SEASONAL EDIT</div>
        <h2
          className="font-black uppercase leading-none tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-hero)",
            fontSize: "clamp(3rem, 8vw, 8rem)",
          }}
        >
          THE
          <br />
          WINTER
          <br />
          EDIT
        </h2>
        <p className="text-white/80 max-w-md mb-10 text-sm md:text-base leading-relaxed">
          Warmth meets elegance. Discover our curated selection of winter
          essentials crafted for the season.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-3 bg-white text-black text-xs tracking-widest uppercase px-10 py-4 hover:bg-[#F7F6F3] transition-colors"
        >
          SHOP THE COLLECTION
        </Link>
      </div>
    </section>
  );
}
