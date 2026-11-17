import type { PointerEvent as ReactPointerEvent } from "react";
import { stagger, utils, type Timeline } from "animejs";

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;

export const $ = (root: ParentNode, selector: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(selector));

const MASK_HIDDEN = "inset(100% 0% 0% 0%)";
const MASK_SHOWN = "inset(0% 0% 0% 0%)";

/** Image frames rise out of a bottom-anchored clip mask while the photo settles from a slight zoom. */
export function prepareMask(frames: HTMLElement[]) {
  if (!frames.length) return;
  utils.set(frames, { clipPath: MASK_HIDDEN });
  const imgs = frames.flatMap((f) => $(f, "[data-mask-inner]"));
  if (imgs.length) utils.set(imgs, { scale: 1.14 });
}

export function maskIn(tl: Timeline, frames: HTMLElement[], at: number, gap = 160) {
  if (!frames.length) return tl;
  tl.add(frames, { clipPath: [MASK_HIDDEN, MASK_SHOWN], translateY: [40, 0], duration: 1300, delay: stagger(gap), ease: "inOutQuart" }, at);
  const imgs = frames.flatMap((f) => $(f, "[data-mask-inner]"));
  if (imgs.length) tl.add(imgs, { scale: [1.14, 1], duration: 1800, delay: stagger(gap), ease: "outQuart" }, at);
  return tl;
}

export function prepareFade(els: HTMLElement[]) {
  if (els.length) utils.set(els, { opacity: 0, translateY: 24 });
}

export function fadeUp(tl: Timeline, els: HTMLElement[], at: number, gap = 80) {
  if (els.length) tl.add(els, { opacity: [0, 1], translateY: [24, 0], duration: 900, delay: stagger(gap), ease: "outQuart" }, at);
  return tl;
}

export function prepareBlur(els: HTMLElement[]) {
  if (els.length) utils.set(els, { opacity: 0 });
}

/** Same keyframes as the hero headline (React Bits BlurText "blur" effect), so the page shares one motion language. */
export function blurIn(tl: Timeline, els: HTMLElement[], at: number, gap = 70) {
  if (els.length)
    tl.add(
      els,
      {
        opacity: [0, 0.5, 1],
        filter: ["blur(12px)", "blur(5px)", "blur(0px)"],
        translateY: [36, -3, 0],
        duration: 1100,
        delay: stagger(gap),
        ease: "outQuart",
      },
      at
    );
  return tl;
}

/** Writes normalised pointer position (-1…1) to CSS vars for cursor-following image movement. Mouse only. */
export function trackPointer(e: ReactPointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
  el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
}

export function resetPointer(e: ReactPointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--mx", "0");
  e.currentTarget.style.setProperty("--my", "0");
}
