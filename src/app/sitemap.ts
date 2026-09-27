import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const rooms = await api.rooms();
  return [
    "",
    "/stay",
    "/rooms",
    ...rooms.map((room) => `/rooms/${room.slug}`),
    "/experiences",
    "/wellness",
    "/gallery",
    "/about",
    "/contact",
    "/events",
    "/venue",
    "/book",
    "/terms",
    "/privacy-policy",
    "/cancellation-policy",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6,
  }));
}
