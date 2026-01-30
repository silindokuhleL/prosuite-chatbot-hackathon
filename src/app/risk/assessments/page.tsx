import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function RiskAssessmentsPage() {
  return (
    <>
      <PageHeader 
        title="Risk Assessments"
        description="Conduct and review risk assessments"
        textColor={PROSUITE_COLORS.risk.text}
        accentColor={PROSUITE_COLORS.risk.accent}
      />
      <PlaceholderPage 
        title="Risk Assessments"
        description="Conduct periodic assessments to evaluate risk levels"
        icon="file-check"
        color={PROSUITE_COLORS.risk.text}
      />
    </>
  );
}
