import { EventReserveButton } from "@/components/events/event-reserve-button";
import { dateBadge, isWeekly, scheduleLabel, upcomingDates } from "@/lib/events";
import type { EventDto } from "@/lib/types";
import { Calendar, Clock3, MapPin, Repeat } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  events: EventDto[];
  timezone: string;
};

export function EventsCalendarSection({ events, timezone }: Props) {
  return (
    <section id="calendar" className="scroll-mt-24 border-t border-stone/40 bg-sand" aria-labelledby="events-calendar-heading">
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-ink-soft">Calendar</p>
            <h2 id="events-calendar-heading" className="display mt-2 text-3xl text-ink md:text-4xl">
              What&apos;s on at the villa
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink-soft md:text-base">
              Hosted nights and gatherings open to guests. Reserve a spot and the team will confirm by phone.
            </p>
          </div>
          <Link
            href="/venue"
            className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink uppercase underline-offset-4 hover:text-lamp hover:underline"
          >
            Private hire instead →
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="mt-10 flex flex-col items-start gap-4 border border-dashed border-stone/55 bg-white/70 px-6 py-12 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-sand-deep">
                <Calendar className="h-5 w-5 text-lamp" strokeWidth={1.5} aria-hidden />
              </div>
              <div>
                <p className="font-medium text-ink">No public listings right now</p>
                <p className="mt-1 max-w-md text-sm text-ink-soft">
                  For weddings, parties, or corporate days, send a private venue enquiry and we will confirm your date.
                </p>
              </div>
            </div>
            <Link href="/venue" className="btn btn-ink shrink-0">
              Request venue hire
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid gap-5 lg:grid-cols-2">
            {events.map((event) => {
              const schedule = scheduleLabel(event, timezone);
              const badge = dateBadge(event, timezone);
              return (
                <li key={event.id} className="group grid overflow-hidden border border-stone/45 bg-white sm:grid-cols-[13rem_1fr]">
                  <div className="relative aspect-[16/10] bg-ink sm:aspect-auto sm:min-h-[15rem]">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, 13rem"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-ink via-dusk to-ocean" />
                    )}
                    {badge ? (
                      <div className="absolute left-3 top-3 bg-white px-3 py-2 text-center leading-none shadow-sm">
                        <span className="display block text-3xl text-ink">{badge.day}</span>
                        <span className="mt-1 block text-[0.6rem] font-bold tracking-[0.16em] text-lamp uppercase">
                          {badge.month}
                        </span>
                      </div>
                    ) : (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-lamp px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.14em] text-ink uppercase">
                        <Repeat className="h-3 w-3" aria-hidden />
                        Weekly
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col p-5 md:p-6">
                    <p className="text-[0.62rem] font-bold tracking-[0.16em] text-lamp uppercase">{event.eventType}</p>
                    <h3 className="display mt-1 text-3xl text-ink">{event.title}</h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                      <li className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 shrink-0 text-lamp" strokeWidth={1.6} aria-hidden />
                        {schedule}
                      </li>
                      {event.location ? (
                        <li className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-lamp" strokeWidth={1.6} aria-hidden />
                          {event.location}
                        </li>
                      ) : null}
                    </ul>
                    {event.description ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{event.description}</p>
                    ) : null}
                    <div className="mt-auto pt-5">
                      <EventReserveButton
                        event={event}
                        schedule={schedule}
                        dates={isWeekly(event) ? upcomingDates(event, timezone) : []}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
