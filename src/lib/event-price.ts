import type { EventDto } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export function eventPriceLabel(event: Pick<EventDto, "priceFrom" | "priceNote">, currency: string) {
  if (event.priceFrom != null && Number(event.priceFrom) > 0) {
    const amount = formatMoney(event.priceFrom, currency);
    return event.priceNote ? `${amount} ${event.priceNote}` : `From ${amount}`;
  }
  return null;
}

export function eventPriceHeadline(event: Pick<EventDto, "priceFrom">, currency: string) {
  if (event.priceFrom != null && Number(event.priceFrom) > 0) {
    return formatMoney(event.priceFrom, currency);
  }
  return "On request";
}
