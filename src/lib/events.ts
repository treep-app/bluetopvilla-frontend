import type { EventDto } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "YYYY-MM-DD" today at the villa. */
export function todayIn(timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

export function isWeekly(event: Pick<EventDto, "recurrenceDays">) {
  return event.recurrenceDays.length > 0;
}

/** "Every Friday & Saturday · 21:00" or "Sat 24 Oct · 19:00" (villa time). */
export function scheduleLabel(event: EventDto, timeZone: string) {
  if (isWeekly(event)) {
    const days = event.recurrenceDays.map((day) => (event.recurrenceDays.length > 2 ? WEEKDAYS[day] : WEEKDAYS_LONG[day]));
    const list = days.length > 1 ? `${days.slice(0, -1).join(", ")} & ${days[days.length - 1]}` : days[0];
    return `Every ${list}${event.recurrenceTime ? ` · ${event.recurrenceTime}` : ""}`;
  }
  if (!event.eventAt) return "Date to be announced";
  const date = new Date(event.eventAt);
  const day = date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone });
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
  return `${day} · ${time}`;
}

/** Big date block for one-off events: { day: "24", month: "Oct" }. */
export function dateBadge(event: EventDto, timeZone: string) {
  if (isWeekly(event) || !event.eventAt) return null;
  const date = new Date(event.eventAt);
  return {
    day: date.toLocaleDateString("en-GB", { day: "numeric", timeZone }),
    month: date.toLocaleDateString("en-GB", { month: "short", timeZone }),
  };
}

/** Next `count` dates ("YYYY-MM-DD") a weekly event runs, starting today at the villa. */
export function upcomingDates(event: EventDto, timeZone: string, count = 8) {
  if (!isWeekly(event)) return [];
  const dates: string[] = [];
  const cursor = new Date(`${todayIn(timeZone)}T00:00:00Z`);
  while (dates.length < count) {
    if (event.recurrenceDays.includes(cursor.getUTCDay())) dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

export function formatDateKey(key: string) {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}
