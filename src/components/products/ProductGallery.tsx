"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  model3dUrl?: string;
}

export function ProductGallery({ images, name, model3dUrl }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [show3d, setShow3d] = useState(false);

  return (
    <div className="flex gap-3">
      {/* Thumbnail strip */}
      <div className="flex flex-col gap-2 w-[72px] shrink-0">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setShow3d(false); }}
            className={cn(
              "relative w-full aspect-[3/4] overflow-hidden transition-all duration-200",
              active === i && !show3d
                ? "outline outline-1 outline-black"
                : "opacity-60 hover:opacity-100"
            )}
          >
            <Image
              src={src}
              alt={`${name} view ${i + 1}`}
              fill
              sizes="72px"
              className="object-cover"
            />
          </button>
        ))}
        {model3dUrl && (
          <button
            onClick={() => setShow3d(true)}
            className={cn(
              "w-full aspect-square border transition-all flex items-center justify-center bg-[#F7F6F3] text-xs font-semibold tracking-widest",
              show3d ? "border-black text-black" : "border-transparent text-gray-400 hover:border-gray-300"
            )}
          >
            3D
          </button>
        )}
      </div>

      {/* Main image */}
      <div className="flex-1 relative aspect-[3/4] bg-[#F7F6F3] overflow-hidden">
        {show3d && model3dUrl ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Loading 3D…
          </div>
        ) : (
          <Image
            src={images[active]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
            priority
          />
        )}
      </div>
    </div>
  );
}
