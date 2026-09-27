"use client";

import { motion } from "framer-motion";
import { CalendarDays, MessageSquare, PartyPopper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PropertySettings } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function EventsProcess({ property }: { property: PropertySettings }) {
  const steps = [
    {
      icon: MessageSquare,
      title: "Tell us the brief",
      text: "Share your date, guest count, event type, and any room block needs in the venue form.",
    },
    {
      icon: CalendarDays,
      title: "We confirm the fit",
      text: "The villa checks availability, layout options, and deposit — then replies with next steps.",
    },
    {
      icon: PartyPopper,
      title: "Arrive & celebrate",
      text: `Host on the day. Overnight guests check in at ${property.checkInTime} when rooms are part of your plan.`,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-ink text-sand" aria-labelledby="events-process-heading">
      <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block">
        <Image src="/images/event-wedding.jpg" alt="" fill className="object-cover opacity-40" sizes="42vw" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-ink/40 to-ink" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-xl">
          <p className="eyebrow text-lamp-soft">How it works</p>
          <h2 id="events-process-heading" className="display mt-3 text-4xl md:text-5xl">
            From enquiry to event day
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-sand/75 md:text-base">
            Private hire starts with a conversation — not an instant cart. We keep the path short and clear.
          </p>
        </div>

        <ol className="mt-12 grid max-w-3xl gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease, delay: index * 0.1 }}
              className="border border-white/12 bg-white/[0.04] p-6 backdrop-blur-[2px]"
            >
              <span className="text-[0.65rem] font-bold tracking-[0.2em] text-lamp uppercase">Step 0{index + 1}</span>
              <step.icon className="mt-5 h-6 w-6 text-sand" strokeWidth={1.25} aria-hidden />
              <h3 className="display mt-4 text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sand/70">{step.text}</p>
            </motion.li>
          ))}
        </ol>

        <Link href="/venue" className="btn btn-gold mt-10 inline-flex">
          Open venue enquiry form
        </Link>
      </div>
    </section>
  );
}
