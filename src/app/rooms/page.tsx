import { RoomCatalog } from "@/components/rooms/room-catalog";
import { RoomsHero } from "@/components/rooms/rooms-hero";
import { RoomsStayGuide } from "@/components/rooms/rooms-stay-guide";
import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Browse rooms at Blue Top Villa in Kasoa — compare amenities, occupancy, and rates, then check availability and reserve online.",
};

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const [property, rooms] = await Promise.all([api.property(), api.rooms()]);

  return (
    <div className="bg-sand">
      <RoomsHero roomCount={rooms.length} property={property} />
      <RoomsStayGuide />

      <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20" aria-labelledby="room-catalog-heading">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-ink-soft">Select your room</p>
            <h2 id="room-catalog-heading" className="display mt-2 text-4xl text-ink md:text-5xl">
              Available accommodations
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-base">
              Each listing shows starting rates, guest capacity, and key amenities. Open a room for photos and full
              details, or go straight to availability for your dates.
            </p>
          </div>
          <Link href="/contact" className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink uppercase underline-offset-4 hover:text-lamp hover:underline">
            Need help choosing?
          </Link>
        </div>

        <RoomCatalog rooms={rooms} />
      </section>

      <section className="border-t border-stone/40 bg-ocean py-10 text-sand md:py-12">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-5 px-5 md:flex-row md:items-center md:px-8">
          <div>
            <p className="eyebrow">Ready to stay?</p>
            <h2 className="display mt-1 text-3xl md:text-4xl">Reserve your room</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-gold">
              Start booking
            </Link>
            <Link href="/contact" className="btn btn-ghost border-sand/45 text-sand hover:bg-sand/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
