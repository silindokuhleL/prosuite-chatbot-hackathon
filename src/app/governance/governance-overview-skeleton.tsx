export function GovernanceOverviewSkeleton() {
  return (
    <div className="animate-pulse blur-[1px] opacity-80 space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6 text-center">
            <div className="mx-auto h-10 w-16 rounded bg-muted" />
            <div className="mx-auto mt-2 h-4 w-20 rounded bg-muted" />
            <div className="mx-auto mt-1 h-3 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Policies Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <div className="h-5 w-32 rounded bg-muted" />
        </div>
        <div className="p-0">
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex gap-4">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="hidden md:block h-4 w-24 rounded bg-muted" />
              <div className="hidden lg:block h-4 w-24 rounded bg-muted" />
              <div className="hidden md:block h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-b border-border px-4 py-4 last:border-0">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-48 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                </div>
                <div className="hidden md:block w-24">
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
                <div className="hidden lg:block w-24">
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
                <div className="hidden md:block w-24">
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
                <div className="w-20">
                  <div className="h-6 w-16 rounded-full bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objectives Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <div className="h-5 w-44 rounded bg-muted" />
        </div>
        <div className="p-0">
          <div className="border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex gap-4">
              <div className="h-4 w-36 rounded bg-muted" />
              <div className="hidden md:block h-4 w-20 rounded bg-muted" />
              <div className="hidden lg:block h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-border px-4 py-4 last:border-0">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-56 rounded bg-muted" />
                  <div className="h-3 w-40 rounded bg-muted" />
                </div>
                <div className="hidden md:block w-20">
                  <div className="h-4 w-16 rounded bg-muted" />
                </div>
                <div className="hidden lg:block w-24">
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
                <div className="w-20">
                  <div className="h-6 w-16 rounded-full bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Committees Grid */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-4">
          <div className="h-5 w-32 rounded bg-muted" />
        </div>
        <div className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-40 rounded bg-muted" />
                    <div className="h-3 w-32 rounded bg-muted" />
                    <div className="h-3 w-28 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-16 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
