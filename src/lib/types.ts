export const BOOKING_STATUSES = [
  "PENDING_PAYMENT",
  "PAYMENT_PROCESSING",
  "CONFIRMED",
  "CANCELLED",
  "EXPIRED",
  "COMPLETED",
  "NO_SHOW",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_PROVIDERS = ["STRIPE", "HUBTEL", "MANUAL"] as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

export const ENQUIRY_STATUSES = [
  "PENDING",
  "CONTACTED",
  "CONFIRMED",
  "DECLINED",
  "CANCELLED",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "STAFF",
  "CONTENT_EDITOR",
  "REPORTS_VIEWER",
] as const;

export type Role = (typeof ROLES)[number];

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type AmenityDto = {
  id: string;
  name: string;
  icon: string | null;
};

export type RoomImageDto = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

export type RoomTypeSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sizeSqm: number | null;
  bedConfig: string | null;
  occupancy: number;
  basePrice: string;
  currency: string;
  featuredImage: string | null;
  amenities: AmenityDto[];
};

export type RoomTypeDetail = RoomTypeSummary & {
  images: RoomImageDto[];
  units: number;
};

export type AvailabilityRoom = RoomTypeSummary & {
  nights: number;
  nightly: string;
  subtotal: string;
  taxes: string;
  fees: string;
  discount: string;
  total: string;
  availableUnits: number;
};

export type AvailabilitySearchResult = {
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  rooms: number;
  currency: string;
  results: AvailabilityRoom[];
};

export type BookingGuestInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  specialRequests?: string;
};

export type BookingDto = {
  id: string;
  reference: string;
  status: BookingStatus;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  currency: string;
  subtotal: string;
  taxes: string;
  fees: string;
  discount: string;
  total: string;
  holdExpiresAt: string | null;
  specialRequests: string | null;
  promoCode?: string | null;
  promoOffer?: string | null;
  discountPercent?: number | null;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string | null;
  };
  rooms: Array<{
    roomTypeName: string;
    roomTypeSlug: string;
    nightly: string;
    nights: number;
    lineTotal: string;
  }>;
  payment: {
    status: PaymentStatus;
    provider: PaymentProvider | null;
  } | null;
};

export type PaymentInitResult = {
  provider: PaymentProvider;
  clientReference: string;
  checkoutId?: string | null;
  /** Preferred: Hubtel /direct URL for in-page embed. */
  embedUrl?: string;
  /** Full Hubtel checkout page (fallback if embed is blocked). */
  redirectUrl?: string;
  message: string;
};

export type GalleryImageDto = {
  id: string;
  url: string;
  category: string;
  label: string | null;
  alt: string | null;
};

export type EventDto = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  eventType: string;
  eventAt: string | null;
  /** Weekly events: 0 = Sunday … 6 = Saturday. */
  recurrenceDays: number[];
  recurrenceTime: string | null;
  location: string | null;
  imageUrl: string | null;
  priceFrom: string | null;
  priceNote: string | null;
};

export type EventSpaceDto = {
  id: string;
  title: string;
  detail: string | null;
  tag: string | null;
  imageUrl: string | null;
  href: string | null;
};

export type PropertySettings = {
  name: string;
  timezone: string;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
  phone: string | null;
  phoneAlt: string | null;
  email: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  whatsapp: string | null;
  instagram: string | null;
  tiktok: string | null;
};

export type ExperienceDto = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  highlights: string[];
  icon: string | null;
  imageUrl: string | null;
};

export type DiningItemDto = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
};

export type PaymentOptions = {
  hubtel: {
    enabled: boolean;
    /** checkout = redirect to Hubtel Online Checkout; direct = prompt sent to the guest's phone. */
    mode: "checkout" | "direct";
    /** Channels advertised on Hubtel Online Checkout (mobile_money | card | wallet). */
    methods: Array<"mobile_money" | "card" | "wallet">;
    channels: string[];
  };
  cash: { enabled: boolean; label: string };
  stripe: { enabled: boolean };
  holdMinutes: number;
};
