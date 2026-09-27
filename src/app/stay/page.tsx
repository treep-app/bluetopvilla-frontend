import { StayAvailabilityPanel } from "@/components/stay/stay-availability-panel";
import { StayDiningSection } from "@/components/stay/stay-dining-section";
import { api } from "@/lib/api";
import { cleanRoomCopy } from "@/lib/booking-utils";
import { formatMoney } from "@/lib/utils";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stay",
  description:
    "Book a room at Blue Top Villa in Kasoa — check availability with live rates, compare rooms, and plan dining as part of your stay.",
};

export const dynamic = "force-dynamic";

export default async function StayPage() {
  const [property, rooms, diningImages, diningItems] = await Promise.all([
    api.property(),
    api.rooms(),
    api.gallery("dining"),
    api.dining(),
  ]);

  return (
    <div className="bg-sand">
      <header className="relative overflow-hidden bg-ink text-sand">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-hotel.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-35"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/55" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 pb-12 pt-28 md:px-8 md:pb-14 md:pt-32">
          <p className="eyebrow text-lamp-soft">Overnight</p>
          <h1 className="display mt-3 max-w-3xl text-5xl md:text-6xl">Stay at the villa</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-sand/85 md:text-lg">
            Choose dates, see live availability from our booking engine, and reserve online. Dining and the grounds are
            part of your stay.
          </p>
          <nav
            aria-label="On this page"
            className="mt-8 flex flex-wrap gap-5 text-[0.68rem] font-semibold tracking-[0.14em] uppercase"
          >
            <a href="#availability" className="text-sand/70 transition hover:text-lamp">
              Availability
            </a>
            <a href="#rooms" className="text-sand/70 transition hover:text-lamp">
              Rooms
            </a>
            <a href="#how-it-works" className="text-sand/70 transition hover:text-lamp">
              How booking works
            </a>
            <a href="#dining" className="text-sand/70 transition hover:text-lamp">
              Dining
            </a>
          </nav>
        </div>
      </header>

      <section id="availability" className="scroll-mt-28 mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-14">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-ink-soft">Step 1</p>
            <h2 className="display mt-2 text-3xl text-ink md:text-4xl">Check availability</h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            Same calendar as the homepage. Rates and totals come from the server for your dates.
          </p>
        </div>
        <StayAvailabilityPanel property={property} />
      </section>

      {rooms.length > 0 ? (
        <section id="rooms" className="scroll-mt-28 border-y border-stone/40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-ink-soft">From the house</p>
                <h2 className="display mt-2 text-3xl text-ink md:text-4xl">Rooms &amp; suites</h2>
              </div>
              <Link
                href="/rooms"
                className="text-[0.7rem] font-semibold tracking-[0.14em] text-ink uppercase underline-offset-4 hover:text-lamp hover:underline"
              >
                View all rooms →
              </Link>
            </div>
            <ul className="grid gap-5 md:grid-cols-3">
              {rooms.map((room) => (
                <li key={room.id}>
                  <Link href={`/rooms/${room.slug}`} className="group block border border-stone/40 transition hover:border-lamp/35">
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                      {room.featuredImage ? (
                        <Image
                          src={room.featuredImage}
                          alt={room.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="display text-2xl text-ink">{room.name}</h3>
                        <p className="text-sm text-lamp">{formatMoney(room.basePrice, room.currency)}</p>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{cleanRoomCopy(room.description)}</p>
                      <p className="mt-2 text-xs tracking-[0.08em] text-ink-soft uppercase">
                        Up to {room.occupancy} guests · from / night
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section id="how-it-works" className="scroll-mt-28 bg-sand">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:py-16">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/room-suite.jpg"
              alt="A room at Blue Top Villa"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="eyebrow text-ink-soft">Step 2</p>
            <h2 className="display mt-2 text-3xl text-ink md:text-4xl">How a booking works</h2>
            <ol className="mt-8 space-y-4">
              {[
                "Pick dates with the calendar — same picker as the homepage.",
                "See live rooms and totals from the booking engine.",
                "Continue to /book, leave your details, and hold the room.",
                "Pay with Hubtel or Stripe, or wait for villa confirmation.",
              ].map((step, index) => (
                <li key={step} className="flex gap-4 text-ink-soft">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-ink text-[0.7rem] font-bold text-sand">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <Link href="/book" className="btn btn-ink mt-8 inline-flex gap-2">
              Go to booking
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <StayDiningSection galleryImages={diningImages} items={diningItems} />
    </div>
  );
}
