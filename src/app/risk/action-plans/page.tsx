import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function RiskActionPlansPage() {
  return (
    <>
      <PageHeader 
        title="Action Plans"
        description="Manage risk mitigation action plans"
        textColor={PROSUITE_COLORS.risk.text}
        accentColor={PROSUITE_COLORS.risk.accent}
      />
      <PlaceholderPage 
        title="Risk Action Plans"
        description="Track and manage action plans for risk mitigation"
        icon="clipboard"
        color={PROSUITE_COLORS.risk.text}
      />
    </>
  );
}
