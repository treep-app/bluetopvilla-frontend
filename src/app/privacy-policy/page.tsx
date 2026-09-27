import type { Metadata } from "next";
import { LegalPage, legalContactLine } from "@/components/legal-page";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const property = await api.property();

  return (
    <LegalPage title="Privacy Policy">
      <p>Blue Top Villa collects only what is needed to manage a reservation or enquiry: name, phone, email, dates, guest numbers, and messages you send.</p>
      <p>Information is used to confirm and manage your stay or event, and to contact you by phone, SMS, WhatsApp, or email. It is not sold.</p>
      <p>For privacy requests, contact us: {legalContactLine(property)}.</p>
    </LegalPage>
  );
}
