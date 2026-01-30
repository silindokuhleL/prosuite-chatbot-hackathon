import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AuditFollowUpPage() {
  return (
    <>
      <PageHeader 
        title="Finding Follow-Up"
        description="Track progress on audit finding remediation"
        textColor={PROSUITE_COLORS.audit.text}
        accentColor={PROSUITE_COLORS.audit.accent}
      />
      <PlaceholderPage 
        title="Finding Follow-Up"
        description="Monitor and verify closure of audit findings"
        icon="refresh"
        color={PROSUITE_COLORS.audit.text}
      />
    </>
  );
}
