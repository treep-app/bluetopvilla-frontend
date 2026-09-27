"use client";

import { GalleryItem } from "@/components/gallery/gallery-item";
import type { GalleryChapter, GalleryImage } from "@/lib/gallery-data";
import { AnimatePresence, motion } from "framer-motion";

type GridProps = {
  images: GalleryImage[];
  /** Absolute indices in the lightbox sequence */
  indexOffset?: number;
  onOpen: (index: number) => void;
  priorityCount?: number;
};

/**
 * Intentional hospitality layouts — never a random equal grid.
 * 1 → cinematic feature
 * 2 → asymmetric pair
 * 3 → classic hotel: tall lead + stacked pair
 * 4+ → feature lead, then composed rows
 */
export function GalleryGrid({ images, indexOffset = 0, onOpen, priorityCount = 0 }: GridProps) {
  if (images.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-ink-soft">No photographs in this collection yet.</p>
    );
  }

  const open = (localIndex: number) => onOpen(indexOffset + localIndex);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={images.map((i) => i.id).join("-")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-3 md:gap-4"
      >
        {composeRows(images).map((row, rowIndex) => (
          <EditorialRow
            key={`row-${rowIndex}-${row.images.map((i) => i.id).join("-")}`}
            row={row}
            startIndex={row.startIndex}
            onOpen={open}
            priority={rowIndex === 0 && priorityCount > 0}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

type Row =
  | { kind: "feature"; images: [GalleryImage]; startIndex: number }
  | { kind: "pair"; images: [GalleryImage, GalleryImage]; startIndex: number }
  | { kind: "lead-stack"; images: [GalleryImage, GalleryImage, GalleryImage]; startIndex: number }
  | { kind: "trio"; images: GalleryImage[]; startIndex: number };

function composeRows(images: GalleryImage[]): Row[] {
  const rows: Row[] = [];
  let i = 0;

  while (i < images.length) {
    const remaining = images.length - i;
    const current = images[i];

    if (remaining === 1) {
      rows.push({ kind: "feature", images: [current], startIndex: i });
      i += 1;
      continue;
    }

    if (remaining === 2) {
      rows.push({ kind: "pair", images: [current, images[i + 1]], startIndex: i });
      i += 2;
      continue;
    }

    // Prefer cinematic opener for feature-marked images when enough remain after
    if (current.layout === "feature" && remaining > 3) {
      rows.push({ kind: "feature", images: [current], startIndex: i });
      i += 1;
      continue;
    }

    // Classic hospitality: tall lead + two stacked
    if (remaining === 3 || current.layout === "tall") {
      rows.push({
        kind: "lead-stack",
        images: [current, images[i + 1], images[i + 2]],
        startIndex: i,
      });
      i += 3;
      continue;
    }

    rows.push({
      kind: "trio",
      images: images.slice(i, i + 3),
      startIndex: i,
    });
    i += 3;
  }

  return rows;
}

function EditorialRow({
  row,
  startIndex,
  onOpen,
  priority,
}: {
  row: Row;
  startIndex: number;
  onOpen: (index: number) => void;
  priority?: boolean;
}) {
  if (row.kind === "feature") {
    const image = row.images[0];
    return (
      <GalleryItem
        image={image}
        index={startIndex}
        onOpen={onOpen}
        priority={priority}
        aspect="aspect-[16/10] md:aspect-[21/9]"
        sizes="(max-width: 1400px) 100vw, 1400px"
      />
    );
  }

  if (row.kind === "pair") {
    const [a, b] = row.images;
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
        <GalleryItem
          image={a}
          index={startIndex}
          onOpen={onOpen}
          priority={priority}
          className="md:col-span-7"
          aspect="aspect-[4/3] md:aspect-[5/4]"
          sizes="(max-width: 768px) 100vw, 58vw"
        />
        <GalleryItem
          image={b}
          index={startIndex + 1}
          onOpen={onOpen}
          className="md:col-span-5"
          aspect="aspect-[4/3] md:aspect-[4/5]"
          sizes="(max-width: 768px) 100vw, 42vw"
        />
      </div>
    );
  }

  if (row.kind === "lead-stack") {
    const [lead, top, bottom] = row.images;
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
        <div className="relative aspect-[3/4] md:col-span-7 md:aspect-auto md:min-h-[560px]">
          <GalleryItem
            image={lead}
            index={startIndex}
            onOpen={onOpen}
            priority={priority}
            className="absolute inset-0 h-full w-full"
            aspect="!aspect-auto h-full"
            sizes="(max-width: 768px) 100vw, 58vw"
          />
        </div>
        <div className="flex flex-col gap-3 md:col-span-5 md:min-h-[560px] md:gap-4">
          <GalleryItem
            image={top}
            index={startIndex + 1}
            onOpen={onOpen}
            className="md:min-h-0 md:flex-1"
            aspect="aspect-[4/3] md:!aspect-auto md:h-full"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
          <GalleryItem
            image={bottom}
            index={startIndex + 2}
            onOpen={onOpen}
            className="md:min-h-0 md:flex-1"
            aspect="aspect-[4/3] md:!aspect-auto md:h-full"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
        </div>
      </div>
    );
  }

  // trio
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
      {row.images.map((image, i) => (
        <GalleryItem
          key={image.id}
          image={image}
          index={startIndex + i}
          onOpen={onOpen}
          priority={priority && i === 0}
          aspect="aspect-[4/5] sm:aspect-[3/4]"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      ))}
    </div>
  );
}

type ChaptersProps = {
  chapters: GalleryChapter[];
  flatImages: GalleryImage[];
  onOpen: (index: number) => void;
};

/** Editorial “All” view — each category as its own hospitality chapter. */
export function GalleryChapters({ chapters, flatImages, onOpen }: ChaptersProps) {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {chapters.map((chapter, chapterIndex) => {
        const offset = flatImages.findIndex((img) => img.id === chapter.images[0]?.id);
        return (
          <section
            key={chapter.id}
            id={`gallery-${chapter.id}`}
            aria-labelledby={`gallery-heading-${chapter.id}`}
            className="scroll-mt-28"
          >
            <div className="mb-6 max-w-xl md:mb-8">
              <p className="eyebrow">{chapter.eyebrow}</p>
              <h2 id={`gallery-heading-${chapter.id}`} className="display mt-2 text-3xl md:text-4xl">
                {chapter.label}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">{chapter.intro}</p>
            </div>
            <GalleryGrid
              images={chapter.images}
              indexOffset={offset >= 0 ? offset : 0}
              onOpen={onOpen}
              priorityCount={chapterIndex === 0 ? 2 : 0}
            />
          </section>
        );
      })}
    </div>
  );
}
