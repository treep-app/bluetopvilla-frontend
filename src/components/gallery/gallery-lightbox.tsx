"use client";

import { categoryLabel, type GalleryImage } from "@/lib/gallery-data";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function GalleryLightbox({ images, index, onClose, onChange }: Props) {
  const image = images[index];
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.lightbox = "open";
    return () => {
      document.body.style.overflow = previous;
      delete document.body.dataset.lightbox;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onChange((index - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") onChange((index + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onChange, onClose]);

  if (!image || typeof document === "undefined") return null;

  const go = (next: number) => onChange((next + images.length) % images.length);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-[200] flex flex-col text-sand"
      style={{ backgroundColor: "#0e0c0a" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      onTouchStart={(event) => {
        startX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (startX.current == null) return;
        const delta = (event.changedTouches[0]?.clientX ?? startX.current) - startX.current;
        if (delta > 56) go(index - 1);
        if (delta < -56) go(index + 1);
        startX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div>
          <p className="text-[0.65rem] tracking-[0.2em] text-sand/55 uppercase">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[0.65rem] font-semibold tracking-[0.16em] text-lamp uppercase">
            {categoryLabel(image.category)}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close gallery"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center border border-sand/25 text-sand transition hover:border-lamp hover:text-lamp"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-24">
        {images.length > 1 ? (
          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              go(index - 1);
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-sand/25 text-sand transition hover:border-lamp hover:text-lamp md:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={image.id}
            className="relative h-[min(72vh,100%)] w-full max-w-6xl"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 ? (
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              go(index + 1);
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-sand/25 text-sand transition hover:border-lamp hover:text-lamp md:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="px-4 pb-8 text-center md:px-8" onClick={(event) => event.stopPropagation()}>
        <p className="display text-2xl text-sand md:text-3xl">{image.title}</p>
        <p className="mt-1.5 text-sm text-sand/55">{image.caption ?? image.alt}</p>
      </div>
    </motion.div>,
    document.body,
  );
}
