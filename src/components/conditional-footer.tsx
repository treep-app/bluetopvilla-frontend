"use client";

import { SiteFooter } from "@/components/site-footer";
import type { PropertySettings } from "@/lib/types";
import { usePathname } from "next/navigation";

const HIDE_FOOTER_EXACT = ["/rooms", "/book"];
const HIDE_FOOTER_PREFIX = ["/book/confirmation", "/book/payment-return"];

export function ConditionalFooter({ property }: { property: PropertySettings | null }) {
  const pathname = usePathname();
  if (HIDE_FOOTER_EXACT.includes(pathname)) return null;
  if (HIDE_FOOTER_PREFIX.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return null;
  }
  return <SiteFooter property={property} />;
}
