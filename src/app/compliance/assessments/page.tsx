import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function ComplianceAssessmentsPage() {
  return (
    <>
      <PageHeader 
        title="Compliance Assessments"
        description="Conduct and manage compliance assessments"
        textColor={PROSUITE_COLORS.compliance.text}
        accentColor={PROSUITE_COLORS.compliance.accent}
      />
      <PlaceholderPage 
        title="Compliance Assessments"
        description="Plan and execute compliance assessments against regulations"
        icon="file-check"
        color={PROSUITE_COLORS.compliance.text}
      />
    </>
  );
}
