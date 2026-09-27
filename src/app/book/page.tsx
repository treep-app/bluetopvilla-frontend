import { BookingFlow } from "@/components/book/booking-flow";
import { api } from "@/lib/api";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Book your stay",
  description:
    "Check availability and reserve a room at Blue Top Villa in Kasoa — secure hold, Hubtel and Stripe payment.",
};

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const property = await api.property();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-sand pt-28 text-sm text-ink-soft">
          Loading booking…
        </div>
      }
    >
      <BookingFlow property={property} />
    </Suspense>
  );
}
