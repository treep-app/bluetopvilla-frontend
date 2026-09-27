"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { checkTimesLabel } from "@/lib/property";
import type { PropertySettings } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

const highlights = [
  {
    title: "Rooms & suites",
    description: "Comfortable stays with clear rates and instant hold while you complete payment.",
    href: "/rooms",
    image: "/images/room-suite.jpg",
  },
  {
    title: "Events & venue",
    description: "Weddings, celebrations, and corporate days in a private Kasoa setting.",
    href: "/venue",
    image: "/images/event-wedding.jpg",
  },
];

export function HomeVillaIntro({ property }: { property: PropertySettings }) {
  const assurances = [
    { icon: MapPin, label: "Kasoa, Ghana", detail: "Between Accra & the coast" },
    { icon: CalendarClock, label: checkTimesLabel(property), detail: "Call if you arrive late" },
    { icon: ShieldCheck, label: "Secure booking", detail: "Room held while you pay" },
  ];

  return (
    <section
      className="relative mx-auto w-full max-w-[1400px] flex-1 px-5 pt-8 pb-14 md:px-8 md:pt-10 md:pb-16"
      aria-labelledby="villa-intro-heading"
    >
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-stone/60 to-transparent md:inset-x-8" />

      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div
          className="relative lg:col-span-5"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-ink/5 shadow-[0_24px_64px_-32px_rgba(22,20,16,0.35)]">
            <Image
              src="/images/gallery-lobby.jpg"
              alt="Interior at Blue Top Villa"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-2 w-[46%] overflow-hidden border-4 border-sand shadow-[0_16px_48px_-20px_rgba(22,20,16,0.4)] sm:-right-6 md:-bottom-8">
            <div className="relative aspect-[4/5]">
              <Image
                src="/images/gallery-pool.jpg"
                alt="Pool at Blue Top Villa"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          </div>
          <div className="absolute left-4 top-4 flex items-center gap-2 bg-white/92 px-3 py-2 text-[0.65rem] font-semibold tracking-[0.18em] text-ink uppercase backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-lamp" strokeWidth={1.75} aria-hidden />
            Hotel &amp; events
          </div>
        </motion.div>

        <div className="lg:col-span-7 lg:pl-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease, delay: 0.05 }}
          >
            <p className="eyebrow">The villa</p>
            <h2 id="villa-intro-heading" className="display mt-3 text-[2.35rem] leading-[1.06] text-ink md:text-5xl lg:text-[3.25rem]">
              Made for staying,
              <span className="block text-ink-soft/90">and for gathering.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg md:leading-8">
              Blue Top Villa is a contemporary house in Kasoa — private rooms for overnight guests, a pool and
              gardens for slow afternoons, and flexible spaces for weddings, parties, and corporate retreats.
            </p>
          </motion.div>

          <motion.ul
            className="mt-8 grid gap-3 sm:grid-cols-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.12 }}
          >
            {assurances.map((item) => (
              <li
                key={item.label}
                className="flex gap-3 border border-stone/50 bg-white/50 px-3.5 py-3.5 backdrop-blur-[2px]"
              >
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-lamp" strokeWidth={1.5} aria-hidden />
                <div>
                  <p className="text-[0.72rem] font-semibold tracking-[0.06em] text-ink">{item.label}</p>
                  <p className="mt-0.5 text-xs leading-snug text-ink-soft">{item.detail}</p>
                </div>
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="mt-10 grid gap-4 sm:grid-cols-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.18 }}
          >
            {highlights.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden border border-stone/45 bg-sand-deep/40 transition hover:border-lamp/40 hover:bg-white"
              >
                <div className="relative h-28 overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
                  <p className="absolute bottom-3 left-3 display text-2xl text-sand">{item.title}</p>
                </div>
                <p className="px-4 py-3.5 text-sm leading-relaxed text-ink-soft">{item.description}</p>
              </Link>
            ))}
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.22 }}
          >
            <Link href="/book" className="btn btn-gold gap-2">
              Start your booking
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] text-ink uppercase transition hover:text-lamp"
            >
              <Users className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              About the house
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
