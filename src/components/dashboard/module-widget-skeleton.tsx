export function ModuleWidgetSkeleton() {
  return (
    <div className="animate-pulse blur-[1px] opacity-80">
      <div className="rounded-lg border border-border bg-card p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="h-5 w-28 rounded bg-muted" />
          </div>
          <div className="h-4 w-4 rounded bg-muted" />
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="space-y-1">
            <div className="h-6 w-10 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
          <div className="space-y-1">
            <div className="h-6 w-8 rounded bg-muted" />
            <div className="h-3 w-14 rounded bg-muted" />
          </div>
        </div>
        
        {/* Items */}
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between rounded-lg bg-muted/50 p-2"
            >
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-5 w-14 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ModuleWidgetGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ModuleWidgetSkeleton key={i} />
      ))}
    </div>
  );
}
