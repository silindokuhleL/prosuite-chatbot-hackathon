import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function ComplianceMonitoringPage() {
  return (
    <>
      <PageHeader 
        title="Compliance Monitoring"
        description="Monitor ongoing compliance status"
        textColor={PROSUITE_COLORS.compliance.text}
        accentColor={PROSUITE_COLORS.compliance.accent}
      />
      <PlaceholderPage 
        title="Compliance Monitoring"
        description="Track compliance status and identify gaps in real-time"
        icon="activity"
        color={PROSUITE_COLORS.compliance.text}
      />
    </>
  );
}
