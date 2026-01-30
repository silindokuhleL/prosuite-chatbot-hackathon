import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function AuditAnnualPlansPage() {
  return (
    <>
      <PageHeader 
        title="Annual Audit Plans"
        description="Plan and schedule audits for the year"
        textColor={PROSUITE_COLORS.audit.text}
        accentColor={PROSUITE_COLORS.audit.accent}
      />
      <PlaceholderPage 
        title="Annual Audit Plans"
        description="Create and manage annual audit planning and scheduling"
        icon="calendar"
        color={PROSUITE_COLORS.audit.text}
      />
    </>
  );
}
