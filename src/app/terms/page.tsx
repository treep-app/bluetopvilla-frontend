import type { Metadata } from "next";
import { LegalPage, legalContactLine } from "@/components/legal-page";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default async function TermsPage() {
  const property = await api.property();

  return (
    <LegalPage title="Terms & Conditions">
      <p>
        These terms govern room bookings, venue reservations, and event reservations at Blue Top Villa, Kasoa,
        Ghana.
      </p>
      <h2 className="display text-2xl text-ink">Reservation confirmation</h2>
      <p>Reservations are subject to availability and are confirmed after Blue Top Villa contacts the guest, or after a verified payment confirms a held room booking.</p>
      <h2 className="display text-2xl text-ink">Accurate information</h2>
      <p>Guests must provide truthful contact details.</p>
      <h2 className="display text-2xl text-ink">Payment</h2>
      <p>The amount shown at checkout is calculated by the Blue Top Villa booking engine. Hubtel and Stripe payments are verified on the server.</p>
      <h2 className="display text-2xl text-ink">Venue reservations</h2>
      <p>Venue bookings are confirmed after approval by management.</p>
      <h2 className="display text-2xl text-ink">Contact</h2>
      <p>{legalContactLine(property)}</p>
    </LegalPage>
  );
}
