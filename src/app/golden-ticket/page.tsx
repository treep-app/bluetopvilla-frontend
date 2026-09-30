import { Suspense } from "react";
import GoldenTicketPage from "./golden-ticket-client";

export const metadata = {
  title: "Golden Ticket",
  description: "Reveal your Blue Top Villa Golden Ticket offer.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-ocean text-sm text-sand/70">
          Opening your ticket…
        </div>
      }
    >
      <GoldenTicketPage />
    </Suspense>
  );
}
