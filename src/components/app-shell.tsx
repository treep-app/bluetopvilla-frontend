"use client";

import { ConditionalFooter } from "@/components/conditional-footer";
import { MobileBookFab } from "@/components/mobile-book-fab";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { showMobileBottomNav } from "@/lib/mobile-chrome";
import type { PropertySettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function AppShell({
  children,
  property,
}: {
  children: React.ReactNode;
  property: PropertySettings | null;
}) {
  const pathname = usePathname();
  const padForNav = showMobileBottomNav(pathname);

  return (
    <>
      <main
        className={cn(
          "min-w-0",
          padForNav &&
            "pb-[calc(var(--mobile-nav-height)+1.25rem+env(safe-area-inset-bottom,0px))] md:pb-0",
        )}
      >
        {children}
      </main>
      <div
        className={cn(
          padForNav &&
            "pb-[calc(var(--mobile-nav-height)+1.25rem+env(safe-area-inset-bottom,0px))] md:pb-0",
        )}
      >
        <ConditionalFooter property={property} />
      </div>
      <MobileBottomNav />
      <MobileBookFab />
    </>
  );
}
