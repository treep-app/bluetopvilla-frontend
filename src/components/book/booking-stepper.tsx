"use client";

import { BOOK_STEPS, type BookStepId } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = {
  current: BookStepId;
  variant?: "light" | "dark";
};

export function BookingStepper({ current, variant = "light" }: Props) {
  const currentIndex = BOOK_STEPS.findIndex((s) => s.id === current);
  const dark = variant === "dark";
  const stepMeta = BOOK_STEPS[currentIndex] ?? BOOK_STEPS[0];
  const progress = ((currentIndex + 1) / BOOK_STEPS.length) * 100;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3 sm:hidden">
        <p className={cn("text-xs font-semibold tracking-wide", dark ? "text-sand/80" : "text-ink-soft")}>
          Step {currentIndex + 1} of {BOOK_STEPS.length}
          <span className="mx-1.5 text-lamp">·</span>
          <span className={dark ? "text-sand" : "text-ink"}>{stepMeta.label}</span>
        </p>
        <span className={cn("text-[0.65rem] font-bold tabular-nums", dark ? "text-lamp-soft" : "text-lamp")}>
          {Math.round(progress)}%
        </span>
      </div>
      <div
        className={cn("mb-3 h-1 overflow-hidden rounded-full sm:hidden", dark ? "bg-white/15" : "bg-stone/35")}
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-lamp transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    <ol className="hidden w-full items-center gap-0.5 sm:flex sm:gap-1">
      {BOOK_STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-0.5 sm:gap-1">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-[0.65rem] font-bold transition sm:h-9 sm:w-9",
                  done && "bg-lamp text-ink",
                  active && !dark && "bg-ink text-sand ring-2 ring-lamp/40",
                  active && dark && "bg-sand text-ink ring-2 ring-lamp/50",
                  !done && !active && (dark ? "border border-white/25 bg-white/10 text-sand/70" : "border border-stone/50 bg-white text-ink-soft"),
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden /> : index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-[0.55rem] font-semibold tracking-[0.1em] uppercase sm:text-[0.62rem]",
                  dark && (active || done ? "text-sand" : "text-sand/50"),
                  !dark && (active || done ? "text-ink" : "text-ink-soft/60"),
                )}
              >
                {step.label}
              </span>
            </div>
            {index < BOOK_STEPS.length - 1 ? (
              <div
                className={cn(
                  "mb-4 h-px min-w-[0.35rem] flex-1 sm:min-w-[0.5rem]",
                  index < currentIndex ? "bg-lamp" : dark ? "bg-white/20" : "bg-stone/40",
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
    </div>
  );
}
