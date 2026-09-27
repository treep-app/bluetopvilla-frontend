export type Photo = {
  id: string;
  src: string;
  alt: string;
  label?: string | null;
  category?: string;
};

export const GALLERY_FILTERS = [
  { id: "all", label: "All" },
  { id: "exterior", label: "Exterior" },
  { id: "villa", label: "The house" },
  { id: "pool", label: "Pool" },
  { id: "dining", label: "Dining" },
  { id: "rooms", label: "Rooms" },
  { id: "events", label: "Events" },
] as const;

export function toPhotos(
  images: Array<{ id: string; url: string; alt?: string | null; label?: string | null; category?: string }>,
): Photo[] {
  return images.map((image) => ({
    id: image.id,
    src: image.url,
    alt: image.alt ?? image.label ?? "Blue Top Villa",
    label: image.label,
    category: image.category,
  }));
}
