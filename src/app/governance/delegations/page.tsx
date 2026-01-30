import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function GovernanceDelegationsPage() {
  return (
    <>
      <PageHeader 
        title="Delegations of Authority"
        description="Manage authority delegations"
        textColor={PROSUITE_COLORS.governance.text}
        accentColor={PROSUITE_COLORS.governance.accent}
      />
      <PlaceholderPage 
        title="Delegations of Authority"
        description="Track and manage delegated authorities and approval limits"
        icon="user-check"
        color={PROSUITE_COLORS.governance.text}
      />
    </>
  );
}
