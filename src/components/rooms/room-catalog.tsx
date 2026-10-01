"use client";

import { RoomListingCard } from "@/components/rooms/room-listing-card";
import type { RoomTypeSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

type SortKey = "recommended" | "price-asc" | "price-desc" | "occupancy";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price · low to high" },
  { value: "price-desc", label: "Price · high to low" },
  { value: "occupancy", label: "Most guests" },
];

type Props = {
  rooms: RoomTypeSummary[];
};

export function RoomCatalog({ rooms }: Props) {
  const [minGuests, setMinGuests] = useState(0);
  const [sort, setSort] = useState<SortKey>("recommended");

  const filtered = useMemo(() => {
    let list = rooms.filter((room) => room.occupancy >= minGuests);
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
        break;
      case "occupancy":
        list = [...list].sort((a, b) => b.occupancy - a.occupancy);
        break;
      default:
        break;
    }
    return list;
  }, [rooms, minGuests, sort]);

  const guestFilters = useMemo(() => {
    const max = Math.max(2, ...rooms.map((r) => r.occupancy));
    return Array.from({ length: Math.min(max - 1, 4) }, (_, i) => i + 2);
  }, [rooms]);

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-labelledby="room-catalog-heading">
      <div className="shrink-0 border-b border-stone/35 bg-sand/80 px-4 py-3.5 backdrop-blur-sm sm:px-5 sm:py-4 md:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="room-catalog-heading" className="display text-xl text-ink md:text-2xl">
              Choose your room
            </h2>
            <p className="mt-0.5 text-xs text-ink-soft">
              {filtered.length} of {rooms.length} shown · rates from live availability
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="-mx-1 flex min-w-0 items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
              <span className="mr-1 text-[0.62rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Guests</span>
              <FilterPill active={minGuests === 0} onClick={() => setMinGuests(0)}>Any</FilterPill>
              {guestFilters.map((n) => (
                <FilterPill key={n} active={minGuests === n} onClick={() => setMinGuests(n)}>
                  {n}+
                </FilterPill>
              ))}
            </div>
            <label className="flex items-center gap-2 text-[0.62rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="border border-stone/45 bg-white px-2.5 py-1.5 text-[0.7rem] font-medium tracking-normal text-ink outline-none focus:border-lamp"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>
            <Link
              href="/book"
              className="hidden text-[0.65rem] font-semibold tracking-[0.12em] text-ink uppercase underline-offset-4 hover:text-lamp hover:underline sm:inline"
            >
              Book now
            </Link>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 md:px-8 md:py-6">
        <div className="mx-auto max-w-[1400px]">
          {filtered.length === 0 ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center border border-dashed border-stone/50 bg-white/50 px-6 py-12 text-center">
              <p className="display text-2xl text-ink">No rooms match</p>
              <p className="mt-2 text-sm text-ink-soft">Try &ldquo;Any&rdquo; guests or a different sort.</p>
              <button type="button" onClick={() => setMinGuests(0)} className="btn btn-ghost mt-6 border-ink/25 text-ink">
                Reset filters
              </button>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
              {filtered.map((room, index) => (
                <li key={room.id}>
                  <RoomListingCard room={room} index={index} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.06em] uppercase transition",
        active ? "border-ink bg-ink text-sand" : "border-stone/45 bg-white text-ink-soft hover:border-ink/25",
      )}
    >
      {children}
    </button>
  );
}
