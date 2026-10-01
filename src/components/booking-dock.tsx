"use client";

import { useBookingCalendarPopover } from "@/components/booking-calendar-popover";
import { BookingCalendar, type DatePickerFocus } from "@/components/booking-calendar";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MapPin, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
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
    <div className="flex h-full min-h-[4.5rem] flex-col justify-center px-4 py-3 sm:min-h-[5.25rem] md:px-5">
      <p className="text-[0.7rem] font-medium tracking-[0.12em] text-lamp uppercase">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-10 w-10 items-center justify-center text-ink-soft hover:text-ink disabled:opacity-30"
        >
          <Minus className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <span className="min-w-[1.25rem] text-center text-lg font-medium text-ink">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-10 w-10 items-center justify-center text-ink-soft hover:text-ink disabled:opacity-30"
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
  const checkInRef = useRef<HTMLButtonElement>(null);
  const checkOutRef = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [dateFocus, setDateFocus] = useState<DatePickerFocus>("check-in");
  const [dateError, setDateError] = useState(false);
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const appear = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(appear);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsMdUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const closePanel = useCallback(() => setActivePanel(null), []);

  useEffect(() => {
    if (isMdUp) return;
    const onPointerDown = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setActivePanel(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isMdUp]);

  const calendarPortal = useBookingCalendarPopover({
    panel: !isMdUp ? activePanel : null,
    checkIn,
    checkOut,
    focus: dateFocus,
    onFocusChange: setDateFocus,
    onChange: (nextIn, nextOut) => {
      setCheckIn(nextIn);
      setCheckOut(nextOut);
      setDateError(false);
    },
    onComplete: closePanel,
    checkInTriggerRef: checkInRef,
    checkOutTriggerRef: checkOutRef,
    formRef: dockRef,
  });

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

  const serenaField = (
    focus: DatePickerFocus,
    label: string,
    value: string,
    triggerRef: React.RefObject<HTMLButtonElement | null>,
  ) => (
    <div className="relative min-h-[4.5rem] flex-1 border-b border-stone/40 sm:min-h-[5.25rem] md:border-b-0 md:border-r">
      <button
        ref={triggerRef}
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
        <p className="mt-1.5 flex min-w-0 items-center gap-2 text-sm text-ink md:text-[0.95rem]">
          <Calendar className="h-4 w-4 shrink-0 text-ink-soft" strokeWidth={1.5} aria-hidden />
          <span className="truncate font-medium">{formatStayDate(value)}</span>
        </p>
      </button>
      {isMdUp && activePanel === focus ? (
        <div className="absolute bottom-full left-0 z-50 mb-1 flex justify-start px-2 md:px-0">
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
            onComplete={closePanel}
          />
        </div>
      ) : null}
    </div>
  );

  const serenaBar = (
    <form
      ref={dockRef}
      onSubmit={onSubmit}
      className="relative w-full min-w-0 border-t border-stone/30 bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row lg:items-stretch">
        <div className="hidden min-h-[5.25rem] flex-col justify-center border-b border-stone/40 px-5 py-3 lg:flex lg:w-[17%] lg:border-b-0 lg:border-r">
          <p className="text-[0.7rem] font-medium tracking-[0.12em] text-lamp uppercase">Where</p>
          <p className="mt-1.5 flex items-start gap-2 text-sm font-medium text-ink">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" strokeWidth={1.5} aria-hidden />
            Blue Top Villa, Kasoa
          </p>
        </div>

        <div className="relative flex min-w-0 flex-[1] flex-col md:flex-row">
          {serenaField("check-in", "Check-in", checkIn, checkInRef)}
          {serenaField("check-out", "Check-out", checkOut, checkOutRef)}
          <div className="grid grid-cols-3 border-b border-stone/40 md:contents md:border-b-0">
            <div className="border-r border-stone/40 md:border-b-0 md:border-r">
              <Counter label="Rooms" value={rooms} min={1} max={5} onChange={setRooms} />
            </div>
            <div className="border-r border-stone/40 md:border-b-0 md:border-r">
              <Counter label="Adults" value={adults} min={1} max={10} onChange={setAdults} />
            </div>
            <div className="md:border-b-0 md:border-r">
              <Counter label="Children" value={children} min={0} max={10} onChange={setChildren} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex min-h-[3.25rem] w-full items-center justify-center bg-[rgb(217,157,38)] px-6 py-3.5 text-[0.72rem] font-bold tracking-[0.2em] text-white uppercase transition hover:bg-[rgb(200,140,30)] sm:min-h-[3.5rem] lg:min-h-[5.25rem] lg:w-auto lg:min-w-[11rem] lg:px-8 lg:py-4"
        >
          Book now
        </button>
      </div>
      {dateError && !checkOut ? (
        <p className="border-t border-stone/20 px-4 py-2 text-center text-xs text-red-700/90 sm:px-5">
          Please choose a check-out date.
        </p>
      ) : null}
      {calendarPortal}
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
            className="relative z-30 w-full min-w-0"
          >
            {serenaBar}
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  return null;
}
