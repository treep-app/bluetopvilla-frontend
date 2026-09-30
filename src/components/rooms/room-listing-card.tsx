import type { RoomTypeSummary } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { ArrowRight, BedDouble, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function cleanDescription(text: string | null) {
  if (!text) return "Calm interiors and ensuite comfort at Blue Top Villa.";
  if (text.startsWith("TODO:")) return "Calm interiors and ensuite comfort at Blue Top Villa.";
  return text;
}

type Props = {
  room: RoomTypeSummary;
  index: number;
};

export function RoomListingCard({ room, index }: Props) {
  const bed = room.bedConfig && !room.bedConfig.startsWith("TODO") ? room.bedConfig : null;

  return (
    <article className="group relative h-full overflow-hidden bg-ink">
      <div className="relative aspect-[4/5] w-full sm:aspect-[5/6]">
        {room.featuredImage ? (
          <Image
            src={room.featuredImage}
            alt={room.name}
            fill
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 400px"
            priority={index < 3}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-dusk to-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="text-[0.58rem] font-semibold tracking-[0.16em] text-lamp-soft uppercase">
            From {formatMoney(room.basePrice, room.currency)} / night
          </p>
          <h2 className="display mt-1 text-2xl leading-tight text-sand sm:text-[1.65rem]">{room.name}</h2>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-sand/70">{cleanDescription(room.description)}</p>

          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.7rem] text-sand/75">
            <li className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-lamp-soft" aria-hidden />
              Up to {room.occupancy}
            </li>
            {bed ? (
              <li className="inline-flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5 text-lamp-soft" aria-hidden />
                {bed}
              </li>
            ) : null}
            {room.sizeSqm ? <li>{room.sizeSqm} m²</li> : null}
          </ul>

          <div className="mt-4 flex gap-2 border-t border-white/15 pt-3">
            <Link
              href={`/book?room=${room.slug}`}
              className="btn btn-gold inline-flex flex-1 justify-center gap-1.5 py-2.5 text-[0.62rem]"
            >
              Check dates
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              href={`/rooms/${room.slug}`}
              className="btn btn-ghost inline-flex flex-1 justify-center border-sand/35 py-2.5 text-[0.62rem] text-sand hover:bg-sand/10"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
