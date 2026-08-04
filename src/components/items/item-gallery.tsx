"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ItemGalleryProps = {
  images: { url: string; alt: string }[];
};

export function ItemGallery({ images }: ItemGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted shadow-soft">
        <Image src={current.url} alt={current.alt} fill className="object-cover" priority />
      </div>
      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2",
                active === index ? "border-primary" : "border-transparent",
              )}
              aria-label={image.alt}
            >
              <Image src={image.url} alt={image.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
