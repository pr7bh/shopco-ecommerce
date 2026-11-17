import type { ReactNode } from "react";

export interface InfoSection {
  id: string;
  heading: string;
  body: ReactNode;
}

export function InfoPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: InfoSection[] }) {
  return (
    <div className="shopco-container py-16 md:py-24">
      <p className="text-[11px] tracking-[0.22em] uppercase text-black/45">{eyebrow}</p>
      <h1
        className="mt-4 font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.6rem,7vw,5.5rem)]"
        style={{ fontFamily: "var(--font-hero)" }}
      >
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-black/65 md:text-lg">{intro}</p>

      <div className="mt-14 grid gap-10 border-t border-black/10 pt-10 lg:grid-cols-12 lg:gap-8">
        <nav aria-label="On this page" className="lg:col-span-3">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:sticky lg:top-24 lg:flex-col">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-black/55 underline-offset-4 transition-colors hover:text-black hover:underline">
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-14 lg:col-span-8 lg:col-start-5">
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28">
              <h2 id={`${s.id}-h`} className="text-2xl font-bold tracking-[-0.02em]" style={{ fontFamily: "var(--font-display)" }}>
                {s.heading}
              </h2>
              <div className="mt-4 max-w-2xl space-y-4 text-[15px] leading-relaxed text-black/70">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
