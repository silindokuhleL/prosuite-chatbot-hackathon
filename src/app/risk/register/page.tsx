import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function RiskRegisterPage() {
  return (
    <>
      <PageHeader 
        title="Risk Register"
        description="View and manage all organizational risks"
        textColor={PROSUITE_COLORS.risk.text}
        accentColor={PROSUITE_COLORS.risk.accent}
      />
      <PlaceholderPage 
        title="Risk Register"
        description="Comprehensive view of all risks in your organization"
        icon="list"
        color={PROSUITE_COLORS.risk.text}
      />
    </>
  );
}
