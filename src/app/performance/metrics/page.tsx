import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function PerformanceMetricsPage() {
  return (
    <>
      <PageHeader 
        title="Metrics"
        description="View and analyze performance metrics"
        textColor={PROSUITE_COLORS.performance.text}
        accentColor={PROSUITE_COLORS.performance.accent}
      />
      <PlaceholderPage 
        title="Performance Metrics"
        description="Track and analyze performance metrics across the organization"
        icon="chart"
        color={PROSUITE_COLORS.performance.text}
      />
    </>
  );
}
