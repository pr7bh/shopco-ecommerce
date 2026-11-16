"use client";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function useScrollReveal(options?: {
  selector?: string;
  delay?: number;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = options?.selector
      ? Array.from(el.querySelectorAll<HTMLElement>(options.selector))
      : [el];

    targets.forEach((t) => {
      t.style.opacity = "0";
      t.style.transform = "translateY(28px)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          animate(targets, {
            opacity: [0, 1],
            translateY: [28, 0],
            duration: 700,
            delay: stagger(options?.staggerDelay ?? 80, {
              start: options?.delay ?? 0,
            }),
            easing: "easeOutExpo",
          });
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.selector, options?.delay, options?.staggerDelay]);

  return ref;
}
