import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function ComplianceControlsPage() {
  return (
    <>
      <PageHeader 
        title="Controls Management"
        description="Manage compliance controls"
        textColor={PROSUITE_COLORS.compliance.text}
        accentColor={PROSUITE_COLORS.compliance.accent}
      />
      <PlaceholderPage 
        title="Compliance Controls"
        description="Define and manage controls to meet compliance requirements"
        icon="list"
        color={PROSUITE_COLORS.compliance.text}
      />
    </>
  );
}
