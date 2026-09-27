import type { ExperienceDto } from "@/lib/types";

export type VillaEventType = {
  slug: string;
  href: string;
  title: string;
  tagline: string;
  description: string;
  image: string | null;
  /** Icon key, rendered by `EventTypeIcon` (kept serialisable for server → client props). */
  icon: string | null;
  highlights: string[];
};

/** Event types are the villa's published experiences (managed in the backend). */
export function toVillaEventTypes(experiences: ExperienceDto[]): VillaEventType[] {
  return experiences.map((experience) => ({
    slug: experience.slug,
    href: `/venue?type=${encodeURIComponent(experience.title)}`,
    title: experience.title,
    tagline: experience.tagline ?? "",
    description: experience.description ?? "",
    image: experience.imageUrl,
    icon: experience.icon,
    highlights: experience.highlights,
  }));
}

export const villaEventAssurances = [
  { label: "Enquiry first", detail: "We confirm date, layout, and deposit after speaking with you." },
  { label: "One address", detail: "Ceremony, reception, and guest rooms can stay on one property." },
  { label: "Kasoa location", detail: "Easy reach from Accra with space to breathe away from the city." },
];
