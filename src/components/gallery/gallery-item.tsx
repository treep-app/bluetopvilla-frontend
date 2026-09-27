"use client";

import { categoryLabel, type GalleryImage } from "@/lib/gallery-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  image: GalleryImage;
  index: number;
  onOpen: (index: number) => void;
  priority?: boolean;
  className?: string;
  /** Aspect class when not filling a grid cell with absolute image */
  aspect?: string;
  sizes?: string;
};

export function GalleryItem({
  image,
  index,
  onOpen,
  priority,
  className,
  aspect = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw",
}: Props) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.05, 0.2) }}
      onClick={() => onOpen(index)}
      className={cn(
        "group relative block w-full overflow-hidden bg-ink/5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lamp",
        aspect,
        className,
      )}
      aria-label={`View ${image.title}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
      />
      <div className="absolute inset-0 bg-ink/0 transition duration-500 group-hover:bg-ink/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent p-5 pt-16 opacity-0 transition duration-500 group-hover:opacity-100 max-md:opacity-100">
        <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-lamp uppercase">
          {categoryLabel(image.category)}
        </p>
        <p className="display mt-1 text-2xl text-sand md:text-[1.65rem]">{image.title}</p>
      </div>
    </motion.button>
  );
}
