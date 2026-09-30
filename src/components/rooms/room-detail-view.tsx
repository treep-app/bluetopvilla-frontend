import { RoomAmenityIcon } from "@/components/rooms/room-amenity-icon";
import { RoomDetailGallery } from "@/components/rooms/room-detail-gallery";
import { RoomDetailBookingPanel } from "@/components/rooms/room-detail-booking-panel";
import type { RoomTypeDetail } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { ArrowLeft, BedDouble, ChevronRight, Maximize2, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

function cleanDescription(text: string | null) {
  if (!text || text.startsWith("TODO:")) {
    return "A well-appointed room at Blue Top Villa in Kasoa — quiet interiors, ensuite comfort, and easy access to the pool and event spaces.";
  }
  return text;
}

export function RoomDetailView({ room }: { room: RoomTypeDetail }) {
  const gallery =
    room.images.length > 0
      ? room.images
      : room.featuredImage
        ? [{ id: "featured", url: room.featuredImage, alt: room.name, sortOrder: 0 }]
        : [];

  const bed = room.bedConfig && !room.bedConfig.startsWith("TODO") ? room.bedConfig : null;

  return (
    <div className="bg-sand pb-28 lg:pb-16">
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8 md:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-1 text-[0.62rem] font-medium tracking-[0.14em] text-ink-soft uppercase"
        >
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
          <Link href="/rooms" className="hover:text-ink">Rooms</Link>
          <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
          <span className="text-ink">{room.name}</span>
        </nav>

        <div className="relative overflow-hidden rounded-2xl border border-stone/35 shadow-[0_24px_60px_-40px_rgba(22,20,16,0.25)]">
          <Link
            href="/rooms"
            className="absolute top-3 left-3 z-20 inline-flex items-center gap-2 rounded-full border border-white/25 bg-ink/80 px-3.5 py-2 text-sm font-medium text-sand shadow-lg backdrop-blur-md transition hover:border-lamp/50 hover:bg-ink sm:top-4 sm:left-4 sm:px-4"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lamp text-ink">
              <ArrowLeft className="h-4 w-4" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="pr-0.5">All rooms</span>
          </Link>
          <RoomDetailGallery images={gallery} roomName={room.name} />
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1400px] gap-6 px-5 md:px-8 lg:grid-cols-12 lg:items-start lg:gap-8">
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-2xl border border-stone/35 bg-white p-6 md:p-8">
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-lamp uppercase">Accommodation</p>
            <h1 className="display mt-2 text-4xl text-ink md:text-5xl">{room.name}</h1>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
              <li className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-lamp" aria-hidden />
                Up to {room.occupancy} guests
              </li>
              {bed ? (
                <li className="inline-flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-lamp" aria-hidden />
                  {bed}
                </li>
              ) : null}
              {room.sizeSqm ? (
                <li className="inline-flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-lamp" aria-hidden />
                  {room.sizeSqm} m²
                </li>
              ) : null}
            </ul>
            <p className="mt-6 text-base leading-relaxed text-ink-soft md:leading-8">
              {cleanDescription(room.description)}
            </p>
          </section>

          <section className="rounded-2xl border border-stone/35 bg-white p-6 md:p-8">
            <h2 className="text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">Room details</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <DetailRow label="Starting rate" value={`${formatMoney(room.basePrice, room.currency)} / night`} />
              <DetailRow label="Max guests" value={String(room.occupancy)} />
              <DetailRow label="Bed" value={bed ?? "On request"} />
              <DetailRow
                label={room.sizeSqm ? "Room size" : "Availability"}
                value={room.sizeSqm ? `${room.sizeSqm} m²` : `${room.units} unit${room.units === 1 ? "" : "s"}`}
              />
            </dl>
          </section>

          {room.amenities.length > 0 ? (
            <section className="rounded-2xl border border-stone/35 bg-white p-6 md:p-8">
              <h2 className="text-[0.65rem] font-semibold tracking-[0.16em] text-ink-soft uppercase">Amenities</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {room.amenities.map((amenity) => (
                  <li
                    key={amenity.id}
                    className="flex items-center gap-3 rounded-xl border border-stone/30 bg-sand/40 px-4 py-3 text-sm text-ink"
                  >
                    <RoomAmenityIcon icon={amenity.icon} className="h-4 w-4 shrink-0 text-lamp" />
                    {amenity.name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="flex items-start gap-3 rounded-2xl border border-stone/35 bg-sand-deep/40 px-5 py-4 text-sm text-ink-soft">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-lamp" aria-hidden />
            <p>
              Secure online booking with room held during payment. Need help choosing?{" "}
              <Link href="/contact" className="font-medium text-ink underline-offset-2 hover:text-lamp hover:underline">
                Contact the villa
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="lg:col-span-5">
          <RoomDetailBookingPanel
            roomSlug={room.slug}
            roomName={room.name}
            price={formatMoney(room.basePrice, room.currency)}
          />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-stone/25 bg-sand/30 px-4 py-3">
      <dt className="text-[0.62rem] font-semibold tracking-[0.14em] text-ink-soft uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
