"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface HeroImage {
  url: string;
  altAr: string;
  altEn: string;
}

export function HeroCarousel({
  images,
  fallback,
  companyName,
}: {
  images: HeroImage[];
  fallback: string;
  companyName: string;
}) {
  const allImages = images.length > 0 ? images : [{ url: fallback, altAr: companyName, altEn: companyName }];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (paused || allImages.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused, allImages.length]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {allImages.map((img, i) => (
        <div
          key={img.url}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === current ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={img.url}
            alt={img.altEn || img.altAr || companyName}
            fill
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />

      {allImages.length > 1 && (
        <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
