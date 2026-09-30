"use client";

import { api } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Lock, Smartphone, Wallet, CreditCard, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const HUBTEL_ORIGINS = ["https://pay.hubtel.com", "https://checkout.hubtel.com", "https://unified-pay.hubtel.com"];

export const VILLA_HUBTEL_RETURN = "villa:hubtel-return" as const;

type Phase = "loading" | "ready" | "confirming" | "paid" | "blocked";

type HubtelPaymentWidgetProps = {
  /** Hubtel checkoutDirectUrl (…/direct) — rendered inside the widget frame. */
  embedUrl: string;
  bookingReference: string;
  email: string;
  onPaid: () => void;
  onClose: () => void;
};

/**
 * In-page Hubtel payment widget.
 * Guests never navigate away — Hubtel Online Checkout (/direct) runs in a framed sheet
 * on Blue Top Villa. Backend owns initiate + callback + status; this is presentation only.
 */
export function HubtelPaymentWidget({
  embedUrl,
  bookingReference,
  email,
  onPaid,
  onClose,
}: HubtelPaymentWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const paidRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [statusNote, setStatusNote] = useState("Preparing secure payment…");

  const directUrl = useMemo(() => {
    try {
      const url = new URL(embedUrl);
      if (!url.pathname.endsWith("/direct")) {
        url.pathname = `${url.pathname.replace(/\/$/, "")}/direct`;
      }
      return url.toString();
    } catch {
      return embedUrl.endsWith("/direct") ? embedUrl : `${embedUrl.replace(/\/$/, "")}/direct`;
    }
  }, [embedUrl]);

  const finishPaid = useCallback(() => {
    if (paidRef.current) return;
    paidRef.current = true;
    setPhase("paid");
    setStatusNote("Payment confirmed");
    window.setTimeout(() => onPaid(), 650);
  }, [onPaid]);

  const checkStatus = useCallback(async () => {
    const result = await api.refreshHubtel(bookingReference);
    if (result.status === "CONFIRMED" || result.status === "COMPLETED") {
      finishPaid();
      return true;
    }
    return false;
  }, [bookingReference, finishPaid]);

  // Poll backend status while the widget is open.
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const paid = await checkStatus();
        if (cancelled || paid) return;
        setStatusNote((prev) =>
          phase === "confirming" ? "Confirming with Hubtel…" : prev === "Preparing secure payment…" ? prev : "Waiting for payment…",
        );
      } catch {
        /* ignore transient errors */
      }
    };
    void tick();
    const id = window.setInterval(() => void tick(), 3500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [checkStatus, phase]);

  // Bridge: payment-return page inside the iframe posts here when Hubtel finishes.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; reference?: string } | null;
      if (!data || data.type !== VILLA_HUBTEL_RETURN) return;
      if (data.reference && data.reference !== bookingReference) return;
      setPhase("confirming");
      setStatusNote("Payment received — confirming…");
      void checkStatus().then((paid) => {
        if (!paid) finishPaid(); // still move on; confirmation page will keep polling
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [bookingReference, checkStatus, finishPaid]);

  // Detect iframe blocked (blank for too long) or return navigation.
  useEffect(() => {
    const blockTimer = window.setTimeout(() => {
      setPhase((current) => {
        if (current === "loading") {
          setStatusNote("Couldn’t load the payment frame. Retry or use another method.");
          return "blocked";
        }
        return current;
      });
    }, 12_000);
    return () => window.clearTimeout(blockTimer);
  }, []);

  const onIframeLoad = () => {
    const frame = iframeRef.current;
    if (!frame) return;
    try {
      const href = frame.contentWindow?.location.href ?? "";
      if (href.startsWith(window.location.origin)) {
        if (href.includes("/book/payment-return") || href.includes("/book/confirmation")) {
          setPhase("confirming");
          void checkStatus().then((paid) => {
            if (!paid) finishPaid();
          });
          return;
        }
      }
    } catch {
      // Still on Hubtel origin — expected.
    }
    setPhase((current) => (current === "paid" || current === "confirming" ? current : "ready"));
    setStatusNote("Choose mobile money, card, or wallet");
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hubtel-pay-title"
      >
        <motion.button
          type="button"
          aria-label="Close payment"
          className="absolute inset-0 bg-[#0b1520]/75 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        <motion.div
          className="relative z-10 flex h-[min(94dvh,820px)] w-full max-w-[440px] flex-col overflow-hidden rounded-t-[1.35rem] bg-[#f7f4ef] shadow-[0_32px_90px_-24px_rgba(8,16,24,0.75)] sm:rounded-[1.35rem]"
          initial={{ y: 56, opacity: 0.9, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Brand chrome — guest stays “on” Blue Top Villa */}
          <header className="relative overflow-hidden bg-[#14212b] px-5 pb-4 pt-4 text-[#f7f4ef]">
            <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#d99d26]/20 blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#e8c547]">Blue Top Villa</p>
                <h2 id="hubtel-pay-title" className="mt-1 font-[family-name:var(--font-display)] text-[1.65rem] leading-none tracking-tight">
                  {phase === "paid" ? "You’re booked" : "Pay for your stay"}
                </h2>
                <p className="mt-2 text-[12px] text-white/60">
                  Ref <span className="font-semibold text-white/85">{bookingReference}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mt-4 flex flex-wrap gap-1.5">
              {[
                { icon: Smartphone, label: "Mobile money" },
                { icon: CreditCard, label: "Bank card" },
                { icon: Wallet, label: "Wallet" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/75"
                >
                  <Icon className="h-3 w-3 text-[#e8c547]" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </header>

          <div className="relative min-h-0 flex-1 bg-white">
            {phase === "paid" ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
                <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <CheckCircle2 className="h-14 w-14 text-emerald-600" aria-hidden />
                </motion.div>
                <p className="font-[family-name:var(--font-display)] text-2xl text-[#14212b]">Payment successful</p>
                <p className="text-sm text-[#5c6670]">Taking you to your reservation…</p>
              </div>
            ) : null}

            {phase === "blocked" ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="text-sm text-[#5c6670]">
                  Your browser blocked the secure payment frame. Close this and tap Pay again — or try another browser.
                </p>
                <button type="button" onClick={onClose} className="btn btn-ink">
                  Close and retry
                </button>
              </div>
            ) : null}

            {phase !== "paid" && phase !== "blocked" ? (
              <>
                {(phase === "loading" || phase === "confirming") && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#f7f4ef]/92">
                    <Loader2 className="h-7 w-7 animate-spin text-[#d99d26]" aria-hidden />
                    <p className="text-sm text-[#5c6670]">
                      {phase === "confirming" ? "Confirming payment…" : "Opening secure checkout…"}
                    </p>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  title="Hubtel payment"
                  src={directUrl}
                  className="h-full w-full border-0 bg-white"
                  allow="payment *; publickey-credentials-get *; clipboard-write"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={onIframeLoad}
                />
              </>
            ) : null}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-[#e7ddd0] bg-[#f7f4ef] px-5 py-3">
            <p className="flex min-w-0 items-center gap-1.5 text-[11px] text-[#5c6670]">
              <Lock className="h-3.5 w-3.5 shrink-0 text-[#d99d26]" aria-hidden />
              <span className="truncate">{statusNote}</span>
            </p>
            {phase === "ready" || phase === "confirming" ? (
              <button
                type="button"
                className="shrink-0 text-[11px] font-semibold text-[#14212b] underline-offset-2 hover:underline"
                onClick={() => {
                  setPhase("confirming");
                  void checkStatus().then((paid) => {
                    if (!paid) {
                      setPhase("ready");
                      setStatusNote("Not confirmed yet — finish payment in the frame above.");
                    }
                  });
                }}
              >
                I’ve paid
              </button>
            ) : null}
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** @deprecated Use HubtelPaymentWidget */
export const HubtelCheckoutOverlay = HubtelPaymentWidget;

export function isHubtelCheckoutOrigin(origin: string) {
  return HUBTEL_ORIGINS.some((allowed) => origin === allowed || origin.startsWith(allowed));
}
