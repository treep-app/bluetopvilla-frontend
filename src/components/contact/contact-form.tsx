"use client";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BedDouble, Check, CircleHelp, PartyPopper, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

const TOPICS = [
  {
    id: "stay",
    label: "A stay",
    icon: BedDouble,
    hint: { text: "Want to see rooms and prices for your dates?", href: "/book", cta: "Check live availability" },
  },
  {
    id: "event",
    label: "An event",
    icon: PartyPopper,
    hint: { text: "Planning a wedding, party or corporate day?", href: "/venue", cta: "Use the venue enquiry" },
  },
  { id: "dining", label: "Dining", icon: UtensilsCrossed, hint: null },
  { id: "other", label: "Something else", icon: CircleHelp, hint: null },
] as const;

type TopicId = (typeof TOPICS)[number]["id"];
type Field = "name" | "contact" | "message";

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

const inputClass =
  "mt-2 w-full border border-stone/60 bg-sand/30 px-3.5 py-3 text-[0.95rem] font-normal tracking-normal normal-case text-ink outline-none transition placeholder:text-ink-soft/45 focus:border-lamp focus:bg-white aria-[invalid=true]:border-red-700/60";
const labelClass = "block text-[0.68rem] font-semibold tracking-[0.14em] text-ink-soft uppercase";

export function ContactForm({ propertyName }: { propertyName: string }) {
  const [topic, setTopic] = useState<TopicId>("stay");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sentTo, setSentTo] = useState<string | null>(null);
  const fieldRefs = useRef<Partial<Record<Field, HTMLElement | null>>>({});

  const activeTopic = TOPICS.find((item) => item.id === topic)!;
  const submit = useMutation({
    mutationFn: () =>
      api.contact({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        message: `Topic: ${activeTopic.label}\n\n${form.message.trim()}`,
      }),
    onSuccess: () => setSentTo(form.email.trim() || form.phone.trim()),
  });

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (form.name.trim().length < 2) next.name = "Tell us your name.";
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!email && !phone) next.contact = "Add a phone number or email so we can reply.";
    else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.contact = "That email address doesn't look right.";
    else if (phone && phone.replace(/\D/g, "").length < 9) next.contact = "That phone number looks too short.";
    if (form.message.trim().length < MESSAGE_MIN) next.message = `Write at least ${MESSAGE_MIN} characters.`;
    setErrors(next);
    const first = (["name", "contact", "message"] as Field[]).find((key) => next[key]);
    if (first) fieldRefs.current[first]?.focus();
    return !first;
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    // Bots fill hidden fields; pretend it worked without sending anything.
    if (trap) {
      setSentTo(form.email || form.phone);
      return;
    }
    submit.mutate();
  };

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    const field: Field = key === "email" || key === "phone" ? "contact" : key;
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const reset = () => {
    setForm({ name: "", email: "", phone: "", message: "" });
    setSentTo(null);
    submit.reset();
  };

  return (
    <div className="relative border border-stone/45 bg-white shadow-[0_30px_70px_-50px_rgba(22,20,16,0.45)]">
      <AnimatePresence mode="wait" initial={false}>
        {sentTo ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex min-h-[34rem] flex-col items-center justify-center px-6 py-14 text-center md:px-12"
            role="status"
            aria-live="polite"
          >
            <span className="flex h-14 w-14 items-center justify-center bg-lamp text-ink">
              <Check className="h-7 w-7" strokeWidth={2.25} aria-hidden />
            </span>
            <p className="eyebrow mt-7">Message sent</p>
            <h2 className="display mt-2 text-4xl text-ink md:text-5xl">Thank you, {form.name.trim().split(" ")[0]}.</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft md:text-base">
              Your message is with the team at {propertyName}. We&apos;ll reply to <strong className="text-ink">{sentTo}</strong>.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/book" className="btn btn-gold gap-2">
                Check availability
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <button type="button" onClick={reset} className="btn btn-ghost border-ink/25 text-ink">
                Send another message
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            noValidate
            className="px-5 py-7 md:px-9 md:py-9"
          >
            <p className="eyebrow">Write to us</p>
            <h2 className="display mt-2 text-3xl text-ink md:text-4xl">Send a message</h2>

            <fieldset className="mt-7">
              <legend className={labelClass}>What&apos;s it about?</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TOPICS.map((item) => {
                  const Icon = item.icon;
                  const active = topic === item.id;
                  return (
                    <label
                      key={item.id}
                      className={cn(
                        "flex cursor-pointer flex-col items-start gap-2 border px-3 py-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lamp",
                        active ? "border-ink bg-ink text-sand" : "border-stone/55 bg-sand/30 text-ink hover:border-ink/35",
                      )}
                    >
                      <input
                        type="radio"
                        name="topic"
                        value={item.id}
                        checked={active}
                        onChange={() => setTopic(item.id)}
                        className="sr-only"
                      />
                      <Icon className={cn("h-4 w-4", active ? "text-lamp" : "text-ink-soft")} strokeWidth={1.6} aria-hidden />
                      <span className="text-[0.8rem] font-medium">{item.label}</span>
                    </label>
                  );
                })}
              </div>
              <AnimatePresence initial={false}>
                {activeTopic.hint ? (
                  <motion.div
                    key={activeTopic.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-l-2 border-lamp bg-sand/60 px-3.5 py-2.5 text-sm text-ink-soft">
                      {activeTopic.hint.text}
                      <Link
                        href={activeTopic.hint.href}
                        className="inline-flex items-center gap-1 font-medium text-ink underline-offset-4 hover:text-lamp hover:underline"
                      >
                        {activeTopic.hint.cta}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </fieldset>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className={cn(labelClass, "sm:col-span-2")}>
                Your name
                <input
                  ref={(element) => {
                    fieldRefs.current.name = element;
                  }}
                  autoComplete="name"
                  maxLength={100}
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  className={inputClass}
                  placeholder="Ama Mensah"
                />
                {errors.name ? (
                  <span id="contact-name-error" className="mt-1.5 block text-xs font-normal tracking-normal text-red-700 normal-case">
                    {errors.name}
                  </span>
                ) : null}
              </label>
              <label className={labelClass}>
                Phone / WhatsApp
                <input
                  ref={(element) => {
                    fieldRefs.current.contact = element;
                  }}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby="contact-reach-hint"
                  className={inputClass}
                  placeholder="055 123 4567"
                />
              </label>
              <label className={labelClass}>
                Email
                <input
                  type="email"
                  autoComplete="email"
                  maxLength={120}
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby="contact-reach-hint"
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </label>
              <p
                id="contact-reach-hint"
                className={cn("-mt-2 text-xs sm:col-span-2", errors.contact ? "text-red-700" : "text-ink-soft/80")}
              >
                {errors.contact ?? "Either is fine — we'll reply the way you prefer."}
              </p>
              <label className={cn(labelClass, "sm:col-span-2")}>
                <span className="flex items-baseline justify-between">
                  Message
                  <span
                    className={cn(
                      "font-normal tracking-normal normal-case tabular-nums",
                      form.message.length > MESSAGE_MAX * 0.9 ? "text-red-700" : "text-ink-soft/60",
                    )}
                    aria-hidden
                  >
                    {form.message.length}/{MESSAGE_MAX}
                  </span>
                </span>
                <textarea
                  ref={(element) => {
                    fieldRefs.current.message = element;
                  }}
                  rows={6}
                  maxLength={MESSAGE_MAX}
                  value={form.message}
                  onChange={(event) => update("message", event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={cn(inputClass, "resize-y leading-relaxed")}
                  placeholder={
                    topic === "stay"
                      ? "Your dates, number of guests, and anything we should know…"
                      : topic === "event"
                        ? "The occasion, a rough date and guest count…"
                        : topic === "dining"
                          ? "Dietary needs, group meals, or questions about the table…"
                          : "How can we help?"
                  }
                />
                {errors.message ? (
                  <span id="contact-message-error" className="mt-1.5 block text-xs font-normal tracking-normal text-red-700 normal-case">
                    {errors.message}
                  </span>
                ) : null}
              </label>

              {/* Hidden from people; bots tend to fill it. */}
              <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
                Company
                <input tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} />
              </label>
            </div>

            {submit.isError ? (
              <p role="alert" className="mt-5 border-l-2 border-red-700 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
                {(submit.error as Error).message || "Your message couldn't be sent. Please try again or call us."}
              </p>
            ) : null}

            <div className="mt-7 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-ink-soft/80 sm:max-w-[16rem]">
                We only use your details to reply. See our{" "}
                <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-ink">
                  privacy policy
                </Link>
                .
              </p>
              <button type="submit" disabled={submit.isPending} className="btn btn-ink gap-2 disabled:opacity-60 sm:min-w-[12rem]">
                {submit.isPending ? "Sending…" : "Send message"}
                {!submit.isPending ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
