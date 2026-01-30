import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function PerformanceScorecardsPage() {
  return (
    <>
      <PageHeader 
        title="Scorecards"
        description="Manage balanced scorecards"
        textColor={PROSUITE_COLORS.performance.text}
        accentColor={PROSUITE_COLORS.performance.accent}
      />
      <PlaceholderPage 
        title="Performance Scorecards"
        description="Create and manage balanced scorecards for strategic alignment"
        icon="grid"
        color={PROSUITE_COLORS.performance.text}
      />
    </>
  );
}
