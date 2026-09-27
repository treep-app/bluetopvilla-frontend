import { ContactForm } from "@/components/contact/contact-form";
import { CopyButton } from "@/components/contact/copy-button";
import { api } from "@/lib/api";
import { checkTimesLabel, directionsHref, mapEmbedSrc, telHref, whatsappHref } from "@/lib/property";
import type { PaymentOptions, PropertySettings } from "@/lib/types";
import { ArrowUpRight, ChevronRight, Clock3, Instagram, Mail, MapPin, MessageCircle, Navigation, Phone, Plus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call, WhatsApp or write to Blue Top Villa in Kasoa, Ghana — questions about stays, events and dining, with directions to the villa.",
};

export const dynamic = "force-dynamic";

function paymentAnswer(options: PaymentOptions) {
  const methods: string[] = [];
  if (options.hubtel.enabled) {
    methods.push(options.hubtel.mode === "checkout" ? "mobile money or card through Hubtel" : "mobile money through Hubtel");
  }
  if (options.stripe.enabled) methods.push("international cards through Stripe");
  return methods.length
    ? `You can pay online with ${methods.join(", or ")} when you book. Payments can also be taken at the front desk.`
    : "Payment is arranged with the villa team — at the front desk or by mobile money. Call or message us and we'll confirm the details.";
}

function quickAnswers(property: PropertySettings, options: PaymentOptions): Array<{ q: string; a: ReactNode }> {
  return [
    {
      q: "What time is check-in and check-out?",
      a: (
        <>
          {checkTimesLabel(property)}.{" "}
          {property.phone ? (
            <>
              Arriving late? Call us on{" "}
              <a href={telHref(property.phone)} className="text-ink underline underline-offset-2">
                {property.phone}
              </a>{" "}
              so we can plan for you.
            </>
          ) : null}
        </>
      ),
    },
    {
      q: "How do I book a room?",
      a: (
        <>
          Choose your dates on the{" "}
          <Link href="/book" className="text-ink underline underline-offset-2">
            booking page
          </Link>{" "}
          to see live availability and prices. Your room is held for {options.holdMinutes} minutes while you pay.
        </>
      ),
    },
    { q: "How can I pay?", a: paymentAnswer(options) },
    {
      q: "Can I host a wedding, party or corporate event?",
      a: (
        <>
          Yes — send a{" "}
          <Link href="/venue" className="text-ink underline underline-offset-2">
            venue enquiry
          </Link>{" "}
          with your date and guest count and the team will confirm availability, layout and deposit.
        </>
      ),
    },
    {
      q: "How do I change or cancel a booking?",
      a: (
        <>
          Call, WhatsApp or email us with your booking reference. Read the{" "}
          <Link href="/cancellation-policy" className="text-ink underline underline-offset-2">
            cancellation policy
          </Link>{" "}
          for how changes are handled.
        </>
      ),
    },
  ];
}

export default async function ContactPage() {
  const [property, paymentOptions] = await Promise.all([api.property(), api.paymentOptions()]);
  const phones = [property.phone, property.phoneAlt].filter((value): value is string => Boolean(value));
  const whatsappGreeting = `Hello ${property.name}, I have a question.`;
  const directions = directionsHref(property);
  const mapSrc = mapEmbedSrc(property);

  const directLines = [
    phones[0]
      ? { label: "Call us", value: phones[0], href: telHref(phones[0]), icon: Phone, external: false }
      : null,
    property.whatsapp
      ? {
          label: "WhatsApp",
          value: "Chat with the team",
          href: whatsappHref(property.whatsapp, whatsappGreeting),
          icon: MessageCircle,
          external: true,
        }
      : null,
    property.email
      ? { label: "Email", value: property.email, href: `mailto:${property.email}`, icon: Mail, external: false }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href: string; icon: typeof Phone; external: boolean }>;

  return (
    <div className="bg-sand">
      {/* Hero */}
      <header className="relative overflow-hidden bg-ink text-sand">
        <div className="absolute inset-0">
          <Image src="/images/hero-hotel.jpg" alt="" fill priority className="object-cover object-center opacity-45" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[0.68rem] font-medium tracking-[0.14em] text-sand/70 uppercase"
          >
            <Link href="/" className="hover:text-sand">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
            <span className="text-sand">Contact</span>
          </nav>
          <p className="eyebrow mt-8 text-lamp-soft">Contact</p>
          <h1 className="display mt-3 max-w-3xl text-5xl leading-[1.02] md:text-7xl">Talk to the villa</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-sand/80 md:text-lg">
            Questions about a stay, an event or the table — the team at {property.name} is a call, a message or an email
            away.
          </p>

          {directLines.length ? (
            <ul className="mt-10 grid max-w-4xl gap-px overflow-hidden border border-sand/15 bg-sand/15 sm:grid-cols-3">
              {directLines.map((line) => {
                const Icon = line.icon;
                return (
                  <li key={line.label}>
                    <a
                      href={line.href}
                      {...(line.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group flex h-full items-center gap-4 bg-ink/70 px-5 py-5 backdrop-blur-sm transition hover:bg-ink/40"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-lamp text-ink transition group-hover:bg-lamp-soft">
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.65rem] font-semibold tracking-[0.16em] text-sand/60 uppercase">
                          {line.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.95rem] text-sand">{line.value}</span>
                      </span>
                      <ArrowUpRight
                        className="ml-auto h-4 w-4 shrink-0 text-sand/40 transition group-hover:text-lamp"
                        aria-hidden
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </header>

      {/* Form + details */}
      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <ContactForm propertyName={property.name} />
        </div>

        <aside className="space-y-10 lg:col-span-5 lg:pt-2">
          <div>
            <p className="eyebrow text-ink-soft">Reach us directly</p>
            <dl className="mt-5 divide-y divide-stone/50 border-y border-stone/50">
              {phones.map((phone, index) => (
                <div key={phone} className="flex items-center gap-4 py-4">
                  <Phone className="h-4 w-4 shrink-0 text-lamp" strokeWidth={1.6} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft/70 uppercase">
                      {index === 0 ? "Front desk" : "Alternative line"}
                    </dt>
                    <dd>
                      <a href={telHref(phone)} className="text-lg text-ink hover:text-lamp">
                        {phone}
                      </a>
                    </dd>
                  </div>
                  <CopyButton value={phone} label="phone number" />
                </div>
              ))}
              {property.whatsapp ? (
                <div className="flex items-center gap-4 py-4">
                  <MessageCircle className="h-4 w-4 shrink-0 text-lamp" strokeWidth={1.6} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft/70 uppercase">WhatsApp</dt>
                    <dd>
                      <a
                        href={whatsappHref(property.whatsapp, whatsappGreeting)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-lg text-ink hover:text-lamp"
                      >
                        Message us on WhatsApp
                      </a>
                    </dd>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-soft/50" aria-hidden />
                </div>
              ) : null}
              {property.email ? (
                <div className="flex items-center gap-4 py-4">
                  <Mail className="h-4 w-4 shrink-0 text-lamp" strokeWidth={1.6} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <dt className="text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft/70 uppercase">Email</dt>
                    <dd className="truncate">
                      <a href={`mailto:${property.email}`} className="text-lg text-ink hover:text-lamp">
                        {property.email}
                      </a>
                    </dd>
                  </div>
                  <CopyButton value={property.email} label="email address" />
                </div>
              ) : null}
            </dl>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {property.address ? (
              <div>
                <p className="flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft/70 uppercase">
                  <MapPin className="h-3.5 w-3.5 text-lamp" aria-hidden />
                  Visit
                </p>
                <p className="display mt-2 text-2xl text-ink">{property.address}</p>
                {directions ? (
                <a
                  href={directions}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-ink uppercase underline-offset-4 hover:text-lamp hover:underline"
                >
                  Get directions
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
                ) : null}
              </div>
            ) : null}
            <div>
              <p className="flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft/70 uppercase">
                <Clock3 className="h-3.5 w-3.5 text-lamp" aria-hidden />
                Stays
              </p>
              <p className="display mt-2 text-2xl text-ink">{checkTimesLabel(property)}</p>
              <p className="mt-2 text-sm text-ink-soft">Arriving later? Let us know and we&apos;ll be ready for you.</p>
            </div>
          </div>

          {property.instagram || property.tiktok ? (
            <div className="flex flex-wrap items-center gap-3 border-t border-stone/50 pt-6">
              <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft/70 uppercase">Follow</span>
              {property.instagram ? (
                <a
                  href={property.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-stone/60 px-3 py-2 text-sm text-ink transition hover:border-ink/40"
                >
                  <Instagram className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                  Instagram
                </a>
              ) : null}
              {property.tiktok ? (
                <a
                  href={property.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-stone/60 px-3 py-2 text-sm text-ink transition hover:border-ink/40"
                >
                  <span className="text-[0.8rem] font-semibold" aria-hidden>
                    ♪
                  </span>
                  TikTok
                </a>
              ) : null}
            </div>
          ) : null}
        </aside>
      </section>

      {/* Map */}
      {property.address ? (
        <section className="relative border-y border-stone/40 bg-sand-deep" aria-label="Location">
          <div className="relative md:h-[480px]">
            <div className="relative h-[300px] md:absolute md:inset-0 md:h-auto">
            {mapSrc ? (
              <iframe
                title={`Map showing ${property.name}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[30%] sepia-[12%]"
              />
            ) : (
              <Image src="/images/hero-hotel.jpg" alt="" fill className="object-cover opacity-80" sizes="100vw" />
            )}
            </div>
            {/* Phones: card sits under the map. Larger screens: card floats over it. */}
            <div className="md:pointer-events-none md:absolute md:inset-0 md:mx-auto md:flex md:max-w-[1400px] md:items-center md:px-8">
              <div className="w-full bg-ink p-6 text-sand md:pointer-events-auto md:max-w-sm md:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
                <p className="eyebrow text-lamp-soft">Find us</p>
                <p className="display mt-2 text-3xl">{property.name}</p>
                <p className="mt-2 text-sm text-sand/75">{property.address}</p>
                <p className="mt-1 text-sm text-sand/60">Between Accra and the coast.</p>
                {directions ? (
                  <a href={directions} target="_blank" rel="noreferrer" className="btn btn-gold mt-5 gap-2">
                    <Navigation className="h-4 w-4" aria-hidden />
                    Directions
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Quick answers */}
      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-ink-soft">Before you write</p>
          <h2 className="display mt-2 text-4xl text-ink md:text-5xl">Quick answers</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft md:text-base">
            The things guests ask most. Can&apos;t find yours? Send a message and the team will get back to you.
          </p>
        </div>
        <div className="divide-y divide-stone/50 border-y border-stone/50 lg:col-span-8">
          {quickAnswers(property, paymentOptions).map((item) => (
            <details key={item.q} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left">
                <span className="display text-xl text-ink md:text-2xl">{item.q}</span>
                <Plus
                  className="h-5 w-5 shrink-0 text-lamp transition duration-300 group-open:rotate-45"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </summary>
              <div className="max-w-2xl pb-6 text-sm leading-relaxed text-ink-soft md:text-base">{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
