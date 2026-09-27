"use client";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type DatePickerFocus = "check-in" | "check-out";

type Props = {
  checkIn: string;
  checkOut: string;
  focus: DatePickerFocus;
  onChange: (checkIn: string, checkOut: string) => void;
  onFocusChange: (focus: DatePickerFocus) => void;
  onComplete?: () => void;
};

function toIso(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function parseDate(iso: string) {
  return startOfDay(parseISO(iso));
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function MonthGrid({
  month,
  today,
  checkInDate,
  checkOutDate,
  hoverDate,
  onHover,
  onSelect,
}: {
  month: Date;
  today: Date;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  hoverDate: Date | null;
  onHover: (date: Date | null) => void;
  onSelect: (date: Date) => void;
}) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  const rangeEnd =
    checkInDate && checkOutDate
      ? checkOutDate
      : checkInDate && hoverDate && isAfter(hoverDate, checkInDate)
        ? hoverDate
        : null;

  return (
    <div className="min-w-[252px]">
      <p className="display mb-3 text-center text-lg text-ink">{format(month, "MMMM yyyy")}</p>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1 text-[0.65rem] font-medium tracking-wider text-ink-soft uppercase">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const disabled = isBefore(day, today);
          const isStart = checkInDate && isSameDay(day, checkInDate);
          const isEnd = checkOutDate && isSameDay(day, checkOutDate);
          const inRange =
            checkInDate &&
            rangeEnd &&
            isAfter(day, checkInDate) &&
            isBefore(day, rangeEnd);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled || !inMonth}
              onMouseEnter={() => !disabled && inMonth && onHover(day)}
              onMouseLeave={() => onHover(null)}
              onClick={() => !disabled && inMonth && onSelect(day)}
              className={cn(
                "relative mx-auto flex h-9 w-9 items-center justify-center text-sm transition",
                !inMonth && "invisible",
                disabled && inMonth && "cursor-not-allowed text-ink-soft/35",
                !disabled && inMonth && "text-ink hover:bg-sand-deep/80",
                inRange && "bg-sand-deep/90 text-ink",
                (isStart || isEnd) && "bg-ink font-medium text-sand hover:bg-ink",
                isToday && !isStart && !isEnd && "ring-1 ring-lamp/60 ring-inset",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BookingCalendar({ checkIn, checkOut, focus, onChange, onFocusChange, onComplete }: Props) {
  const today = startOfDay(new Date());
  const checkInDate = checkIn ? parseDate(checkIn) : null;
  const checkOutDate = checkOut ? parseDate(checkOut) : null;

  const [viewMonth, setViewMonth] = useState(() =>
    checkInDate && !isBefore(checkInDate, today) ? startOfMonth(checkInDate) : startOfMonth(today),
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const secondMonth = useMemo(() => addMonths(viewMonth, 1), [viewMonth]);

  const handleSelect = (day: Date) => {
    if (isBefore(day, today)) return;

    if (focus === "check-in") {
      let nextOut = checkOut;
      if (checkOut && !isAfter(parseDate(checkOut), day)) {
        nextOut = "";
      }
      onChange(toIso(day), nextOut);
      onFocusChange("check-out");
      return;
    }

    if (!checkInDate) {
      onChange(toIso(day), "");
      onFocusChange("check-out");
      return;
    }

    if (isBefore(day, checkInDate) || isSameDay(day, checkInDate)) {
      onChange(toIso(day), "");
      onFocusChange("check-out");
      return;
    }

    onChange(checkIn, toIso(day));
    onComplete?.();
  };

  const nights =
    checkInDate && checkOutDate
      ? Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000))
      : null;

  return (
    <div className="w-full max-w-[560px] rounded-xl border border-stone/40 bg-white p-4 shadow-xl md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-stone/25 pb-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onFocusChange("check-in")}
            className={cn(
              "rounded-md px-3 py-2 text-left transition",
              focus === "check-in" ? "bg-sand-deep ring-1 ring-lamp/50" : "hover:bg-sand/60",
            )}
          >
            <p className="text-[0.6rem] tracking-[0.18em] text-ink-soft uppercase">Check-in</p>
            <p className="display text-lg text-ink">
              {checkInDate ? format(checkInDate, "MMM d, yyyy") : "Select"}
            </p>
          </button>
          <button
            type="button"
            onClick={() => onFocusChange("check-out")}
            className={cn(
              "rounded-md px-3 py-2 text-left transition",
              focus === "check-out" ? "bg-sand-deep ring-1 ring-lamp/50" : "hover:bg-sand/60",
            )}
          >
            <p className="text-[0.6rem] tracking-[0.18em] text-ink-soft uppercase">Check-out</p>
            <p className="display text-lg text-ink">
              {checkOutDate ? format(checkOutDate, "MMM d, yyyy") : "Select"}
            </p>
          </button>
        </div>
        {nights ? (
          <p className="text-xs tracking-wide text-ink-soft">
            <span className="font-semibold text-ink">{nights}</span> night{nights === 1 ? "" : "s"}
          </p>
        ) : (
          <p className="text-xs text-ink-soft">
            {focus === "check-in" ? "Choose your arrival date" : "Choose your departure date"}
          </p>
        )}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          disabled={!isAfter(viewMonth, startOfMonth(today))}
          className="flex h-9 w-9 items-center justify-center border border-stone/50 text-ink disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="flex h-9 w-9 items-center justify-center border border-stone/50 text-ink"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:justify-between">
        <MonthGrid
          month={viewMonth}
          today={today}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          hoverDate={hoverDate}
          onHover={setHoverDate}
          onSelect={handleSelect}
        />
        <div className="hidden md:block">
          <MonthGrid
            month={secondMonth}
            today={today}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            hoverDate={hoverDate}
            onHover={setHoverDate}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone/25 pt-3">
        <button
          type="button"
          className="text-xs text-ink-soft underline-offset-2 hover:underline"
          onClick={() => {
            onChange(toIso(today), toIso(addDays(today, 1)));
            onFocusChange("check-out");
          }}
        >
          Tonight · 1 night
        </button>
        <button
          type="button"
          className="btn btn-gold text-[0.65rem]"
          disabled={!checkIn || !checkOut}
          onClick={onComplete}
        >
          Done
        </button>
      </div>
    </div>
  );
}
