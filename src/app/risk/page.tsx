import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { RiskList } from './risk-list';

export default function RiskPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Risk Management"
        description="Identify, assess, and manage organizational risks"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Risk Management' },
        ]}
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
            <Button size="sm">
              <Icon name="plus" size={16} className="mr-2" />
              New Risk
            </Button>
          </>
        }
      />
      <RiskList />
    </AppLayout>
  );
}
