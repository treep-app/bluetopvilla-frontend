/**
 * Gallery presentation layer — images come from the backend `/gallery` endpoint.
 */

export type GalleryCategoryId =
  | "all"
  | "rooms"
  | "property"
  | "pool"
  | "dining"
  | "events"
  | "experiences"
  | "surroundings";

/** Intentional tile role for editorial layouts */
export type GalleryLayoutRole = "feature" | "tall" | "wide" | "standard";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: Exclude<GalleryCategoryId, "all">;
  layout?: GalleryLayoutRole;
  /** Optional short caption shown in lightbox */
  caption?: string;
};

export type GalleryFilter = {
  id: GalleryCategoryId;
  label: string;
};

export type GalleryChapter = {
  id: string;
  label: string;
  eyebrow: string;
  intro: string;
  images: GalleryImage[];
  /** Category ids represented — used for filter matching */
  categoryIds: Array<Exclude<GalleryCategoryId, "all">>;
};

export const GALLERY_FILTERS: GalleryFilter[] = [
  { id: "all", label: "All" },
  { id: "rooms", label: "Rooms & Suites" },
  { id: "property", label: "Property" },
  { id: "pool", label: "Pool" },
  { id: "dining", label: "Dining" },
  { id: "events", label: "Events" },
  { id: "experiences", label: "Experiences" },
  { id: "surroundings", label: "Surroundings" },
];

const CHAPTER_COPY: Record<
  Exclude<GalleryCategoryId, "all">,
  { eyebrow: string; intro: string }
> = {
  rooms: {
    eyebrow: "Rest",
    intro: "Suites and guest rooms prepared for quiet nights and unhurried mornings.",
  },
  property: {
    eyebrow: "Arrival",
    intro: "The house as guests first meet it — warm light, calm interiors, a sense of place.",
  },
  pool: {
    eyebrow: "Water",
    intro: "Afternoons by the pool, when the villa softens into shade and still water.",
  },
  dining: {
    eyebrow: "Table",
    intro: "Shared meals and private dinners — hospitality at its most familiar.",
  },
  events: {
    eyebrow: "Gather",
    intro: "Weddings, celebrations, and gatherings staged across the grounds.",
  },
  experiences: {
    eyebrow: "Moments",
    intro: "The slower hours that turn a stay into a memory.",
  },
  surroundings: {
    eyebrow: "Place",
    intro: "Between Accra and the coast — the villa in its Kasoa setting.",
  },
};

const CATEGORY_ALIASES: Record<string, Exclude<GalleryCategoryId, "all">> = {
  rooms: "rooms",
  room: "rooms",
  suites: "rooms",
  property: "property",
  villa: "property",
  house: "property",
  lobby: "property",
  pool: "pool",
  dining: "dining",
  events: "events",
  event: "events",
  wedding: "events",
  experiences: "experiences",
  experience: "experiences",
  surroundings: "surroundings",
  exterior: "surroundings",
  grounds: "surroundings",
};

export function normalizeGalleryCategory(raw?: string | null): Exclude<GalleryCategoryId, "all"> {
  if (!raw) return "property";
  const key = raw.toLowerCase().trim();
  return CATEGORY_ALIASES[key] ?? "property";
}

export function fromApiGallery(
  images: Array<{
    id: string;
    url: string;
    alt?: string | null;
    label?: string | null;
    category?: string;
    sortOrder?: number;
  }>,
): GalleryImage[] {
  const sorted = [...images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // Prefer known villa photos for layout roles
  const layoutForUrl = (url: string, category: Exclude<GalleryCategoryId, "all">, indexInCat: number): GalleryLayoutRole => {
    if (url.includes("room-suite") || url.includes("event-wedding")) return "tall";
    if (
      url.includes("gallery-pool") ||
      url.includes("hero-hotel") ||
      url.includes("gallery-lobby") ||
      url.includes("gallery-dining")
    ) {
      return "feature";
    }
    if (url.includes("room-deluxe") || url.includes("event-corporate")) return "wide";
    if (url.includes("room-standard") || url.includes("event-party")) return "standard";
    if (indexInCat === 0 && (category === "rooms" || category === "events")) return "tall";
    if (indexInCat === 0) return "feature";
    return "standard";
  };

  const categoryCounts: Record<string, number> = {};

  return sorted.map((image) => {
    const category = normalizeGalleryCategory(image.category);
    const indexInCat = categoryCounts[category] ?? 0;
    categoryCounts[category] = indexInCat + 1;

    return {
      id: image.id,
      src: image.url,
      alt: image.alt ?? image.label ?? "Blue Top Villa",
      title: image.label ?? image.alt ?? "Blue Top Villa",
      category,
      layout: layoutForUrl(image.url, category, indexInCat),
    };
  });
}

export function categoryLabel(id: Exclude<GalleryCategoryId, "all"> | string) {
  return GALLERY_FILTERS.find((f) => f.id === id)?.label ?? id;
}

const LAYOUT_RANK: Record<GalleryLayoutRole, number> = {
  tall: 0,
  feature: 1,
  wide: 2,
  standard: 3,
};

function sortByLayout(images: GalleryImage[]) {
  return [...images].sort(
    (a, b) => LAYOUT_RANK[a.layout ?? "standard"] - LAYOUT_RANK[b.layout ?? "standard"],
  );
}

/** Editorial chapters for the “All” view — grouped for hospitality rhythm, not one header per photo. */
export function buildGalleryChapters(images: GalleryImage[]): GalleryChapter[] {
  const byCategory = (id: Exclude<GalleryCategoryId, "all">) =>
    sortByLayout(images.filter((img) => img.category === id));

  const rooms = byCategory("rooms");
  const villa = sortByLayout([
    ...byCategory("pool"),
    ...byCategory("property"),
    ...byCategory("dining"),
    ...byCategory("experiences"),
  ]);
  const events = byCategory("events");
  const place = byCategory("surroundings");

  const chapters: GalleryChapter[] = [];

  if (rooms.length) {
    chapters.push({
      id: "rooms",
      label: "Rooms & Suites",
      eyebrow: CHAPTER_COPY.rooms.eyebrow,
      intro: CHAPTER_COPY.rooms.intro,
      images: rooms,
      categoryIds: ["rooms"],
    });
  }

  if (villa.length) {
    chapters.push({
      id: "villa",
      label: "The villa",
      eyebrow: "House & grounds",
      intro: "Arrival spaces, the pool, and the table — the shared heart of a stay.",
      images: villa,
      categoryIds: ["property", "pool", "dining", "experiences"],
    });
  }

  if (events.length) {
    chapters.push({
      id: "events",
      label: "Events",
      eyebrow: CHAPTER_COPY.events.eyebrow,
      intro: CHAPTER_COPY.events.intro,
      images: events,
      categoryIds: ["events"],
    });
  }

  if (place.length) {
    chapters.push({
      id: "surroundings",
      label: "Surroundings",
      eyebrow: CHAPTER_COPY.surroundings.eyebrow,
      intro: CHAPTER_COPY.surroundings.intro,
      images: place,
      categoryIds: ["surroundings"],
    });
  }

  return chapters;
}

/** Single-category view — one focused hospitality story. */
export function buildCategoryChapter(
  images: GalleryImage[],
  category: Exclude<GalleryCategoryId, "all">,
): GalleryChapter | null {
  const chapterImages = sortByLayout(images.filter((img) => img.category === category));
  if (!chapterImages.length) return null;
  const copy = CHAPTER_COPY[category];
  return {
    id: category,
    label: categoryLabel(category),
    eyebrow: copy.eyebrow,
    intro: copy.intro,
    images: chapterImages,
    categoryIds: [category],
  };
}
