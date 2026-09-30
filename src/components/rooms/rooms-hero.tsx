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
    <header className="relative shrink-0 border-b border-white/10 bg-ink text-sand">
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/images/room-suite.jpg" alt="" fill className="object-cover opacity-35" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 py-5 md:px-8 md:py-6">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-[0.62rem] font-medium tracking-[0.14em] text-sand/65 uppercase"
        >
          <Link href="/" className="transition hover:text-sand">Home</Link>
          <ChevronRight className="h-3 w-3 opacity-60" aria-hidden />
          <span className="text-sand">Rooms</span>
        </nav>

        <div className="mt-4 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-4">
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-lamp-soft uppercase">Accommodation</p>
            <h1 className="display mt-1 text-3xl leading-[1.05] text-sand md:text-4xl">Rooms &amp; suites</h1>
            <p className="mt-2 text-sm text-sand/75">
              {roomCount} room type{roomCount === 1 ? "" : "s"} · {checkTimesLabel(property)}
            </p>
          </div>
          <div className="lg:col-span-8">
            <BookingSearch tone="dark" />
          </div>
        </div>
      </div>
    </header>
  );
}
