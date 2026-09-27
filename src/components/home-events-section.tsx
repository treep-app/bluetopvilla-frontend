"use client";

import type { VillaEventType } from "@/lib/villa-events";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HomeEventsSection({ events }: { events: VillaEventType[] }) {
  return (
    <section className="border-t border-stone/30 bg-sand" aria-labelledby="home-events-heading">
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-ink-soft">Gather</p>
            <h2 id="home-events-heading" className="display mt-2 text-3xl text-ink md:text-4xl">
              Events at the villa
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
              Weddings, parties, and corporate days on one private property in Kasoa.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] text-ink uppercase transition hover:text-lamp"
          >
            View all events
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <motion.ul
          className="mt-8 grid gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
          {events.map((event) => (
            <li key={event.slug}>
              <Link
                href="/events"
                className="group relative block aspect-[5/4] overflow-hidden border border-stone/40 bg-ink/5 sm:aspect-[4/3]"
              >
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[0.62rem] font-semibold tracking-[0.14em] text-lamp uppercase">{event.tagline}</p>
                  <h3 className="display mt-1 text-2xl text-sand">{event.title}</h3>
                </div>
              </Link>
            </li>
          ))}
        </motion.ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/venue" className="btn btn-gold">
            Request venue hire
          </Link>
          <Link href="/events" className="btn btn-ghost border-ink/25 text-ink">
            Explore event options
          </Link>
        </div>
      </div>
    </section>
  );
}
