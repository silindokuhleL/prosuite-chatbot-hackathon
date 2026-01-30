import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { RiskDetail } from './risk-detail';
import { getRisk } from '@/lib/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RiskDetailPage({ params }: PageProps) {
  const { id } = await params;
  const risk = getRisk(Number(id));

  if (!risk) {
    notFound();
  }

  return (
    <AppLayout>
      <PageHeader
        title={risk.title}
        description={risk.risk_number}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Risk Management', href: '/risk' },
          { label: risk.risk_number },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Icon name="edit" size={16} className="mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="download" size={16} className="mr-2" />
              Export
            </Button>
          </>
        }
      />
      <RiskDetail risk={risk} />
    </AppLayout>
  );
}
