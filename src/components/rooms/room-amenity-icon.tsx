import {
  Bath,
  BedDouble,
  Car,
  Coffee,
  Laptop,
  LucideIcon,
  Lock,
  Mountain,
  Refrigerator,
  ShowerHead,
  Snowflake,
  Tv,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";

/** Keys match AMENITY_ICONS in the backend (room-catalog.dto.ts). */
const map: Record<string, LucideIcon> = {
  wifi: Wifi,
  wind: Wind,
  snowflake: Snowflake,
  tv: Tv,
  bath: Bath,
  shower: ShowerHead,
  coffee: Coffee,
  bed: BedDouble,
  parking: Car,
  pool: Waves,
  safe: Lock,
  fridge: Refrigerator,
  desk: Laptop,
  view: Mountain,
  breakfast: UtensilsCrossed,
};

export function RoomAmenityIcon({ icon, className }: { icon: string | null; className?: string }) {
  const Icon = (icon && map[icon]) || Wifi;
  return <Icon className={className} strokeWidth={1.5} aria-hidden />;
}
