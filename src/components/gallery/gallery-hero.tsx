"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  heroSrc: string;
  heroAlt: string;
};

export function GalleryHero({ heroSrc, heroAlt }: Props) {
  return (
    <header className="relative isolate overflow-hidden bg-ink text-sand">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={heroSrc} alt="" fill priority className="object-cover" sizes="100vw" />
        </motion.div>
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/25" />
      </div>

      <div className="relative mx-auto flex min-h-[42vh] max-w-[1400px] flex-col justify-end px-5 pb-12 pt-28 md:min-h-[48vh] md:px-8 md:pb-16 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="max-w-xl"
        >
          <p className="eyebrow text-lamp-soft">Blue Top Villa</p>
          <h1 className="display mt-3 text-5xl leading-[0.98] md:text-6xl lg:text-7xl">Gallery</h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-sand/80 md:text-lg">
            Rooms, water, table, and celebration — photographs of the villa as guests live it.
          </p>
          <span className="sr-only">{heroAlt}</span>
        </motion.div>
      </div>
    </header>
  );
}
