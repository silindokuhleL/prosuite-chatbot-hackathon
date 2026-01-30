import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function IncidentReportsPage() {
  return (
    <>
      <PageHeader 
        title="Incident Reports"
        description="Generate and view incident management reports"
        textColor={PROSUITE_COLORS.incident.text}
        accentColor={PROSUITE_COLORS.incident.accent}
      />
      <PlaceholderPage 
        title="Incident Reports"
        description="Generate comprehensive incident reports and analytics"
        icon="file-chart"
        color={PROSUITE_COLORS.incident.text}
      />
    </>
  );
}
