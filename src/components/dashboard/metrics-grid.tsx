'use client';

import { MetricCard } from '@/components/ui/card';
import { Icon } from '@/components/ui/icons';
import type { DashboardMetrics } from '@/lib/data';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Risks"
        value={metrics.totalRisks}
        description={`${metrics.criticalRisks} critical, ${metrics.highRisks} high`}
        icon={<Icon name="risk" size={24} />}
        color="#dc2626"
      />
      <MetricCard
        title="Active Assets"
        value={metrics.activeAssets}
        description={`of ${metrics.totalAssets} total assets`}
        icon={<Icon name="asset" size={24} />}
        color="#3b82f6"
      />
      <MetricCard
        title="Open Incidents"
        value={metrics.openIncidents}
        description={`${metrics.criticalIncidents} critical`}
        icon={<Icon name="incident" size={24} />}
        color="#f97316"
      />
      <MetricCard
        title="Compliance Score"
        value={`${metrics.complianceScore}%`}
        description="Average across packages"
        icon={<Icon name="compliance" size={24} />}
        color="#10b981"
      />
    </div>
  );
}
