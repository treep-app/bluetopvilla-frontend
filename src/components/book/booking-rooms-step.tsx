"use client";

import { cleanRoomCopy } from "@/lib/booking-utils";
import type { AvailabilityRoom } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";
import { BedDouble, Check, Users } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type SortKey = "recommended" | "price-asc" | "price-desc";

type Props = {
  rooms: AvailabilityRoom[];
  selectedSlug: string;
  loading: boolean;
  error: string | null;
  dateLabel: string;
  onSelect: (slug: string) => void;
  onChangeDates: () => void;
};

export function BookingRoomsStep({
  rooms,
  selectedSlug,
  loading,
  error,
  dateLabel,
  onSelect,
  onChangeDates,
}: Props) {
  const [sort, setSort] = useState<SortKey>("recommended");

  const sorted = useMemo(() => {
    const list = [...rooms];
    if (sort === "price-asc") list.sort((a, b) => Number(a.total) - Number(b.total));
    if (sort === "price-desc") list.sort((a, b) => Number(b.total) - Number(a.total));
    return list;
  }, [rooms, sort]);

  if (loading) {
    return (
      <div>
        <RoomsHeader count={null} dateLabel={dateLabel} sort={sort} onSort={setSort} onChangeDates={onChangeDates} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/5] animate-pulse bg-ink/5" />
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-soft">Checking availability at the villa…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <RoomsHeader count={0} dateLabel={dateLabel} sort={sort} onSort={setSort} onChangeDates={onChangeDates} />
        <div className="mt-6 border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-800">{error}</div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div>
        <RoomsHeader count={0} dateLabel={dateLabel} sort={sort} onSort={setSort} onChangeDates={onChangeDates} />
        <div className="mt-8 border border-dashed border-stone/50 px-6 py-14 text-center">
          <p className="display text-3xl text-ink">No rooms for those dates</p>
          <p className="mt-2 text-sm text-ink-soft">Try different dates or fewer rooms.</p>
          <button type="button" onClick={onChangeDates} className="btn btn-gold mt-6 inline-flex">
            Change dates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <RoomsHeader
        count={rooms.length}
        dateLabel={dateLabel}
        sort={sort}
        onSort={setSort}
        onChangeDates={onChangeDates}
      />

      <ul className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 xl:gap-5">
        {sorted.map((room) => {
          const active = room.slug === selectedSlug;
          const bed =
            room.bedConfig && !room.bedConfig.startsWith("TODO") ? room.bedConfig : null;
          return (
            <li key={room.id}>
              <button
                type="button"
                onClick={() => onSelect(room.slug)}
                aria-pressed={active}
                className={cn(
                  "group relative flex h-full w-full flex-col overflow-hidden bg-ink text-left transition",
                  active ? "ring-2 ring-lamp ring-offset-2 ring-offset-sand" : "hover:opacity-[0.97]",
                )}
              >
                <div className="relative aspect-[5/6] w-full overflow-hidden sm:aspect-[5/6]">
                  {room.featuredImage ? (
                    <Image
                      src={room.featuredImage}
                      alt={room.name}
                      fill
                      className={cn(
                        "object-cover transition duration-700 ease-out group-hover:scale-[1.04]",
                        active ? "scale-[1.02]" : "",
                      )}
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 40vw, 420px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-dusk to-ink" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

                  {room.availableUnits <= 2 ? (
                    <span className="absolute top-3 left-3 bg-ink/70 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.14em] text-sand uppercase backdrop-blur-sm">
                      {room.availableUnits} left
                    </span>
                  ) : null}

                  {active ? (
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-lamp px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.14em] text-ink uppercase">
                      <Check className="h-3 w-3" aria-hidden />
                      Selected
                    </span>
                  ) : null}

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className="display text-2xl leading-none text-sand sm:text-[1.75rem]">{room.name}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-sand/70">
                      {cleanRoomCopy(room.description)}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] text-sand/75">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-lamp-soft" aria-hidden />
                        Up to {room.occupancy}
                      </span>
                      {bed ? (
                        <span className="inline-flex items-center gap-1.5">
                          <BedDouble className="h-3.5 w-3.5 text-lamp-soft" aria-hidden />
                          {bed}
                        </span>
                      ) : null}
                      {room.sizeSqm ? <span>{room.sizeSqm} m²</span> : null}
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/15 pt-3">
                      <div>
                        <p className="text-[0.58rem] font-semibold tracking-[0.14em] text-sand/50 uppercase">
                          Total stay
                        </p>
                        <p className="display text-2xl leading-none text-sand">
                          {formatMoney(room.total, room.currency)}
                        </p>
                        <p className="mt-1 text-[0.7rem] text-sand/55">
                          {formatMoney(room.nightly, room.currency)} / night
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 px-3 py-2 text-[0.62rem] font-bold tracking-[0.14em] uppercase transition",
                          active ? "bg-lamp text-ink" : "bg-sand text-ink group-hover:bg-lamp",
                        )}
                      >
                        {active ? "Selected" : "Select"}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

    </div>
  );
}

function RoomsHeader({
  count,
  dateLabel,
  sort,
  onSort,
  onChangeDates,
}: {
  count: number | null;
  dateLabel: string;
  sort: SortKey;
  onSort: (value: SortKey) => void;
  onChangeDates: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onChangeDates}
        className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase transition hover:text-ink"
      >
        ← Change dates
      </button>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">Choose your room</h2>
          <p className="mt-2 text-sm text-ink-soft">
            {dateLabel}
            {count != null ? (
              <>
                {" "}
                · {count} option{count === 1 ? "" : "s"}
              </>
            ) : null}
          </p>
        </div>
        <label className="flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
          Sort
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="border border-stone/45 bg-white px-3 py-2 text-[0.7rem] font-medium tracking-normal text-ink outline-none focus:border-lamp"
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price · low to high</option>
            <option value="price-desc">Price · high to low</option>
          </select>
        </label>
      </div>
    </div>
  );
}
