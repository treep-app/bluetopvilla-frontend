"use client";

import { cleanRoomCopy, formatStayRange } from "@/lib/booking-utils";
import { checkTimesLabel } from "@/lib/property";
import type { AvailabilityRoom, PropertySettings } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
  room?: AvailabilityRoom | null;
  property: PropertySettings;
  guestName?: string;
};

export function BookingTripSummary({
  checkIn,
  checkOut,
  adults,
  children,
  roomsCount,
  room,
  property,
  guestName,
}: Props) {
  return (
    <aside className="border border-stone/40 bg-white shadow-[0_20px_50px_-40px_rgba(22,20,16,0.3)] lg:sticky lg:top-28">
      <div className="border-b border-stone/35 bg-sand-deep/40 px-5 py-4">
        <p className="text-[0.65rem] font-bold tracking-[0.16em] text-ink-soft uppercase">Your stay</p>
        <p className="display mt-1 text-2xl text-ink">{property.name}</p>
        {property.address ? <p className="mt-1 text-xs text-ink-soft">{property.address}</p> : null}
      </div>

      {room?.featuredImage ? (
        <div className="relative aspect-[16/10]">
          <Image src={room.featuredImage} alt={room.name} fill className="object-cover" sizes="360px" />
        </div>
      ) : null}

      <div className="space-y-4 px-5 py-5 text-sm">
        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Dates</p>
          <p className="mt-1 font-medium text-ink">{formatStayRange(checkIn, checkOut)}</p>
          {room ? (
            <p className="mt-0.5 text-xs text-ink-soft">
              {room.nights} night{room.nights === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Guests</p>
          <p className="mt-1 text-ink">
            {adults} adult{adults === 1 ? "" : "s"}
            {children > 0 ? `, ${children} child${children === 1 ? "" : "ren"}` : ""}
            {" · "}
            {roomsCount} room{roomsCount === 1 ? "" : "s"}
          </p>
        </div>
        {room ? (
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Room</p>
            <p className="mt-1 font-medium text-ink">{room.name}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">{cleanRoomCopy(room.description)}</p>
          </div>
        ) : null}
        {guestName ? (
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Guest</p>
            <p className="mt-1 text-ink">{guestName}</p>
          </div>
        ) : null}

        {room ? (
          <dl className="space-y-2 border-t border-stone/35 pt-4">
            <div className="flex justify-between text-ink-soft">
              <dt>
                {formatMoney(room.nightly, room.currency)} × {room.nights} night{room.nights === 1 ? "" : "s"}
              </dt>
              <dd>{formatMoney(room.subtotal, room.currency)}</dd>
            </div>
            <div className="flex justify-between text-ink-soft">
              <dt>Taxes &amp; fees</dt>
              <dd>{formatMoney(Number(room.taxes) + Number(room.fees), room.currency)}</dd>
            </div>
            {Number(room.discount) > 0 ? (
              <div className="flex justify-between text-ink-soft">
                <dt>Discount</dt>
                <dd>−{formatMoney(room.discount, room.currency)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-stone/30 pt-3 text-base font-semibold text-ink">
              <dt>Total</dt>
              <dd>{formatMoney(room.total, room.currency)}</dd>
            </div>
          </dl>
        ) : (
          <p className="border-t border-stone/35 pt-4 text-xs text-ink-soft">
            Select dates and a room to see your total.
          </p>
        )}

        <p className="text-[0.65rem] leading-relaxed text-ink-soft">
          {checkTimesLabel(property)}.{" "}
          <Link href="/cancellation-policy" className="underline-offset-2 hover:text-ink hover:underline">
            Cancellation policy
          </Link>
        </p>
      </div>
    </aside>
  );
}
