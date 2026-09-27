"use client";

import type { GalleryCategoryId, GalleryFilter } from "@/lib/gallery-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  filters: GalleryFilter[];
  active: GalleryCategoryId;
  onChange: (id: GalleryCategoryId) => void;
};

export function GalleryFilters({ filters, active, onChange }: Props) {
  return (
    <nav
      aria-label="Gallery categories"
      className="sticky top-[var(--site-header-height)] z-30 border-b border-stone/30 bg-sand/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex items-center gap-0 overflow-x-auto py-3.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => {
            const isActive = active === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onChange(filter.id)}
                className={cn(
                  "relative shrink-0 px-3.5 py-2 text-[0.65rem] font-semibold tracking-[0.18em] uppercase transition md:px-4",
                  isActive ? "text-ink" : "text-ink-soft/80 hover:text-ink",
                )}
              >
                {filter.label}
                {isActive ? (
                  <motion.span
                    layoutId="gallery-filter-underline"
                    className="absolute inset-x-3.5 bottom-0 h-px bg-lamp md:inset-x-4"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
