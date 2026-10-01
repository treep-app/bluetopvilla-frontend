import { scheduleLabel } from "@/lib/events";
import { eventPriceHeadline } from "@/lib/event-price";
import { absoluteUrl, eventPublicPath, shareMessage, siteOrigin } from "@/lib/share";
import type { EventDto, PropertySettings } from "@/lib/types";
import type { Metadata } from "next";

export function eventPageMetadata(event: EventDto, property: Pick<PropertySettings, "timezone" | "currency">, slug: string): Metadata {
  const schedule = scheduleLabel(event, property.timezone);
  const description =
    event.description?.slice(0, 200)?.trim() ||
    `${shareMessage(event.title, schedule)}. ${eventPriceHeadline(event, property.currency)} — reserve at Blue Top Villa, Kasoa.`;
  const path = eventPublicPath(slug);
  const pageUrl = absoluteUrl(path);
  const ogImage = absoluteUrl(`${path}/opengraph-image`);

  return {
    title: event.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: pageUrl,
      siteName: "Blue Top Villa",
      locale: "en_GH",
      title: `${event.title} | Blue Top Villa`,
      description,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          width: 1200,
          height: 630,
          alt: `${event.title} at Blue Top Villa`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [ogImage],
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}

export function eventJsonLd(event: EventDto, property: PropertySettings, slug: string) {
  const pageUrl = absoluteUrl(eventPublicPath(slug));
  const image = absoluteUrl(`${eventPublicPath(slug)}/opengraph-image`);
  const startDate = event.eventAt ?? undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? undefined,
    startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location ?? "Blue Top Villa",
      address: property.address ?? "Kasoa, Ghana",
    },
    image: [image, event.imageUrl].filter(Boolean),
    organizer: {
      "@type": "Organization",
      name: property.name,
      url: siteOrigin(),
    },
    offers: event.priceFrom
      ? {
          "@type": "Offer",
          price: Number(event.priceFrom),
          priceCurrency: property.currency,
          url: pageUrl,
          availability: "https://schema.org/InStock",
        }
      : undefined,
    url: pageUrl,
  };
}
