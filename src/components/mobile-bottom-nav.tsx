"use client";

import { useMobileNav } from "@/context/mobile-nav-context";
import { isNavActive, type NavLink } from "@/lib/navigation";
import { showMobileBottomNav } from "@/lib/mobile-chrome";
import { cn } from "@/lib/utils";
import { Home, LayoutGrid, Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  href?: string;
  label: string;
  icon: typeof Home;
  link?: NavLink;
  action?: "menu";
};

const leftTabs: Tab[] = [
  { href: "/", label: "Home", icon: Home, link: { href: "/", label: "Home", match: "exact" } },
  { href: "/rooms", label: "Rooms", icon: LayoutGrid, link: { href: "/rooms", label: "Rooms", match: "prefix" } },
];

const rightTabs: Tab[] = [
  {
    href: "/whats-on",
    label: "Events",
    icon: Sparkles,
    link: { href: "/whats-on", label: "What's on", match: "prefix" },
  },
  { label: "Menu", icon: Menu, action: "menu" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useMobileNav();

  if (!showMobileBottomNav(pathname)) return null;

  const renderTab = (tab: Tab) => {
    const Icon = tab.icon;
    const active = tab.link ? isNavActive(pathname, tab.link) : menuOpen;

    if (tab.action === "menu") {
      return (
        <li key="menu">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(
              "flex min-h-[var(--mobile-nav-height)] w-full flex-col items-center justify-center gap-0.5 px-1 text-[0.62rem] font-semibold tracking-wide transition",
              active ? "text-lamp" : "text-ink-soft",
            )}
            aria-expanded={menuOpen}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            {tab.label}
          </button>
        </li>
      );
    }

    return (
      <li key={tab.href}>
        <Link
          href={tab.href!}
          className={cn(
            "flex min-h-[var(--mobile-nav-height)] w-full flex-col items-center justify-center gap-0.5 px-1 text-[0.62rem] font-semibold tracking-wide transition",
            active ? "text-lamp" : "text-ink-soft",
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} aria-hidden />
          {tab.label}
        </Link>
      </li>
    );
  };

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-sand/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_32px_rgba(22,20,16,0.08)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {leftTabs.map(renderTab)}
        <li className="pointer-events-none" aria-hidden />
        {rightTabs.map(renderTab)}
      </ul>
    </nav>
  );
}
