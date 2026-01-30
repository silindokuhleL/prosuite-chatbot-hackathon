import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function ComplianceReportsPage() {
  return (
    <>
      <PageHeader 
        title="Compliance Reports"
        description="Generate and view compliance reports"
        textColor={PROSUITE_COLORS.compliance.text}
        accentColor={PROSUITE_COLORS.compliance.accent}
      />
      <PlaceholderPage 
        title="Compliance Reports"
        description="Generate comprehensive compliance reports and analytics"
        icon="file-chart"
        color={PROSUITE_COLORS.compliance.text}
      />
    </>
  );
}
