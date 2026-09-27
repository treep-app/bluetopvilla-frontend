"use client";

import { BookingDock } from "@/components/booking-dock";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { checkTimesLabel } from "@/lib/property";
import type { PropertySettings } from "@/lib/types";

function buildSlides(property: PropertySettings) {
  return [
    {
      src: "/images/hero-hotel.jpg",
      alt: "Blue Top Villa at dusk in Kasoa",
      eyebrow: "Blue Top Villa",
      title: "Bespoke. Warm. Unforgettable.",
      text:
        "Hotel stays and private gatherings in Kasoa — rooms, the pool, and space to celebrate between Accra and the coast.",
    },
    {
      src: "/images/gallery-pool.jpg",
      alt: "The pool at Blue Top Villa",
      eyebrow: "The grounds",
      title: "Water, shade,\nand a long afternoon.",
      text: "The pool sits beside the house — for a swim between meetings, or after a drive from Accra.",
    },
    {
      src: "/images/gallery-lobby.jpg",
      alt: "An interior at Blue Top Villa",
      eyebrow: "Arrival",
      title: "Come in from the heat.\nThe house is waiting.",
      text: `${checkTimesLabel(property)}. Call ahead if you will arrive later.`,
    },
    {
      src: "/images/room-suite.jpg",
      alt: "A room at Blue Top Villa",
      eyebrow: "Stay",
      title: "A room for the night,\nor a few.",
      text: "Choose dates below. The booking engine holds the room while you pay.",
    },
    {
      src: "/images/event-wedding.jpg",
      alt: "A celebration at Blue Top Villa",
      eyebrow: "Gather",
      title: "Weddings, parties,\nand the work week.",
      text: "The villa hosts private events. Send a date and we will confirm what the house can hold.",
    },
  ];
}

export function HeroSlider({ property }: { property: PropertySettings }) {
  const slides = useMemo(() => buildSlides(property), [property]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dockVisible, setDockVisible] = useState(true);
  const slide = slides[index];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [playing, slides.length]);

  useEffect(() => {
    const onScroll = () => setDockVisible(window.scrollY < 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative flex flex-col bg-[#1c1a17]">
      <div className="hero-slide-frame relative w-full shrink-0 overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((item, slideIndex) => {
            const active = slideIndex === index;
            return (
              <motion.div
                key={item.src}
                className="absolute inset-0"
                initial={false}
                animate={{
                  opacity: active ? 1 : 0,
                  scale: active ? 1.03 : 1,
                }}
                transition={{ duration: 1.35, ease: [0.4, 0, 0.2, 1] }}
                style={{ zIndex: active ? 1 : 0 }}
                aria-hidden={!active}
              >
                <Image
                  src={item.src}
                  alt={active ? item.alt : ""}
                  fill
                  priority={slideIndex === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            );
          })}
          <div className="pointer-events-none absolute inset-0 z-[2] bg-black/42" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0.35) 58%, rgba(0,0,0,0.82) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <div className="flex flex-1 flex-col justify-end px-5 pb-3 pt-24 md:px-10 md:pb-5 md:pt-28">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="max-w-3xl"
            >
              <p className="text-[0.7rem] font-semibold tracking-[0.32em] text-sand/90 uppercase">{slide.eyebrow}</p>
              {index === 0 ? (
                <h1 className="display mt-3 whitespace-pre-line text-4xl leading-[1.08] text-sand md:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
              ) : (
                <h2 className="display mt-3 whitespace-pre-line text-4xl leading-[1.08] text-sand md:text-5xl lg:text-6xl">
                  {slide.title}
                </h2>
              )}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-sand/90 md:text-lg">{slide.text}</p>
              <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
                <Link href="/book" className="btn btn-gold gap-2">
                  Reserve your stay
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/rooms" className="btn btn-ghost border-sand/45 text-sand hover:bg-sand/10">
                  Explore suites &amp; villas
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="mb-2 flex items-center justify-between px-5 md:mb-3 md:px-10">
            <div className="flex gap-2">
              {slides.map((item, slideIndex) => (
                <button
                  key={item.src}
                  type="button"
                  aria-label={`Show ${item.eyebrow}`}
                  onClick={() => setIndex(slideIndex)}
                  className={`h-1 w-8 ${slideIndex === index ? "bg-lamp" : "bg-sand/35"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous photograph"
                onClick={() => setIndex((current) => (current - 1 + slides.length) % slides.length)}
                className="rounded-full border border-sand/40 bg-black/25 p-2.5 text-sand backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                onClick={() => setPlaying((value) => !value)}
                className="rounded-full border border-sand/40 bg-black/25 p-2.5 text-sand backdrop-blur-sm"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                type="button"
                aria-label="Next photograph"
                onClick={() => setIndex((current) => (current + 1) % slides.length)}
                className="rounded-full border border-sand/40 bg-black/25 p-2.5 text-sand backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <BookingDock variant="serena" visible={dockVisible} />
    </section>
  );
}
