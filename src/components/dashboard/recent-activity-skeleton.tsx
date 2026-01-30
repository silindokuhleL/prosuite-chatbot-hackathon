export function RecentActivitySkeleton() {
  return (
    <div className="animate-pulse blur-[1px] opacity-80">
      <div className="rounded-lg border border-border bg-card">
        {/* Card Header */}
        <div className="border-b border-border p-4">
          <div className="h-5 w-32 rounded bg-muted" />
        </div>
        
        {/* Card Content */}
        <div className="space-y-4 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
            >
              {/* Icon */}
              <div className="mt-0.5 h-8 w-8 rounded-lg bg-muted" />
              
              {/* Content */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 rounded-full bg-muted" />
                  <div className="h-3 w-20 rounded bg-muted" />
                </div>
              </div>
              
              {/* Timestamp */}
              <div className="h-3 w-10 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
