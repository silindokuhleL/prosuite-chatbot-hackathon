import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AuditEngagementsPage() {
  return (
    <>
      <PageHeader 
        title="Audit Engagements"
        description="Manage active and planned audit engagements"
        textColor={PROSUITE_COLORS.audit.text}
        accentColor={PROSUITE_COLORS.audit.accent}
      />
      <PlaceholderPage 
        title="Audit Engagements"
        description="Track and manage audit engagements from planning to completion"
        icon="clipboard"
        color={PROSUITE_COLORS.audit.text}
      />
    </>
  );
}
