"use client";

import { BookingSearch } from "@/components/booking-search";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  roomSlug: string;
  roomName: string;
  price: string;
};

export function RoomDetailBookingPanel({ roomSlug, roomName, price }: Props) {
  return (
    <>
      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--site-header-height)+1.25rem)]">
          <BookingCard roomSlug={roomSlug} roomName={roomName} price={price} />
        </div>
      </div>

      <div className="lg:hidden">
        <BookingCard roomSlug={roomSlug} roomName={roomName} price={price} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone/40 bg-white/95 px-4 py-3 shadow-[0_-12px_40px_-20px_rgba(22,20,16,0.35)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{roomName}</p>
            <p className="text-xs text-ink-soft">From {price} / night</p>
          </div>
          <Link href={`/book?room=${roomSlug}`} className="btn btn-gold shrink-0 gap-2 py-2.5">
            Book
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </>
  );
}

function BookingCard({ roomSlug, roomName, price }: { roomSlug: string; roomName: string; price: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone/35 bg-white shadow-[0_28px_70px_-48px_rgba(22,20,16,0.35)]">
      <div className="border-b border-stone/30 bg-ink px-6 py-5 text-sand">
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-lamp-soft uppercase">Book this room</p>
        <p className="display mt-1 text-3xl text-sand">{price}</p>
        <p className="mt-1 text-xs text-sand/65">per night · {roomName}</p>
      </div>
      <div className="p-5 md:p-6">
        <p className="text-sm text-ink-soft">Select dates and guests for live rates and availability.</p>
        <div className="mt-4">
          <BookingSearch layout="compact" roomSlug={roomSlug} />
        </div>
        <Link
          href={`/book?room=${roomSlug}`}
          className="btn btn-gold mt-4 inline-flex w-full justify-center gap-2"
        >
          Continue to booking
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <p className="mt-4 text-center text-[0.65rem] leading-relaxed text-ink-soft">
          Taxes and fees shown at checkout. Your room is held while you complete payment.
        </p>
      </div>
    </div>
  );
}
