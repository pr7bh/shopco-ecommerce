import Link from "next/link";

export function BrandPhilosophy() {
  return (
    <section className="bg-black text-white py-24 md:py-36 overflow-hidden">
      <div className="shopco-container">
        <div className="max-w-5xl">
          <div className="eyebrow text-white/40 mb-8">OUR PHILOSOPHY</div>
          <h2
            className="font-black uppercase leading-none tracking-tight mb-10"
            style={{
              fontFamily: "var(--font-hero)",
              fontSize: "clamp(2rem, 6vw, 5.5rem)",
            }}
          >
            STYLE IS NOT
            <br />
            ABOUT MORE.
            <br />
            <span className="text-[#B8A99A]">
              IT&rsquo;S ABOUT WHAT
              <br />
              MATTERS.
            </span>
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-lg mb-10">
            Every piece in our collection is chosen with intention. We curate
            thoughtfully, design purposefully, and deliver fashion that feels
            right.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 border border-white/30 text-white text-xs tracking-widest uppercase px-8 py-4 hover:border-white transition-colors"
          >
            DISCOVER OUR STORY
          </Link>
        </div>
      </div>
    </section>
  );
}
