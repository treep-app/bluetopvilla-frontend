"use client";

import { BookingCalendar, type DatePickerFocus } from "@/components/booking-calendar";
import { type RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PopoverPos = { top?: number; left: number; openUp: boolean };

type UseBookingCalendarPopoverOptions = {
  panel: DatePickerFocus | null;
  checkIn: string;
  checkOut: string;
  focus: DatePickerFocus;
  onFocusChange: (focus: DatePickerFocus) => void;
  onChange: (checkIn: string, checkOut: string) => void;
  onComplete: () => void;
  checkInTriggerRef: RefObject<HTMLButtonElement | null>;
  checkOutTriggerRef: RefObject<HTMLButtonElement | null>;
  formRef: RefObject<HTMLElement | null>;
};

export function useBookingCalendarPopover({
  panel,
  checkIn,
  checkOut,
  focus,
  onFocusChange,
  onChange,
  onComplete,
  checkInTriggerRef,
  checkOutTriggerRef,
  formRef,
}: UseBookingCalendarPopoverOptions) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<PopoverPos | null>(null);

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const trigger = panel === "check-out" ? checkOutTriggerRef.current : checkInTriggerRef.current;
    if (!trigger || !panel) {
      setPos(null);
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const calendarApproxHeight = 420;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < calendarApproxHeight && rect.top > calendarApproxHeight;
    const width = Math.min(560, window.innerWidth - 24);
    const isNarrow = window.innerWidth < 768;
    let left = isNarrow ? 12 : rect.left;
    if (!isNarrow && left + width > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - width - 12);
    }
    setPos({
      top: isNarrow ? undefined : openUp ? rect.top - 8 : rect.bottom + 8,
      left: isNarrow ? 12 : left,
      openUp: isNarrow ? true : openUp,
    });
  }, [panel, checkInTriggerRef, checkOutTriggerRef]);

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
      onComplete();
    };
    if (!panel) return;
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [panel, formRef, onComplete]);

  const portal =
    mounted && panel && pos
      ? createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[200] max-md:inset-x-3 max-md:bottom-3 max-md:top-auto max-md:max-h-[min(85svh,520px)] max-md:overflow-y-auto max-md:rounded-2xl max-md:border max-md:border-stone/40 max-md:bg-white max-md:shadow-[0_24px_80px_-24px_rgba(22,20,16,0.35)]"
            style={{
              top: pos.openUp && window.innerWidth >= 768 ? undefined : pos.top,
              bottom:
                window.innerWidth < 768
                  ? "max(12px, env(safe-area-inset-bottom, 0px))"
                  : pos.openUp && pos.top != null
                    ? window.innerHeight - pos.top
                    : undefined,
              left: window.innerWidth < 768 ? undefined : pos.left,
              maxWidth: window.innerWidth < 768 ? undefined : "min(560px, calc(100vw - 24px))",
            }}
          >
            <BookingCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              focus={focus}
              onFocusChange={onFocusChange}
              onChange={onChange}
              onComplete={onComplete}
            />
          </div>,
          document.body,
        )
      : null;

  return portal;
}
