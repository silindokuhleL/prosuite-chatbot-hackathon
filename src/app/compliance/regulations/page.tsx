import { PageHeader } from '@/components/layout/header';
import { PROSUITE_COLORS } from '@/lib/colors';
import { PlaceholderPage } from '@/components/shared/placeholder-page';

export default function ComplianceRegulationsPage() {
  return (
    <>
      <PageHeader 
        title="Regulations & Standards"
        description="Manage applicable regulations and standards"
        textColor={PROSUITE_COLORS.compliance.text}
        accentColor={PROSUITE_COLORS.compliance.accent}
      />
      <PlaceholderPage 
        title="Regulations & Standards"
        description="View and manage regulatory requirements and compliance standards"
        icon="book"
        color={PROSUITE_COLORS.compliance.text}
      />
    </>
  );
}
