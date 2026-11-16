"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  model3dUrl?: string;
}

export function ProductGallery({ images, name, model3dUrl }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [show3d, setShow3d] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  return (
    <>
      <div className="flex gap-3">
        {/* Thumbnail strip */}
        <div className="flex flex-col gap-2 w-[72px] shrink-0">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setShow3d(false); }}
              aria-label={`View image ${i + 1}`}
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
        <div
          className="flex-1 relative aspect-[3/4] bg-[#F7F6F3] overflow-hidden group cursor-zoom-in"
          onClick={() => { if (!show3d) setFullscreen(true); }}
        >
          {show3d && model3dUrl ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
              Loading 3D…
            </div>
          ) : (
            <>
              <Image
                src={images[active]}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover"
                priority
              />
              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ZoomIn size={16} className="text-[#292929]" strokeWidth={1.5} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/92 z-[200] flex items-center justify-center cursor-zoom-out"
          onClick={() => setFullscreen(false)}
        >
          <div
            className="relative w-[90vw] h-[90vh] max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={name}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2"
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
          >
            <X size={28} strokeWidth={1.5} />
          </button>

          {/* Thumbnail strip in fullscreen */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActive(i); }}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative w-14 h-[72px] overflow-hidden transition-all",
                    active === i ? "outline outline-2 outline-white" : "opacity-50 hover:opacity-80"
                  )}
                >
                  <Image src={src} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
