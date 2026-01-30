import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { RiskList } from './risk-list';
import { PROSUITE_COLORS } from '@/lib/colors';

export default function RiskPage() {
  return (
    <>
      <PageHeader
        title="Risk Management"
        description="Comprehensive risk identification, assessment, and mitigation"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Risk Management' },
        ]}
        textColor={PROSUITE_COLORS.risk.text}
        accentColor={PROSUITE_COLORS.risk.accent}
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
            <Button size="sm" style={{ backgroundColor: PROSUITE_COLORS.risk.text }}>
              <Icon name="plus" size={16} className="mr-2" />
              New Risk
            </Button>
          </>
        }
      />
      <RiskList />
    </>
  );
}
