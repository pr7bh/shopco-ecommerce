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
    <div className="flex gap-4">
      {/* Thumbnail strip */}
      <div className="flex flex-col gap-3 w-20 shrink-0">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setShow3d(false); }}
            className={cn(
              "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
              active === i && !show3d ? "border-black" : "border-transparent hover:border-gray-300"
            )}
          >
            <Image
              src={src}
              alt={`${name} thumbnail ${i + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
        {model3dUrl && (
          <button
            onClick={() => setShow3d(true)}
            className={cn(
              "w-20 h-20 rounded-xl border-2 transition-all flex items-center justify-center bg-gray-50 text-xs font-medium text-gray-600",
              show3d ? "border-black" : "border-transparent hover:border-gray-300"
            )}
          >
            3D
          </button>
        )}
      </div>

      {/* Main view */}
      <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
        {show3d && model3dUrl ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            {/* ProductViewerLoader is dynamically imported where needed */}
            Loading 3D…
          </div>
        ) : (
          <Image
            src={images[active]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        )}
      </div>
    </div>
  );
}
