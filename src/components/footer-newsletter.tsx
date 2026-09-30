"use client";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function FooterNewsletter({ className, compact }: { className?: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const subscribe = useMutation({
    mutationFn: () => api.newsletterSubscribe({ email: email.trim(), company: trap }),
    onSuccess: () => {
      setDone(true);
      setError(null);
      setEmail("");
    },
    onError: (err: Error) => {
      setError(err.message || "Something went wrong. Try again in a moment.");
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const value = email.trim();
    if (!value) {
      setError("Enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("That email doesn't look right.");
      return;
    }
    if (trap) {
      setDone(true);
      return;
    }
    subscribe.mutate();
  };

  if (done) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-lamp/35 bg-white/[0.04] px-5 py-4 backdrop-blur-sm",
          className,
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lamp/20 text-lamp">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-medium text-sand">You&apos;re on the list</p>
          <p className="mt-0.5 text-xs text-sand/55">Watch your inbox for villa news and offers.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative space-y-2", className)} noValidate>
      <label htmlFor="footer-newsletter-email" className="sr-only">Email for newsletter</label>
      <div className="flex min-w-0 items-stretch gap-2">
        <input
          id="footer-newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={subscribe.isPending}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-3 text-[0.9rem] text-sand outline-none transition placeholder:text-sand/35 focus:border-lamp/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-lamp/20 disabled:opacity-60 sm:px-4 sm:text-[0.95rem]"
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-lamp px-4 text-[0.65rem] font-semibold tracking-[0.12em] text-ink uppercase transition hover:bg-lamp-soft disabled:opacity-60 sm:gap-2 sm:px-5 sm:text-[0.68rem] sm:tracking-[0.14em]"
        >
          {subscribe.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </div>
      <input
        type="text"
        name="company"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      {error ? <p className="text-xs text-red-300/90">{error}</p> : null}
      {!compact ? (
        <p className="text-[0.65rem] leading-relaxed text-sand/45">
          By subscribing you agree to receive updates from Blue Top Villa. See our{" "}
          <Link href="/privacy-policy" className="text-sand/60 underline-offset-2 hover:text-lamp hover:underline">
            privacy policy
          </Link>
          .
        </p>
      ) : (
        <p className="text-[0.65rem] leading-relaxed text-sand/45">
          Offers &amp; news —{" "}
          <Link href="/privacy-policy" className="text-sand/60 underline-offset-2 hover:text-lamp hover:underline">
            Privacy
          </Link>
        </p>
      )}
    </form>
  );
}
