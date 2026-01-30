export function RiskHeatmapSkeleton() {
  return (
    <div className="animate-pulse blur-[1px] opacity-80">
      <div className="rounded-lg border border-border bg-card">
        {/* Card Header */}
        <div className="border-b border-border p-4">
          <div className="h-5 w-28 rounded bg-muted" />
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <div className="min-w-[400px]">
            {/* Impact Label */}
            <div className="mb-2 flex justify-center">
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
            
            <div className="flex">
              {/* Likelihood Label */}
              <div className="flex w-20 items-center justify-center">
                <div className="h-20 w-3 rounded bg-muted" />
              </div>
              
              {/* Heatmap Grid */}
              <div className="flex-1">
                {/* Column Headers */}
                <div className="mb-1 grid grid-cols-5 gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-3 w-full rounded bg-muted" />
                  ))}
                </div>

                {/* Grid Rows */}
                {Array.from({ length: 5 }).map((_, row) => (
                  <div key={row} className="flex items-center gap-1 mb-1">
                    <div className="w-20 pr-2">
                      <div className="ml-auto h-3 w-16 rounded bg-muted" />
                    </div>
                    <div className="grid flex-1 grid-cols-5 gap-1">
                      {Array.from({ length: 5 }).map((_, col) => (
                        <div 
                          key={col} 
                          className="h-10 rounded bg-muted"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
