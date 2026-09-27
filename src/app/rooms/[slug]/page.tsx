import { RoomAmenityIcon } from "@/components/rooms/room-amenity-icon";
import { BookingSearch } from "@/components/booking-search";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, BedDouble, ChevronRight, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiRequestError } from "@/lib/api";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const room = await api.room(slug);
    return {
      title: room.name,
      description: room.description?.startsWith("TODO") ? undefined : room.description ?? undefined,
    };
  } catch {
    return { title: "Room" };
  }
}

function cleanDescription(text: string | null) {
  if (!text || text.startsWith("TODO:")) {
    return "A well-appointed room at Blue Top Villa in Kasoa — quiet interiors, ensuite comfort, and easy access to the pool and event spaces.";
  }
  return text;
}

export default async function RoomPage({ params }: Props) {
  const { slug } = await params;
  let room;
  try {
    room = await api.room(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error;
  }

  const gallery = room.images.length > 0 ? room.images : room.featuredImage ? [{ id: "featured", url: room.featuredImage, alt: room.name, sortOrder: 0 }] : [];

  return (
    <div className="bg-sand">
      <header className="relative h-[min(58vh,520px)] min-h-[320px]">
        <Image
          src={room.featuredImage ?? "/images/hero-hotel.jpg"}
          alt={room.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/25" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-10 pt-28 md:px-8 md:pb-12">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-[0.68rem] font-medium tracking-[0.14em] text-sand/70 uppercase">
            <Link href="/" className="hover:text-sand">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
            <Link href="/rooms" className="hover:text-sand">Rooms</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
            <span className="text-sand">{room.name}</span>
          </nav>
          <p className="eyebrow text-lamp-soft">Room type</p>
          <h1 className="display mt-2 text-5xl text-sand md:text-6xl">{room.name}</h1>
          <p className="mt-4 flex flex-wrap gap-5 text-sm text-sand/85">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-lamp" aria-hidden />
              Up to {room.occupancy} guests
            </span>
            {room.bedConfig && !room.bedConfig.startsWith("TODO") ? (
              <span className="inline-flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-lamp" aria-hidden />
                {room.bedConfig}
              </span>
            ) : null}
            <span className="font-medium text-lamp">
              From {formatMoney(room.basePrice, room.currency)} / night
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-12 md:grid-cols-12 md:px-8 md:py-16">
        <div className="md:col-span-7">
          <Link
            href="/rooms"
            className="mb-8 inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.14em] text-ink-soft uppercase hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All rooms
          </Link>

          {gallery.length > 1 ? (
            <div className="mb-10 grid grid-cols-2 gap-3">
              {gallery.slice(0, 4).map((image, i) => (
                <div
                  key={image.id}
                  className={`relative overflow-hidden bg-ink/5 ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
                >
                  <Image src={image.url} alt={image.alt ?? room.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                </div>
              ))}
            </div>
          ) : null}

          <h2 className="display text-3xl text-ink">About this room</h2>
          <p className="mt-4 text-base leading-8 text-ink-soft md:text-lg">{cleanDescription(room.description)}</p>

          <dl className="mt-10 grid gap-6 border border-stone/45 bg-white p-6 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-ink-soft">Occupancy</dt>
              <dd className="mt-2 text-ink">{room.occupancy} guests</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-soft">Bed</dt>
              <dd className="mt-2 text-ink">
                {room.bedConfig && !room.bedConfig.startsWith("TODO") ? room.bedConfig : "On request"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-soft">From</dt>
              <dd className="mt-2 text-ink">{formatMoney(room.basePrice, room.currency)} / night</dd>
            </div>
            {room.sizeSqm ? (
              <div>
                <dt className="eyebrow text-ink-soft">Size</dt>
                <dd className="mt-2 text-ink">{room.sizeSqm} m²</dd>
              </div>
            ) : (
              <div>
                <dt className="eyebrow text-ink-soft">Inventory</dt>
                <dd className="mt-2 text-ink">{room.units} unit{room.units === 1 ? "" : "s"}</dd>
              </div>
            )}
          </dl>

          <h2 className="display mt-12 text-3xl text-ink">Amenities</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {room.amenities.map((amenity) => (
              <li
                key={amenity.id}
                className="flex items-center gap-3 border border-stone/40 bg-white px-4 py-3 text-sm text-ink-soft"
              >
                <RoomAmenityIcon icon={amenity.icon} className="h-4 w-4 shrink-0 text-lamp" />
                {amenity.name}
              </li>
            ))}
          </ul>
        </div>

        <aside className="md:col-span-5">
          <div className="sticky top-28 border border-stone/45 bg-white shadow-[0_24px_60px_-40px_rgba(22,20,16,0.35)]">
            <div className="border-b border-stone/40 bg-sand-deep/40 px-6 py-5">
              <p className="eyebrow text-ink-soft">Reserve</p>
              <p className="display mt-1 text-3xl text-ink">{formatMoney(room.basePrice, room.currency)}</p>
              <p className="text-xs tracking-[0.08em] text-ink-soft uppercase">Starting rate per night</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-ink-soft">Select dates and guests to see availability for this room type.</p>
              <div className="mt-5">
                <BookingSearch />
              </div>
              <Link href={`/book?room=${room.slug}`} className="btn btn-gold mt-5 w-full gap-2">
                Continue to booking
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
                Your room is held while you complete payment. Need an event package?{" "}
                <Link href="/contact" className="text-ink underline-offset-2 hover:text-lamp hover:underline">
                  Contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
