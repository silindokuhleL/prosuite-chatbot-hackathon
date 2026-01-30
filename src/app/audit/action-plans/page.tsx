import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AuditActionPlansPage() {
  return (
    <>
      <PageHeader 
        title="Corrective Actions"
        description="Manage corrective action plans for audit findings"
        textColor={PROSUITE_COLORS.audit.text}
        accentColor={PROSUITE_COLORS.audit.accent}
      />
      <PlaceholderPage 
        title="Corrective Action Plans"
        description="Track remediation actions for audit findings"
        icon="file-check"
        color={PROSUITE_COLORS.audit.text}
      />
    </>
  );
}
