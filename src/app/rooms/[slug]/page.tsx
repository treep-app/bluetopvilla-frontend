import { RoomDetailView } from "@/components/rooms/room-detail-view";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { api, ApiRequestError } from "@/lib/api";
import { RoomDetailSkeleton } from "@/components/rooms/room-detail-skeleton";

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

async function RoomDetailContent({ params }: Props) {
  const { slug } = await params;
  let room;
  try {
    room = await api.room(slug);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) notFound();
    throw error;
  }

  return <RoomDetailView room={room} />;
}

export default function RoomPage({ params }: Props) {
  return (
    <Suspense fallback={<RoomDetailSkeleton />}>
      <RoomDetailContent params={params} />
    </Suspense>
  );
}
