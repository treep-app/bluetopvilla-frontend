import { VenueEnquiryForm, VenueSidePanel } from "@/components/venue/venue-enquiry-form";
import { api } from "@/lib/api";
import { toVillaEventTypes } from "@/lib/villa-events";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Venue enquiry",
  description:
    "Request venue hire at Blue Top Villa in Kasoa for weddings, parties, and corporate events — enquiry goes to the villa dashboard.",
};

export const dynamic = "force-dynamic";

export default async function VenuePage() {
  const [property, experiences] = await Promise.all([api.property(), api.experiences()]);
  const events = toVillaEventTypes(experiences);

  return (
    <div className="bg-sand">
      <div className="border-b border-stone/30 bg-ink text-sand">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-4 pt-24 md:px-8 md:pt-28">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[0.65rem] font-medium tracking-[0.14em] text-sand/65 uppercase"
          >
            <Link href="/" className="hover:text-sand">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/events" className="hover:text-sand">
              Events
            </Link>
            <span aria-hidden>/</span>
            <span className="text-sand">Venue</span>
          </nav>
          <p className="text-[0.65rem] tracking-[0.12em] text-sand/60 uppercase">
            Enquiry → dashboard · not instant booking
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-10 md:px-8 md:py-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <VenueSidePanel property={property} events={events} />
        </div>
        <div className="lg:col-span-7">
          <Suspense
            fallback={
              <div className="border border-stone/40 bg-white p-8 text-sm text-ink-soft">Loading enquiry form…</div>
            }
          >
            <VenueEnquiryForm property={property} events={events} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
