"use client";

import { villaEventAssurances, type VillaEventType } from "@/lib/villa-events";
import { api } from "@/lib/api";
import type { PropertySettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Check, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const ADD_ONS = [
  { key: "decoration" as const, label: "Decoration" },
  { key: "catering" as const, label: "Catering" },
  { key: "soundSystem" as const, label: "Sound system" },
  { key: "photography" as const, label: "Photography" },
];

const BUDGETS = ["Under GHS 10,000", "GHS 10,000 – 25,000", "GHS 25,000 – 50,000", "GHS 50,000+", "Discuss later"];

type Props = {
  property: PropertySettings;
  events: VillaEventType[];
};

export function VenueEnquiryForm({ property, events }: Props) {
  const params = useSearchParams();
  const typeParam = params.get("type");
  const initialType = events.find((e) => e.title === typeParam)?.title ?? events[0]?.title ?? "";

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventType: initialType,
    eventDate: "",
    startTime: "",
    endTime: "",
    guestCount: 50,
    preferredVenue: "Full villa",
    decoration: false,
    catering: false,
    soundSystem: false,
    photography: false,
    budgetRange: "",
    notes: "",
  });

  const submit = useMutation({
    mutationFn: () =>
      api.venue({
        customerName: form.customerName,
        customerEmail: form.customerEmail || undefined,
        customerPhone: form.customerPhone,
        eventType: form.eventType,
        eventDate: form.eventDate,
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
        guestCount: form.guestCount,
        preferredVenue: form.preferredVenue || undefined,
        decoration: form.decoration,
        catering: form.catering,
        soundSystem: form.soundSystem,
        photography: form.photography,
        budgetRange: form.budgetRange || undefined,
        notes: form.notes || undefined,
      }),
  });

  const selectedEvent = useMemo(
    () => events.find((e) => e.title === form.eventType) ?? events[0],
    [events, form.eventType],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit.mutate();
  };

  if (submit.isSuccess) {
    return (
      <div className="border border-stone/40 bg-white p-8 text-center md:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-lamp text-ink">
          <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden />
        </div>
        <p className="eyebrow mt-6 text-ink-soft">Enquiry received</p>
        <h2 className="display mt-2 text-3xl text-ink md:text-4xl">We have your request</h2>
        <p className="mt-3 text-sm text-ink-soft">
          Reference{" "}
          <strong className="text-ink">{submit.data.reference}</strong> · Status {submit.data.status}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
          The villa team will confirm availability, layout, and any deposit. Keep this reference for follow-up.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/events" className="btn btn-ghost border-ink/20 text-ink">
            Back to events
          </Link>
          <Link href="/contact" className="btn btn-ink">
            Contact us
          </Link>
          <button
            type="button"
            onClick={() => submit.reset()}
            className="btn btn-gold"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-stone/40 bg-white shadow-[0_20px_50px_-40px_rgba(22,20,16,0.3)]">
      <div className="border-b border-stone/35 bg-sand-deep/40 px-5 py-4 md:px-6">
        <p className="text-[0.65rem] font-bold tracking-[0.16em] text-ink-soft uppercase">Venue enquiry</p>
        <p className="mt-1 text-sm text-ink">
          Sent to {property.name} dashboard · we reply to confirm your date
        </p>
      </div>

      <div className="space-y-7 px-5 py-6 md:px-6 md:py-7">
        <fieldset>
          <legend className="text-[0.68rem] font-semibold tracking-[0.14em] text-ink-soft uppercase">
            Occasion
          </legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {events.map(({ title: type }) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((f) => ({ ...f, eventType: type }))}
                className={cn(
                  "border px-2 py-2.5 text-[0.68rem] font-semibold tracking-[0.1em] uppercase transition",
                  form.eventType === type
                    ? "border-ink bg-ink text-sand"
                    : "border-stone/50 bg-sand/40 text-ink-soft hover:border-ink/30",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
            Event date
            <input
              required
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
            />
          </label>
          <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
            Preferred space
            <select
              value={form.preferredVenue}
              onChange={(e) => setForm({ ...form, preferredVenue: e.target.value })}
              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
            >
              <option>Full villa</option>
              <option>Outdoor / lawn</option>
              <option>Indoor reception</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
            Start time
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
            />
          </label>
          <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
            End time
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
            />
          </label>
        </div>

        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Guests</p>
          <div className="mt-2 flex items-center justify-between border border-stone/50 bg-sand/30 px-4 py-3">
            <span className="text-sm text-ink">Expected headcount</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease guests"
                disabled={form.guestCount <= 1}
                onClick={() => setForm((f) => ({ ...f, guestCount: Math.max(1, f.guestCount - 10) }))}
                className="text-ink-soft disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={1}
                max={5000}
                value={form.guestCount}
                onChange={(e) => setForm({ ...form, guestCount: Math.max(1, Number(e.target.value) || 1) })}
                className="w-16 border-0 bg-transparent text-center text-lg font-medium text-ink outline-none"
              />
              <button
                type="button"
                aria-label="Increase guests"
                onClick={() => setForm((f) => ({ ...f, guestCount: Math.min(5000, f.guestCount + 10) }))}
                className="text-ink-soft"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <fieldset>
          <legend className="text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
            Add-ons (optional)
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ADD_ONS.map((addon) => (
              <label
                key={addon.key}
                className={cn(
                  "flex cursor-pointer items-center gap-2 border px-3 py-2.5 text-sm transition",
                  form[addon.key] ? "border-lamp bg-sand/50 text-ink" : "border-stone/45 text-ink-soft",
                )}
              >
                <input
                  type="checkbox"
                  checked={form[addon.key]}
                  onChange={(e) => setForm({ ...form, [addon.key]: e.target.checked })}
                  className="accent-[rgb(217,157,38)]"
                />
                {addon.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
          Budget range (optional)
          <select
            value={form.budgetRange}
            onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
            className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
          >
            <option value="">Select…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase sm:col-span-2">
            Full name
            <input
              required
              minLength={2}
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
            />
          </label>
          <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
            Phone
            <input
              required
              minLength={7}
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
              placeholder="055…"
            />
          </label>
          <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">
            Email
            <input
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
            />
          </label>
          <label className="block text-[0.68rem] font-semibold tracking-[0.12em] text-ink-soft uppercase sm:col-span-2">
            Notes
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              maxLength={1000}
              placeholder={`Anything we should know about your ${selectedEvent?.title.toLowerCase() ?? "event"}…`}
              className="mt-2 w-full border border-stone/50 bg-sand/30 px-3 py-3 text-sm font-normal tracking-normal text-ink outline-none focus:border-lamp"
            />
          </label>
        </div>

        <button type="submit" disabled={submit.isPending} className="btn btn-gold w-full disabled:opacity-60">
          {submit.isPending ? "Sending to villa…" : "Submit venue enquiry"}
        </button>
        {submit.isError ? (
          <p className="text-center text-sm text-red-700">{(submit.error as Error).message}</p>
        ) : null}
        <p className="text-center text-[0.7rem] leading-relaxed text-ink-soft">
          This creates a pending enquiry in the villa dashboard. It is not an instant booking.
        </p>
      </div>
    </form>
  );
}

export function VenueSidePanel({ property, events }: { property: PropertySettings; events: VillaEventType[] }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-ink-soft">Hire the house</p>
        <h1 className="display mt-2 text-4xl text-ink md:text-5xl">Venue enquiry</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base md:leading-7">
          Request a date for weddings, parties, or corporate days. The villa confirms availability, setup, and deposit
          before anything is locked in.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {events.map((event) => (
          <li key={event.slug} className="relative overflow-hidden border border-stone/40">
            <div className="relative aspect-[16/9] sm:aspect-[4/3] lg:aspect-[21/9]">
              {event.image ? (
                <Image src={event.image} alt={event.title} fill className="object-cover" sizes="400px" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="display text-xl text-sand">{event.title}</p>
                <p className="text-[0.65rem] tracking-[0.1em] text-sand/80 uppercase">{event.tagline}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ul className="space-y-3 border border-stone/40 bg-white p-4">
        {villaEventAssurances.map((item) => (
          <li key={item.label}>
            <p className="text-[0.68rem] font-bold tracking-[0.12em] text-lamp uppercase">{item.label}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{item.detail}</p>
          </li>
        ))}
      </ul>

      <p className="text-xs leading-relaxed text-ink-soft">
        {property.name}
        {property.address ? ` · ${property.address}` : ""}
        {property.phone ? ` · ${property.phone}` : ""}
      </p>
    </div>
  );
}
