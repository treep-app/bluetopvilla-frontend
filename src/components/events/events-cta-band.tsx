import Link from "next/link";

export function EventsCtaBand() {
  return (
    <section className="bg-ocean py-16 text-sand md:py-20">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow text-lamp-soft">Ready when you are</p>
          <h2 className="display mt-2 text-4xl md:text-5xl">Tell us the date. We&apos;ll hold the house.</h2>
          <p className="mt-4 text-sm leading-relaxed text-sand/75 md:text-base">
            Start with a venue enquiry — or call if you prefer to speak first. Guest rooms can be booked alongside your
            celebration.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/venue" className="btn btn-gold">
            Venue enquiry
          </Link>
          <Link href="/contact" className="btn btn-ghost border-sand/45 text-sand hover:bg-sand/10">
            Contact us
          </Link>
          <Link href="/rooms" className="btn btn-ghost border-sand/45 text-sand hover:bg-sand/10">
            View rooms
          </Link>
        </div>
      </div>
    </section>
  );
}
