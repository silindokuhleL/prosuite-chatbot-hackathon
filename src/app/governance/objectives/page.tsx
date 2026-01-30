import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function GovernanceObjectivesPage() {
  return (
    <>
      <PageHeader 
        title="Objectives & Strategy"
        description="Define and track strategic objectives"
        textColor={PROSUITE_COLORS.governance.text}
        accentColor={PROSUITE_COLORS.governance.accent}
      />
      <PlaceholderPage 
        title="Objectives & Strategy"
        description="Manage business objectives and strategic goals"
        icon="chart"
        color={PROSUITE_COLORS.governance.text}
      />
    </>
  );
}
