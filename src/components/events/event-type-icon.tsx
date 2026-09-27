import { Briefcase, Building2, Cake, Heart, type LucideIcon, Music, Sparkles, Wine } from "lucide-react";

/** Keys match EVENT_TYPE_ICONS in the backend (events-content.dto.ts). */
const map: Record<string, LucideIcon> = {
  heart: Heart,
  cake: Cake,
  building: Building2,
  music: Music,
  glass: Wine,
  briefcase: Briefcase,
  sparkles: Sparkles,
};

export function EventTypeIcon({ icon, className }: { icon: string | null; className?: string }) {
  const Icon = (icon && map[icon]) || Sparkles;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
