"use client";

import { useMobileNav } from "@/context/mobile-nav-context";
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
  const { menuOpen, setMenuOpen, closeMenu } = useMobileNav();
  const [scrolled, setScrolled] = useState(false);
  const overHero = pathname === "/" && !scrolled && !menuOpen;
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 overflow-x-clip pt-[env(safe-area-inset-top,0px)] transition-all duration-500",
        overHero
          ? "bg-gradient-to-b from-black/45 via-black/15 to-transparent text-sand max-md:from-black/50 max-md:via-black/20"
          : "border-b border-ink/8 bg-sand/92 text-ink shadow-[0_1px_0_rgba(22,20,16,0.04)] backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex min-h-[var(--site-header-height)] max-w-[1400px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-5 md:px-8">
        <Link href="/" className="min-w-0 flex-1 md:flex-none" aria-label="Blue Top Villa — home">
          <span
            className={cn(
              "inline-flex max-w-full items-center sm:max-w-none",
              overHero &&
                "rounded-lg bg-white/12 px-2.5 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.28)] ring-1 ring-white/20 backdrop-blur-md max-md:px-2 max-md:py-1 sm:bg-sand/88 sm:shadow-[0_2px_12px_rgba(0,0,0,0.12)] sm:ring-sand/40 sm:backdrop-blur-sm",
            )}
          >
            <Image
              src="/brand/logo.png"
              alt="Blue Top Villa"
              width={288}
              height={36}
              priority
              className={cn(
                "h-[1.65rem] w-auto max-h-8 sm:h-8 md:h-9",
                !overHero && "-my-0.5 md:-my-1",
              )}
            />
          </span>
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

        <div className="hidden shrink-0 items-center gap-2 sm:gap-3 md:flex md:ml-auto lg:ml-2 xl:ml-4">
          <Link
            href="/book"
            className={cn(
              "btn btn-gold hidden !min-h-10 !px-4 !text-[0.65rem] md:inline-flex",
              overHero && "md:!shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
            )}
          >
            Book now
          </Link>
          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center border max-md:hidden lg:hidden",
              overHero ? "border-sand/35 text-sand" : "border-ink/15 text-ink",
            )}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-sand text-ink max-md:pb-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px))] lg:hidden"
          style={{ top: "calc(var(--site-header-height) + env(safe-area-inset-top, 0px))" }}
        >
          <nav aria-label="Mobile" className="mx-auto flex min-h-full max-w-lg flex-col px-4 py-6 sm:px-6 sm:py-8">
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
                            onClick={closeMenu}
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
              <Link href="/book" onClick={closeMenu} className="btn btn-gold w-full">
                Book your stay
              </Link>
              <Link
                href="/venue"
                onClick={closeMenu}
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
