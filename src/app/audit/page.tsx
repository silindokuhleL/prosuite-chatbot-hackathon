import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { AuditList } from './audit-list';
import { PROSUITE_COLORS } from '@/lib/colors';

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
        textColor={PROSUITE_COLORS.audit.text}
        accentColor={PROSUITE_COLORS.audit.accent}
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
            <Button size="sm" style={{ backgroundColor: PROSUITE_COLORS.audit.text }}>
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
