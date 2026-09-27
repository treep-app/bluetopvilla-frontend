"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/utils";

export default function BookingLookupPage() {
  const { reference } = useParams<{ reference: string }>();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState("");
  const booking = useQuery({
    queryKey: ["booking", reference, submitted],
    queryFn: () => api.booking(reference, submitted),
    enabled: Boolean(submitted),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(email);
  };

  return (
    <div className="bg-sand px-5 pt-32 pb-20">
      <div className="mx-auto max-w-xl bg-white p-8">
        <h1 className="display text-4xl">Find booking {reference}</h1>
        <form onSubmit={onSubmit} className="mt-6">
          <label className="text-xs tracking-[0.16em] uppercase">
            Email used at checkout
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-stone px-3 py-3" />
          </label>
          <button type="submit" className="mt-4 bg-ink px-5 py-3 text-xs tracking-[0.2em] text-sand uppercase">
            Look up
          </button>
        </form>
        {booking.data ? (
          <dl className="mt-8 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Status</dt><dd>{booking.data.status}</dd></div>
            <div className="flex justify-between"><dt>Dates</dt><dd>{booking.data.checkIn} → {booking.data.checkOut}</dd></div>
            <div className="flex justify-between"><dt>Total</dt><dd>{formatMoney(booking.data.total, booking.data.currency)}</dd></div>
          </dl>
        ) : null}
        {booking.isError ? <p className="mt-4 text-sm">{(booking.error as Error).message}</p> : null}
      </div>
    </div>
  );
}
