import { dateBadge, isWeekly, scheduleLabel } from "@/lib/events";
import { eventPriceHeadline } from "@/lib/event-price";
import type { EventDto } from "@/lib/types";
import { Calendar, MapPin, Repeat, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function WhatsOnEventCard({
  event,
  timezone,
  currency,
}: {
  event: EventDto;
  timezone: string;
  currency: string;
}) {
  const href = `/whats-on/${event.slug}`;
  const schedule = scheduleLabel(event, timezone);
  const badge = dateBadge(event, timezone);
  const price = eventPriceHeadline(event, currency);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone/40 bg-white shadow-[0_20px_50px_-40px_rgba(22,20,16,0.35)] transition hover:border-lamp/35 hover:shadow-[0_28px_60px_-36px_rgba(22,20,16,0.4)]">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-ink">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt=""
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-dusk to-ocean" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        {badge ? (
          <div className="absolute left-4 top-4 rounded-xl bg-white px-3 py-2 text-center leading-none shadow-md">
            <span className="display block text-2xl text-ink">{badge.day}</span>
            <span className="mt-0.5 block text-[0.58rem] font-bold tracking-[0.16em] text-lamp uppercase">
              {badge.month}
            </span>
          </div>
        ) : (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-lamp px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.14em] text-ink uppercase">
            <Repeat className="h-3 w-3" aria-hidden />
            Weekly
          </span>
        )}
        <p className="absolute bottom-4 left-4 right-4 text-[0.62rem] font-bold tracking-[0.16em] text-lamp uppercase">
          {event.eventType}
        </p>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <Link href={href}>
          <h2 className="display text-2xl text-ink transition group-hover:text-lamp md:text-[1.65rem]">{event.title}</h2>
        </Link>
        <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
          <li className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-lamp" strokeWidth={1.6} aria-hidden />
            {schedule}
          </li>
          {event.location ? (
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lamp" strokeWidth={1.6} aria-hidden />
              {event.location}
            </li>
          ) : null}
        </ul>
        {event.description ? (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">{event.description}</p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Ticket className="h-4 w-4 text-lamp" aria-hidden />
            {price}
          </span>
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.14em] text-ink uppercase transition hover:text-lamp"
          >
            Details
            <span className="text-lamp" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
