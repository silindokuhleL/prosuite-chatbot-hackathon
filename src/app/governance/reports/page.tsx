import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function GovernanceReportsPage() {
  return (
    <>
      <PageHeader 
        title="Governance Reports"
        description="Generate and view governance reports"
        textColor={PROSUITE_COLORS.governance.text}
        accentColor={PROSUITE_COLORS.governance.accent}
      />
      <PlaceholderPage 
        title="Governance Reports"
        description="Generate comprehensive governance reports and analytics"
        icon="file-chart"
        color={PROSUITE_COLORS.governance.text}
      />
    </>
  );
}
