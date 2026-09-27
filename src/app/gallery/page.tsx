import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { api } from "@/lib/api";
import { fromApiGallery } from "@/lib/gallery-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore photographs of Blue Top Villa in Kasoa — rooms, pool, dining, events, and the grounds that welcome your stay.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = fromApiGallery(await api.gallery());

  return <GalleryExperience images={images} />;
}
