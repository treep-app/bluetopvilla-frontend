"use client";

import { GalleryFilters } from "@/components/gallery/gallery-filters";
import { GalleryChapters, GalleryGrid } from "@/components/gallery/gallery-grid";
import { GalleryHero } from "@/components/gallery/gallery-hero";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import {
  buildCategoryChapter,
  buildGalleryChapters,
  GALLERY_FILTERS,
  type GalleryCategoryId,
  type GalleryImage,
} from "@/lib/gallery-data";
import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  images: GalleryImage[];
};

export function GalleryExperience({ images }: Props) {
  const [filter, setFilter] = useState<GalleryCategoryId>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const availableFilters = useMemo(() => {
    const present = new Set(images.map((img) => img.category));
    return GALLERY_FILTERS.filter(
      (f) => f.id === "all" || present.has(f.id as Exclude<GalleryCategoryId, "all">),
    );
  }, [images]);

  const chapters = useMemo(() => buildGalleryChapters(images), [images]);
  const flatAll = useMemo(() => chapters.flatMap((c) => c.images), [chapters]);

  const activeChapter = useMemo(() => {
    if (filter === "all") return null;
    return buildCategoryChapter(images, filter);
  }, [filter, images]);

  const filtered = useMemo(() => {
    if (filter === "all") return flatAll;
    return activeChapter?.images ?? [];
  }, [filter, flatAll, activeChapter]);

  const hero =
    images.find((img) => img.src.includes("gallery-pool")) ??
    images.find((img) => img.category === "pool") ??
    images.find((img) => img.layout === "feature") ??
    images[0];

  return (
    <div className="bg-sand">
      {hero ? <GalleryHero heroSrc={hero.src} heroAlt={hero.alt} /> : null}

      <GalleryFilters
        filters={availableFilters}
        active={filter}
        onChange={(id) => {
          setFilter(id);
          setOpenIndex(null);
          if (typeof document !== "undefined") {
            requestAnimationFrame(() => {
              document.getElementById("gallery-collection")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            });
          }
        }}
      />

      <section
        id="gallery-collection"
        className="mx-auto max-w-[1400px] scroll-mt-28 px-5 py-12 md:px-8 md:py-16"
        aria-label="Photograph collection"
      >
        {filter === "all" ? (
          <GalleryChapters chapters={chapters} flatImages={flatAll} onOpen={setOpenIndex} />
        ) : activeChapter ? (
          <div>
            <div className="mb-8 max-w-xl md:mb-10">
              <p className="eyebrow">{activeChapter.eyebrow}</p>
              <h2 className="display mt-2 text-3xl md:text-4xl">{activeChapter.label}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">
                {activeChapter.intro}
              </p>
            </div>
            <GalleryGrid images={filtered} onOpen={setOpenIndex} priorityCount={2} />
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-ink-soft">No photographs in this collection yet.</p>
        )}
      </section>

      <section className="border-t border-stone/40 bg-ink py-14 text-sand md:py-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-end md:px-8">
          <div className="max-w-lg">
            <p className="eyebrow text-lamp-soft">Stay with us</p>
            <h2 className="display mt-2 text-3xl md:text-4xl">Ready to see it in person?</h2>
            <p className="mt-3 text-sm leading-relaxed text-sand/70">
              Reserve a room or enquire about hosting your next gathering at Blue Top Villa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-gold">
              Book a stay
            </Link>
            <Link href="/rooms" className="btn btn-ghost border-sand/35 text-sand hover:bg-sand/10">
              View rooms
            </Link>
          </div>
        </div>
      </section>

      {openIndex != null && filtered[openIndex] ? (
        <GalleryLightbox
          images={filtered}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onChange={setOpenIndex}
        />
      ) : null}
    </div>
  );
}
