import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Wellness",
  description: "Slow down at Blue Top Villa — pool, gardens, and quiet spaces in Kasoa for rest between Accra and the coast.",
};

export const dynamic = "force-dynamic";

const offerings = (checkOutTime: string) => [
  {
    title: "The pool",
    text: "Swim and unwind beside the house — a natural pause between travel, meetings, or celebration days.",
    image: "/images/gallery-pool.jpg",
  },
  {
    title: "Gardens & shade",
    text: `Outdoor seating and lawns for reading, conversation, or an unhurried morning before check-out at ${checkOutTime}.`,
    image: "/images/gallery-pool.jpg",
  },
  {
    title: "Restful rooms",
    text: "Air-conditioned rooms designed for sleep after long drives from Accra or event weekends on site.",
    image: "/images/room-suite.jpg",
  },
];

export default async function WellnessPage() {
  const property = await api.property();

  return (
    <div className="bg-sand">
      <header className="relative overflow-hidden bg-ink text-sand">
        <div className="absolute inset-0">
          <Image src="/images/gallery-pool.jpg" alt="" fill className="object-cover opacity-40" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/50" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 pb-14 pt-28 md:px-8 md:pb-16 md:pt-32">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-[0.68rem] font-medium tracking-[0.14em] text-sand/70 uppercase"
          >
            <Link href="/" className="hover:text-sand">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
            <span className="text-sand">Wellness</span>
          </nav>
          <p className="eyebrow mt-8 text-lamp-soft">Restore</p>
          <h1 className="display mt-3 max-w-2xl text-5xl md:text-6xl">Wellness at the villa</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-sand/85 md:text-lg">
            Blue Top Villa is not a full spa resort — it is a calm house with water, shade, and room to breathe. Stay
            for a night or an afternoon between the city and the coast.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {offerings(property.checkOutTime).map((item) => (
            <article key={item.title} className="border border-stone/45 bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-6">
                <h2 className="display text-3xl text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-3 border-t border-stone/40 pt-10">
          <Link href="/book" className="btn btn-gold">Book a stay</Link>
          <Link href="/rooms" className="btn btn-ghost border-ink/25 text-ink">View rooms</Link>
        </div>
      </section>
    </div>
  );
}
