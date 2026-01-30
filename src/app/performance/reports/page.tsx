import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function PerformanceReportsPage() {
  return (
    <>
      <PageHeader 
        title="Performance Reports"
        description="Generate and view performance reports"
        textColor={PROSUITE_COLORS.performance.text}
        accentColor={PROSUITE_COLORS.performance.accent}
      />
      <PlaceholderPage 
        title="Performance Reports"
        description="Generate comprehensive performance reports and analytics"
        icon="file-chart"
        color={PROSUITE_COLORS.performance.text}
      />
    </>
  );
}
