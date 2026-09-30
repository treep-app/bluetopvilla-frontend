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
      <div className="relative mx-auto max-w-[1400px] px-5 pt-24 pb-6 md:px-8 md:pt-28 md:pb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-lamp-soft uppercase">Reservations</p>
            <h1 className="display mt-1 text-3xl text-sand md:text-4xl">Book your stay</h1>
            <p className="mt-2 max-w-md text-sm text-sand/75">{property.name} · Kasoa</p>
          </div>
          <div className="w-full lg:max-w-xl">
            <BookingStepper current={step} variant="dark" />
          </div>
        </div>
      </div>
    </header>
  );
}
