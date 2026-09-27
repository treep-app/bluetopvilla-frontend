"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CalendarClock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { checkTimesLabel } from "@/lib/property";
import type { PropertySettings } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

const experiences = [
  { title: "Stay", image: "/images/room-suite.jpg", href: "/rooms" },
  { title: "Dining", image: "/images/gallery-dining.jpg", href: "/stay#dining" },
  { title: "Wellness", image: "/images/gallery-pool.jpg", href: "/wellness" },
  { title: "Events", image: "/images/event-wedding.jpg", href: "/events" },
];

export function AboutPageContent({ property }: { property: PropertySettings }) {
  const facts = [
    { icon: MapPin, label: property.address ?? "Kasoa, Ghana", detail: "Between Accra & the coast" },
    { icon: CalendarClock, label: checkTimesLabel(property), detail: "Call if arriving late" },
    ...(property.phone ? [{ icon: Phone, label: property.phone, detail: "Or book online" }] : []),
  ];
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="relative overflow-hidden bg-ink text-sand">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-hotel.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/45" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 pb-12 pt-28 md:px-8 md:pb-14 md:pt-32">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[0.65rem] font-medium tracking-[0.16em] text-sand/65 uppercase"
          >
            <Link href="/" className="hover:text-sand">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-sand">About us</span>
          </nav>
          <p className="eyebrow mt-6 text-lamp-soft">Blue Top Villa</p>
          <h1 className="display mt-2 max-w-3xl text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            A hotel and events house in Kasoa
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand/80 md:text-base">
            Stays, gatherings, and quiet time between Accra and the coast — under one roof.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-14">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
              <Image
                src="/images/gallery-lobby.jpg"
                alt="Interior at Blue Top Villa"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="absolute -bottom-5 -right-2 w-[42%] overflow-hidden border-4 border-sand shadow-lg sm:-right-4">
              <div className="relative aspect-square">
                <Image src="/images/gallery-pool.jpg" alt="Pool" fill className="object-cover" sizes="160px" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-2">
            <p className="eyebrow text-ink-soft">Our story</p>
            <h2 className="display mt-2 text-3xl text-ink md:text-4xl">One address. Many ways to gather.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft md:leading-7">
              Blue Top Villa welcomes overnight guests and private events in Kasoa. Whether you are passing through,
              celebrating a milestone, or hosting colleagues away from the city, the house is laid out for rest and
              occasion.
            </p>
            <div
              className="grid transition-[grid-template-rows] duration-400 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pt-3 text-base leading-relaxed text-ink-soft md:leading-7">
                  Hospitality is in the detail — check-in at {property.checkInTime}, rooms held while you pay online, and a team you can
                  reach when plans change. Weddings, parties, and corporate days sit beside guest rooms so celebration
                  and stay can share one property.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-3 text-[0.7rem] font-semibold tracking-[0.14em] text-ink uppercase hover:text-lamp"
            >
              {open ? "Read less" : "Read more"}
            </button>
            <p className="display mt-6 text-xl text-ink md:text-2xl">The delight is in the detail.</p>
            <Link href="/stay" className="btn btn-ink mt-6 inline-flex gap-2">
              Explore stays
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-stone/40 bg-sand-deep/35" aria-label="Villa facts">
        <ul className="mx-auto grid max-w-[1400px] gap-5 px-5 py-8 sm:grid-cols-3 sm:gap-0 md:px-8">
          {facts.map((fact) => (
            <li
              key={fact.label}
              className="flex gap-3 sm:border-r sm:border-stone/40 sm:px-6 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
            >
              <fact.icon className="mt-0.5 h-4 w-4 shrink-0 text-lamp" strokeWidth={1.5} aria-hidden />
              <div>
                <p className="text-sm font-medium text-ink">{fact.label}</p>
                <p className="text-xs text-ink-soft">{fact.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ink py-12 text-sand md:py-14" aria-labelledby="about-exp-heading">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-lamp-soft">At the villa</p>
              <h2 id="about-exp-heading" className="display mt-2 text-3xl md:text-4xl">
                How guests use the house
              </h2>
            </div>
            <Link href="/gallery" className="hidden text-[0.68rem] font-semibold tracking-[0.14em] text-sand/70 uppercase hover:text-lamp sm:inline">
              Gallery →
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {experiences.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease, delay: index * 0.05 }}
              >
                <Link href={item.href} className="group relative block aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 md:p-4">
                    <span className="display text-xl text-sand md:text-2xl">{item.title}</span>
                    <ArrowUpRight className="h-4 w-4 text-sand/80 transition group-hover:text-lamp" aria-hidden />
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 md:grid-cols-2 md:items-center md:gap-12 md:px-8 md:py-14">
        <div>
          <p className="eyebrow text-ink-soft">Our commitment</p>
          <h2 className="display mt-2 text-3xl text-ink md:text-4xl">Responsible hosting</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base md:leading-7">
            We aim to respect neighbours, staff, and the Kasoa community — clear guest communication, sensible use of
            water and energy, and events run with safety in mind. Questions? Contact us before you book.
          </p>
          <Link href="/contact" className="mt-5 inline-flex text-[0.7rem] font-semibold tracking-[0.14em] text-ink uppercase hover:text-lamp">
            Contact us →
          </Link>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src="/images/event-corporate.jpg"
            alt="Gathering at Blue Top Villa"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="border-t border-stone/40 bg-ocean py-12 text-sand md:py-14">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-center md:px-8">
          <div>
            <h2 className="display text-3xl md:text-4xl">Ready to visit?</h2>
            <p className="mt-2 max-w-md text-sm text-sand/75">Book a room, enquire about an event, or speak with the team.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-gold">
              Book now
            </Link>
            <Link href="/venue" className="btn btn-ghost border-sand/45 text-sand hover:bg-sand/10">
              Venue enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
