import { BookingSearch } from "@/components/booking-search";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { checkTimesLabel } from "@/lib/property";
import type { PropertySettings } from "@/lib/types";

type Props = {
  roomCount: number;
  property: PropertySettings;
};

export function RoomsHero({ roomCount, property }: Props) {
  return (
    <header className="relative bg-ink text-sand">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/room-suite.jpg"
          alt=""
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/55" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-[0.65rem] font-medium tracking-[0.14em] text-sand/70 uppercase"
        >
          <Link href="/" className="transition hover:text-sand">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
          <span className="text-sand">Rooms</span>
        </nav>

        <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-5">
            <p className="eyebrow text-lamp-soft">Accommodation</p>
            <h1 className="display mt-2 text-4xl leading-[1.05] md:text-5xl">Rooms &amp; suites</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-sand/80">
              Compare {roomCount} room type{roomCount === 1 ? "" : "s"} — clear rates and a guided path to reserve.
            </p>
          </div>
          <div className="lg:col-span-7">
            <p className="mb-2 text-[0.65rem] font-semibold tracking-[0.14em] text-sand/75 uppercase">
              Check availability
            </p>
            <BookingSearch tone="dark" />
            <p className="mt-2 text-xs text-sand/60">{checkTimesLabel(property)} · Live rates in booking</p>
          </div>
        </div>
      </div>
    </header>
  );
}
