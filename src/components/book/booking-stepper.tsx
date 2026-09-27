"use client";

import { BOOK_STEPS, type BookStepId } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = {
  current: BookStepId;
};

export function BookingStepper({ current }: Props) {
  const currentIndex = BOOK_STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="flex w-full items-center gap-1 md:gap-2">
      {BOOK_STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1 md:gap-2">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center text-[0.7rem] font-bold transition",
                  done && "bg-lamp text-ink",
                  active && "bg-ink text-sand",
                  !done && !active && "border border-stone/50 bg-white text-ink-soft",
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden /> : `0${index + 1}`}
              </span>
              <span
                className={cn(
                  "truncate text-[0.58rem] font-semibold tracking-[0.12em] uppercase md:text-[0.65rem]",
                  active || done ? "text-ink" : "text-ink-soft/60",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < BOOK_STEPS.length - 1 ? (
              <div
                className={cn("mb-5 h-px flex-1", index < currentIndex ? "bg-lamp" : "bg-stone/40")}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
