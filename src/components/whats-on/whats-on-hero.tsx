import Link from "next/link";

export function WhatsOnHero({ count }: { count: number }) {
  return (
    <header className="relative overflow-hidden bg-ink text-sand">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_70%_-20%,rgba(217,157,38,0.22),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1400px] px-4 pb-12 pt-[calc(var(--site-header-height)+2rem)] sm:px-5 sm:pb-14 md:px-8 md:pb-20 md:pt-32">
        <p className="eyebrow text-lamp">Blue Top Villa</p>
        <h1 className="display mt-3 max-w-3xl text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] text-sand">
          What&apos;s on
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-sand/70 md:text-base">
          Hosted nights, live music, and villa gatherings open to guests — browse what&apos;s coming up and reserve your
          spot like you would on Eventbrite, with a personal call-back from our team.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-sand/55">
          {count > 0 ? (
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-semibold tracking-wide text-sand/80">
              {count} upcoming {count === 1 ? "listing" : "listings"}
            </span>
          ) : null}
          <Link
            href="/events"
            className="font-semibold tracking-[0.12em] text-sand/80 uppercase underline-offset-4 transition hover:text-lamp hover:underline"
          >
            Private venue hire →
          </Link>
        </div>
      </div>
    </header>
  );
}
