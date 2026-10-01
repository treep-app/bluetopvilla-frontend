"use client";

import { formatStayRange } from "@/lib/booking-utils";
import type { AvailabilityRoom } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import Image from "next/image";

type Props = {
  checkIn: string;
  checkOut: string;
  room: AvailabilityRoom | null | undefined;
  promoTotal?: number | null;
};

/** Compact stay recap above the fold on phones/tablets (sidebar is desktop-only). */
export function BookingTripSummaryMobile({ checkIn, checkOut, room, promoTotal }: Props) {
  if (!checkIn || !checkOut) return null;

  const total = room ? (promoTotal ?? Number(room.total)) : null;

  return (
    <div className="mb-4 flex min-w-0 items-center gap-3 rounded-xl border border-stone/35 bg-white/90 p-3 shadow-sm lg:hidden">
      {room?.featuredImage ? (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink/10">
          <Image src={room.featuredImage} alt="" fill className="object-cover" sizes="56px" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold tracking-wide text-ink-soft uppercase">
          {room ? room.name : "Your dates"}
        </p>
        <p className="truncate text-sm font-medium text-ink">{formatStayRange(checkIn, checkOut)}</p>
        {total != null && room ? (
          <p className="text-xs text-ink-soft">{formatMoney(total, room.currency)} total</p>
        ) : null}
      </div>
    </div>
  );
}
