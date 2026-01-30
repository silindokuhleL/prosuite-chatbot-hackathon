import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { GovernanceOverview } from './governance-overview';
import { PROSUITE_COLORS } from '@/lib/colors';

export default function GovernancePage() {
  return (
    <AppLayout>
      <PageHeader
        title="Governance Management"
        description="Manage policies, committees, and strategic objectives"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Governance Management' },
        ]}
        textColor={PROSUITE_COLORS.governance.text}
        accentColor={PROSUITE_COLORS.governance.accent}
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
      <GovernanceOverview />
    </AppLayout>
  );
}
