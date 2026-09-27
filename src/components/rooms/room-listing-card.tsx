import { RoomAmenityIcon } from "@/components/rooms/room-amenity-icon";
import type { RoomTypeSummary } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { ArrowRight, BedDouble, Maximize2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function cleanDescription(text: string | null) {
  if (!text) return "A comfortable room at Blue Top Villa — details and official copy will be confirmed by the property.";
  if (text.startsWith("TODO:")) {
    return "A comfortable room at Blue Top Villa with ensuite amenities and calm interiors.";
  }
  return text;
}

type Props = {
  room: RoomTypeSummary;
  index: number;
  featured?: boolean;
};

export function RoomListingCard({ room, index, featured }: Props) {
  const amenities = room.amenities.slice(0, 5);
  const extraAmenities = Math.max(0, room.amenities.length - amenities.length);

  return (
    <article
      className={`group relative overflow-hidden border border-stone/45 bg-white shadow-[0_20px_50px_-40px_rgba(22,20,16,0.45)] transition hover:border-lamp/35 hover:shadow-[0_28px_64px_-36px_rgba(22,20,16,0.35)] ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <div className={`grid ${featured ? "lg:grid-cols-2" : "md:grid-cols-5"}`}>
        <div className={`relative overflow-hidden bg-ink/5 ${featured ? "min-h-[280px] lg:min-h-[360px]" : "aspect-[4/3] md:col-span-2 md:aspect-auto md:min-h-[260px]"}`}>
          {room.featuredImage ? (
            <Image
              src={room.featuredImage}
              alt={room.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-[1.03]"
              sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 40vw"}
              priority={index === 0}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-ink/10" />
          <div className="absolute left-4 top-4 flex items-center gap-2 bg-white/95 px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.14em] text-ink uppercase">
            Room {String(index + 1).padStart(2, "0")}
          </div>
          <p className="absolute bottom-4 left-4 display text-3xl text-sand md:hidden">{room.name}</p>
        </div>

        <div className={`flex flex-col justify-center p-6 md:p-8 ${featured ? "" : "md:col-span-3"}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-ink-soft">From</p>
              <p className="display mt-1 text-3xl text-ink md:text-4xl">
                {formatMoney(room.basePrice, room.currency)}
                <span className="ml-2 text-base font-sans font-normal tracking-normal text-ink-soft">/ night</span>
              </p>
            </div>
            <p className="hidden text-right text-xs tracking-[0.12em] text-ink-soft uppercase md:block">
              Taxes &amp; fees at checkout
            </p>
          </div>

          <h2 className="display mt-5 hidden text-4xl text-ink md:block">{room.name}</h2>
          <h2 className="display mt-3 text-3xl text-ink md:hidden">{room.name}</h2>

          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-soft md:text-base md:leading-7">
            {cleanDescription(room.description)}
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
            <li className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-lamp" strokeWidth={1.5} aria-hidden />
              Up to {room.occupancy} guests
            </li>
            {room.bedConfig && !room.bedConfig.startsWith("TODO") ? (
              <li className="inline-flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-lamp" strokeWidth={1.5} aria-hidden />
                {room.bedConfig}
              </li>
            ) : (
              <li className="inline-flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-lamp" strokeWidth={1.5} aria-hidden />
                Bed configuration on request
              </li>
            )}
            {room.sizeSqm ? (
              <li className="inline-flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-lamp" strokeWidth={1.5} aria-hidden />
                {room.sizeSqm} m²
              </li>
            ) : null}
          </ul>

          {amenities.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <li
                  key={amenity.id}
                  className="inline-flex items-center gap-1.5 border border-stone/50 bg-sand/60 px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.04em] text-ink-soft uppercase"
                >
                  <RoomAmenityIcon icon={amenity.icon} className="h-3.5 w-3.5 text-lamp" />
                  {amenity.name}
                </li>
              ))}
              {extraAmenities > 0 ? (
                <li className="px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.08em] text-ink-soft uppercase">
                  +{extraAmenities} more
                </li>
              ) : null}
            </ul>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-stone/40 pt-6">
            <Link href={`/book?room=${room.slug}`} className="btn btn-gold gap-2">
              Check availability
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={`/rooms/${room.slug}`}
              className="btn btn-ghost border-ink/25 text-ink hover:border-ink/40"
            >
              View room details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
