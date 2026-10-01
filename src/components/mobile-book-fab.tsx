"use client";

import { showMobileBottomNav } from "@/lib/mobile-chrome";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function isBookFlow(pathname: string) {
  return pathname === "/book" || pathname.startsWith("/book/");
}

export function MobileBookFab() {
  const pathname = usePathname();
  if (isBookFlow(pathname)) return null;

  const docked = showMobileBottomNav(pathname);
  return (
    <Link
      href="/book"
      aria-label="Book your stay"
      className={cn(
        "group fixed z-[55] flex flex-col items-center md:hidden",
        "transition-transform duration-200 active:scale-[0.94]",
        docked
          ? "left-1/2 bottom-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px)-1.1rem)] -translate-x-1/2"
          : "right-4 bottom-[calc(1.125rem+env(safe-area-inset-bottom,0px))]",
      )}
    >
      <span
        className={cn(
          "relative flex items-center justify-center rounded-full text-ink",
          docked ? "h-[3.5rem] w-[3.5rem]" : "h-[3.35rem] gap-2 rounded-full px-5",
          "bg-gradient-to-b from-lamp-soft to-lamp",
          "shadow-[0_10px_32px_rgba(217,157,38,0.55),0_2px_8px_rgba(22,20,16,0.12)]",
          "ring-[3px] ring-sand",
        )}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-white/25 opacity-0 transition-opacity group-active:opacity-100"
          aria-hidden
        />
        <CalendarDays className="relative h-[1.35rem] w-[1.35rem] shrink-0" strokeWidth={2.35} aria-hidden />
        {!docked ? (
          <span className="relative text-[0.68rem] font-bold tracking-[0.1em] uppercase">Book</span>
        ) : null}
      </span>
    </Link>
  );
}
