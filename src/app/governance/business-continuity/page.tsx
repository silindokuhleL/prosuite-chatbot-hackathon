import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function GovernanceBCPPage() {
  return (
    <>
      <PageHeader 
        title="Business Continuity"
        description="Manage business continuity plans"
        textColor={PROSUITE_COLORS.governance.text}
        accentColor={PROSUITE_COLORS.governance.accent}
      />
      <PlaceholderPage 
        title="Business Continuity"
        description="Create and maintain business continuity and disaster recovery plans"
        icon="shield"
        color={PROSUITE_COLORS.governance.text}
      />
    </>
  );
}
