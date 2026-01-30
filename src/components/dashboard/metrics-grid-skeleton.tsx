export function MetricsGridSkeleton() {
  return (
    <div className="animate-pulse blur-[1px] opacity-80">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="h-12 w-12 rounded-lg bg-muted" />
              
              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="h-7 w-16 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
