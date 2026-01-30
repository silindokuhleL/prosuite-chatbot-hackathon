import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { ComplianceList } from './compliance-list';
import { PROSUITE_COLORS } from '@/lib/colors';

export default function CompliancePage() {
  return (
    <>
      <PageHeader
        title="Compliance Management"
        description="Track regulatory compliance across standards and frameworks"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Compliance Management' },
        ]}
        textColor={PROSUITE_COLORS.compliance.text}
        accentColor={PROSUITE_COLORS.compliance.accent}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Icon name="filter" size={16} className="mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="download" size={16} className="mr-2" />
              Export
            </Button>
          </>
        }
      />
      <ComplianceList />
    </>
  );
}
