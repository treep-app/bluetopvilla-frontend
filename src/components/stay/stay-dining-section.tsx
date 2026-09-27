import { PhotoGallery } from "@/components/photo-gallery";
import { toPhotos } from "@/lib/photos";
import type { DiningItemDto, GalleryImageDto } from "@/lib/types";
import { ArrowRight, Clock3, type LucideIcon, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

const ICONS: Record<string, LucideIcon> = {
  utensils: UtensilsCrossed,
  clock: Clock3,
};

type Props = {
  galleryImages: GalleryImageDto[];
  items: DiningItemDto[];
};

export function StayDiningSection({ galleryImages, items }: Props) {
  const photos = toPhotos(galleryImages);

  return (
    <section
      id="dining"
      className="scroll-mt-28 border-t border-stone/40 bg-sand-deep/35"
      aria-labelledby="stay-dining-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow text-ink-soft">During your stay</p>
            <h2 id="stay-dining-heading" className="display mt-3 text-4xl text-ink md:text-5xl">
              Dining at the villa
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft md:text-lg md:leading-8">
              Meals are part of how you use the house — not a separate restaurant booking. Ask when you reserve a room,
              or tell us about catering when you enquire for an event.
            </p>

            {items.length > 0 ? (
              <ul className="mt-8 space-y-4">
                {items.map((item) => {
                  const Icon = (item.icon && ICONS[item.icon]) || UtensilsCrossed;
                  return (
                    <li key={item.id} className="flex gap-3 border border-stone/45 bg-white px-4 py-3.5">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-lamp" strokeWidth={1.5} aria-hidden />
                      <div>
                        <p className="text-sm font-medium text-ink">{item.title}</p>
                        {item.description ? <p className="mt-1 text-sm text-ink-soft">{item.description}</p> : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn btn-gold gap-2">
                Book a stay
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/contact" className="btn btn-ghost border-ink/20 text-ink">
                Ask about dining
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            {photos.length > 0 ? <PhotoGallery photos={photos} layout="hero" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
