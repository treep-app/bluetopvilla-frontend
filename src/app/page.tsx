import { HeroSlider } from "@/components/hero-slider";
import { HomeEventsSection } from "@/components/home-events-section";
import { HomeVillaIntro } from "@/components/home-villa-intro";
import { api } from "@/lib/api";
import { toVillaEventTypes } from "@/lib/villa-events";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [property, experiences] = await Promise.all([api.property(), api.experiences()]);

  return (
    <>
      <div className="flex min-h-[100svh] flex-col bg-sand">
        <HeroSlider property={property} />
        <HomeVillaIntro property={property} />
      </div>

      <HomeEventsSection events={toVillaEventTypes(experiences)} />
    </>
  );
}
