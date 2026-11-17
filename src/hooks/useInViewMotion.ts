"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createScope } from "animejs";
import { REDUCED_MOTION } from "@/lib/motion";

interface InViewMotionOptions<T extends HTMLElement> {
  /** Sets the hidden start state; runs on mount, before the section is visible. */
  prepare?: (root: T) => void;
  /** Builds the entrance; runs once, the first time the section enters the viewport. */
  play: (root: T) => void;
  threshold?: number;
  rootMargin?: string;
}

/**
 * One IntersectionObserver per section. All animations live in an anime.js scope that is
 * reverted on unmount; under reduced motion nothing is hidden or animated.
 */
export function useInViewMotion<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { prepare, play, threshold = 0.18, rootMargin = "0px 0px -8% 0px" }: InViewMotionOptions<T>
) {
  const prepareRef = useRef(prepare);
  const playRef = useRef(play);
  useEffect(() => {
    prepareRef.current = prepare;
    playRef.current = play;
  });

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia(REDUCED_MOTION).matches) return;
    const scope = createScope({ root });
    scope.add(() => prepareRef.current?.(root));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        scope.add(() => playRef.current(root));
      },
      { threshold, rootMargin }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      scope.revert();
    };
  }, [ref, threshold, rootMargin]);
}
