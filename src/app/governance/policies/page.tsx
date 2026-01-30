import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function GovernancePoliciesPage() {
  return (
    <>
      <PageHeader 
        title="Policies"
        description="Manage organizational policies"
        textColor={PROSUITE_COLORS.governance.text}
        accentColor={PROSUITE_COLORS.governance.accent}
      />
      <PlaceholderPage 
        title="Policies"
        description="Create, review, and manage organizational policies"
        icon="file"
        color={PROSUITE_COLORS.governance.text}
      />
    </>
  );
}
