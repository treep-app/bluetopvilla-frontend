import { BookingFlow } from "@/components/book/booking-flow";
import { BookingLoading } from "@/components/book/booking-loading";
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
    <Suspense fallback={<BookingLoading property={property} />}>
      <BookingFlow property={property} />
    </Suspense>
  );
}
