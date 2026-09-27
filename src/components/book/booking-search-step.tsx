"use client";

import { BookingCalendar, type DatePickerFocus } from "@/components/booking-calendar";
import { formatStayDate } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { Calendar, Minus, Plus } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Values = {
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  rooms: string;
};

type Props = {
  defaults: Values;
  checkInTime: string;
  checkOutTime: string;
  onSubmit: (values: Values) => void;
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
    <div className="flex items-center justify-between border border-stone/45 bg-sand/40 px-4 py-3">
      <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink uppercase">{label}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="text-ink-soft disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[1.5rem] text-center text-lg font-medium text-ink">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="text-ink-soft disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function BookingSearchStep({ defaults, checkInTime, checkOutTime, onSubmit }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const rootRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState({
    checkIn: defaults.checkIn || today,
    checkOut: defaults.checkOut,
    adults: defaults.adults || "2",
    children: defaults.children || "0",
    rooms: defaults.rooms || "1",
  });
  const [panel, setPanel] = useState<DatePickerFocus | null>(null);
  const [focus, setFocus] = useState<DatePickerFocus>("check-in");
  const [error, setError] = useState(false);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setPanel(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const openDate = (next: DatePickerFocus) => {
    setFocus(next);
    setPanel(next);
    setError(false);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!values.checkOut) {
      setError(true);
      openDate("check-out");
      return;
    }
    onSubmit(values);
  };

  const dateBtn = (which: DatePickerFocus, label: string, value: string) => (
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => openDate(which)}
        className={cn(
          "flex w-full flex-col border border-stone/45 bg-white px-4 py-3.5 text-left transition hover:border-lamp/40",
          panel === which && "border-lamp bg-sand/30",
          error && which === "check-out" && !values.checkOut && "ring-2 ring-red-300",
        )}
      >
        <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-lamp uppercase">{label}</span>
        <span className="mt-1.5 flex items-center gap-2 text-sm font-medium text-ink">
          <Calendar className="h-4 w-4 text-ink-soft" aria-hidden />
          {value ? formatStayDate(value) : "Select date"}
        </span>
      </button>
      {panel === which ? (
        <div className="absolute top-full left-0 z-40 mt-2">
          <BookingCalendar
            checkIn={values.checkIn}
            checkOut={values.checkOut}
            focus={focus}
            onFocusChange={setFocus}
            onChange={(checkIn, checkOut) => {
              setValues((c) => ({ ...c, checkIn, checkOut }));
              setError(false);
            }}
            onComplete={() => setPanel(null)}
          />
        </div>
      ) : null}
    </div>
  );

  return (
    <form ref={rootRef} onSubmit={submit} className="border border-stone/40 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(22,20,16,0.35)] md:p-8">
      <h2 className="display text-3xl text-ink">When will you arrive?</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Check-in {checkInTime} · Check-out {checkOutTime}. Availability is confirmed by the booking engine.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {dateBtn("check-in", "Check-in", values.checkIn)}
        {dateBtn("check-out", "Check-out", values.checkOut)}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Counter
          label="Adults"
          value={Number(values.adults)}
          min={1}
          max={10}
          onChange={(n) => setValues((c) => ({ ...c, adults: String(n) }))}
        />
        <Counter
          label="Children"
          value={Number(values.children)}
          min={0}
          max={10}
          onChange={(n) => setValues((c) => ({ ...c, children: String(n) }))}
        />
        <Counter
          label="Rooms"
          value={Number(values.rooms)}
          min={1}
          max={5}
          onChange={(n) => setValues((c) => ({ ...c, rooms: String(n) }))}
        />
      </div>

      {error && !values.checkOut ? (
        <p className="mt-4 text-sm text-red-700">Please choose a check-out date.</p>
      ) : null}

      <button type="submit" className="btn btn-gold mt-8 w-full md:w-auto">
        Show available rooms
      </button>
    </form>
  );
}
