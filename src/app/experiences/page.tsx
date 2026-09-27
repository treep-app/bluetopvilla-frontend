import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";

export const metadata: Metadata = { title: "Experiences" };
export const dynamic = "force-dynamic";

export default async function ExperiencesPage() {
  const experiences = await api.experiences();
  return (
    <div className="bg-sand pt-28">
      <div className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <p className="eyebrow text-ink-soft">At the villa</p>
        <h1 className="display mt-3 text-6xl">Experiences</h1>
        <p className="mt-6 max-w-2xl text-ink-soft">
          Only services Blue Top Villa already offers are listed. Additional experiences will appear here once the
          villa confirms them.
        </p>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {experiences.map((item) => (
            <Link key={item.slug} href={item.slug === "weddings" || item.slug === "parties" || item.slug === "corporate-events" ? `/venue?type=${item.title}` : "/contact"} className="group">
              <div className="relative aspect-[3/4] overflow-hidden">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                ) : null}
              </div>
              <h2 className="display mt-4 text-3xl">{item.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
