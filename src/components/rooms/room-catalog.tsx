"use client";

import { RoomListingCard } from "@/components/rooms/room-listing-card";
import type { RoomTypeSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

type SortKey = "recommended" | "price-asc" | "price-desc" | "occupancy";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
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
    return Array.from({ length: max - 1 }, (_, i) => i + 2);
  }, [rooms]);

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-stone/45 bg-white p-5 shadow-[0_16px_40px_-32px_rgba(22,20,16,0.25)]">
          <div className="flex items-center gap-2 text-ink">
            <SlidersHorizontal className="h-4 w-4 text-lamp" strokeWidth={1.5} aria-hidden />
            <p className="text-[0.72rem] font-bold tracking-[0.14em] uppercase">Refine results</p>
          </div>

          <div className="mt-6">
            <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Guests</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMinGuests(0)}
                className={cn(
                  "border px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.08em] uppercase transition",
                  minGuests === 0
                    ? "border-ink bg-ink text-sand"
                    : "border-stone/50 bg-sand text-ink-soft hover:border-ink/30",
                )}
              >
                Any
              </button>
              {guestFilters.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMinGuests(n)}
                  className={cn(
                    "border px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.08em] uppercase transition",
                    minGuests === n
                      ? "border-ink bg-ink text-sand"
                      : "border-stone/50 bg-sand text-ink-soft hover:border-ink/30",
                  )}
                >
                  {n}+
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <label htmlFor="room-sort" className="text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
              Sort by
            </label>
            <select
              id="room-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="mt-2 w-full border border-stone/50 bg-sand px-3 py-2.5 text-sm text-ink outline-none focus:border-lamp"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-8 border-t border-stone/40 pt-5 text-xs leading-relaxed text-ink-soft">
            Showing <span className="font-semibold text-ink">{filtered.length}</span> of {rooms.length} room
            {rooms.length === 1 ? "" : " types"}. Final rates may vary by date.
          </p>
        </div>
      </aside>

      <div className="space-y-8">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-stone/60 bg-white/60 px-6 py-16 text-center">
            <p className="display text-3xl text-ink">No rooms match these filters</p>
            <p className="mt-3 text-sm text-ink-soft">Try lowering the guest count or choose &ldquo;Any&rdquo;.</p>
            <button
              type="button"
              onClick={() => setMinGuests(0)}
              className="btn btn-ghost mt-8 border-ink/25 text-ink"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filtered.map((room, index) => (
            <RoomListingCard key={room.id} room={room} index={index} featured={index === 0 && filtered.length > 1} />
          ))
        )}
      </div>
    </div>
  );
}
