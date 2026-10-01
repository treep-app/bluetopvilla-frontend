import { BookingStepper } from "@/components/book/booking-stepper";
import type { BookStepId } from "@/lib/booking-utils";
import type { PropertySettings } from "@/lib/types";
import Image from "next/image";

export function BookingFlowHeader({
  property,
  step,
}: {
  property: PropertySettings;
  step: BookStepId;
}) {
  return (
    <header className="relative shrink-0 overflow-hidden border-b border-white/10 bg-ink text-sand">
      <div className="absolute inset-0">
        <Image src="/images/hero-hotel.jpg" alt="" fill className="object-cover opacity-30" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/92 to-ink/75" />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-4 pb-4 pt-below-header sm:px-5 sm:pb-5 md:px-8 md:pb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-5">
          <div className="min-w-0">
            <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-lamp-soft uppercase sm:text-[0.65rem] sm:tracking-[0.2em]">
              Reservations
            </p>
            <h1 className="display mt-0.5 text-2xl text-sand sm:mt-1 sm:text-3xl md:text-4xl">Book your stay</h1>
            <p className="mt-1.5 hidden max-w-md text-sm text-sand/75 sm:block">{property.name} · Kasoa</p>
          </div>
          <div className="w-full min-w-0 lg:max-w-xl">
            <BookingStepper current={step} variant="dark" />
          </div>
        </div>
      </div>
    </header>
  );
}
