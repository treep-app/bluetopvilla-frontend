"use client";

import { villaEventAssurances } from "@/lib/villa-events";
import { motion } from "framer-motion";
import { MapPin, Moon, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { EventSpaceDto, PropertySettings } from "@/lib/types";

/** Fit the grid to however many spaces staff have published. */
const GRID_COLUMNS: Record<number, string> = {
  1: "md:grid-cols-1 md:max-w-xl",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

export function EventsSpaces({ property, spaces }: { property: PropertySettings; spaces: EventSpaceDto[] }) {
  const stats = [
    { icon: Users, label: "Private hire", value: "Your guest list" },
    { icon: MapPin, label: "Location", value: property.address ?? "Kasoa, Ghana" },
    {
      icon: Moon,
      label: "Check-in / out",
      value:
        property.checkInTime === property.checkOutTime
          ? property.checkInTime
          : `${property.checkInTime} / ${property.checkOutTime}`,
    },
  ];

  return (
    <section className="bg-sand-deep/40" aria-labelledby="events-spaces-heading">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-ink-soft">The property</p>
            <h2 id="events-spaces-heading" className="display mt-3 text-4xl text-ink md:text-5xl">
              Spaces that hold a day — and a night
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-ink-soft md:text-base lg:col-span-5">
            Use the house as one venue: outdoor moments, indoor dining, and overnight rooms without splitting your
            guests across town.
          </p>
        </div>

        {spaces.length ? (
        <ul className={`mt-12 grid gap-5 ${GRID_COLUMNS[Math.min(spaces.length, 4)]}`}>
          {spaces.map((space, index) => (
            <motion.li
              key={space.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                href={space.href ?? "/venue"}
                className="group block overflow-hidden border border-stone/45 bg-white transition hover:border-lamp/40"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-ink/80">
                  {space.imageUrl ? (
                    <Image
                      src={space.imageUrl}
                      alt={space.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  {space.tag ? (
                    <span className="absolute left-4 top-4 bg-white/95 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.14em] text-ink uppercase">
                      {space.tag}
                    </span>
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="display text-3xl text-sand">{space.title}</h3>
                    {space.detail ? <p className="mt-2 text-sm leading-relaxed text-sand/85">{space.detail}</p> : null}
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
        ) : null}

        <div className="mt-10 grid gap-4 border border-stone/40 bg-white p-6 sm:grid-cols-3 md:gap-0 md:p-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex gap-4 border-stone/40 sm:border-r sm:px-6 sm:py-7 last:border-r-0"
            >
              <stat.icon className="mt-0.5 h-5 w-5 shrink-0 text-lamp" strokeWidth={1.5} aria-hidden />
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-ink-soft uppercase">{stat.label}</p>
                <p className="mt-1 text-lg font-medium text-ink">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 border border-stone/40 bg-sand p-6 md:grid-cols-3 md:gap-8 md:p-8">
          {villaEventAssurances.map((point) => (
            <div key={point.label}>
              <p className="text-[0.72rem] font-bold tracking-[0.12em] text-lamp uppercase">{point.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{point.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
