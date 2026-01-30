import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function ComplianceTrainingPage() {
  return (
    <>
      <PageHeader 
        title="Training & Awareness"
        description="Manage compliance training programs"
        textColor={PROSUITE_COLORS.compliance.text}
        accentColor={PROSUITE_COLORS.compliance.accent}
      />
      <PlaceholderPage 
        title="Training & Awareness"
        description="Create and track compliance training campaigns"
        icon="users"
        color={PROSUITE_COLORS.compliance.text}
      />
    </>
  );
}
