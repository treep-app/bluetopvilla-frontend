import { WhatsOnCatalog } from "@/components/whats-on/whats-on-catalog";
import { WhatsOnHero } from "@/components/whats-on/whats-on-hero";
import { api } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What's on",
  description:
    "Browse hosted events, live nights, and gatherings at Blue Top Villa, Kasoa — reserve your spot online.",
};

export const dynamic = "force-dynamic";

export default async function WhatsOnPage() {
  const [property, events] = await Promise.all([api.property(), api.events()]);

  return (
    <div className="bg-sand">
      <WhatsOnHero count={events.length} />
      <WhatsOnCatalog events={events} timezone={property.timezone} currency={property.currency} />
    </div>
  );
}
