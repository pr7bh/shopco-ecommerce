"use client";

import { useId, useRef, useState } from "react";
import { createTimeline } from "animejs";
import Magnet from "@/components/reactbits/Magnet";
import { ArrowGlyph } from "@/components/common/ArrowGlyph";
import { useInViewMotion } from "@/hooks/useInViewMotion";
import { $, blurIn, fadeUp, prepareBlur, prepareFade } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "shopco-newsletter";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; email: string }
  | { kind: "duplicate"; email: string }
  | { kind: "error"; message: string };

function saveLocally(email: string): "saved" | "exists" {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const list: string[] = raw ? JSON.parse(raw) : [];
  if (list.includes(email)) return "exists";
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, email]));
  return "saved";
}

export function NewsletterSection() {
  const ref = useRef<HTMLElement>(null);
  const inputId = useId();
  const errorId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useInViewMotion(ref, {
    threshold: 0.3,
    prepare: (root) => {
      prepareBlur($(root, ".nl-word"));
      prepareFade($(root, ".nl-meta"));
    },
    play: (root) => {
      const tl = createTimeline();
      blurIn(tl, $(root, ".nl-word"), 0, 100);
      fadeUp(tl, $(root, ".nl-meta"), 400, 80);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setStatus({ kind: "error", message: "Please enter a valid email address, like name@example.com." });
      return;
    }
    setStatus({ kind: "loading" });
    // The save is instant (no backend); hold the loading state briefly so it reads as feedback, not a flicker.
    await new Promise((r) => setTimeout(r, 450));
    try {
      const result = saveLocally(value);
      setStatus(result === "saved" ? { kind: "success", email: value } : { kind: "duplicate", email: value });
      if (result === "saved") setEmail("");
    } catch {
      setStatus({ kind: "error", message: "We couldn't save that on this device — your browser may be blocking storage." });
    }
  }

  const invalid = status.kind === "error";
  const loading = status.kind === "loading";
  const done = status.kind === "success" || status.kind === "duplicate";

  return (
    <section
      id="newsletter"
      ref={ref}
      aria-labelledby="newsletter-heading"
      className="scroll-mt-24 bg-black py-[clamp(4.5rem,9vw,8rem)] text-white"
    >
      <div className="shopco-container grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="nl-meta text-[11px] tracking-[0.22em] uppercase text-white/45">Newsletter</p>
          <h2
            id="newsletter-heading"
            className="mt-5 font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2.75rem,7vw,6rem)]"
            style={{ fontFamily: "var(--font-hero)" }}
          >
            <span className="block">
              <span className="nl-word inline-block">Stay</span> <span className="nl-word inline-block">in</span>
            </span>
            <span className="nl-word inline-block text-[#C8BBAA]">the loop.</span>
          </h2>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-10">
          <p className="nl-meta max-w-md text-base leading-relaxed text-white/70">
            Discover new collections, seasonal edits and the latest from SHOP.CO.
          </p>

          <div className="nl-meta mt-10">
            {done ? (
              <div role="status" className="border-l-2 border-[#C8BBAA] pl-4">
                <p className="text-lg font-medium" style={{ fontFamily: "var(--font-display)" }}>
                  {status.kind === "success" ? "You're on the list." : "You're already on the list."}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {status.email} is saved on this device. This is a demo store, so no emails will be sent.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus({ kind: "idle" })}
                  className="ed-link mt-5 text-white"
                >
                  Use another email
                  <ArrowGlyph />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor={inputId} className="text-[11px] tracking-[0.22em] uppercase text-white/50">
                  Email address
                </label>
                <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end">
                  <input
                    id={inputId}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    disabled={loading}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? errorId : undefined}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (invalid) setStatus({ kind: "idle" });
                    }}
                    placeholder="name@example.com"
                    className={cn(
                      "w-full flex-1 border-b bg-transparent pb-3 text-lg text-white outline-none transition-colors placeholder:text-white/25 disabled:opacity-60",
                      invalid ? "border-[#ff8a80]" : "border-white/30 focus:border-white"
                    )}
                  />
                  <Magnet padding={50} magnetStrength={4} maxOffset={8} disabled={loading}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex min-w-[10.5rem] items-center justify-center gap-3 bg-white px-7 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase text-black transition-colors hover:bg-[#F7F6F3] disabled:cursor-wait"
                    >
                      {loading ? (
                        <>
                          <span aria-hidden className="h-3 w-3 animate-spin rounded-full border border-black/30 border-t-black" />
                          Subscribing
                        </>
                      ) : (
                        <>
                          Subscribe
                          <ArrowGlyph className="transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </Magnet>
                </div>
                <p id={errorId} role="alert" className="mt-3 min-h-[1.25rem] text-sm text-[#ff8a80]">
                  {invalid ? status.message : ""}
                </p>
              </form>
            )}
            <p className="mt-6 text-xs text-white/35">Demo store: your email stays in this browser and is never sent anywhere.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
