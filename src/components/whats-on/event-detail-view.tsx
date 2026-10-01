import type { ReactNode } from "react";
import { EventReserveButton } from "@/components/events/event-reserve-button";
import { dateBadge, formatDateKey, isWeekly, scheduleLabel, upcomingDates } from "@/lib/events";
import { eventPriceHeadline, eventPriceLabel } from "@/lib/event-price";
import type { EventDto } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Repeat,
  Sparkles,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function DetailCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone/35 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(22,20,16,0.18)] md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FactTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-stone/30 bg-sand/35 px-4 py-4">
      <div className="flex items-center gap-2 text-lamp">{icon}</div>
      <p className="mt-2 text-[0.62rem] font-semibold tracking-[0.14em] text-ink-soft uppercase">{label}</p>
      <p className="mt-1 text-sm font-medium leading-snug text-ink">{value}</p>
    </div>
  );
}

export function EventDetailView({
  event,
  timezone,
  currency,
}: {
  event: EventDto;
  timezone: string;
  currency: string;
}) {
  const schedule = scheduleLabel(event, timezone);
  const badge = dateBadge(event, timezone);
  const dates = isWeekly(event) ? upcomingDates(event, timezone, 6) : [];
  const priceLine = eventPriceLabel(event, currency);
  const priceHeadline = eventPriceHeadline(event, currency);
  const hasPrice = event.priceFrom != null && Number(event.priceFrom) > 0;

  return (
    <article className="min-w-0 bg-sand pb-16 md:pb-20">
      <div className="relative overflow-hidden bg-ink">
        <div className="relative mx-auto grid max-w-[1200px] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[280px] lg:min-h-[420px]">
            {event.imageUrl ? (
              <Image src={event.imageUrl} alt="" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-ink via-dusk to-ocean" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/40 lg:bg-gradient-to-r lg:from-transparent lg:via-ink/20 lg:to-ink" />
          </div>

          <div className="relative flex min-w-0 flex-col justify-end px-4 py-8 sm:px-5 sm:py-10 lg:px-10 lg:py-12">
            <Link
              href="/whats-on"
              className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-sand/80 transition hover:text-lamp"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All events
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-lamp/20 px-3 py-1 text-[0.62rem] font-bold tracking-[0.14em] text-lamp uppercase">
                {event.eventType}
              </span>
              {isWeekly(event) ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-[0.62rem] font-semibold tracking-wide text-sand/80">
                  <Repeat className="h-3 w-3" aria-hidden />
                  Recurring
                </span>
              ) : null}
            </div>
            <h1 className="display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] text-sand">{event.title}</h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-sand/75">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-lamp" aria-hidden />
                {schedule}
              </span>
              {event.location ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-lamp" aria-hidden />
                  {event.location}
                </span>
              ) : null}
            </p>
            {badge ? (
              <div className="mt-6 inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="text-center leading-none">
                  <span className="display block text-3xl text-sand">{badge.day}</span>
                  <span className="text-[0.6rem] font-bold tracking-[0.16em] text-lamp uppercase">{badge.month}</span>
                </div>
                <p className="text-xs text-sand/70">Save the date — reserve early for the best tables.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto grid min-w-0 max-w-[1200px] gap-6 px-4 pt-6 sm:px-5 sm:pt-8 md:px-8 lg:grid-cols-[1fr_minmax(0,340px)] lg:gap-8 lg:pt-10">
        <div className="space-y-6 min-w-0">
          <div className="grid gap-3 sm:grid-cols-2">
            <FactTile icon={<CalendarDays className="h-4 w-4" />} label="When" value={schedule} />
            <FactTile
              icon={<Ticket className="h-4 w-4" />}
              label="Price"
              value={priceLine ?? "Confirm with the villa — pricing may vary by night."}
            />
            <FactTile
              icon={<MapPin className="h-4 w-4" />}
              label="Where"
              value={event.location ?? "Blue Top Villa, Kasoa"}
            />
            <FactTile
              icon={<Sparkles className="h-4 w-4" />}
              label="Experience"
              value={isWeekly(event) ? "Weekly villa night" : "One-night special"}
            />
          </div>

          <DetailCard>
            <h2 className="text-[0.68rem] font-semibold tracking-[0.16em] text-lamp uppercase">About this event</h2>
            {event.description ? (
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-ink-soft">{event.description}</p>
            ) : (
              <p className="mt-4 text-base leading-8 text-ink-soft">
                Join us at Blue Top Villa for an evening of {event.eventType.toLowerCase()} and warm hospitality. Reserve
                your spot below — our team will confirm details by phone or WhatsApp.
              </p>
            )}
          </DetailCard>

          {dates.length ? (
            <DetailCard>
              <h2 className="text-[0.68rem] font-semibold tracking-[0.16em] text-lamp uppercase">Upcoming dates</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {dates.map((d) => (
                  <li
                    key={d}
                    className="rounded-full border border-stone/40 bg-sand/50 px-3.5 py-2 text-xs font-medium text-ink"
                  >
                    {formatDateKey(d)}
                  </li>
                ))}
              </ul>
            </DetailCard>
          ) : null}

          <DetailCard className="bg-sand/60">
            <h2 className="text-[0.68rem] font-semibold tracking-[0.16em] text-lamp uppercase">Good to know</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lamp" aria-hidden />
                Reservation is free — pay at the villa or as advised when we confirm.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lamp" aria-hidden />
                We&apos;ll reach you on the phone number you provide to confirm your table or entry.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lamp" aria-hidden />
                Staying overnight?{" "}
                <Link href="/book" className="font-medium text-ink underline-offset-2 hover:text-lamp hover:underline">
                  Book a room
                </Link>{" "}
                for the full villa experience.
              </li>
            </ul>
          </DetailCard>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <DetailCard className="overflow-hidden p-0">
            <div className="border-b border-stone/30 bg-gradient-to-br from-ink to-dusk px-6 py-6 text-sand">
              <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-lamp uppercase">Get tickets</p>
              <p className="display mt-2 text-4xl text-sand">{priceHeadline}</p>
              {event.priceNote && hasPrice ? (
                <p className="mt-1 text-sm text-sand/65">{event.priceNote}</p>
              ) : !hasPrice ? (
                <p className="mt-2 text-sm text-sand/65">We&apos;ll confirm cover and packages when you reserve.</p>
              ) : null}
            </div>
            <div className="p-6">
              <ul className="space-y-2 text-xs text-ink-soft">
                <li className="flex justify-between gap-3 border-b border-stone/25 pb-2">
                  <span>Schedule</span>
                  <span className="text-right font-medium text-ink">{schedule}</span>
                </li>
                {event.location ? (
                  <li className="flex justify-between gap-3 border-b border-stone/25 pb-2">
                    <span>Location</span>
                    <span className="text-right font-medium text-ink">{event.location}</span>
                  </li>
                ) : null}
                <li className="flex justify-between gap-3 pb-1">
                  <span>Confirmation</span>
                  <span className="text-right font-medium text-ink">By phone / SMS</span>
                </li>
              </ul>
              <div className="mt-6">
                <EventReserveButton event={event} schedule={schedule} dates={dates} />
              </div>
              <p className="mt-4 text-center text-[0.65rem] leading-relaxed text-ink-soft">
                No payment required online · Blue Top Villa will confirm your reservation
              </p>
            </div>
          </DetailCard>

          <p className="mt-4 text-center text-xs text-ink-soft">
            Private event?{" "}
            <Link href="/venue" className="font-medium text-ink underline-offset-2 hover:text-lamp hover:underline">
              Venue hire enquiry
            </Link>
          </p>
        </aside>
      </div>
    </article>
  );
}
