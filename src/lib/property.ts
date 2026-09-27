import type { PropertySettings } from "@/lib/types";

/** "Check-in / out 12:00", or separate times when they differ. */
export function checkTimesLabel(property: Pick<PropertySettings, "checkInTime" | "checkOutTime">) {
  return property.checkInTime === property.checkOutTime
    ? `Check-in / out ${property.checkInTime}`
    : `Check-in ${property.checkInTime} · Check-out ${property.checkOutTime}`;
}

/** Local Ghanaian numbers (e.g. "055 917 1787") are stored as displayed; dial them with +233. */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.startsWith("0") ? `233${digits.slice(1)}` : digits}`;
}

export function whatsappHref(whatsapp: string, message?: string) {
  const base = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

type Location = Pick<PropertySettings, "address" | "latitude" | "longitude">;

const hasPin = (place: Location): place is Location & { latitude: number; longitude: number } =>
  typeof place.latitude === "number" && typeof place.longitude === "number";

/** Google Maps directions — to the exact pin when known, otherwise the address (plus codes work too). */
export function directionsHref(place: Location) {
  const destination = hasPin(place) ? `${place.latitude},${place.longitude}` : place.address;
  return destination ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}` : null;
}

/**
 * Embeddable map for the property:
 * - Google Maps Embed API when NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY is set;
 * - otherwise OpenStreetMap (no key needed) when the property has coordinates;
 * - otherwise null (Google's old key-less embed no longer loads in iframes).
 */
export function mapEmbedSrc(place: Location) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  if (key && (hasPin(place) || place.address)) {
    const q = hasPin(place) ? `${place.latitude},${place.longitude}` : place.address!;
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}&zoom=15`;
  }
  if (!hasPin(place)) return null;
  const d = 0.012;
  const bbox = [place.longitude - d * 1.6, place.latitude - d, place.longitude + d * 1.6, place.latitude + d].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${place.latitude},${place.longitude}`;
}
