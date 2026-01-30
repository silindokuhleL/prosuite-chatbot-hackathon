import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AuditUniversePage() {
  return (
    <>
      <PageHeader 
        title="Audit Universe"
        description="Define and manage auditable entities"
        textColor={PROSUITE_COLORS.audit.text}
        accentColor={PROSUITE_COLORS.audit.accent}
      />
      <PlaceholderPage 
        title="Audit Universe"
        description="Comprehensive view of all auditable entities and risk ratings"
        icon="network"
        color={PROSUITE_COLORS.audit.text}
      />
    </>
  );
}
