import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AuditReportsPage() {
  return (
    <>
      <PageHeader 
        title="Audit Reports"
        description="Generate and view audit reports"
        textColor={PROSUITE_COLORS.audit.text}
        accentColor={PROSUITE_COLORS.audit.accent}
      />
      <PlaceholderPage 
        title="Audit Reports"
        description="Generate comprehensive audit reports and analytics"
        icon="file-chart"
        color={PROSUITE_COLORS.audit.text}
      />
    </>
  );
}
