import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function RiskControlsPage() {
  return (
    <>
      <PageHeader 
        title="Risk Controls"
        description="Manage controls to mitigate organizational risks"
        textColor={PROSUITE_COLORS.risk.text}
        accentColor={PROSUITE_COLORS.risk.accent}
      />
      <PlaceholderPage 
        title="Risk Controls"
        description="View and manage all risk controls and their effectiveness"
        icon="shield"
        color={PROSUITE_COLORS.risk.text}
      />
    </>
  );
}
