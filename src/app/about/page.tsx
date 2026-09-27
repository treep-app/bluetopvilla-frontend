import { AboutPageContent } from "@/components/about/about-page-content";
import { api } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover Blue Top Villa — a hotel and events house in Kasoa, Ghana, for stays, gatherings, and quiet time between Accra and the coast.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const property = await api.property();

  return (
    <div className="bg-sand">
      <AboutPageContent property={property} />
    </div>
  );
}
