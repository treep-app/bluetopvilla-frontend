"use client";

import { BookingCalendar, type DatePickerFocus } from "@/components/booking-calendar";
import { api } from "@/lib/api";
import { cleanRoomCopy, formatStayDate } from "@/lib/booking-utils";
import type { AvailabilitySearchResult, PropertySettings } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, MapPin, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

type Props = {
  property: PropertySettings;
};

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex h-full min-h-[5rem] flex-col justify-center border-b border-stone/40 px-4 py-3 md:border-b-0 md:border-r md:px-5">
      <p className="text-[0.68rem] font-medium tracking-[0.12em] text-lamp uppercase">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="text-ink-soft hover:text-ink disabled:opacity-30"
        >
          <Minus className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <span className="min-w-[1.25rem] text-center text-lg font-medium text-ink">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="text-ink-soft hover:text-ink disabled:opacity-30"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export function StayAvailabilityPanel({ property }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [activePanel, setActivePanel] = useState<DatePickerFocus | null>(null);
  const [dateFocus, setDateFocus] = useState<DatePickerFocus>("check-in");
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const canSearch = Boolean(checkIn && checkOut);

  const availability = useQuery({
    queryKey: ["stay-availability", checkIn, checkOut, adults, children, rooms],
    queryFn: () => api.search({ checkIn, checkOut, adults, children, rooms }),
    enabled: canSearch,
  });

  const openDates = (focus: DatePickerFocus) => {
    setDateFocus(focus);
    setActivePanel(focus);
    setDateError(false);
  };

  const goToBook = (roomSlug?: string) => {
    if (!checkOut) {
      setDateError(true);
      openDates("check-out");
      return;
    }
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
      step: "rooms",
    });
    if (roomSlug) params.set("room", roomSlug);
    router.push(`/book?${params.toString()}`);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    goToBook();
  };

  const dateField = (focus: DatePickerFocus, label: string, value: string) => (
    <div className="relative min-h-[5rem] flex-1 border-b border-stone/40 md:border-b-0 md:border-r">
      <button
        type="button"
        onClick={() => openDates(focus)}
        aria-expanded={activePanel === focus}
        className={cn(
          "flex h-full w-full flex-col justify-center px-4 py-3 text-left transition hover:bg-sand/40 md:px-5",
          activePanel === focus && "bg-sand/50",
          dateError && !checkOut && focus === "check-out" && "ring-2 ring-inset ring-red-300",
        )}
      >
        <p className="text-[0.68rem] font-medium tracking-[0.12em] text-lamp uppercase">{label}</p>
        <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-ink md:text-[0.95rem]">
          <Calendar className="h-4 w-4 shrink-0 text-ink-soft" strokeWidth={1.5} aria-hidden />
          <span className="truncate">{value ? formatStayDate(value) : "Select date"}</span>
        </p>
      </button>
      {activePanel === focus ? (
        <div className="absolute top-full left-0 z-50 mt-1 flex justify-start px-2 md:px-0">
          <BookingCalendar
            checkIn={checkIn}
            checkOut={checkOut}
            focus={dateFocus}
            onFocusChange={setDateFocus}
            onChange={(nextIn, nextOut) => {
              setCheckIn(nextIn);
              setCheckOut(nextOut);
              setDateError(false);
            }}
            onComplete={() => setActivePanel(null)}
          />
        </div>
      ) : null}
    </div>
  );

  const results: AvailabilitySearchResult | undefined = availability.data;

  return (
    <div>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="overflow-visible border border-stone/40 bg-white shadow-[0_24px_60px_-40px_rgba(22,20,16,0.35)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="hidden min-h-[5rem] flex-col justify-center border-b border-stone/40 px-5 py-3 lg:flex lg:w-[18%] lg:border-b-0 lg:border-r">
            <p className="text-[0.68rem] font-medium tracking-[0.12em] text-lamp uppercase">Where</p>
            <p className="mt-1.5 flex items-start gap-2 text-sm font-medium text-ink">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" strokeWidth={1.5} aria-hidden />
              <span>
                {property.name}
                {property.address ? (
                  <span className="mt-0.5 block text-xs font-normal text-ink-soft">{property.address}</span>
                ) : null}
              </span>
            </p>
          </div>

          <div className="relative flex flex-[1.4] flex-col md:flex-row">
            {dateField("check-in", "Check-in", checkIn)}
            {dateField("check-out", "Check-out", checkOut)}
          </div>

          <div className="flex flex-1 flex-col md:flex-row">
            <Counter label="Adults" value={adults} min={1} max={10} onChange={setAdults} />
            <Counter label="Children" value={children} min={0} max={10} onChange={setChildren} />
            <Counter label="Rooms" value={rooms} min={1} max={5} onChange={setRooms} />
          </div>

          <button
            type="submit"
            className="flex min-h-[3.5rem] items-center justify-center gap-2 bg-[rgb(217,157,38)] px-8 py-4 text-[0.72rem] font-bold tracking-[0.18em] text-ink uppercase transition hover:bg-[rgb(200,140,30)] lg:min-h-[5rem] lg:min-w-[11rem]"
          >
            Check availability
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
        {dateError && !checkOut ? (
          <p className="border-t border-stone/25 px-5 py-2 text-center text-xs text-red-700">
            Please choose a check-out date.
          </p>
        ) : null}
      </form>

      <p className="mt-3 text-xs tracking-[0.08em] text-ink-soft uppercase">
        Check-in {property.checkInTime} · Check-out {property.checkOutTime}
        {property.phone ? ` · ${property.phone}` : ""}
      </p>

      {canSearch ? (
        <div className="mt-8">
          {availability.isLoading ? (
            <p className="text-sm text-ink-soft">Checking the house for your dates…</p>
          ) : null}
          {availability.isError ? (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {(availability.error as Error).message}
            </p>
          ) : null}
          {results && results.results.length === 0 ? (
            <div className="border border-dashed border-stone/55 bg-white px-5 py-8 text-center">
              <p className="display text-2xl text-ink">No rooms free for those dates</p>
              <p className="mt-2 text-sm text-ink-soft">Try different dates or fewer rooms.</p>
            </div>
          ) : null}
          {results && results.results.length > 0 ? (
            <div>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="eyebrow text-ink-soft">Available now</p>
                  <p className="display mt-1 text-2xl text-ink md:text-3xl">
                    {results.results.length} room type{results.results.length === 1 ? "" : "s"} · {results.nights}{" "}
                    night{results.nights === 1 ? "" : "s"}
                  </p>
                </div>
                <button type="button" onClick={() => goToBook()} className="btn btn-ink gap-2">
                  Continue to booking
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <ul className="grid gap-4 md:grid-cols-3">
                {results.results.map((room) => (
                  <li key={room.id}>
                    <button
                      type="button"
                      onClick={() => goToBook(room.slug)}
                      className="group flex h-full w-full flex-col overflow-hidden border border-stone/40 bg-white text-left transition hover:border-lamp/40"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                        {room.featuredImage ? (
                          <Image
                            src={room.featuredImage}
                            alt={room.name}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="display text-2xl text-ink">{room.name}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                          {cleanRoomCopy(room.description)}
                        </p>
                        <p className="mt-3 text-[0.65rem] tracking-[0.1em] text-ink-soft uppercase">
                          {room.availableUnits} left · up to {room.occupancy} guests
                        </p>
                        <p className="mt-auto pt-3 display text-2xl text-ink">
                          {formatMoney(room.total, room.currency)}
                          <span className="ml-1 font-sans text-xs font-normal tracking-normal text-ink-soft">
                            total
                          </span>
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-center text-xs text-ink-soft md:text-left">
                Prefer to browse first?{" "}
                <Link href="/rooms" className="text-ink underline-offset-2 hover:underline">
                  View all rooms
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
