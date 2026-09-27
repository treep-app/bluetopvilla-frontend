"use client";

import { Expand } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Lightbox } from "@/components/lightbox";
import { GALLERY_FILTERS, type Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

type Props = {
  photos: Photo[];
  filters?: boolean;
  layout?: "editorial" | "hero";
};

function tileClass(index: number, layout: "editorial" | "hero", count: number) {
  if (layout === "hero" || count === 1) {
    return index === 0 ? "aspect-[16/9] md:col-span-3" : "aspect-[4/3]";
  }
  if (index === 0) return "aspect-[4/3] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[560px]";
  if (index === 3 || index === 7) return "aspect-[16/10] md:col-span-2";
  return "aspect-square";
}

export function PhotoGallery({ photos, filters = false, layout = "editorial" }: Props) {
  const [filter, setFilter] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? photos : photos.filter((photo) => photo.category === filter)),
    [filter, photos],
  );

  const active = openIndex == null ? null : visible[openIndex];

  return (
    <div>
      {filters ? (
        <div className="flex flex-wrap gap-2">
          {GALLERY_FILTERS.filter((item) => item.id === "all" || photos.some((photo) => photo.category === item.id)).map(
            (item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFilter(item.id);
                  setOpenIndex(null);
                }}
                className={cn("btn", filter === item.id ? "btn-gold" : "btn-ghost border-sand/25 text-sand")}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      ) : null}

      <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3", filters && "mt-10")}>
        {visible.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className={cn(
              "group relative overflow-hidden bg-ink text-left",
              tileClass(index, layout, visible.length),
            )}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition duration-500 group-hover:opacity-100 md:opacity-0" />
            <div className="absolute inset-3 border border-lamp/40 transition duration-500 group-hover:border-lamp md:border-lamp/0" />
            <span className="btn-gold-icon absolute right-4 top-4 h-11 w-11">
              <Expand className="h-4 w-4" />
            </span>
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-[0.68rem] tracking-[0.22em] uppercase text-lamp">View photograph</p>
              {photo.label ? <p className="display mt-1 text-2xl text-sand">{photo.label}</p> : null}
            </div>
          </button>
        ))}
      </div>

      {active ? (
        <Lightbox
          photos={visible}
          index={openIndex ?? 0}
          onClose={() => setOpenIndex(null)}
          onChange={setOpenIndex}
        />
      ) : null}
    </div>
  );
}
