"use client";

import { isNavActive, mobileNavGroups, primaryNav } from "@/lib/navigation";
import { telHref } from "@/lib/property";
import type { PropertySettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader({ property }: { property: PropertySettings | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        overHero
          ? "bg-gradient-to-b from-ink/50 to-transparent text-sand"
          : "border-b border-ink/8 bg-sand/92 text-ink shadow-[0_1px_0_rgba(22,20,16,0.04)] backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[1400px] items-center gap-4 px-5 md:px-8">
        <Link href="/" className="shrink-0" aria-label="Blue Top Villa — home">
          <Image
            src="/brand/logo.png"
            alt="Blue Top Villa"
            width={288}
            height={36}
            priority
            className={cn(
              "h-8 w-auto md:h-9",
              // Transparent logo: over the hero photo the navy letters need a light plate
              // to stay readable; on the solid header it sits directly.
              overHero ? "rounded-lg bg-sand/90 px-2.5 py-1.5" : "-my-1",
            )}
          />
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center justify-end gap-6 lg:flex xl:gap-8"
        >
          {primaryNav.map((link) => {
            const active = isNavActive(pathname, link);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className={cn("nav-link", overHero ? "text-sand" : "text-ink")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-2 xl:ml-4">
          <Link
            href="/book"
            className={cn(
              "btn btn-gold hidden !min-h-10 !px-4 !text-[0.65rem] sm:inline-flex",
            )}
          >
            Book now
          </Link>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center border lg:hidden",
              overHero ? "border-sand/35 text-sand" : "border-ink/15 text-ink",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 top-[4.25rem] z-40 overflow-y-auto bg-sand text-ink lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex min-h-full max-w-lg flex-col px-6 py-8">
            <div className="flex flex-1 flex-col gap-8">
              {mobileNavGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-[0.65rem] font-bold tracking-[0.2em] text-lamp uppercase">{group.title}</p>
                  <ul className="mt-3 space-y-0">
                    {group.links.map((link) => {
                      const active = isNavActive(pathname, link);
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "display block border-b border-ink/8 py-3.5 text-2xl leading-none",
                              active ? "text-lamp" : "text-ink",
                            )}
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10 space-y-3 border-t border-ink/10 pt-8 pb-4">
              <Link href="/book" onClick={() => setOpen(false)} className="btn btn-gold w-full">
                Book your stay
              </Link>
              <Link
                href="/venue"
                onClick={() => setOpen(false)}
                className="btn btn-ghost w-full border-ink/20 text-ink"
              >
                Venue enquiry
              </Link>
              {property?.phone || property?.email ? (
                <p className="pt-2 text-center text-xs text-ink-soft">
                  {property.phone ? <a href={telHref(property.phone)}>{property.phone}</a> : null}
                  {property.phone && property.email ? " · " : null}
                  {property.email ? <a href={`mailto:${property.email}`}>{property.email}</a> : null}
                </p>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
