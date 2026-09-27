import { CalendarRange, CreditCard, DoorOpen } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: CalendarRange,
    title: "Choose your dates",
    text: "Use the availability bar to pick check-in, check-out, and party size.",
  },
  {
    icon: DoorOpen,
    title: "Compare rooms",
    text: "Review occupancy, amenities, and nightly rates before you select a room type.",
  },
  {
    icon: CreditCard,
    title: "Reserve securely",
    text: "Your room is held while you complete payment — confirmation follows by email.",
  },
];

export function RoomsStayGuide() {
  return (
    <section className="border-y border-stone/40 bg-sand-deep/50" aria-labelledby="rooms-guide-heading">
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-ink-soft">How booking works</p>
            <h2 id="rooms-guide-heading" className="display mt-2 text-3xl text-ink md:text-4xl">
              Three steps to your stay
            </h2>
          </div>
          <Link href="/book" className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink uppercase underline-offset-4 hover:text-lamp hover:underline">
            Go to booking engine
          </Link>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="relative border border-stone/45 bg-white p-6">
              <span className="text-[0.65rem] font-bold tracking-[0.2em] text-lamp uppercase">Step {index + 1}</span>
              <step.icon className="mt-4 h-6 w-6 text-ink" strokeWidth={1.25} aria-hidden />
              <h3 className="display mt-4 text-2xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
