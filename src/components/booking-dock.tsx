"use client";

import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { BookingCalendar, type DatePickerFocus } from "@/components/booking-calendar";
import { Calendar, MapPin, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function formatStayDate(value: string) {
  if (!value) return "Select date";
  try {
    return format(parseISO(value), "d MMMM yyyy");
  } catch {
    return "Select date";
  }
}

type ActivePanel = "check-in" | "check-out" | null;

type Props = {
  /** Full-width bar anchored to hero bottom (Serena-style) */
  variant?: "serena" | "card";
  visible?: boolean;
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
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex h-full min-h-[5.25rem] flex-col justify-center px-4 py-3 md:px-5">
      <p className="text-[0.7rem] font-medium tracking-[0.12em] text-lamp uppercase">{label}</p>
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

export function BookingDock({ variant = "serena", visible = true }: Props) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const dockRef = useRef<HTMLFormElement>(null);
  const [ready, setReady] = useState(false);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [dateFocus, setDateFocus] = useState<DatePickerFocus>("check-in");
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    const appear = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(appear);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const openDates = (focus: DatePickerFocus) => {
    setDateFocus(focus);
    setActivePanel(focus);
    setDateError(false);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!checkOut) {
      setDateError(true);
      setDateFocus("check-out");
      setActivePanel("check-out");
      return;
    }
    router.push(
      `/book?${new URLSearchParams({
        checkIn,
        checkOut,
        adults: String(adults),
        children: String(children),
        rooms: String(rooms),
        step: "rooms",
      }).toString()}`,
    );
  };

  const handleDatesChange = (nextIn: string, nextOut: string) => {
    setCheckIn(nextIn);
    setCheckOut(nextOut);
    setDateError(false);
  };

  const serenaField = (focus: DatePickerFocus, label: string, value: string) => (
    <div className="relative min-h-[5.25rem] flex-1 border-b border-stone/40 md:border-b-0 md:border-r">
      <button
        type="button"
        onClick={() => openDates(focus)}
        aria-expanded={activePanel === focus}
        className={cn(
          "flex h-full w-full flex-col justify-center px-4 py-3 text-left transition hover:bg-sand/30 md:px-5",
          activePanel === focus && "bg-sand/40",
          dateError && !checkOut && focus === "check-out" && "ring-2 ring-inset ring-red-300",
        )}
      >
        <p className="text-[0.7rem] font-medium tracking-[0.12em] text-lamp uppercase">{label}</p>
        <p className="mt-1.5 flex items-center gap-2 text-sm text-ink md:text-[0.95rem]">
          <Calendar className="h-4 w-4 shrink-0 text-ink-soft" strokeWidth={1.5} aria-hidden />
          <span className="truncate font-medium">{formatStayDate(value)}</span>
        </p>
      </button>
      {activePanel === focus ? (
        <div className="absolute bottom-full left-0 z-50 mb-1 flex justify-start px-2 md:px-0">
          <BookingCalendar
            checkIn={checkIn}
            checkOut={checkOut}
            focus={dateFocus}
            onFocusChange={setDateFocus}
            onChange={handleDatesChange}
            onComplete={() => setActivePanel(null)}
          />
        </div>
      ) : null}
    </div>
  );

  const serenaBar = (
    <form
      ref={dockRef}
      onSubmit={onSubmit}
      className="relative w-full border-t border-stone/30 bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row lg:items-stretch">
        <div className="hidden min-h-[5.25rem] flex-col justify-center border-b border-stone/40 px-5 py-3 lg:flex lg:w-[17%] lg:border-b-0 lg:border-r">
          <p className="text-[0.7rem] font-medium tracking-[0.12em] text-lamp uppercase">Where</p>
          <p className="mt-1.5 flex items-start gap-2 text-sm font-medium text-ink">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" strokeWidth={1.5} aria-hidden />
            Blue Top Villa, Kasoa
          </p>
        </div>

        <div className="relative flex flex-[1] flex-col md:flex-row">
          {serenaField("check-in", "Check-in", checkIn)}
          {serenaField("check-out", "Check-out", checkOut)}
          <div className="border-b border-stone/40 md:border-b-0 md:border-r">
            <Counter label="Rooms" value={rooms} min={1} max={5} onChange={setRooms} />
          </div>
          <div className="border-b border-stone/40 md:border-b-0 md:border-r">
            <Counter label="Adults" value={adults} min={1} max={10} onChange={setAdults} />
          </div>
          <div className="border-b border-stone/40 md:border-b-0 md:border-r">
            <Counter label="Children" value={children} min={0} max={10} onChange={setChildren} />
          </div>
        </div>

        <button
          type="submit"
          className="flex min-h-[3.5rem] w-full items-center justify-center bg-[rgb(217,157,38)] px-8 py-4 text-[0.72rem] font-bold tracking-[0.2em] text-white uppercase transition hover:bg-[rgb(200,140,30)] lg:min-h-[5.25rem] lg:w-auto lg:min-w-[11rem]"
        >
          Book now
        </button>
      </div>
      {dateError && !checkOut ? (
        <p className="border-t border-stone/20 px-5 py-2 text-center text-xs text-red-700/90">
          Please choose a check-out date.
        </p>
      ) : null}
    </form>
  );

  if (variant === "serena") {
    return (
      <AnimatePresence>
        {ready && visible ? (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-30 w-full"
          >
            {serenaBar}
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  return null;
}
