"use client";

import { api } from "@/lib/api";
import { formatStayRange } from "@/lib/booking-utils";
import { formatMoney } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Confirmation() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? "";
  const email = params.get("email") ?? "";
  const booking = useQuery({
    queryKey: ["booking", reference, email],
    queryFn: async () => {
      const current = await api.booking(reference, email);
      // Returning from Hubtel: ask the API to confirm with Hubtel directly in case its callback hasn't arrived.
      if (current.status === "PAYMENT_PROCESSING" && current.payment?.provider === "HUBTEL") {
        const refreshed = await api.refreshHubtel(reference).catch(() => null);
        if (refreshed && refreshed.status !== current.status) return api.booking(reference, email);
      }
      return current;
    },
    enabled: Boolean(reference && email),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "PENDING_PAYMENT" || status === "PAYMENT_PROCESSING" ? 8000 : false;
    },
  });

  if (!reference || !email) {
    return (
      <div className="mx-auto max-w-lg px-5 pt-32 text-center">
        <p className="display text-3xl text-ink">Find your reservation</p>
        <p className="mt-3 text-sm text-ink-soft">Add a booking reference and email to view this page.</p>
        <Link href="/book" className="btn btn-gold mt-8 inline-flex">
          Start a booking
        </Link>
      </div>
    );
  }

  if (booking.isLoading) {
    return <p className="pt-32 text-center text-sm text-ink-soft">Finding your reservation…</p>;
  }
  if (booking.isError) {
    return <p className="pt-32 text-center text-sm text-red-700">{(booking.error as Error).message}</p>;
  }
  const data = booking.data;
  if (!data) return null;

  const statusLabel = data.status.replaceAll("_", " ");

  return (
    <div className="bg-sand px-5 pt-28 pb-20 md:px-8">
      <div className="mx-auto max-w-2xl border border-stone/40 bg-white shadow-[0_24px_60px_-40px_rgba(22,20,16,0.3)]">
        <div className="border-b border-stone/35 bg-ink px-6 py-8 text-sand md:px-8">
          <p className="eyebrow text-lamp-soft">Reservation</p>
          <h1 className="display mt-2 text-4xl md:text-5xl">{data.reference}</h1>
          <p className="mt-3 text-sm text-sand/80">
            {data.guest.firstName} {data.guest.lastName} · <span className="uppercase tracking-wide">{statusLabel}</span>
          </p>
        </div>
        <dl className="space-y-4 px-6 py-8 text-sm md:px-8">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Room</dt>
            <dd className="font-medium text-ink">{data.rooms[0]?.roomTypeName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Dates</dt>
            <dd className="text-right text-ink">{formatStayRange(data.checkIn, data.checkOut)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Guests</dt>
            <dd className="text-ink">
              {data.adults} adults, {data.children} children
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-stone/35 pt-4 text-base">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="font-semibold text-ink">{formatMoney(data.total, data.currency)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Payment</dt>
            <dd className="text-ink">{data.payment?.status ?? "PENDING"}</dd>
          </div>
        </dl>
        {data.status === "PENDING_PAYMENT" || data.status === "PAYMENT_PROCESSING" ? (
          <div className="border-t border-stone/35 bg-sand/50 px-6 py-5 text-sm text-ink-soft md:px-8">
            <p>
              {data.status === "PAYMENT_PROCESSING"
                ? "Waiting for your payment to be confirmed — this page updates automatically. "
                : ""}
              The room is held until{" "}
              {data.holdExpiresAt ? new Date(data.holdExpiresAt).toLocaleTimeString() : "the hold expires"}. Complete
              payment to confirm, or the villa can confirm if payment is still pending.
            </p>
            <Link
              href={`/book?step=pay&reference=${data.reference}&email=${encodeURIComponent(email)}&checkIn=${data.checkIn}&checkOut=${data.checkOut}`}
              className="btn btn-gold mt-4 inline-flex"
            >
              Return to payment
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<p className="pt-32 text-center text-sm text-ink-soft">Loading…</p>}>
      <Confirmation />
    </Suspense>
  );
}
