"use client";

import { api } from "@/lib/api";
import { formatDateKey } from "@/lib/events";
import type { EventDto } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { Check, Minus, Plus, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const inputClass =
  "mt-2 w-full border border-stone/60 bg-sand/30 px-3.5 py-3 text-[0.95rem] font-normal tracking-normal normal-case text-ink outline-none transition focus:border-lamp focus:bg-white";
const labelClass = "block text-[0.68rem] font-semibold tracking-[0.14em] text-ink-soft uppercase";

type Props = {
  event: EventDto;
  /** Dates guests can pick for a weekly event; empty for one-off events. */
  dates: string[];
  schedule: string;
};

export function EventReserveButton({ event, dates, schedule }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", partySize: 2, visitDate: dates[0] ?? "", notes: "" });
  const [error, setError] = useState<string | null>(null);

  const reserve = useMutation({
    mutationFn: () =>
      api.reserveEvent({
        eventSlug: event.slug,
        attendeeName: form.name.trim(),
        attendeePhone: form.phone.trim(),
        attendeeEmail: form.email.trim() || undefined,
        partySize: form.partySize,
        visitDate: dates.length ? form.visitDate : undefined,
        notes: form.notes.trim() || undefined,
      }),
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError("Tell us your name.");
    if (form.phone.replace(/\D/g, "").length < 9) return setError("Add a phone number so the team can confirm.");
    setError(null);
    reserve.mutate();
  };

  const close = () => {
    setOpen(false);
    if (reserve.isSuccess) {
      reserve.reset();
      setForm((current) => ({ ...current, notes: "" }));
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn btn-ink">
        Reserve a spot
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`reserve-${event.id}`}
        >
          <div
            className="max-h-[92svh] w-full max-w-lg overflow-y-auto bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone/40 bg-ink px-6 py-5 text-sand">
              <div>
                <p className="eyebrow text-lamp-soft">Reserve</p>
                <h2 id={`reserve-${event.id}`} className="display mt-1 text-3xl">
                  {event.title}
                </h2>
                <p className="mt-1 text-sm text-sand/70">{schedule}</p>
              </div>
              <button type="button" onClick={close} aria-label="Close" className="p-1 text-sand/70 hover:text-sand">
                <X className="h-5 w-5" />
              </button>
            </div>

            {reserve.isSuccess ? (
              <div className="px-6 py-10 text-center" role="status">
                <span className="mx-auto flex h-12 w-12 items-center justify-center bg-lamp text-ink">
                  <Check className="h-6 w-6" strokeWidth={2.25} aria-hidden />
                </span>
                <p className="eyebrow mt-6">Request received</p>
                <p className="display mt-2 text-3xl text-ink">See you there, {form.name.trim().split(" ")[0]}.</p>
                <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">
                  Reference <strong className="text-ink">{reserve.data.reference}</strong>. The team will call{" "}
                  {form.phone} to confirm your spot for {form.partySize}
                  {dates.length && form.visitDate ? ` on ${formatDateKey(form.visitDate)}` : ""}.
                </p>
                <button type="button" onClick={close} className="btn btn-gold mt-8">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5 px-6 py-6">
                {dates.length ? (
                  <label className={labelClass}>
                    Which night?
                    <select
                      className={inputClass}
                      value={form.visitDate}
                      onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                    >
                      {dates.map((date) => (
                        <option key={date} value={date}>
                          {formatDateKey(date)}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <div>
                  <p className={labelClass}>Party size</p>
                  <div className="mt-2 flex items-center justify-between border border-stone/60 bg-sand/30 px-4 py-2.5">
                    <span className="text-sm text-ink">
                      {form.partySize} {form.partySize === 1 ? "guest" : "guests"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Fewer guests"
                        disabled={form.partySize <= 1}
                        onClick={() => setForm({ ...form, partySize: form.partySize - 1 })}
                        className="flex h-8 w-8 items-center justify-center border border-stone/60 text-ink disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="More guests"
                        disabled={form.partySize >= 50}
                        onClick={() => setForm({ ...form, partySize: form.partySize + 1 })}
                        className="flex h-8 w-8 items-center justify-center border border-stone/60 text-ink disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <label className={labelClass}>
                  Your name
                  <input autoComplete="name" maxLength={100} className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Phone / WhatsApp
                    <input type="tel" inputMode="tel" autoComplete="tel" maxLength={20} className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="055 123 4567" />
                  </label>
                  <label className={labelClass}>
                    Email (optional)
                    <input type="email" autoComplete="email" maxLength={120} className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </label>
                </div>
                <label className={labelClass}>
                  Anything we should know? (optional)
                  <textarea rows={3} maxLength={1000} className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="A birthday, a table preference…" />
                </label>

                {error || reserve.isError ? (
                  <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
                    {error ?? (reserve.error as Error).message}
                  </p>
                ) : null}

                <button type="submit" disabled={reserve.isPending} className="btn btn-gold w-full disabled:opacity-60">
                  {reserve.isPending ? "Sending…" : "Request my spot"}
                </button>
                <p className="text-center text-xs text-ink-soft/80">No payment now — the team confirms by phone.</p>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
