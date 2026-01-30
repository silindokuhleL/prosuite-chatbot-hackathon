import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { IncidentList } from './incident-list';

export default function IncidentPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Incident Management"
        description="Track, investigate, and resolve security incidents"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Incident Management' },
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
              Report Incident
            </Button>
          </>
        }
      />
      <IncidentList />
    </AppLayout>
  );
}
