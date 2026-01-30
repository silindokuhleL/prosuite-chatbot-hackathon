import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function RiskReportsPage() {
  return (
    <>
      <PageHeader 
        title="Risk Reports"
        description="Generate and view risk management reports"
        textColor={PROSUITE_COLORS.risk.text}
        accentColor={PROSUITE_COLORS.risk.accent}
      />
      <PlaceholderPage 
        title="Risk Reports"
        description="Generate comprehensive risk reports and analytics"
        icon="file-chart"
        color={PROSUITE_COLORS.risk.text}
      />
    </>
  );
}
