"use client";

import { BookingRoomsStep } from "@/components/book/booking-rooms-step";
import { BookingSearchStep } from "@/components/book/booking-search-step";
import { BookingStepper } from "@/components/book/booking-stepper";
import { BookingTripSummary } from "@/components/book/booking-trip-summary";
import { api } from "@/lib/api";
import { type BookStepId, formatStayRange } from "@/lib/booking-utils";
import type { PropertySettings } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

const CHANNEL_LABELS: Record<string, string> = {
  "mtn-gh": "MTN",
  "vodafone-gh": "Telecel",
  "tigo-gh": "AirtelTigo",
};

export function BookingFlow({ property }: { property: PropertySettings }) {
  const params = useSearchParams();
  const router = useRouter();
  const step = (params.get("step") ?? "search") as BookStepId;
  const checkIn = params.get("checkIn") ?? "";
  const checkOut = params.get("checkOut") ?? "";
  const adults = Number(params.get("adults") ?? 2);
  const children = Number(params.get("children") ?? 0);
  const rooms = Number(params.get("rooms") ?? 1);
  const selected = params.get("room") ?? "";

  const search = useQuery({
    queryKey: ["availability", checkIn, checkOut, adults, children, rooms],
    queryFn: () => api.search({ checkIn, checkOut, adults, children, rooms }),
    enabled: Boolean(checkIn && checkOut) && ["rooms", "guest", "summary", "pay"].includes(step),
  });

  const chosen =
    search.data?.results.find((room) => room.slug === selected) ??
    (selected ? undefined : search.data?.results[0]);

  const [guest, setGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Ghana",
    specialRequests: "",
  });
  const paymentOptions = useQuery({ queryKey: ["payment-options"], queryFn: () => api.paymentOptions() });
  const holdMinutes = paymentOptions.data?.holdMinutes;
  const [channel, setChannel] = useState("mtn-gh");
  const [msisdn, setMsisdn] = useState("");
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);

  const setStep = (next: string, extra?: Record<string, string>) => {
    const nextParams = new URLSearchParams(params.toString());
    nextParams.set("step", next);
    Object.entries(extra ?? {}).forEach(([key, value]) => nextParams.set(key, value));
    router.push(`/book?${nextParams.toString()}`);
    setMessage("");
  };

  const create = useMutation({
    mutationFn: () =>
      api.createBooking({
        checkIn,
        checkOut,
        adults,
        children,
        rooms,
        roomTypeSlug: chosen?.slug,
        ...guest,
      }),
    onSuccess: (booking) => {
      setStep("pay", { reference: booking.reference, email: guest.email });
    },
    onError: (error: Error) => setMessage(error.message),
  });

  const payHubtel = useMutation({
    mutationFn: () =>
      api.payHubtel({
        bookingReference: params.get("reference"),
        channel,
        msisdn: msisdn || guest.phone,
      }),
    onSuccess: (result) => {
      // Checkout mode: continue on Hubtel's page. Direct mode: prompt sent — track it on the confirmation page.
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
        return;
      }
      const reference = params.get("reference") ?? "";
      const email = params.get("email") ?? guest.email;
      router.push(`/book/confirmation?reference=${encodeURIComponent(reference)}&email=${encodeURIComponent(email)}`);
    },
    onError: (error: Error) => setMessage(error.message),
  });

  const payStripe = useMutation({
    mutationFn: () => api.payStripe({ bookingReference: params.get("reference") }),
    onSuccess: (result) => {
      if (result.redirectUrl) window.location.href = result.redirectUrl;
      else setMessage(result.message);
    },
    onError: (error: Error) => setMessage(error.message),
  });

  const guestName = [guest.firstName, guest.lastName].filter(Boolean).join(" ");

  return (
    <div className="bg-sand">
      <header className="border-b border-stone/30 bg-ink text-sand">
        <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-28 md:px-8 md:pt-32">
          <p className="eyebrow text-lamp-soft">Reservations</p>
          <h1 className="display mt-2 text-4xl md:text-5xl">Book your stay</h1>
          <p className="mt-3 max-w-xl text-sm text-sand/75">
            Secure online booking at {property.name}. Your room is held while you complete
            payment.
          </p>
          <div className="mt-8 max-w-3xl">
            <BookingStepper current={["search", "rooms", "guest", "summary", "pay"].includes(step) ? step : "search"} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 md:px-8 lg:grid-cols-12 lg:py-12">
        <div className="min-w-0 lg:col-span-8">
          {step === "search" ? (
            <BookingSearchStep
              defaults={{
                checkIn,
                checkOut,
                adults: String(adults),
                children: String(children),
                rooms: String(rooms),
              }}
              checkInTime={property.checkInTime}
              checkOutTime={property.checkOutTime}
              onSubmit={(values) => setStep("rooms", values)}
            />
          ) : null}

          {step === "rooms" ? (
            <div>
              <button
                type="button"
                onClick={() => setStep("search")}
                className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Change dates
              </button>
              <p className="mb-5 text-sm text-ink-soft">
                Showing rooms for <span className="font-medium text-ink">{formatStayRange(checkIn, checkOut)}</span>
              </p>
              <BookingRoomsStep
                rooms={search.data?.results ?? []}
                selectedSlug={selected || chosen?.slug || ""}
                loading={search.isLoading}
                error={search.isError ? (search.error as Error).message : null}
                onSelect={(slug) => setStep("guest", { room: slug })}
              />
            </div>
          ) : null}

          {step === "guest" ? (
            <form
              className="border border-stone/40 bg-white p-6 md:p-8"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                setStep("summary");
              }}
            >
              <button
                type="button"
                onClick={() => setStep("rooms")}
                className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Change room
              </button>
              <h2 className="display text-3xl text-ink">Guest details</h2>
              <p className="mt-2 text-sm text-ink-soft">We will send confirmation to this email and phone.</p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {(
                  [
                    ["firstName", "First name", "text"],
                    ["lastName", "Last name", "text"],
                    ["email", "Email", "email"],
                    ["phone", "Phone", "tel"],
                    ["country", "Country", "text"],
                  ] as const
                ).map(([field, label, type]) => (
                  <label key={field} className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
                    {label}
                    <input
                      required={field !== "country"}
                      type={type}
                      value={guest[field]}
                      onChange={(e) => setGuest((c) => ({ ...c, [field]: e.target.value }))}
                      className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
                    />
                  </label>
                ))}
                <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase md:col-span-2">
                  Special requests
                  <textarea
                    value={guest.specialRequests}
                    onChange={(e) => setGuest((c) => ({ ...c, specialRequests: e.target.value }))}
                    className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
                    rows={3}
                    placeholder="Arrival time, dietary needs, celebration notes…"
                  />
                </label>
              </div>
              <button type="submit" className="btn btn-gold mt-8 gap-2">
                Review booking
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>
          ) : null}

          {step === "summary" && chosen ? (
            <div className="border border-stone/40 bg-white p-6 md:p-8">
              <button
                type="button"
                onClick={() => setStep("guest")}
                className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Edit guest
              </button>
              <h2 className="display text-3xl text-ink">Review &amp; hold</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Confirming holds the room{holdMinutes ? ` for ${holdMinutes} minutes` : ""} while you pay.
              </p>

              <dl className="mt-8 space-y-3 border border-stone/35 bg-sand/40 p-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Room</dt>
                  <dd className="font-medium text-ink">{chosen.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Dates</dt>
                  <dd className="text-right text-ink">{formatStayRange(checkIn, checkOut)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Guests</dt>
                  <dd className="text-ink">
                    {adults} adults{children > 0 ? `, ${children} children` : ""}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Guest</dt>
                  <dd className="text-ink">{guestName || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-stone/35 pt-3 text-base">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd className="font-semibold text-ink">{formatMoney(chosen.total, chosen.currency)}</dd>
                </div>
              </dl>

              <label className="mt-6 flex items-start gap-3 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I accept the{" "}
                  <Link href="/terms" className="text-ink underline-offset-2 hover:underline">
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/cancellation-policy" className="text-ink underline-offset-2 hover:underline">
                    cancellation policy
                  </Link>
                  .
                </span>
              </label>

              <div className="mt-6 flex items-start gap-2 text-xs text-ink-soft">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-lamp" aria-hidden />
                Secure hold — pay online with mobile money or card.
              </div>

              <button
                type="button"
                onClick={() => create.mutate()}
                disabled={create.isPending || !accepted}
                className="btn btn-gold mt-6 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {create.isPending ? "Holding the room…" : "Confirm and hold room"}
              </button>
              {message ? <p className="mt-4 text-sm text-red-700">{message}</p> : null}
            </div>
          ) : null}

          {step === "pay" ? (
            <div>
              <h2 className="display text-3xl text-ink">Complete payment</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Reference <strong className="text-ink">{params.get("reference")}</strong> — your room is held
                {holdMinutes ? ` for ${holdMinutes} minutes` : ""} while you pay.
              </p>
              {paymentOptions.isLoading ? (
                <p className="mt-8 text-sm text-ink-soft">Loading payment options…</p>
              ) : paymentOptions.isError ? (
                <p className="mt-8 text-sm text-red-700">{(paymentOptions.error as Error).message}</p>
              ) : !paymentOptions.data?.hubtel.enabled && !paymentOptions.data?.stripe.enabled ? (
                <div className="mt-8 border border-stone/40 bg-white p-6 text-sm text-ink-soft">
                  Online payment isn&apos;t available right now. Your room is held — contact the villa to pay and
                  confirm your booking.
                </div>
              ) : (
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {paymentOptions.data.hubtel.enabled ? (
                    <div className="border border-stone/40 bg-white p-6">
                      <p className="text-[0.65rem] font-bold tracking-[0.14em] text-lamp uppercase">Ghana</p>
                      <h3 className="display mt-2 text-2xl text-ink">Mobile money</h3>
                      {paymentOptions.data.hubtel.mode === "checkout" ? (
                        <p className="mt-2 text-sm text-ink-soft">
                          Pay securely on Hubtel with MTN, Telecel or AirtelTigo mobile money, or a card.
                        </p>
                      ) : (
                        <>
                          <p className="mt-2 text-sm text-ink-soft">We&apos;ll send a payment prompt to your phone.</p>
                          <label className="mt-5 block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
                            Network
                            <select
                              value={channel}
                              onChange={(e) => setChannel(e.target.value)}
                              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink"
                            >
                              {paymentOptions.data.hubtel.channels.map((value) => (
                                <option key={value} value={value}>
                                  {CHANNEL_LABELS[value] ?? value}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="mt-4 block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
                            Mobile money number
                            <input
                              value={msisdn}
                              onChange={(e) => setMsisdn(e.target.value)}
                              inputMode="tel"
                              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink"
                              placeholder={guest.phone || "055…"}
                            />
                          </label>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => payHubtel.mutate()}
                        disabled={payHubtel.isPending}
                        className="btn btn-ink mt-5 w-full"
                      >
                        {payHubtel.isPending
                          ? paymentOptions.data.hubtel.mode === "checkout"
                            ? "Opening Hubtel…"
                            : "Sending prompt…"
                          : "Pay with Hubtel"}
                      </button>
                    </div>
                  ) : null}
                  {paymentOptions.data.stripe.enabled ? (
                    <div className="border border-stone/40 bg-white p-6">
                      <p className="text-[0.65rem] font-bold tracking-[0.14em] text-lamp uppercase">International</p>
                      <h3 className="display mt-2 text-2xl text-ink">Card payment</h3>
                      <p className="mt-2 text-sm text-ink-soft">Stripe Checkout for cards worldwide.</p>
                      <button
                        type="button"
                        onClick={() => payStripe.mutate()}
                        disabled={payStripe.isPending}
                        className="btn btn-ghost mt-8 w-full border-ink/25 text-ink"
                      >
                        {payStripe.isPending ? "Opening Stripe…" : "Continue to Stripe"}
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
              {params.get("reference") && params.get("email") ? (
                <Link
                  href={`/book/confirmation?reference=${params.get("reference")}&email=${encodeURIComponent(params.get("email") ?? "")}`}
                  className="mt-6 inline-block text-sm text-ink underline-offset-2 hover:underline"
                >
                  View reservation status →
                </Link>
              ) : null}
              {message ? <p className="mt-4 text-sm text-ink-soft">{message}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-4">
          <BookingTripSummary
            checkIn={checkIn}
            checkOut={checkOut}
            adults={adults}
            childrenCount={children}
            roomsCount={rooms}
            room={chosen ?? null}
            property={property}
            guestName={guestName || undefined}
          />
        </div>
      </div>
    </div>
  );
}
