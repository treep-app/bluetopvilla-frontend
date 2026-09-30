"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ScratchTicket } from "@/components/golden-ticket/scratch-ticket";
import { api, ApiRequestError } from "@/lib/api";

type TicketView = {
  status: string;
  offerTitle: string;
  offerSubtitle: string | null;
  offerTerms: string | null;
  guestName: string | null;
  expiresAt: string;
  promoCode: string | null;
  revealed: boolean;
  redeemed: boolean;
};

function formatExpiry(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function GoldenTicketPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState<TicketView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [scratched, setScratched] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      if (!token) {
        if (!cancelled) {
          setOffer(null);
          setError("This link is missing its secure ticket token. Open the original email or SMS invite.");
          setLoading(false);
        }
        return;
      }

      try {
        const data = await api.verifyGoldenTicket(token);
        if (cancelled) return;

        if (data.status === "CANCELLED") {
          setOffer(null);
          setError("This Golden Ticket has been cancelled.");
        } else if (data.status === "EXPIRED") {
          setOffer(null);
          setError(
            `This Golden Ticket expired on ${formatExpiry(data.expiresAt)}. Contact Blue Top Villa for a new offer.`,
          );
        } else {
          setOffer(data);
          setPromoCode(data.promoCode);
          setScratched(data.revealed || data.status === "REVEALED" || data.status === "REDEEMED");
          setRedeemed(data.redeemed || data.status === "REDEEMED");
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiRequestError
            ? err.message
            : "Unable to reach the ticket service. Please try again.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleScratchRevealed = async () => {
    setScratched(true);
    if (!token || promoCode) return;
    try {
      const data = await api.revealGoldenTicket(token);
      setPromoCode(data.promoCode);
      if (data.status === "REDEEMED") setRedeemed(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not reveal this ticket.");
    }
  };

  const handleRedeem = async () => {
    if (!token || redeeming || redeemed) return;
    setRedeeming(true);
    try {
      const data = await api.redeemGoldenTicket(token);
      setPromoCode(data.promoCode);
      setRedeemed(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Redemption failed. Please try again.");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-ocean to-dusk px-6 text-sm text-sand/70">
        Opening your Golden Ticket…
      </div>
    );
  }

  if (error && !offer) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-b from-ocean to-dusk px-6 text-center text-sand">
        <p className="eyebrow text-lamp">Golden Ticket</p>
        <h1 className="display mt-3 text-4xl text-sand">Ticket unavailable</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-sand/70">{error}</p>
        <Link
          href="/book"
          className="mt-8 inline-flex rounded-full bg-lamp px-6 py-3 text-sm font-semibold text-ink transition hover:bg-lamp-soft"
        >
          Book a stay instead
        </Link>
      </div>
    );
  }

  if (!offer) return null;

  if (redeemed) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-b from-ocean to-dusk px-6 py-16 text-center text-sand">
        <p className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
          Redeemed
        </p>
        <h1 className="display mt-5 text-4xl text-lamp sm:text-5xl">Redeemed successfully</h1>
        <p className="mt-3 max-w-md text-sm text-sand/70">
          Show this confirmation at Blue Top Villa, Kasoa when you book or check in.
        </p>
        {promoCode ? (
          <div className="mt-8 rounded-full bg-sand px-8 py-3 text-lg font-semibold tracking-wide text-ink">
            Promo code: {promoCode}
          </div>
        ) : null}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/book"
            className="inline-flex rounded-full bg-lamp px-6 py-3 text-sm font-semibold text-ink transition hover:bg-lamp-soft"
          >
            Book your stay
          </Link>
          <a
            href="tel:+233559171787"
            className="inline-flex rounded-full border border-sand/30 px-6 py-3 text-sm font-semibold text-sand transition hover:border-lamp hover:text-lamp"
          >
            Call the villa
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-gradient-to-b from-ocean via-dusk to-[#0f1a22] text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(217,157,38,0.18),_transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:py-20">
        <section className="flex flex-col items-center md:items-end">
          {scratched && promoCode && offer.status !== "ISSUED" ? (
            <div className="w-full max-w-sm rounded-2xl bg-[#1b2c38] px-6 py-10 text-center ring-1 ring-lamp/30">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lamp">Golden Ticket</p>
              <p className="mt-4 font-display text-5xl leading-none text-lamp">{offer.offerTitle}</p>
              {offer.offerSubtitle ? (
                <p className="mt-3 text-sm leading-snug text-sand/90">{offer.offerSubtitle}</p>
              ) : null}
              <div className="mt-5 rounded-full bg-sand px-5 py-2 text-sm font-semibold text-ink">
                Promo code: {promoCode}
              </div>
            </div>
          ) : (
            <ScratchTicket
              offerTitle={offer.offerTitle}
              offerSubtitle={offer.offerSubtitle}
              promoCode={promoCode}
              onRevealed={() => void handleScratchRevealed()}
            />
          )}
        </section>

        <section className="text-center md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lamp">
            Blue Top Villa Golden Ticket
          </p>
          <h1 className="display mt-3 text-3xl leading-tight text-sand sm:text-4xl lg:text-5xl">
            Scratch to unlock your stay
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-sand/70 md:mx-0 md:max-w-none md:text-base">
            {offer.guestName ? (
              <>
                A personalized offer for <span className="font-semibold text-sand">{offer.guestName}</span>.{" "}
              </>
            ) : null}
            Scratch the foil, reveal your promo code, then enter it when you book online — or show it at check-in.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-sand/55 md:justify-start">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Single use</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Expires {formatExpiry(offer.expiresAt)}
            </span>
          </div>

              {scratched ? (
            <div className="mt-8 flex w-full max-w-sm flex-col gap-3 md:max-w-none md:flex-row">
              <Link
                href={`/book?promo=${encodeURIComponent(promoCode || "")}`}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-lamp px-6 text-sm font-semibold text-ink transition hover:bg-lamp-soft"
              >
                Book with this code
              </Link>
              <button
                type="button"
                onClick={() => void handleRedeem()}
                disabled={redeeming || !promoCode}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-sand/30 px-6 text-sm font-semibold text-sand transition hover:border-lamp hover:text-lamp disabled:opacity-60"
              >
                {redeeming ? "Saving…" : "Mark as used at villa"}
              </button>
            </div>
          ) : null}

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

          {offer.offerTerms ? (
            <p className="mx-auto mt-6 max-w-md text-[11px] leading-relaxed text-sand/40 md:mx-0 md:max-w-none">
              {offer.offerTerms}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
