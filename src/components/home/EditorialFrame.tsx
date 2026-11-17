import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { pexelsUrl } from "./hero/campaigns";

export interface EditorialImage {
  id: number;
  alt: string;
  focus?: string;
}

interface EditorialFrameProps {
  image: EditorialImage;
  /** Optional second photo that crossfades in when the surrounding `.group` is hovered. */
  hover?: EditorialImage;
  sizes: string;
  className?: string;
  /** Scroll parallax strength; multiplies the section's --py value. */
  depth?: number;
  width?: number;
}

/**
 * Photo frame used across the homepage: clip-mask reveal target ([data-reveal-frame]),
 * scale wrapper for the reveal ([data-mask-inner]), CSS translate for scroll parallax,
 * and .ed-photo for hover zoom / cursor drift.
 */
export function EditorialFrame({ image, hover, sizes, className, depth = 0, width = 1400 }: EditorialFrameProps) {
  return (
    <div className={cn("ed-frame", className)} data-reveal-frame>
      <div
        data-mask-inner
        className="absolute inset-x-0 -inset-y-[7%]"
        style={{ translate: `0 calc(var(--py, 0) * ${depth} * 1px)` } as CSSProperties}
      >
        <Image
          src={pexelsUrl(image.id, width)}
          alt={image.alt}
          fill
          sizes={sizes}
          className="ed-photo object-cover"
          style={{ objectPosition: image.focus }}
        />
        {hover && (
          <Image
            src={pexelsUrl(hover.id, width)}
            alt=""
            fill
            sizes={sizes}
            className="ed-photo ed-photo-alt object-cover"
            style={{ objectPosition: hover.focus }}
          />
        )}
      </div>
    </div>
  );
}
