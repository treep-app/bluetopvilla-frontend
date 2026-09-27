import Link from "next/link";
import { checkTimesLabel, telHref } from "@/lib/property";
import type { PropertySettings } from "@/lib/types";

const explore = [
  { href: "/rooms", label: "Rooms & suites" },
  { href: "/stay", label: "Plan your stay" },
  { href: "/wellness", label: "Wellness" },
  { href: "/events", label: "Meetings & events" },
  { href: "/venue", label: "Venue enquiry" },
  { href: "/gallery", label: "Gallery" },
];

const villa = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book online" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/cancellation-policy", label: "Cancellation" },
];

export function SiteFooter({ property }: { property: PropertySettings | null }) {
  return (
    <footer className="bg-ink text-sand/75">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-12 md:gap-8 md:px-8 md:py-16">
        <div className="md:col-span-4">
          <p className="display text-3xl text-sand">Blue Top Villa</p>
          <p className="mt-4 max-w-xs text-sm leading-7">
            Hotel stays and event hosting in Kasoa, Ghana.
          </p>
          <Link href="/book" className="btn btn-gold mt-6 inline-flex !min-h-10 !text-[0.65rem]">
            Book now
          </Link>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow mb-4 text-lamp">Visit</p>
          {property?.address ? <p className="text-sm text-sand/85">{property.address}</p> : null}
          {property ? <p className="mt-2 text-sm">{checkTimesLabel(property)}</p> : null}
          {property?.instagram || property?.tiktok ? (
            <div className="mt-4 flex gap-4 text-sm">
              {property.instagram ? (
                <a href={property.instagram} target="_blank" rel="noreferrer" className="hover:text-sand">
                  Instagram
                </a>
              ) : null}
              {property.tiktok ? (
                <a href={property.tiktok} target="_blank" rel="noreferrer" className="hover:text-sand">
                  TikTok
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow mb-4 text-lamp">Explore</p>
          <div className="flex flex-col gap-2 text-sm">
            {explore.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-sand">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow mb-4 text-lamp">Villa</p>
          <div className="flex flex-col gap-2 text-sm">
            {villa.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-sand">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 space-y-1 text-sm">
            {property?.phone ? (
              <p>
                <a href={telHref(property.phone)} className="hover:text-sand">
                  {property.phone}
                </a>
              </p>
            ) : null}
            {property?.email ? (
              <p>
                <a href={`mailto:${property.email}`} className="hover:text-sand">
                  {property.email}
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs tracking-[0.18em] uppercase md:px-8">
        Blue Top Villa · Kasoa, Ghana
      </div>
    </footer>
  );
}
