import { format, parseISO } from "date-fns";

export function cleanRoomCopy(text: string | null | undefined) {
  if (!text || text.startsWith("TODO:")) {
    return "A comfortable room at Blue Top Villa with ensuite amenities.";
  }
  return text;
}

export function formatStayDate(iso: string) {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "EEE d MMM yyyy");
  } catch {
    return iso;
  }
}

export function formatStayRange(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return "Select dates";
  return `${formatStayDate(checkIn)} → ${formatStayDate(checkOut)}`;
}

export const BOOK_STEPS = [
  { id: "search", label: "Dates" },
  { id: "rooms", label: "Room" },
  { id: "guest", label: "Guest" },
  { id: "summary", label: "Review" },
  { id: "pay", label: "Payment" },
] as const;

export type BookStepId = (typeof BOOK_STEPS)[number]["id"];
