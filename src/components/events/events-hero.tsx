"use client";

import type { VillaEventType } from "@/lib/villa-events";
import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function EventsHero({ events }: { events: VillaEventType[] }) {
  return (
    <header className="relative overflow-hidden bg-ink text-sand">
      <div className="absolute inset-0">
        <Image
          src="/images/event-corporate.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/55" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[0.65rem] font-medium tracking-[0.16em] text-sand/65 uppercase"
        >
          <Link href="/" className="transition hover:text-sand">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-sand">Meetings &amp; Events</span>
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="max-w-2xl lg:col-span-7">
            <p className="text-[0.7rem] font-semibold tracking-[0.28em] text-lamp uppercase">Gather at Blue Top</p>
            <h1 className="display mt-2 text-4xl leading-[1.05] text-sand md:text-5xl">
              Meetings &amp; events
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-sand/80 md:text-base">
              Weddings, celebrations, and corporate days in one private Kasoa address — with guest rooms when you need
              them.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/venue" className="btn btn-gold gap-2">
                Start a venue enquiry
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href="#event-types"
                className="inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.14em] text-sand/75 uppercase transition hover:text-lamp"
              >
                Three ways to gather
                <ArrowDown className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>

          <div className="hidden border-t border-white/15 pt-4 md:grid md:grid-cols-3 md:gap-4 lg:col-span-5 lg:border-t-0 lg:border-l lg:border-white/15 lg:pt-0 lg:pl-8">
            {events.map((type) => (
              <a key={type.slug} href="#event-types" className="group block transition hover:opacity-90">
                <p className="text-[0.62rem] font-bold tracking-[0.14em] text-lamp uppercase">{type.title}</p>
                <p className="mt-1 text-xs text-sand/65 group-hover:text-sand/85">{type.tagline}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
