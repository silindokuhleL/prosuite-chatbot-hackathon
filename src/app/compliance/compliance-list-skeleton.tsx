export function ComplianceListSkeleton() {
  return (
    <div className="animate-pulse blur-[1px] opacity-80">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="rounded-lg border border-border bg-card"
          >
            {/* Card Header */}
            <div className="p-4 pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-40 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                </div>
                <div className="h-6 w-16 rounded-full bg-muted" />
              </div>
            </div>
            
            {/* Card Content */}
            <div className="space-y-4 px-4 pb-4">
              {/* Description */}
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </div>

              {/* Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 rounded bg-muted" />
                  <div className="h-4 w-10 rounded bg-muted" />
                </div>
                <div className="h-2 w-full rounded-full bg-muted" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <div className="mx-auto h-6 w-8 rounded bg-muted" />
                  <div className="mx-auto mt-1 h-3 w-16 rounded bg-muted" />
                </div>
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <div className="mx-auto h-6 w-8 rounded bg-muted" />
                  <div className="mx-auto mt-1 h-3 w-12 rounded bg-muted" />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-20 rounded-full bg-muted" />
                </div>
                <div className="h-4 w-4 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
