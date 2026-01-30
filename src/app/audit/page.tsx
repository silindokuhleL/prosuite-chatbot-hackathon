import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { AuditList } from './audit-list';

export default function AuditPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Audit Management"
        description="Plan, execute, and report on internal audit engagements"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Audit Management' },
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
              New Engagement
            </Button>
          </>
        }
      />
      <AuditList />
    </AppLayout>
  );
}
