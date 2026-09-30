"use client";

import { BookContactLink, BookStepBody, BookStepCard, BookStepHeader, BookTrustNote } from "@/components/book/book-step-shell";
import { BookingFlowHeader } from "@/components/book/booking-flow-header";
import { BookingRoomsStep } from "@/components/book/booking-rooms-step";
import { BookingSearchStep } from "@/components/book/booking-search-step";
import { BookingTripSummary } from "@/components/book/booking-trip-summary";
import { HubtelPaymentWidget } from "@/components/book/hubtel-payment-widget";
import { api } from "@/lib/api";
import { type BookStepId, formatStayRange } from "@/lib/booking-utils";
import type { PaymentInitResult, PropertySettings } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

const CHANNEL_LABELS: Record<string, string> = {
  "mtn-gh": "MTN",
  "vodafone-gh": "Telecel",
  "tigo-gh": "AirtelTigo",
};

const METHOD_LABELS: Record<string, string> = {
  mobile_money: "Mobile money",
  card: "Bank card",
  wallet: "Wallet",
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

  const chosen = search.data?.results.find((room) => room.slug === selected);

  const [guest, setGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Ghana",
    specialRequests: "",
    promoCode: "",
  });
  const [promo, setPromo] = useState<{
    code: string;
    offerTitle: string;
    discountPercent: number;
    discountAmount: number;
    total: number;
  } | null>(null);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoChecking, setPromoChecking] = useState(false);
  const paymentOptions = useQuery({ queryKey: ["payment-options"], queryFn: () => api.paymentOptions() });

  useEffect(() => {
    const fromUrl = params.get("promo");
    if (fromUrl?.trim()) {
      setGuest((c) => ({ ...c, promoCode: fromUrl.trim().toUpperCase() }));
    }
  }, [params]);

  useEffect(() => {
    // Recalculate discount when the selected room changes.
    if (!promo || !chosen) return;
    const subtotal = Number(chosen.subtotal);
    const taxes = Number(chosen.taxes);
    const fees = Number(chosen.fees);
    const discountAmount = Number(((subtotal * promo.discountPercent) / 100).toFixed(2));
    const total = Number(Math.max(0, subtotal + taxes + fees - discountAmount).toFixed(2));
    setPromo((prev) => (prev ? { ...prev, discountAmount, total } : prev));
  }, [chosen?.slug, chosen?.subtotal, promo?.discountPercent]);
  const holdMinutes = paymentOptions.data?.holdMinutes;
  const [channel, setChannel] = useState("mtn-gh");
  const [msisdn, setMsisdn] = useState("");
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [hubtelCheckout, setHubtelCheckout] = useState<PaymentInitResult | null>(null);

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
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        country: guest.country,
        specialRequests: guest.specialRequests,
        promoCode: promo?.code || guest.promoCode || undefined,
      }),
    onSuccess: (booking) => {
      setStep("pay", { reference: booking.reference, email: guest.email });
    },
    onError: (error: Error) => setMessage(error.message),
  });

  const applyPromo = async () => {
    const code = guest.promoCode.trim();
    if (!code) {
      setPromo(null);
      setPromoMessage("Enter the coupon code from your Golden Ticket SMS.");
      return;
    }
    if (!chosen) {
      setPromoMessage("Select a room first, then apply your coupon.");
      return;
    }
    setPromoChecking(true);
    setPromoMessage("");
    try {
      const validated = await api.validatePromoCode(code);
      const subtotal = Number(chosen.subtotal);
      const taxes = Number(chosen.taxes);
      const fees = Number(chosen.fees);
      const discountAmount = Number(((subtotal * validated.discountPercent) / 100).toFixed(2));
      const total = Number(Math.max(0, subtotal + taxes + fees - discountAmount).toFixed(2));
      setPromo({
        code: validated.promoCode,
        offerTitle: validated.offerTitle,
        discountPercent: validated.discountPercent,
        discountAmount,
        total,
      });
      setGuest((c) => ({ ...c, promoCode: validated.promoCode }));
      setPromoMessage(`${validated.offerTitle} applied — ${validated.discountPercent}% off your room.`);
    } catch (error) {
      setPromo(null);
      setPromoMessage(error instanceof Error ? error.message : "Could not apply that coupon.");
    } finally {
      setPromoChecking(false);
    }
  };

  const payHubtel = useMutation({
    mutationFn: () =>
      api.payHubtel({
        bookingReference: params.get("reference"),
        channel,
        msisdn: msisdn || guest.phone,
      }),
    onSuccess: (result) => {
      // Online Checkout: open branded in-page overlay with checkoutDirectUrl.
      if (result.embedUrl || result.redirectUrl) {
        setHubtelCheckout(result);
        return;
      }
      // Direct MoMo prompt mode — track on confirmation.
      const reference = params.get("reference") ?? "";
      const email = params.get("email") ?? guest.email;
      router.push(`/book/confirmation?reference=${encodeURIComponent(reference)}&email=${encodeURIComponent(email)}`);
    },
    onError: (error: Error) => setMessage(error.message),
  });

  const goToConfirmation = () => {
    const reference = params.get("reference") ?? "";
    const email = params.get("email") ?? guest.email;
    setHubtelCheckout(null);
    router.push(`/book/confirmation?reference=${encodeURIComponent(reference)}&email=${encodeURIComponent(email)}`);
  };

  const payCash = useMutation({
    mutationFn: () => api.payCash({ bookingReference: params.get("reference") }),
    onSuccess: (result) => {
      setMessage(result.message);
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
  const flowStep = (["search", "rooms", "guest", "summary", "pay"].includes(step) ? step : "search") as BookStepId;
  const didAutoRooms = useRef(false);

  useEffect(() => {
    if (didAutoRooms.current) return;
    if (params.get("step")) return;
    if (!checkIn || !checkOut) return;
    didAutoRooms.current = true;
    const next = new URLSearchParams(params.toString());
    next.set("step", "rooms");
    router.replace(`/book?${next.toString()}`, { scroll: false });
  }, [checkIn, checkOut, params, router]);

  return (
    <div className="min-h-[calc(100svh-var(--site-header-height))] bg-sand">
      <BookingFlowHeader property={property} step={flowStep} />

      <div className="mx-auto grid max-w-[1400px] gap-6 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-8">
          {step === "search" ? (
            <BookStepCard>
              <BookStepHeader
                title="When will you arrive?"
                subtitle="Choose your dates and party size — we’ll show live rates for your stay."
              />
              <BookStepBody>
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
                <BookTrustNote />
              </BookStepBody>
            </BookStepCard>
          ) : null}

          {step === "rooms" ? (
            <BookStepCard className="p-4 sm:p-5 md:p-6">
            <BookingRoomsStep
              rooms={search.data?.results ?? []}
              selectedSlug={selected}
              loading={search.isLoading}
              error={search.isError ? (search.error as Error).message : null}
              dateLabel={formatStayRange(checkIn, checkOut)}
              onSelect={(slug) => setStep("rooms", { room: slug })}
              onContinue={() => {
                if (!selected) return;
                setStep("guest", { room: selected });
              }}
              onChangeDates={() => setStep("search")}
            />
            </BookStepCard>
          ) : null}

          {step === "guest" ? (
            <BookStepCard>
            <form
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                setStep("summary");
              }}
            >
              <BookStepHeader
                title="Guest details"
                subtitle="We’ll send your confirmation and booking link to this email and phone."
                back={{ label: "Change room", onClick: () => setStep("rooms") }}
              />
              <BookStepBody>
              <div className="grid gap-4 md:grid-cols-2">
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
                      className="mt-2 w-full rounded-lg border border-stone/45 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp focus:ring-1 focus:ring-lamp/30"
                    />
                  </label>
                ))}
                <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase md:col-span-2">
                  Special requests
                  <textarea
                    value={guest.specialRequests}
                    onChange={(e) => setGuest((c) => ({ ...c, specialRequests: e.target.value }))}
                    className="mt-2 w-full rounded-lg border border-stone/45 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp focus:ring-1 focus:ring-lamp/30"
                    rows={3}
                    placeholder="Arrival time, dietary needs, celebration notes…"
                  />
                </label>
                <div className="md:col-span-2 rounded-xl border border-lamp/30 bg-lamp/5 p-4">
                  <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
                    Golden Ticket coupon
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Have a code from SMS or email? Enter it here to use when you book — or show it at check-in.
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={guest.promoCode}
                      onChange={(e) => {
                        setGuest((c) => ({ ...c, promoCode: e.target.value.toUpperCase() }));
                        setPromo(null);
                        setPromoMessage("");
                      }}
                      className="w-full border border-stone/50 bg-white px-3 py-3 font-mono text-sm tracking-wide text-ink outline-none focus:border-lamp sm:flex-1"
                      placeholder="e.g. 94919"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => void applyPromo()}
                      disabled={promoChecking}
                      className="inline-flex items-center justify-center bg-ink px-5 py-3 text-[0.7rem] font-semibold tracking-[0.12em] text-sand uppercase disabled:opacity-60"
                    >
                      {promoChecking ? "Checking…" : "Apply code"}
                    </button>
                  </div>
                  {promoMessage ? (
                    <p className={`mt-2 text-sm ${promo ? "text-emerald-800" : "text-[#93000a]"}`}>{promoMessage}</p>
                  ) : null}
                </div>
              </div>
              <button type="submit" className="btn btn-gold mt-8 inline-flex gap-2">
                Review booking
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              </BookStepBody>
            </form>
            </BookStepCard>
          ) : null}

          {step === "summary" && chosen ? (
            <BookStepCard>
              <BookStepHeader
                title="Review & hold"
                subtitle={`Confirming holds the room${holdMinutes ? ` for ${holdMinutes} minutes` : ""} while you pay.`}
                back={{ label: "Edit guest", onClick: () => setStep("guest") }}
              />
              <BookStepBody>
              <dl className="space-y-3 rounded-xl border border-stone/35 bg-sand/40 p-5 text-sm">
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
              </BookStepBody>
            </BookStepCard>
          ) : null}

          {step === "pay" ? (
            <BookStepCard>
              <BookStepHeader
                title="Complete payment"
                subtitle={`Reference ${params.get("reference") ?? ""} — your room is held${holdMinutes ? ` for ${holdMinutes} minutes` : ""} while you pay.`}
              />
              <BookStepBody>
              {paymentOptions.isLoading ? (
                <p className="text-sm text-ink-soft">Loading payment options…</p>
              ) : paymentOptions.isError ? (
                <p className="text-sm text-red-700">{(paymentOptions.error as Error).message}</p>
              ) : !paymentOptions.data?.hubtel.enabled &&
                !paymentOptions.data?.stripe.enabled &&
                !paymentOptions.data?.cash.enabled ? (
                <div className="rounded-xl border border-stone/35 bg-sand/40 p-6 text-sm text-ink-soft">
                  Online payment isn&apos;t available right now. Your room is held — contact the villa to pay and
                  confirm your booking.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {paymentOptions.data.hubtel.enabled ? (
                    <div className="rounded-xl border border-stone/35 bg-sand/30 p-6 md:col-span-2">
                      <p className="text-[0.65rem] font-bold tracking-[0.14em] text-lamp uppercase">Ghana · Hubtel</p>
                      <h3 className="display mt-2 text-2xl text-ink">
                        {paymentOptions.data.hubtel.mode === "checkout" ? "Pay online" : "Mobile money"}
                      </h3>
                      {paymentOptions.data.hubtel.mode === "checkout" ? (
                        <>
                          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
                            A secure payment sheet opens on this page — mobile money, bank card, or wallet. You never
                            leave Blue Top Villa.
                          </p>
                          <ul className="mt-4 flex flex-wrap gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-soft">
                            {(paymentOptions.data.hubtel.methods.length
                              ? paymentOptions.data.hubtel.methods
                              : (["mobile_money", "card", "wallet"] as const)
                            ).map((method) => (
                              <li
                                key={method}
                                className="rounded-full border border-stone/40 bg-sand/40 px-3 py-1.5 text-ink"
                              >
                                {METHOD_LABELS[method] ?? method}
                              </li>
                            ))}
                          </ul>
                        </>
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
                        className="btn btn-ink mt-5 w-full sm:w-auto sm:min-w-[220px]"
                      >
                        {payHubtel.isPending
                          ? paymentOptions.data.hubtel.mode === "checkout"
                            ? "Opening checkout…"
                            : "Sending prompt…"
                          : paymentOptions.data.hubtel.mode === "checkout"
                            ? "Pay securely"
                            : "Pay with Hubtel"}
                      </button>
                    </div>
                  ) : null}

                  {paymentOptions.data.cash.enabled ? (
                    <div className="rounded-xl border border-stone/35 bg-white p-6">
                      <p className="text-[0.65rem] font-bold tracking-[0.14em] text-lamp uppercase">On arrival</p>
                      <h3 className="display mt-2 text-2xl text-ink">Cash</h3>
                      <p className="mt-2 text-sm text-ink-soft">
                        Hold your room now and pay cash at Blue Top Villa. Front desk confirms your booking when you
                        arrive.
                      </p>
                      <button
                        type="button"
                        onClick={() => payCash.mutate()}
                        disabled={payCash.isPending}
                        className="btn btn-ghost mt-8 w-full border-ink/25 text-ink"
                      >
                        {payCash.isPending ? "Saving…" : paymentOptions.data.cash.label}
                      </button>
                    </div>
                  ) : null}

                  {paymentOptions.data.stripe.enabled ? (
                    <div className="rounded-xl border border-stone/35 bg-white p-6">
                      <p className="text-[0.65rem] font-bold tracking-[0.14em] text-lamp uppercase">International</p>
                      <h3 className="display mt-2 text-2xl text-ink">Card (Stripe)</h3>
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
              <BookContactLink />
              </BookStepBody>
            </BookStepCard>
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
            promo={promo}
            continueLabel={step === "rooms" ? "Continue" : undefined}
            onContinue={
              step === "rooms"
                ? () => {
                    if (!selected) return;
                    setStep("guest", { room: selected });
                  }
                : undefined
            }
            continueDisabled={step === "rooms" && !selected}
          />
        </div>
      </div>

      {hubtelCheckout?.embedUrl || hubtelCheckout?.redirectUrl ? (
        <HubtelPaymentWidget
          embedUrl={hubtelCheckout.embedUrl || hubtelCheckout.redirectUrl!}
          bookingReference={params.get("reference") ?? ""}
          email={params.get("email") ?? guest.email}
          onPaid={goToConfirmation}
          onClose={() => {
            setHubtelCheckout(null);
            setMessage("Payment closed. You can tap Pay securely again while your room hold is active.");
          }}
        />
      ) : null}
    </div>
  );
}
