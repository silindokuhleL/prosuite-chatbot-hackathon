import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AuditFindingsPage() {
  return (
    <>
      <PageHeader 
        title="Audit Findings"
        description="Track and manage audit findings"
        textColor={PROSUITE_COLORS.audit.text}
        accentColor={PROSUITE_COLORS.audit.accent}
      />
      <PlaceholderPage 
        title="Audit Findings"
        description="Document and track findings from audit engagements"
        icon="alert"
        color={PROSUITE_COLORS.audit.text}
      />
    </>
  );
}
