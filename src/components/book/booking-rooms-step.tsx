"use client";

import { RoomAmenityIcon } from "@/components/rooms/room-amenity-icon";
import { cleanRoomCopy } from "@/lib/booking-utils";
import type { AvailabilityRoom } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";
import { BedDouble, Users } from "lucide-react";
import Image from "next/image";

type Props = {
  rooms: AvailabilityRoom[];
  selectedSlug: string;
  loading: boolean;
  error: string | null;
  onSelect: (slug: string) => void;
};

export function BookingRoomsStep({ rooms, selectedSlug, loading, error, onSelect }: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-44 animate-pulse border border-stone/30 bg-white/70" />
        ))}
        <p className="text-sm text-ink-soft">Checking availability at the villa…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="border border-dashed border-stone/55 bg-white px-6 py-12 text-center">
        <p className="display text-3xl text-ink">No rooms for those dates</p>
        <p className="mt-2 text-sm text-ink-soft">Try different dates or fewer rooms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="display text-3xl text-ink">Choose your room</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Prices include taxes &amp; fees for your stay. Select a room to continue.
        </p>
      </div>
      <ul className="space-y-4">
        {rooms.map((room) => {
          const active = room.slug === selectedSlug;
          const amenities = room.amenities?.slice(0, 4) ?? [];
          return (
            <li key={room.id}>
              <button
                type="button"
                onClick={() => onSelect(room.slug)}
                className={cn(
                  "grid w-full gap-5 border bg-white p-4 text-left transition md:grid-cols-[200px_1fr_auto] md:p-5",
                  active
                    ? "border-lamp shadow-[0_16px_40px_-28px_rgba(217,157,38,0.55)] ring-1 ring-lamp"
                    : "border-stone/40 hover:border-ink/30",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 md:aspect-auto md:min-h-[140px]">
                  {room.featuredImage ? (
                    <Image src={room.featuredImage} alt={room.name} fill className="object-cover" sizes="200px" />
                  ) : null}
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="display text-2xl text-ink md:text-3xl">{room.name}</h3>
                    <span className="text-xs tracking-[0.1em] text-ink-soft uppercase">
                      {room.availableUnits} left
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                    {cleanRoomCopy(room.description)}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
                    <li className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-lamp" aria-hidden />
                      Up to {room.occupancy}
                    </li>
                    {room.bedConfig && !room.bedConfig.startsWith("TODO") ? (
                      <li className="inline-flex items-center gap-1.5">
                        <BedDouble className="h-3.5 w-3.5 text-lamp" aria-hidden />
                        {room.bedConfig}
                      </li>
                    ) : null}
                  </ul>
                  {amenities.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {amenities.map((a) => (
                        <li
                          key={a.id}
                          className="inline-flex items-center gap-1 border border-stone/40 bg-sand/50 px-2 py-0.5 text-[0.62rem] tracking-[0.04em] text-ink-soft uppercase"
                        >
                          <RoomAmenityIcon icon={a.icon} className="h-3 w-3 text-lamp" />
                          {a.name}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="flex flex-row items-end justify-between gap-4 md:flex-col md:items-end md:justify-center">
                  <div className="text-left md:text-right">
                    <p className="text-[0.62rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Total stay</p>
                    <p className="display text-3xl text-ink">{formatMoney(room.total, room.currency)}</p>
                    <p className="text-xs text-ink-soft">
                      {room.nights} night{room.nights === 1 ? "" : "s"} · {formatMoney(room.nightly, room.currency)}/night
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex px-4 py-2.5 text-[0.68rem] font-bold tracking-[0.14em] uppercase",
                      active ? "bg-lamp text-ink" : "bg-ink text-sand",
                    )}
                  >
                    {active ? "Selected" : "Select"}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
