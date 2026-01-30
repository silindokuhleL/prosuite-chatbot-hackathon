import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function GovernanceStructurePage() {
  return (
    <>
      <PageHeader 
        title="Organisational Structure"
        description="View and manage organizational hierarchy"
        textColor={PROSUITE_COLORS.governance.text}
        accentColor={PROSUITE_COLORS.governance.accent}
      />
      <PlaceholderPage 
        title="Organisational Structure"
        description="Define and manage your organization's governance structure"
        icon="building"
        color={PROSUITE_COLORS.governance.text}
      />
    </>
  );
}
