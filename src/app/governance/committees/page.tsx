import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function GovernanceCommitteesPage() {
  return (
    <>
      <PageHeader 
        title="Committee Management"
        description="Manage governance committees"
        textColor={PROSUITE_COLORS.governance.text}
        accentColor={PROSUITE_COLORS.governance.accent}
      />
      <PlaceholderPage 
        title="Committee Management"
        description="Organize and track governance committees and meetings"
        icon="users"
        color={PROSUITE_COLORS.governance.text}
      />
    </>
  );
}
