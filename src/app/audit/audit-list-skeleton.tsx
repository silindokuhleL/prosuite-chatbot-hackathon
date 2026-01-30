export function AuditListSkeleton() {
  return (
    <div className="animate-pulse blur-[1px] opacity-80">
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Table header */}
        <div className="border-b border-border bg-muted/50 px-4 py-3">
          <div className="flex gap-4">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-44 rounded bg-muted" />
            <div className="hidden md:block h-4 w-28 rounded bg-muted" />
            <div className="hidden lg:block h-4 w-24 rounded bg-muted" />
            <div className="hidden lg:block h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
        </div>
        
        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div 
            key={i} 
            className="border-b border-border px-4 py-4 last:border-0"
          >
            <div className="flex items-center gap-4">
              {/* Audit ID */}
              <div className="w-20">
                <div className="h-4 w-16 rounded bg-muted" />
              </div>
              
              {/* Title */}
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
              </div>
              
              {/* Lead Auditor */}
              <div className="hidden md:block w-28">
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
              
              {/* Start Date */}
              <div className="hidden lg:block w-24">
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
              
              {/* End Date */}
              <div className="hidden lg:block w-24">
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
              
              {/* Status */}
              <div className="w-20">
                <div className="h-6 w-16 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
