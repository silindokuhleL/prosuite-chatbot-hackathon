import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AuditWorkpapersPage() {
  return (
    <>
      <PageHeader 
        title="Workpapers"
        description="Manage audit workpapers and documentation"
        textColor={PROSUITE_COLORS.audit.text}
        accentColor={PROSUITE_COLORS.audit.accent}
      />
      <PlaceholderPage 
        title="Audit Workpapers"
        description="Create and manage audit working papers and evidence"
        icon="file"
        color={PROSUITE_COLORS.audit.text}
      />
    </>
  );
}
