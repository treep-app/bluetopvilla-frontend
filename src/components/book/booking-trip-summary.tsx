"use client";

import { cleanRoomCopy, formatStayRange } from "@/lib/booking-utils";
import { checkTimesLabel } from "@/lib/property";
import type { AvailabilityRoom, PropertySettings } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  checkIn: string;
  checkOut: string;
  adults: number;
  /** Number of children staying. Not React `children` — the lint rule rejects that prop name. */
  childrenCount: number;
  roomsCount: number;
  room?: AvailabilityRoom | null;
  property: PropertySettings;
  guestName?: string;
  /** Applied Golden Ticket / coupon discount preview. */
  promo?: {
    code: string;
    offerTitle: string;
    discountPercent: number;
    discountAmount: number;
    total: number;
  } | null;
  continueLabel?: string;
  onContinue?: () => void;
  continueDisabled?: boolean;
};

export function BookingTripSummary({
  checkIn,
  checkOut,
  adults,
  childrenCount,
  roomsCount,
  room,
  property,
  guestName,
  promo,
  continueLabel,
  onContinue,
  continueDisabled,
}: Props) {
  const discountAmount = promo?.discountAmount ?? (room ? Number(room.discount) : 0);
  const totalAmount = promo?.total ?? (room ? Number(room.total) : 0);

  return (
    <aside className="overflow-hidden rounded-2xl border border-stone/35 bg-white shadow-[0_24px_60px_-40px_rgba(22,20,16,0.2)] lg:sticky lg:top-[calc(var(--site-header-height)+1.25rem)]">
      <div className="border-b border-stone/30 px-5 py-4">
        <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-lamp uppercase">Your stay</p>
        <p className="display mt-1 text-2xl text-ink">{property.name}</p>
        {property.address ? <p className="mt-1 text-xs leading-snug text-ink-soft">{property.address}</p> : null}
      </div>

      {room?.featuredImage ? (
        <div className="relative aspect-[16/10]">
          <Image src={room.featuredImage} alt={room.name} fill className="object-cover" sizes="360px" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 py-3">
            <p className="font-display text-lg text-sand">{room.name}</p>
          </div>
        </div>
      ) : null}

      <div className="space-y-4 px-5 py-5 text-sm">
        <Row label="Dates">
          <p className="font-medium text-ink">{formatStayRange(checkIn, checkOut)}</p>
          {room ? (
            <p className="mt-0.5 text-xs text-ink-soft">
              {room.nights} night{room.nights === 1 ? "" : "s"}
            </p>
          ) : null}
        </Row>

        <Row label="Guests">
          <p className="text-ink">
            {adults} adult{adults === 1 ? "" : "s"}
            {childrenCount > 0 ? `, ${childrenCount} child${childrenCount === 1 ? "" : "ren"}` : ""}
            {" · "}
            {roomsCount} room{roomsCount === 1 ? "" : "s"}
          </p>
        </Row>

        {room && !room.featuredImage ? (
          <Row label="Room">
            <p className="font-medium text-ink">{room.name}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">{cleanRoomCopy(room.description)}</p>
          </Row>
        ) : null}

        {guestName ? (
          <Row label="Guest">
            <p className="text-ink">{guestName}</p>
          </Row>
        ) : null}

        {room ? (
          <dl className="space-y-2 border-t border-stone/30 pt-4">
            <div className="flex justify-between gap-3 text-ink-soft">
              <dt>
                {formatMoney(room.nightly, room.currency)} × {room.nights} night
                {room.nights === 1 ? "" : "s"}
              </dt>
              <dd>{formatMoney(room.subtotal, room.currency)}</dd>
            </div>
            <div className="flex justify-between gap-3 text-ink-soft">
              <dt>Taxes &amp; fees</dt>
              <dd>{formatMoney(Number(room.taxes) + Number(room.fees), room.currency)}</dd>
            </div>
            {discountAmount > 0 ? (
              <div className="flex justify-between gap-3 text-emerald-800">
                <dt>
                  Coupon{promo?.code ? ` (${promo.code})` : ""}
                  {promo?.discountPercent ? ` · ${promo.discountPercent}% off` : ""}
                </dt>
                <dd>−{formatMoney(discountAmount, room.currency)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3 border-t border-stone/30 pt-3">
              <dt className="text-[0.65rem] font-semibold tracking-[0.14em] text-ink-soft uppercase">Total</dt>
              <dd className="display text-2xl leading-none text-ink">{formatMoney(totalAmount, room.currency)}</dd>
            </div>
          </dl>
        ) : (
          <p className="border-t border-stone/30 pt-4 text-xs text-ink-soft">
            Select a room to see your total.
          </p>
        )}

        {continueLabel && onContinue ? (
          <button
            type="button"
            onClick={onContinue}
            disabled={continueDisabled}
            className="btn btn-gold inline-flex w-full justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {continueLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : null}

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

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
