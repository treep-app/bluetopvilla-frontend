"use client";

import { VILLA_HUBTEL_RETURN } from "@/components/book/hubtel-payment-widget";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * Hubtel returnUrl target for the in-page payment widget iframe.
 * When loaded inside the widget, notifies the parent and stops.
 * When opened top-level (rare), continues to the confirmation page.
 */
function PaymentReturnInner() {
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get("reference") ?? "";
  const email = params.get("email") ?? "";

  useEffect(() => {
    const payload = { type: VILLA_HUBTEL_RETURN, reference, email };

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, window.location.origin);
      return;
    }

    if (reference && email) {
      router.replace(
        `/book/confirmation?reference=${encodeURIComponent(reference)}&email=${encodeURIComponent(email)}`,
      );
    } else {
      router.replace("/book");
    }
  }, [email, reference, router]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 bg-sand px-6 text-center">
      <p className="text-sm text-ink-soft">Confirming your payment…</p>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<p className="pt-32 text-center text-sm text-ink-soft">Confirming…</p>}>
      <PaymentReturnInner />
    </Suspense>
  );
}
