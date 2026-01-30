import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function IncidentRegisterPage() {
  return (
    <>
      <PageHeader 
        title="Incident Register"
        description="View and manage all reported incidents"
        textColor={PROSUITE_COLORS.incident.text}
        accentColor={PROSUITE_COLORS.incident.accent}
      />
      <PlaceholderPage 
        title="Incident Register"
        description="Comprehensive view of all incidents in your organization"
        icon="list"
        color={PROSUITE_COLORS.incident.text}
      />
    </>
  );
}
