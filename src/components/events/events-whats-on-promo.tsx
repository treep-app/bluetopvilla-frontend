import type { EventDto } from "@/lib/types";
import Link from "next/link";
import { WhatsOnEventCard } from "@/components/whats-on/whats-on-event-card";

type Props = {
  events: EventDto[];
  timezone: string;
  currency: string;
};

export function EventsWhatsOnPromo({ events, timezone, currency }: Props) {
  const preview = events.slice(0, 2);

  return (
    <section className="border-t border-stone/40 bg-sand-deep/40" aria-labelledby="whats-on-promo-heading">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-ink-soft">What&apos;s on</p>
            <h2 id="whats-on-promo-heading" className="display mt-2 text-3xl text-ink md:text-4xl">
              Hosted events at the villa
            </h2>
            <p className="mt-3 max-w-lg text-sm text-ink-soft md:text-base">
              Open nights and gatherings for guests — full calendar, details, and reservations live on our events hub.
            </p>
          </div>
          <Link href="/whats-on" className="btn btn-gold shrink-0">
            See all events
          </Link>
        </div>

        {preview.length ? (
          <ul className="mt-10 grid gap-6 lg:grid-cols-2">
            {preview.map((event) => (
              <li key={event.id}>
                <WhatsOnEventCard event={event} timezone={timezone} currency={currency} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-ink-soft">
            New listings appear here when published.{" "}
            <Link href="/whats-on" className="font-medium text-ink underline-offset-2 hover:text-lamp hover:underline">
              Check the events hub
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
