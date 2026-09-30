import { BookingFlowHeader } from "@/components/book/booking-flow-header";
import type { PropertySettings } from "@/lib/types";

export function BookingLoading({ property }: { property?: PropertySettings | null }) {
  const name = property?.name ?? "Blue Top Villa";

  return (
    <div className="animate-pulse bg-sand">
      <BookingFlowHeader property={{ ...defaultProperty, name }} step="search" />
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-8 md:px-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-2xl border border-stone/30 bg-white p-8">
            <div className="h-8 w-2/3 rounded bg-stone/30" />
            <div className="mt-6 flex gap-3">
              <div className="h-16 flex-1 rounded-lg bg-stone/25" />
              <div className="h-16 flex-1 rounded-lg bg-stone/25" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-lg bg-stone/20" />
              ))}
            </div>
            <div className="mt-8 h-11 w-48 rounded bg-lamp/30" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-stone/30 bg-white p-6">
            <div className="h-4 w-24 rounded bg-stone/30" />
            <div className="mt-4 h-32 rounded-lg bg-stone/20" />
          </div>
        </div>
      </div>
      <p className="sr-only">Loading booking…</p>
    </div>
  );
}

const defaultProperty: PropertySettings = {
  name: "Blue Top Villa",
  address: null,
  phone: null,
  phoneAlt: null,
  email: null,
  checkInTime: "12:00",
  checkOutTime: "12:00",
  currency: "GHS",
  timezone: "Africa/Accra",
  latitude: null,
  longitude: null,
  whatsapp: null,
  instagram: null,
  tiktok: null,
};
