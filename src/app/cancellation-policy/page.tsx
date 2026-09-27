import type { Metadata } from "next";
import { LegalPage, legalContactLine } from "@/components/legal-page";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Cancellation Policy" };

export default async function CancellationPage() {
  const property = await api.property();

  return (
    <LegalPage title="Cancellation Policy">
      <p>Cancel or reschedule by phone, WhatsApp, or email, quoting your reservation reference.</p>
      <p>Room bookings cancelled well ahead of check-in can normally be moved or cancelled. Late cancellations and no-shows may be charged the first night.</p>
      <p>Venue reservations may involve non-refundable deposits once preparations begin.</p>
      <p>{legalContactLine(property)}</p>
    </LegalPage>
  );
}
