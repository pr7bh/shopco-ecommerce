"use client";

import { useEffect, useRef, type RefObject } from "react";
import { REDUCED_MOTION } from "@/lib/motion";

/**
 * Calls `onProgress(p)` (0 = section just entering at the bottom, 1 = fully left at the top)
 * once per animation frame while scrolling. The scroll listener is attached only while the
 * section is on screen, and never under reduced motion.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onProgress: (progress: number, root: T) => void
) {
  const callback = useRef(onProgress);
  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia(REDUCED_MOTION).matches) return;
    let raf = 0;
    let listening = false;
    const update = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      callback.current(p, root);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      const method = on ? "addEventListener" : "removeEventListener";
      window[method]("scroll", onScroll, { passive: true } as AddEventListenerOptions);
      window[method]("resize", onScroll);
      if (on) onScroll();
    };
    const io = new IntersectionObserver(([entry]) => listen(entry.isIntersecting), { rootMargin: "10% 0px" });
    io.observe(root);
    return () => {
      io.disconnect();
      listen(false);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}
