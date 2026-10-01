import { EventDetailView } from "@/components/whats-on/event-detail-view";
import { api, ApiRequestError } from "@/lib/api";
import { eventJsonLd, eventPageMetadata } from "@/lib/event-seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [event, property] = await Promise.all([api.event(slug), api.property()]);
    return eventPageMetadata(event, property, slug);
  } catch {
    return { title: "Event" };
  }
}

export default async function WhatsOnEventPage({ params }: Props) {
  const { slug } = await params;
  const property = await api.property();

  let event;
  try {
    event = await api.event(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error;
  }

  const jsonLd = eventJsonLd(event, property, slug);

  return (
    <div className="bg-sand">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EventDetailView event={event} timezone={property.timezone} currency={property.currency} />
    </div>
  );
}
