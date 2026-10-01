"use client";

import { useBookingCalendarPopover } from "@/components/booking-calendar-popover";
import type { DatePickerFocus } from "@/components/booking-calendar";
import { formatStayDate } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { Calendar, Minus, Plus } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

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
    <div className="flex items-center justify-between rounded-xl border border-stone/40 bg-sand/40 px-3 py-2.5 sm:px-4 sm:py-3">
      <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink uppercase">{label}</p>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition hover:bg-white disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[1.75rem] text-center text-lg font-medium tabular-nums text-ink">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition hover:bg-white disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function BookingSearchStep({ defaults, checkInTime, checkOutTime, onSubmit }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const formRef = useRef<HTMLFormElement>(null);
  const checkInRef = useRef<HTMLButtonElement>(null);
  const checkOutRef = useRef<HTMLButtonElement>(null);
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

  const closePanel = useCallback(() => setPanel(null), []);

  useEffect(() => {
    setValues({
      checkIn: defaults.checkIn || today,
      checkOut: defaults.checkOut,
      adults: defaults.adults || "2",
      children: defaults.children || "0",
      rooms: defaults.rooms || "1",
    });
  }, [defaults.checkIn, defaults.checkOut, defaults.adults, defaults.children, defaults.rooms, today]);

  const calendarPortal = useBookingCalendarPopover({
    panel,
    checkIn: values.checkIn,
    checkOut: values.checkOut,
    focus,
    onFocusChange: setFocus,
    onChange: (checkIn, checkOut) => {
      setValues((c) => ({ ...c, checkIn, checkOut }));
      setError(false);
    },
    onComplete: closePanel,
    checkInTriggerRef: checkInRef,
    checkOutTriggerRef: checkOutRef,
    formRef,
  });

  const openDate = (next: DatePickerFocus) => {
    setFocus(next);
    setPanel((current) => (current === next ? null : next));
    setError(false);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!values.checkOut) {
      setError(true);
      openDate("check-out");
      return;
    }
    setPanel(null);
    onSubmit(values);
  };

  const dateBtn = (which: DatePickerFocus, label: string, value: string) => (
    <div className="relative flex-1">
      <button
        ref={which === "check-in" ? checkInRef : checkOutRef}
        type="button"
        onClick={() => openDate(which)}
        className={cn(
          "flex min-h-[4.25rem] w-full flex-col rounded-xl border border-stone/40 bg-white px-4 py-3.5 text-left transition hover:border-lamp/45",
          panel === which && "border-lamp bg-sand/40 ring-1 ring-lamp/25",
          error && which === "check-out" && !values.checkOut && "ring-2 ring-red-300",
        )}
      >
        <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-lamp uppercase">{label}</span>
        <span className="mt-1.5 flex min-w-0 items-center gap-2 text-base font-medium text-ink sm:text-sm">
          <Calendar className="h-4 w-4 text-ink-soft" aria-hidden />
          {value ? formatStayDate(value) : "Select date"}
        </span>
      </button>
    </div>
  );

  return (
    <>
      <form id="book-search-form" ref={formRef} onSubmit={submit} className="relative">
        <div className="flex flex-col gap-3 sm:flex-row">
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

        <p className="mt-4 text-xs text-ink-soft">
          Check-in {checkInTime} · Check-out {checkOutTime}
        </p>

        <button type="submit" className="btn btn-gold mt-6 hidden w-full lg:inline-flex lg:w-auto">
          Show available rooms
        </button>
      </form>
      {calendarPortal}
    </>
  );
}
