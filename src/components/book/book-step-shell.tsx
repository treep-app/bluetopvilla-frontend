import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BookStepCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-stone/35 bg-white shadow-[0_24px_60px_-40px_rgba(22,20,16,0.2)] ${className}`}
    >
      {children}
    </div>
  );
}

export function BookStepHeader({
  title,
  subtitle,
  back,
}: {
  title: string;
  subtitle?: string;
  back?: { label: string; onClick: () => void };
}) {
  return (
    <div className="border-b border-stone/30 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
      {back ? (
        <button
          type="button"
          onClick={back.onClick}
          className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-stone/40 bg-sand/50 px-3 py-2 text-sm font-medium text-ink transition hover:border-lamp/40 hover:bg-sand sm:mb-4 sm:px-3.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sand">
            <ArrowLeft className="h-4 w-4" strokeWidth={2.25} aria-hidden />
          </span>
          {back.label}
        </button>
      ) : null}
      <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm leading-relaxed text-ink-soft">{subtitle}</p> : null}
    </div>
  );
}

export function BookStepBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 ${className}`}>{children}</div>;
}

export function BookTrustNote() {
  return (
    <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
      <span className="mt-0.5 text-lamp" aria-hidden>◆</span>
      Secure hold while you pay · Confirmation by email and SMS
    </p>
  );
}

export function BookContactLink() {
  return (
    <p className="text-center text-xs text-ink-soft">
      Need help?{" "}
      <Link href="/contact" className="font-medium text-ink underline-offset-2 hover:text-lamp hover:underline">
        Contact the villa
      </Link>
    </p>
  );
}
