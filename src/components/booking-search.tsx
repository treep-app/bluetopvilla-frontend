"use client";

import { BookingCalendar, type DatePickerFocus } from "@/components/booking-calendar";
import { formatStayDate } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { Calendar, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  tone?: "light" | "dark";
};

function Counter({
  label,
  value,
  min,
  max,
  onChange,
  tone,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  tone: "light" | "dark";
}) {
  return (
    <div className="flex flex-col justify-end">
      <p
        className={cn(
          "text-[0.65rem] font-semibold tracking-[0.14em] uppercase",
          tone === "dark" ? "text-sand/70" : "text-ink-soft",
        )}
      >
        {label}
      </p>
      <div
        className={cn(
          "mt-2 flex items-center justify-between border px-3 py-2.5",
          tone === "dark" ? "border-white/25 text-sand" : "border-stone/50 bg-white text-ink",
        )}
      >
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[1.25rem] text-center text-base font-medium">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

type PopoverPos = { top: number; left: number; openUp: boolean };

export function BookingSearch({ tone = "light" }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const checkInRef = useRef<HTMLButtonElement>(null);
  const checkOutRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [panel, setPanel] = useState<DatePickerFocus | null>(null);
  const [focus, setFocus] = useState<DatePickerFocus>("check-in");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<PopoverPos | null>(null);

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const trigger = panel === "check-out" ? checkOutRef.current : checkInRef.current;
    if (!trigger || !panel) {
      setPos(null);
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const calendarApproxHeight = 420;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < calendarApproxHeight && rect.top > calendarApproxHeight;
    const width = Math.min(560, window.innerWidth - 24);
    let left = rect.left;
    if (left + width > window.innerWidth - 12) left = Math.max(12, window.innerWidth - width - 12);
    setPos({
      top: openUp ? rect.top - 8 : rect.bottom + 8,
      left,
      openUp,
    });
  }, [panel]);

  useLayoutEffect(() => {
    if (!panel) {
      setPos(null);
      return;
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [panel, updatePosition]);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (formRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setPanel(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!checkOut) {
      setError(true);
      setFocus("check-out");
      setPanel("check-out");
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

  const dark = tone === "dark";

  const dateBtn = (which: DatePickerFocus, label: string, value: string) => (
    <div className="relative">
      <button
        ref={which === "check-in" ? checkInRef : checkOutRef}
        type="button"
        onClick={() => {
          setFocus(which);
          setPanel((current) => (current === which ? null : which));
          setError(false);
        }}
        className={cn(
          "flex w-full flex-col border px-3 py-2.5 text-left transition",
          dark
            ? "border-white/25 bg-transparent text-sand hover:border-white/45"
            : "border-stone/50 bg-white text-ink hover:border-lamp/40",
          panel === which && (dark ? "border-lamp" : "border-lamp bg-sand/30"),
          error && which === "check-out" && !checkOut && "ring-2 ring-red-400",
        )}
      >
        <span
          className={cn(
            "text-[0.65rem] font-semibold tracking-[0.14em] uppercase",
            dark ? "text-sand/70" : "text-lamp",
          )}
        >
          {label}
        </span>
        <span className="mt-1 flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-3.5 w-3.5 opacity-70" aria-hidden />
          {value ? formatStayDate(value) : "Select date"}
        </span>
      </button>
    </div>
  );

  const calendarPortal =
    mounted && panel && pos
      ? createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[200]"
            style={{
              top: pos.openUp ? undefined : pos.top,
              bottom: pos.openUp ? window.innerHeight - pos.top : undefined,
              left: pos.left,
              maxWidth: "min(560px, calc(100vw - 24px))",
            }}
          >
            <BookingCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              focus={focus}
              onFocusChange={setFocus}
              onChange={(nextIn, nextOut) => {
                setCheckIn(nextIn);
                setCheckOut(nextOut);
                setError(false);
              }}
              onComplete={() => setPanel(null)}
            />
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className={cn(
          "relative z-10 grid gap-3 overflow-visible p-4 md:grid-cols-6 md:items-end",
          dark ? "bg-ink/70 text-sand backdrop-blur" : "border border-stone/40 bg-white shadow-xl",
        )}
      >
        {dateBtn("check-in", "Check-in", checkIn)}
        {dateBtn("check-out", "Check-out", checkOut)}
        <Counter label="Adults" value={adults} min={1} max={10} onChange={setAdults} tone={tone} />
        <Counter label="Children" value={children} min={0} max={10} onChange={setChildren} tone={tone} />
        <Counter label="Rooms" value={rooms} min={1} max={5} onChange={setRooms} tone={tone} />
        <button
          type="submit"
          className="bg-lamp px-4 py-3 text-xs font-semibold tracking-[0.2em] text-ink uppercase transition hover:bg-lamp-soft"
        >
          Check availability
        </button>
      </form>
      {calendarPortal}
    </>
  );
}
