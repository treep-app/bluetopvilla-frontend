"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo, useState } from "react";

type ImageItem = {
  id: string;
  url: string;
  alt: string | null;
};

const heroHeight = "h-[220px] sm:h-[260px] md:h-[300px]";

export function RoomDetailGallery({
  images,
  roomName,
}: {
  images: ImageItem[];
  roomName: string;
}) {
  const slides = useMemo(() => {
    if (images.length > 0) return images;
    return [{ id: "fallback", url: "/images/room-suite.jpg", alt: roomName }];
  }, [images, roomName]);

  const [active, setActive] = useState(0);
  const current = slides[active] ?? slides[0];

  return (
    <div className="bg-ink p-2 sm:p-2.5">
      <div className={`relative ${heroHeight} overflow-hidden rounded-xl`}>
        <Image
          key={current.id}
          src={current.url}
          alt={current.alt ?? roomName}
          fill
          className="object-cover object-center transition-opacity duration-500"
          priority={active === 0}
          sizes="(max-width: 1024px) 100vw, 900px"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-ink/20"
          aria-hidden
        />
        {slides.length > 1 ? (
          <p className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/60 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-sand/90 uppercase backdrop-blur-sm">
            {active + 1} / {slides.length}
          </p>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <ul className="mt-2.5 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {slides.map((image, index) => {
            const selected = index === active;
            return (
              <li key={image.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={selected}
                  className={cn(
                    "relative h-14 w-[4.5rem] overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-24",
                    selected ? "border-lamp opacity-100 ring-2 ring-lamp/30" : "border-white/15 opacity-65 hover:border-white/40 hover:opacity-100",
                  )}
                >
                  <Image src={image.url} alt="" fill className="object-cover" sizes="96px" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
