"use client";

import { WhatsOnEventCard } from "@/components/whats-on/whats-on-event-card";
import { isWeekly } from "@/lib/events";
import type { EventDto } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";

function sortEvents(events: EventDto[]) {
  return [...events].sort((a, b) => {
    const aWeekly = isWeekly(a);
    const bWeekly = isWeekly(b);
    if (aWeekly && !bWeekly) return 1;
    if (!aWeekly && bWeekly) return -1;
    if (!aWeekly && !bWeekly && a.eventAt && b.eventAt) {
      return a.eventAt.localeCompare(b.eventAt);
    }
    return a.title.localeCompare(b.title);
  });
}

export function WhatsOnCatalog({
  events,
  timezone,
  currency,
}: {
  events: EventDto[];
  timezone: string;
  currency: string;
}) {
  const types = useMemo(() => {
    const set = new Set(events.map((e) => e.eventType).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [events]);

  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    const list = filter === "All" ? events : events.filter((e) => e.eventType === filter);
    return sortEvents(list);
  }, [events, filter]);

  if (!events.length) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="rounded-2xl border border-dashed border-stone/55 bg-white/80 px-8 py-16 text-center">
          <p className="display text-3xl text-ink">Nothing scheduled yet</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
            New villa nights and gatherings are added here as they are announced. For private hire, explore our event
            spaces.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/events" className="btn btn-ink">Meetings &amp; events</Link>
            <Link href="/venue" className="btn border border-stone/50 bg-transparent text-ink hover:border-ink">
              Venue enquiry
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-8 md:px-8 md:pb-28">
      <div className="flex flex-col gap-4 border-b border-stone/35 pb-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "event" : "events"}
          {filter !== "All" ? ` · ${filter}` : ""}
        </p>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by type">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={filter === type}
              onClick={() => setFilter(type)}
              className={cn(
                "rounded-full px-4 py-2 text-[0.65rem] font-semibold tracking-[0.12em] uppercase transition",
                filter === type
                  ? "bg-ink text-sand"
                  : "border border-stone/45 bg-white text-ink-soft hover:border-lamp/40 hover:text-ink",
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => (
          <li key={event.id}>
            <WhatsOnEventCard event={event} timezone={timezone} currency={currency} />
          </li>
        ))}
      </ul>
    </div>
  );
}
