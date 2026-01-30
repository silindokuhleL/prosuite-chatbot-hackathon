import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { IncidentList } from './incident-list';
import { PROSUITE_COLORS } from '@/lib/colors';

export default function IncidentPage() {
  return (
    <>
      <PageHeader
        title="Incident Management"
        description="Track, investigate, and resolve security incidents"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Incident Management' },
        ]}
        textColor={PROSUITE_COLORS.incident.text}
        accentColor={PROSUITE_COLORS.incident.accent}
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
            <Button size="sm" style={{ backgroundColor: PROSUITE_COLORS.incident.text }}>
              <Icon name="plus" size={16} className="mr-2" />
              Report Incident
            </Button>
          </>
        }
      />
      <IncidentList />
    </>
  );
}
