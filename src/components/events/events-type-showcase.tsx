"use client";

import { EventTypeIcon } from "@/components/events/event-type-icon";
import type { VillaEventType } from "@/lib/villa-events";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function EventsTypeShowcase({ events }: { events: VillaEventType[] }) {
  const [active, setActive] = useState(0);
  const event = events[active];
  if (!event) return null;

  return (
    <section id="event-types" className="bg-sand scroll-mt-24" aria-labelledby="event-types-heading">
      <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow text-ink-soft">Choose your occasion</p>
            <h2 id="event-types-heading" className="display mt-2 text-3xl text-ink md:text-4xl">
              Three ways to gather
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Select an event type — then send an enquiry with your preferred date.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Event types"
            className="flex flex-wrap gap-2 border border-stone/40 bg-white p-1.5"
          >
            {events.map((type, index) => (
              <button
                key={type.slug}
                type="button"
                role="tab"
                aria-selected={active === index}
                onClick={() => setActive(index)}
                className={cn(
                  "px-4 py-2.5 text-[0.68rem] font-semibold tracking-[0.12em] uppercase transition",
                  active === index
                    ? "bg-ink text-sand"
                    : "text-ink-soft hover:bg-sand-deep/60 hover:text-ink",
                )}
              >
                {type.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="relative min-h-[300px] overflow-hidden bg-ink/5 lg:col-span-7 lg:min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={event.slug}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease }}
              >
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-white/95 px-3 py-2 text-[0.65rem] font-bold tracking-[0.14em] text-ink uppercase backdrop-blur-sm">
              <EventTypeIcon icon={event.icon} className="h-3.5 w-3.5 text-lamp" />
              {event.tagline}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={event.slug + "-copy"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease }}
              className="flex flex-col justify-center border border-stone/40 bg-white p-7 md:p-10 lg:col-span-5"
            >
              <p className="text-[0.65rem] font-bold tracking-[0.2em] text-lamp uppercase">
                0{active + 1} / 0{events.length}
              </p>
              <h3 className="display mt-3 text-4xl text-ink md:text-5xl">{event.title}</h3>
              <p className="mt-5 text-base leading-relaxed text-ink-soft">{event.description}</p>
              <ul className="mt-8 space-y-3">
                {event.highlights.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-ink">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-lamp" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={event.href} className="btn btn-gold gap-2">
                  Enquire for {event.title.toLowerCase()}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/contact" className="btn btn-ghost border-ink/20 text-ink">
                  Call the villa
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {events.map((type, index) => (
            <li key={type.slug}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "group relative block w-full overflow-hidden text-left transition",
                  active === index ? "ring-2 ring-lamp ring-offset-2 ring-offset-sand" : "opacity-80 hover:opacity-100",
                )}
              >
                <div className="relative aspect-[16/10]">
                  {type.image ? <Image src={type.image} alt="" fill className="object-cover" sizes="33vw" /> : null}
                  <div className="absolute inset-0 bg-ink/45 transition group-hover:bg-ink/30" />
                  <span className="absolute bottom-3 left-3 display text-xl text-sand">{type.title}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
