import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function PerformanceKPIsPage() {
  return (
    <>
      <PageHeader 
        title="KPIs"
        description="Define and track Key Performance Indicators"
        textColor={PROSUITE_COLORS.performance.text}
        accentColor={PROSUITE_COLORS.performance.accent}
      />
      <PlaceholderPage 
        title="Key Performance Indicators"
        description="Define, monitor, and analyze organizational KPIs"
        icon="activity"
        color={PROSUITE_COLORS.performance.text}
      />
    </>
  );
}
