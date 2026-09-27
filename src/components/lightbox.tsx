"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "@/lib/photos";

type Props = {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function Lightbox({ photos, index, onClose, onChange }: Props) {
  const photo = photos[index];
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
      if (event.key === "ArrowLeft") onChange((index - 1 + photos.length) % photos.length);
      if (event.key === "ArrowRight") onChange((index + 1) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onChange, onClose, photos.length]);

  if (!photo || typeof document === "undefined") return null;

  const go = (next: number) => onChange((next + photos.length) % photos.length);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[200] flex flex-col text-sand"
      style={{ backgroundColor: "#0e0c0a" }}
      initial={false}
      animate={{ opacity: 1 }}
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
        <p className="text-xs tracking-[0.2em] uppercase text-sand/70">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </p>
        <button type="button" aria-label="Close photograph" onClick={onClose} className="btn-gold-icon">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-20">
        {photos.length > 1 ? (
          <button
            type="button"
            aria-label="Previous photograph"
            onClick={(event) => {
              event.stopPropagation();
              go(index - 1);
            }}
            className="btn-gold-icon absolute left-4 top-1/2 z-10 -translate-y-1/2 md:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
            className="relative h-[min(70vh,100%)] w-full max-w-6xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Image key={photo.src} src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>

        {photos.length > 1 ? (
          <button
            type="button"
            aria-label="Next photograph"
            onClick={(event) => {
              event.stopPropagation();
              go(index + 1);
            }}
            className="btn-gold-icon absolute right-4 top-1/2 z-10 -translate-y-1/2 md:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="px-4 pb-5 text-center md:px-8" onClick={(event) => event.stopPropagation()}>
        {photo.label ? <p className="display text-2xl text-sand">{photo.label}</p> : null}
        <p className="mt-1 text-sm text-sand/65">{photo.alt}</p>
        {photos.length > 1 ? (
          <div className="mx-auto mt-5 flex max-w-3xl gap-2 overflow-x-auto pb-1">
            {photos.map((item, thumbIndex) => (
              <button
                key={item.id}
                type="button"
                aria-label={`View ${item.label ?? item.alt}`}
                aria-current={thumbIndex === index ? "true" : undefined}
                onClick={() => onChange(thumbIndex)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden ${
                  thumbIndex === index ? "ring-2 ring-lamp" : "opacity-55 hover:opacity-100"
                }`}
              >
                <Image src={item.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>,
    document.body,
  );
}
