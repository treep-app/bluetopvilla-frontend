"use client";

import { api } from "@/lib/api";
import { formatStayDate } from "@/lib/booking-utils";
import type { BookingDto } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Copy,
  Mail,
  Phone,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";

type StatusTone = "confirmed" | "cash" | "processing" | "pending" | "cancelled" | "other";

function resolveTone(data: BookingDto): StatusTone {
  if (data.status === "CONFIRMED" || data.status === "COMPLETED") return "confirmed";
  if (data.status === "CANCELLED" || data.status === "EXPIRED" || data.status === "NO_SHOW") return "cancelled";
  if (data.status === "PAYMENT_PROCESSING") return "processing";
  if (data.status === "PENDING_PAYMENT" && data.payment?.provider === "MANUAL") return "cash";
  if (data.status === "PENDING_PAYMENT") return "pending";
  return "other";
}

function toneMeta(data: BookingDto, tone: StatusTone, holdUntil: string | null) {
  switch (tone) {
    case "confirmed":
      return {
        label: "Confirmed",
        note: "Present your reference at check-in.",
        Icon: CheckCircle2,
      };
    case "cash":
      return {
        label: "Cash on arrival",
        note: holdUntil ? `Room held until ${holdUntil}. Pay at the front desk to confirm.` : "Pay at the front desk to confirm.",
        Icon: Wallet,
      };
    case "processing":
      return {
        label: "Confirming payment",
        note: "This page updates automatically while payment settles.",
        Icon: Clock3,
      };
    case "pending":
      return {
        label: "Awaiting payment",
        note: holdUntil ? `Complete payment by ${holdUntil} to keep this hold.` : "Complete payment to confirm your stay.",
        Icon: Wallet,
      };
    case "cancelled":
      return {
        label: data.status.replaceAll("_", " "),
        note:
          data.status === "EXPIRED"
            ? "This hold has ended. Book again if those dates are still open."
            : "This reservation is no longer active.",
        Icon: Clock3,
      };
    default:
      return {
        label: "Reservation",
        note: "Your stay details are below.",
        Icon: CheckCircle2,
      };
  }
}

function holdLabel(iso: string | null) {
  if (!iso) return null;
  try {
    return format(parseISO(iso), "h:mm a");
  } catch {
    return new Date(iso).toLocaleTimeString();
  }
}

function Confirmation() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? "";
  const email = params.get("email") ?? "";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const booking = useQuery({
    queryKey: ["booking", reference, email],
    queryFn: async () => {
      const current = await api.booking(reference, email);
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

  const data = booking.data;
  const tone = data ? resolveTone(data) : "other";
  const holdUntil = data ? holdLabel(data.holdExpiresAt) : null;
  const meta = data ? toneMeta(data, tone, holdUntil) : null;

  const nightsLabel = useMemo(() => {
    if (!data?.nights) return null;
    return data.nights === 1 ? "1 night" : `${data.nights} nights`;
  }, [data?.nights]);

  const guestsLabel = useMemo(() => {
    if (!data) return "";
    const adults = `${data.adults} adult${data.adults === 1 ? "" : "s"}`;
    if (!data.children) return adults;
    return `${adults}, ${data.children} child${data.children === 1 ? "" : "ren"}`;
  }, [data]);

  const paymentLabel = useMemo(() => {
    if (!data) return "";
    if (tone === "cash") return "Cash at villa";
    if (data.payment?.status) return data.payment.status.replaceAll("_", " ");
    return data.status.replaceAll("_", " ");
  }, [data, tone]);

  const copyReference = async () => {
    if (!data?.reference) return;
    try {
      await navigator.clipboard.writeText(data.reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  if (!reference || !email) {
    return (
      <Shell>
        <div className="mx-auto max-w-md text-center text-sand">
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-lamp-soft uppercase">Reservation</p>
          <h1 className="display mt-3 text-4xl">Find your stay</h1>
          <p className="mt-3 text-sm text-sand/70">Open the link from your confirmation email, or start a new booking.</p>
          <Link href="/book" className="btn btn-gold mt-8 inline-flex">
            Book a room
          </Link>
        </div>
      </Shell>
    );
  }

  if (booking.isLoading) {
    return (
      <Shell>
        <p className="text-sm text-sand/70">Opening your reservation…</p>
      </Shell>
    );
  }

  if (booking.isError || !data || !meta) {
    return (
      <Shell light>
        <div className="mx-auto max-w-md text-center">
          <p className="display text-3xl text-ink">We couldn’t find that reservation</p>
          <p className="mt-3 text-sm text-ink-soft">
            {(booking.error as Error | undefined)?.message || "Check the reference and email, then try again."}
          </p>
          <Link href="/book" className="btn btn-gold mt-8 inline-flex">
            Start a booking
          </Link>
        </div>
      </Shell>
    );
  }

  const payHref = `/book?step=pay&reference=${data.reference}&email=${encodeURIComponent(email)}&checkIn=${data.checkIn}&checkOut=${data.checkOut}`;
  const StatusIcon = meta.Icon;
  const rows = [
    { label: "Check-in", value: formatStayDate(data.checkIn) },
    { label: "Check-out", value: formatStayDate(data.checkOut) },
    { label: "Guests", value: guestsLabel },
    { label: "Payment", value: paymentLabel },
  ];

  return (
    <Shell>
      <motion.article
        className="relative flex max-h-full w-full max-w-3xl flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="min-h-0 w-full overflow-y-auto overscroll-none rounded-[1.25rem] border border-white/12 bg-sand text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.65)]">
          {/* Status strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/8 bg-ink px-5 py-3.5 text-sand sm:px-7 sm:py-4">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-lamp/35 bg-lamp/15 text-lamp-soft">
                <StatusIcon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-lamp-soft uppercase">{meta.label}</p>
                <p className="mt-1 text-sm leading-snug text-sand/75">{meta.note}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void copyReference()}
              className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 transition hover:border-lamp/40 hover:bg-white/10"
            >
              <span className="text-[0.58rem] font-semibold tracking-[0.16em] text-sand/45 uppercase">Ref</span>
              <span className="font-display text-base tracking-wide text-sand">{data.reference}</span>
              <Copy className="h-3.5 w-3.5 text-sand/45" aria-hidden />
            </button>
          </div>
          {copied ? (
            <p className="border-b border-ink/8 bg-ink px-5 pb-2.5 text-xs text-lamp-soft sm:px-7">Copied</p>
          ) : null}

          {/* Stay body */}
          <div className="px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-ink-soft uppercase">Your stay</p>
                <h1 className="display mt-1 text-[1.85rem] leading-none text-ink sm:text-4xl">
                  {data.rooms[0]?.roomTypeName ?? "Room"}
                </h1>
              </div>
              <div className="text-right">
                {nightsLabel ? <p className="text-sm font-medium text-ink">{nightsLabel}</p> : null}
                <p className="mt-0.5 text-xs tracking-wide text-ink-soft uppercase">Blue Top Villa · Kasoa</p>
              </div>
            </div>

            <dl className="mt-4 divide-y divide-stone/35 border-y border-stone/35">
              {rows.map((row) => (
                <div key={row.label} className="grid grid-cols-[6.75rem_1fr] gap-3 py-2.5 sm:grid-cols-[8.5rem_1fr] sm:py-3">
                  <dt className="text-[0.65rem] font-semibold tracking-[0.14em] text-ink-soft uppercase">{row.label}</dt>
                  <dd className="text-sm font-medium text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">Total</p>
                <p className="display mt-1 text-[1.85rem] leading-none text-ink sm:text-4xl">
                  {formatMoney(data.total, data.currency)}
                </p>
                {data.promoOffer ? (
                  <p className="mt-1 text-xs text-ink-soft">
                    Promo {data.promoCode} · {data.promoOffer}
                  </p>
                ) : null}
              </div>
              <div className="text-right text-sm">
                <p className="font-medium text-ink">
                  {data.guest.firstName} {data.guest.lastName}
                </p>
                <p className="mt-0.5 text-ink-soft">{data.guest.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-stone/35 bg-white/55 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft">
              <a href="tel:+233559171787" className="inline-flex items-center gap-1.5 hover:text-lamp">
                <Phone className="h-3.5 w-3.5" aria-hidden />
                055 917 1787
              </a>
              <a href="mailto:info@bluetopvilla.com" className="inline-flex items-center gap-1.5 hover:text-lamp">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                info@bluetopvilla.com
              </a>
            </div>

            <div className="flex flex-wrap gap-2 [&_.btn]:min-h-10 [&_.btn]:px-4 [&_.btn]:text-[0.65rem]">
              {tone === "confirmed" ? (
                <Link href="/stay" className="btn btn-ghost border-ink/20">
                  Plan your stay
                </Link>
              ) : null}
              {tone === "cash" ? (
                <Link href={payHref} className="btn btn-ghost border-ink/20">
                  Pay online instead
                </Link>
              ) : null}
              {tone === "pending" || tone === "processing" ? (
                <Link href={payHref} className="btn btn-gold inline-flex gap-2">
                  {tone === "processing" ? "Check payment" : "Complete payment"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : null}
              {tone === "cancelled" ? (
                <Link href="/book" className="btn btn-gold inline-flex gap-2">
                  Book again
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : null}
              {tone === "confirmed" || tone === "cash" || tone === "other" ? (
                <Link href="/" className="btn btn-ink">
                  Back to villa
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </motion.article>
    </Shell>
  );
}

function Shell({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 top-[var(--site-header-height)] overflow-hidden ${light ? "bg-sand" : "bg-ink"}`}
    >
      {!light ? (
        <div className="absolute inset-0">
          <Image
            src="/images/room-suite.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[center_35%] opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink/95" />
        </div>
      ) : null}
      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden p-3 sm:p-5">
        {children}
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-x-0 bottom-0 top-[var(--site-header-height)] flex items-center justify-center overflow-hidden bg-ink text-sm text-sand/70">
          Loading reservation…
        </div>
      }
    >
      <Confirmation />
    </Suspense>
  );
}
