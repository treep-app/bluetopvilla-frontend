import { RoomCatalog } from "@/components/rooms/room-catalog";
import { RoomsHero } from "@/components/rooms/rooms-hero";
import type { Metadata } from "next";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description:
    "Browse rooms at Blue Top Villa in Kasoa — compare amenities, occupancy, and rates, then check availability and reserve online.",
};

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const [property, rooms] = await Promise.all([api.property(), api.rooms()]);

  return (
    <div className="flex h-[calc(100svh-var(--site-header-height))] flex-col overflow-hidden bg-sand">
      <RoomsHero roomCount={rooms.length} property={property} />
      <RoomCatalog rooms={rooms} />
    </div>
  );
}
