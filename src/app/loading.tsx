import { MetricsGridSkeleton } from '@/components/dashboard/metrics-grid-skeleton';
import { RiskHeatmapSkeleton } from '@/components/dashboard/risk-heatmap-skeleton';
import { RecentActivitySkeleton } from '@/components/dashboard/recent-activity-skeleton';
import { ModuleWidgetGridSkeleton } from '@/components/dashboard/module-widget-skeleton';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar skeleton */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
            <div className="h-5 w-20 rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="p-4 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <div className="h-5 w-5 rounded bg-muted animate-pulse" />
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header skeleton */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <div className="h-5 w-24 rounded bg-muted animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 space-y-6">
          {/* Page header - always visible structure */}
          <div className="mb-6 flex items-center">
            <div className="w-[4px] h-[32px] mr-3 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-32 rounded bg-muted animate-pulse" />
              <div className="h-3 w-48 rounded bg-muted animate-pulse" />
            </div>
          </div>

          {/* Dashboard skeletons */}
          <MetricsGridSkeleton />
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RiskHeatmapSkeleton />
            </div>
            <div>
              <RecentActivitySkeleton />
            </div>
          </div>

          <div>
            <div className="mb-4 h-5 w-32 rounded bg-muted animate-pulse" />
            <ModuleWidgetGridSkeleton />
          </div>
        </main>
      </div>
    </div>
  );
}
