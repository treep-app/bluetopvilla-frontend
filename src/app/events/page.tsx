import { EventsWhatsOnPromo } from "@/components/events/events-whats-on-promo";
import { EventsCtaBand } from "@/components/events/events-cta-band";
import { EventsHero } from "@/components/events/events-hero";
import { EventsProcess } from "@/components/events/events-process";
import { EventsSpaces } from "@/components/events/events-spaces";
import { EventsTypeShowcase } from "@/components/events/events-type-showcase";
import { api } from "@/lib/api";
import { toVillaEventTypes } from "@/lib/villa-events";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetings & Events",
  description:
    "Host weddings, parties, and corporate gatherings at Blue Top Villa in Kasoa — private venue hire with rooms on site.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [property, experiences, published, spaces] = await Promise.all([
    api.property(),
    api.experiences(),
    api.events(),
    api.eventSpaces(),
  ]);
  const eventTypes = toVillaEventTypes(experiences);

  return (
    <div className="bg-sand">
      <EventsHero events={eventTypes} />
      <EventsTypeShowcase events={eventTypes} />
      <EventsProcess property={property} />
      <EventsSpaces property={property} spaces={spaces} />
      <EventsWhatsOnPromo events={published} timezone={property.timezone} currency={property.currency} />
      <EventsCtaBand />
    </div>
  );
}
