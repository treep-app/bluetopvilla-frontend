import type {
  ApiResponse,
  AvailabilitySearchResult,
  BookingDto,
  DiningItemDto,
  EventDto,
  EventSpaceDto,
  ExperienceDto,
  GalleryImageDto,
  PaymentInitResult,
  PaymentOptions,
  PropertySettings,
  RoomTypeDetail,
  RoomTypeSummary,
} from "@/lib/types";
import { getPublicApiBase } from "@/lib/api-base";

const API = getPublicApiBase();

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  let json: ApiResponse<T>;
  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiRequestError(
      response.status >= 500
        ? "The booking service is temporarily unavailable. Please try again in a moment."
        : "Unexpected response from the server.",
      "NETWORK_ERROR",
      response.status,
    );
  }
  if (!json.success) {
    throw new ApiRequestError(json.error.message, json.error.code, response.status);
  }
  return json.data;
}

export const api = {
  property: () => request<PropertySettings>("/property"),
  rooms: () => request<RoomTypeSummary[]>("/rooms"),
  room: (slug: string) => request<RoomTypeDetail>(`/rooms/${slug}`),
  gallery: (category?: string) =>
    request<GalleryImageDto[]>(`/gallery${category ? `?category=${category}` : ""}`),
  events: () => request<EventDto[]>("/events"),
  event: (slug: string) => request<EventDto>(`/events/${encodeURIComponent(slug)}`),
  eventSpaces: () => request<EventSpaceDto[]>("/event-spaces"),
  reserveEvent: (body: Record<string, unknown>) =>
    request<{ reference: string; status: string }>("/event-reservations", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  experiences: () => request<ExperienceDto[]>("/experiences"),
  dining: () => request<DiningItemDto[]>("/dining"),
  search: (body: Record<string, unknown>) =>
    request<AvailabilitySearchResult>("/availability/search", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  createBooking: (body: Record<string, unknown>) =>
    request<BookingDto>("/bookings", { method: "POST", body: JSON.stringify(body) }),
  booking: (reference: string, email: string) =>
    request<BookingDto>(`/bookings/${reference}?email=${encodeURIComponent(email)}`),
  paymentOptions: () => request<PaymentOptions>("/payments/options"),
  /** Asks the API to re-check pending Hubtel payments (covers callbacks that never arrived). */
  refreshHubtel: (bookingReference: string) =>
    request<{ status: string }>("/payments/hubtel/refresh", {
      method: "POST",
      body: JSON.stringify({ bookingReference }),
    }),
  payHubtel: (body: Record<string, unknown>) =>
    request<PaymentInitResult>("/payments/hubtel/initiate", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  payCash: (body: Record<string, unknown>) =>
    request<PaymentInitResult>("/payments/cash", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  payStripe: (body: Record<string, unknown>) =>
    request<PaymentInitResult>("/payments/stripe/create", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  contact: (body: Record<string, unknown>) =>
    request<{ id: string }>("/contact", { method: "POST", body: JSON.stringify(body) }),
  newsletterSubscribe: (body: { email: string; company?: string }) =>
    request<{ subscribed: boolean }>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  venue: (body: Record<string, unknown>) =>
    request<{ reference: string; status: string }>("/venue-enquiries", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verifyGoldenTicket: (token: string) =>
    request<{
      status: string;
      offerTitle: string;
      offerSubtitle: string | null;
      offerTerms: string | null;
      guestName: string | null;
      expiresAt: string;
      promoCode: string | null;
      revealed: boolean;
      redeemed: boolean;
    }>(`/golden-tickets/verify?token=${encodeURIComponent(token)}`),
  revealGoldenTicket: (token: string) =>
    request<{
      status: string;
      promoCode: string;
      offerTitle: string;
      offerSubtitle?: string | null;
      expiresAt?: string;
      alreadyRedeemed: boolean;
    }>("/golden-tickets/reveal", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  redeemGoldenTicket: (token: string) =>
    request<{
      status: string;
      promoCode: string;
      offerTitle?: string;
      alreadyRedeemed: boolean;
    }>("/golden-tickets/redeem", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  validatePromoCode: (code: string) =>
    request<{
      ticketId: string;
      promoCode: string;
      offerTitle: string;
      offerSubtitle: string | null;
      discountPercent: number;
      expiresAt: string;
      guestName: string | null;
    }>(`/golden-tickets/promo?code=${encodeURIComponent(code)}`),
};
