"use client";

import { formatStayRange } from "@/lib/booking-utils";
import type { BookStepId } from "@/lib/booking-utils";
import type { AvailabilityRoom } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";
import { ArrowRight, CalendarDays } from "lucide-react";

type Promo = {
  total: number;
} | null;

type Props = {
  step: BookStepId;
  checkIn: string;
  checkOut: string;
  room: AvailabilityRoom | null | undefined;
  promo: Promo;
  selectedSlug: string;
  continueDisabled?: boolean;
  searchFormId?: string;
  guestFormId?: string;
  summaryDisabled?: boolean;
  summaryPending?: boolean;
  summaryLabel?: string;
  onRoomsContinue?: () => void;
  onSummaryConfirm?: () => void;
  onPayHubtel?: () => void;
  payHubtelPending?: boolean;
  payHubtelLabel?: string;
  showPayCta?: boolean;
};

export function BookingMobileActionBar({
  step,
  checkIn,
  checkOut,
  room,
  promo,
  selectedSlug,
  continueDisabled,
  searchFormId = "book-search-form",
  guestFormId = "book-guest-form",
  summaryDisabled,
  summaryPending,
  summaryLabel = "Confirm and hold room",
  onRoomsContinue,
  onSummaryConfirm,
  onPayHubtel,
  payHubtelPending,
  payHubtelLabel = "Pay securely",
  showPayCta,
}: Props) {
  if (step === "search") {
    return (
      <MobileBarShell>
        <BarMeta
          icon={<CalendarDays className="h-4 w-4 text-lamp" aria-hidden />}
          title={checkIn && checkOut ? formatStayRange(checkIn, checkOut) : "Pick your dates"}
          subtitle="Live rates after you continue"
        />
        <BarButton type="submit" form={searchFormId}>
          Show rooms
        </BarButton>
      </MobileBarShell>
    );
  }

  if (step === "rooms") {
    const selected = room?.slug === selectedSlug ? room : null;
    const total = selected ? (promo?.total ?? Number(selected.total)) : null;
    return (
      <MobileBarShell>
        <BarMeta
          title={selected ? selected.name : "Select a room"}
          subtitle={total != null && selected ? formatMoney(total, selected.currency) : "Tap a room to compare rates"}
        />
        <BarButton type="button" disabled={!selected || continueDisabled} onClick={onRoomsContinue}>
          Continue
        </BarButton>
      </MobileBarShell>
    );
  }

  if (step === "guest") {
    const total = room ? (promo?.total ?? Number(room.total)) : null;
    return (
      <MobileBarShell>
        <BarMeta
          title={room?.name ?? "Your stay"}
          subtitle={total != null && room ? formatMoney(total, room.currency) : formatStayRange(checkIn, checkOut)}
        />
        <BarButton type="submit" form={guestFormId}>
          Review
        </BarButton>
      </MobileBarShell>
    );
  }

  if (step === "summary") {
    const total = room ? (promo?.total ?? Number(room.total)) : null;
    return (
      <MobileBarShell>
        <BarMeta
          title="Ready to hold"
          subtitle={total != null && room ? formatMoney(total, room.currency) : "Review details above"}
        />
        <BarButton
          type="button"
          disabled={summaryDisabled || summaryPending}
          onClick={onSummaryConfirm}
          loading={summaryPending}
        >
          {summaryPending ? "Holding…" : summaryLabel}
        </BarButton>
      </MobileBarShell>
    );
  }

  if (step === "pay" && showPayCta && onPayHubtel) {
    const total = room ? (promo?.total ?? Number(room.total)) : null;
    return (
      <MobileBarShell>
        <BarMeta
          title="Complete payment"
          subtitle={total != null && room ? formatMoney(total, room.currency) : "Secure checkout"}
        />
        <BarButton type="button" disabled={payHubtelPending} loading={payHubtelPending} onClick={onPayHubtel}>
          {payHubtelPending ? "Opening…" : payHubtelLabel}
        </BarButton>
      </MobileBarShell>
    );
  }

  return null;
}

function MobileBarShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone/40 bg-sand/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-12px_40px_-16px_rgba(22,20,16,0.2)] backdrop-blur-xl lg:hidden"
      role="region"
      aria-label="Booking actions"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3">{children}</div>
    </div>
  );
}

function BarMeta({
  icon,
  title,
  subtitle,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
        {icon}
        <span className="truncate">{title}</span>
      </p>
      <p className="truncate text-xs text-ink-soft">{subtitle}</p>
    </div>
  );
}

function BarButton({
  children,
  type,
  form,
  disabled,
  loading,
  onClick,
}: {
  children: React.ReactNode;
  type: "submit" | "button";
  form?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      form={form}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "btn btn-gold inline-flex min-h-11 shrink-0 gap-1.5 px-5 !text-[0.68rem] disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      {children}
      {!loading ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
    </button>
  );
}
