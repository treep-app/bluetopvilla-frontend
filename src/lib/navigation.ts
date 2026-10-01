export type NavLink = {
  href: string;
  label: string;
  /** Match nested routes e.g. /rooms/suite */
  match?: "exact" | "prefix";
};

/** Primary desktop nav — guest journey order (hotel standard). */
export const primaryNav: NavLink[] = [
  { href: "/rooms", label: "Rooms", match: "prefix" },
  { href: "/stay", label: "Stay", match: "exact" },
  { href: "/wellness", label: "Wellness", match: "exact" },
  { href: "/events", label: "Events", match: "prefix" },
  { href: "/gallery", label: "Gallery", match: "exact" },
  { href: "/about", label: "About", match: "exact" },
  { href: "/contact", label: "Contact", match: "exact" },
];

export type MobileNavGroup = {
  title: string;
  links: NavLink[];
};

/** Mobile drawer — grouped like a hotel site map. */
export const mobileNavGroups: MobileNavGroup[] = [
  {
    title: "Stay",
    links: [
      { href: "/stay", label: "Plan your stay", match: "exact" },
      { href: "/rooms", label: "Rooms & suites", match: "prefix" },
      { href: "/book", label: "Book online", match: "prefix" },
    ],
  },
  {
    title: "Experience",
    links: [
      { href: "/wellness", label: "Wellness", match: "exact" },
      { href: "/stay#dining", label: "Dining", match: "exact" },
      { href: "/events", label: "Meetings & events", match: "prefix" },
      { href: "/whats-on", label: "What's on", match: "prefix" },
      { href: "/venue", label: "Venue enquiry", match: "exact" },
    ],
  },
  {
    title: "The villa",
    links: [
      { href: "/gallery", label: "Gallery", match: "exact" },
      { href: "/about", label: "About us", match: "exact" },
      { href: "/contact", label: "Contact us", match: "exact" },
    ],
  },
];

export function isNavActive(pathname: string, link: NavLink) {
  if (link.href.includes("#")) {
    const [path] = link.href.split("#");
    return pathname === path;
  }
  if (link.match === "prefix") {
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  }
  return pathname === link.href;
}
