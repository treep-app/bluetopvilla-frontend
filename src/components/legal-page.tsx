import type { PropertySettings } from "@/lib/types";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-sand px-5 pt-32 pb-20">
      <article className="mx-auto max-w-3xl">
        <h1 className="display text-5xl">{title}</h1>
        <div className="prose-legal mt-8 space-y-6 text-ink-soft leading-8">{children}</div>
      </article>
    </div>
  );
}

/** "055 917 1787 · info@…" from the property settings. */
export function legalContactLine(property: PropertySettings) {
  return [property.phone, property.email].filter(Boolean).join(" · ");
}
