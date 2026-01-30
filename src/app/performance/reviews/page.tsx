import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function PerformanceReviewsPage() {
  return (
    <>
      <PageHeader 
        title="Performance Reviews"
        description="Conduct and manage performance reviews"
        textColor={PROSUITE_COLORS.performance.text}
        accentColor={PROSUITE_COLORS.performance.accent}
      />
      <PlaceholderPage 
        title="Performance Reviews"
        description="Plan and execute periodic performance reviews"
        icon="file-check"
        color={PROSUITE_COLORS.performance.text}
      />
    </>
  );
}
