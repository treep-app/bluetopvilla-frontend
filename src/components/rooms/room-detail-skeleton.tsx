export function RoomDetailSkeleton() {
  return (
    <div className="animate-pulse bg-sand pb-20">
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8 md:pt-8">
        <div className="mb-4 h-3 w-48 rounded bg-stone/40" />
        <div className="overflow-hidden rounded-2xl border border-stone/30 bg-ink p-2">
          <div className="h-[220px] rounded-xl bg-stone/40 sm:h-[260px] md:h-[300px]" />
          <div className="mt-2.5 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 w-20 shrink-0 rounded-lg bg-stone/35 sm:h-16 sm:w-24" />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-[1400px] gap-6 px-5 md:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-stone/30 bg-white p-6 md:p-8">
            <div className="h-8 w-2/3 rounded bg-stone/30" />
            <div className="mt-4 flex gap-4">
              <div className="h-4 w-24 rounded bg-stone/25" />
              <div className="h-4 w-28 rounded bg-stone/25" />
            </div>
          </div>
          <div className="rounded-2xl border border-stone/30 bg-white p-6 md:p-8">
            <div className="h-4 w-32 rounded bg-stone/30" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-stone/20" />
              <div className="h-3 w-full rounded bg-stone/20" />
              <div className="h-3 w-[85%] rounded bg-stone/20" />
            </div>
          </div>
          <div className="rounded-2xl border border-stone/30 bg-white p-6">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-24 rounded-full bg-stone/25" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-stone/30 bg-white p-6 md:p-7">
            <div className="h-4 w-28 rounded bg-lamp/30" />
            <div className="mt-3 h-10 w-40 rounded bg-stone/30" />
            <div className="mt-6 space-y-3">
              <div className="h-14 rounded border border-stone/25 bg-sand/50" />
              <div className="h-14 rounded border border-stone/25 bg-sand/50" />
              <div className="h-12 rounded bg-stone/30" />
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only">Loading room details…</p>
    </div>
  );
}
