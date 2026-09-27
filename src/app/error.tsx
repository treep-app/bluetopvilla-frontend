"use client";

import Link from "next/link";
import { useEffect } from "react";

/** Shown when a page's backend data can't be loaded, instead of rendering an empty page. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-sand px-5 pt-32 pb-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow text-ink-soft">Something went wrong</p>
        <h1 className="display mt-3 text-4xl text-ink md:text-5xl">We couldn&apos;t load this page</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">
          The villa&apos;s booking system didn&apos;t respond. Please try again in a moment.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-gold">
            Try again
          </button>
          <Link href="/" className="btn btn-ghost border-ink/20 text-ink">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
