import Image from "next/image";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { checkTimesLabel } from "@/lib/property";
import type { PropertySettings } from "@/lib/types";

const explore = [
  { href: "/rooms", label: "Rooms & suites" },
  { href: "/stay", label: "Plan your stay" },
  { href: "/wellness", label: "Wellness" },
  { href: "/events", label: "Meetings & events" },
  { href: "/whats-on", label: "What's on" },
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

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm text-sand/72 transition hover:text-sand"
    >
      <span className="h-px w-0 bg-lamp/80 transition-all group-hover:w-3" aria-hidden />
      {children}
    </Link>
  );
}

export function SiteFooter({ property }: { property: PropertySettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-sand/75">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-30%,rgba(217,157,38,0.14),transparent_55%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lamp/50 to-transparent" aria-hidden />

      <div className="relative mx-auto grid min-w-0 max-w-[1400px] gap-10 px-4 py-12 sm:gap-12 sm:px-5 sm:py-14 md:grid-cols-12 md:gap-10 md:px-8 md:py-16 lg:gap-8">
        <div className="md:col-span-4 lg:col-span-4">
          <Link href="/" className="inline-block shrink-0" aria-label="Blue Top Villa — home">
            <Image
              src="/brand/logo.png"
              alt="Blue Top Villa"
              width={288}
              height={36}
              className="h-9 w-auto rounded-lg bg-sand/92 px-3 py-2 md:h-10"
            />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-sand/65">
            Boutique hotel stays and memorable events in Kasoa, Ghana - warm service, calm rooms, golden-hour views.
          </p>
          <div className="mt-8 max-w-md">
            <p className="eyebrow mb-3 text-lamp">Newsletter</p>
            <FooterNewsletter compact />
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-2">
          <p className="eyebrow mb-5 text-lamp">Visit</p>
          {property?.address ? <p className="text-sm leading-7 text-sand/85">{property.address}</p> : null}
          {property ? <p className="mt-3 text-sm text-sand/60">{checkTimesLabel(property)}</p> : null}
          {property?.instagram || property?.tiktok ? (
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {property.instagram ? (
                <a
                  href={property.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-sand/80 underline-offset-4 transition hover:text-lamp hover:underline"
                >
                  Instagram
                </a>
              ) : null}
              {property.tiktok ? (
                <a
                  href={property.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-sand/80 underline-offset-4 transition hover:text-lamp hover:underline"
                >
                  TikTok
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <p className="eyebrow mb-5 text-lamp">Explore</p>
          <nav className="flex flex-col gap-2.5" aria-label="Explore">
            {explore.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </nav>
        </div>

        <div className="md:col-span-3 lg:col-span-3">
          <p className="eyebrow mb-5 text-lamp">Villa</p>
          <nav className="flex flex-col gap-2.5" aria-label="Villa">
            {villa.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="relative border-t border-white/[0.08] bg-black/20">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-5 py-6 text-center md:flex-row md:px-8 md:text-left">
          <p className="text-xs text-sand/50">
            © {year} Bluetopvilla. All rights reserved.
          </p>
          <p className="text-[0.65rem] tracking-[0.22em] text-sand/40 uppercase">
            Blue Top Villa · Kasoa, Ghana
          </p>
        </div>
      </div>
    </footer>
  );
}
