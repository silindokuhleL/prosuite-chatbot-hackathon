'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/badge';
import { getAuditEngagements, getAuditEngagementStatuses, getUser } from '@/lib/data';
import type { AuditEngagement } from '@/types';

export function AuditList() {
  const router = useRouter();
  const engagements = getAuditEngagements();
  const statuses = getAuditEngagementStatuses();

  const columns = [
    {
      key: 'engagement_id',
      header: 'ID',
      className: 'w-32',
      render: (engagement: AuditEngagement) => (
        <span className="font-mono text-xs">{engagement.engagement_id}</span>
      ),
    },
    {
      key: 'title',
      header: 'Engagement',
      render: (engagement: AuditEngagement) => (
        <div>
          <p className="font-medium">{engagement.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {engagement.scope}
          </p>
        </div>
      ),
    },
    {
      key: 'lead_auditor_id',
      header: 'Lead Auditor',
      className: 'hidden md:table-cell',
      render: (engagement: AuditEngagement) => getUser(engagement.lead_auditor_id)?.name || '-',
    },
    {
      key: 'start_date',
      header: 'Start Date',
      className: 'hidden lg:table-cell w-28',
    },
    {
      key: 'end_date',
      header: 'End Date',
      className: 'hidden lg:table-cell w-28',
    },
    {
      key: 'status_id',
      header: 'Status',
      className: 'w-28',
      render: (engagement: AuditEngagement) => {
        const status = statuses.find(s => s.id === engagement.status_id);
        return (
          <StatusBadge
            status={status?.name || '-'}
            color={status?.color || '#6b7280'}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      data={engagements}
      columns={columns}
      onRowClick={(engagement) => router.push(`/audit/${engagement.id}`)}
      emptyMessage="No audit engagements found"
    />
  );
}
